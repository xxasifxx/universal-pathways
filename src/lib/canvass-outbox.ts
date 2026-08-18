/** Browser-only outbox. Doors are recorded locally first, then flushed. */
import type { OutcomeKey, TurfBundle } from "./canvass";

export type PendingVisit = {
  client_id: string;
  hh_key: string;
  outcome: OutcomeKey;
  note: string | null;
  visited_at: string;
  responses: Array<{
    voter_id: string;
    support: number | null;
    issues: string[];
    wants_lawn_sign: boolean;
    volunteer_lead: boolean;
    vote_by_mail: boolean;
    do_not_contact: boolean;
  }>;
};

const DB_NAME = "eb-canvass";
const STORE = "outbox";
const BUNDLE_STORE = "bundles";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "key" });
      if (!db.objectStoreNames.contains(BUNDLE_STORE))
        db.createObjectStore(BUNDLE_STORE, { keyPath: "turfId" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(
  store: string,
  mode: IDBTransactionMode,
  run: (s: IDBObjectStore) => IDBRequest,
): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const request = run(tx.objectStore(store));
    request.onsuccess = () => resolve(request.result as T);
    request.onerror = () => reject(request.error);
  });
}

export function newClientId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function cacheBundle(turfId: string, bundle: TurfBundle, canvasser: string) {
  await withStore(BUNDLE_STORE, "readwrite", (s) =>
    s.put({ turfId, bundle, canvasser, cached_at: Date.now() }),
  );
}

export async function readCachedBundle(
  turfId: string,
): Promise<{ bundle: TurfBundle; canvasser: string } | null> {
  try {
    const row = await withStore<any>(BUNDLE_STORE, "readonly", (s) => s.get(turfId));
    return row ? { bundle: row.bundle as TurfBundle, canvasser: String(row.canvasser ?? "") } : null;
  } catch {
    return null;
  }
}

export async function queueVisit(turfId: string, visit: PendingVisit) {
  await withStore(STORE, "readwrite", (s) =>
    s.put({ key: `${turfId}:${visit.client_id}`, turfId, visit }),
  );
}

export async function pendingVisits(turfId: string): Promise<PendingVisit[]> {
  try {
    const rows = await withStore<any[]>(STORE, "readonly", (s) => s.getAll());
    return rows.filter((r) => r.turfId === turfId).map((r) => r.visit as PendingVisit);
  } catch {
    return [];
  }
}

async function clearVisits(turfId: string, clientIds: string[]) {
  const db = await openDb();
  await new Promise<void>((resolve) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    for (const id of clientIds) store.delete(`${turfId}:${id}`);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

/** Returns how many doors are still waiting to sync. */
export async function flushOutbox(turfId: string, canvasser: string): Promise<number> {
  const queued = await pendingVisits(turfId);
  if (queued.length === 0) return 0;
  if (typeof navigator !== "undefined" && navigator.onLine === false) return queued.length;

  const batch = queued.slice(0, 100);
  try {
    const response = await fetch("/api/public/canvass-sync", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        turfId,
        visits: batch.map((v) => ({ ...v, canvasser_name: canvasser })),
      }),
    });
    if (!response.ok) return queued.length;
    await clearVisits(
      turfId,
      batch.map((v) => v.client_id),
    );
    return queued.length - batch.length;
  } catch {
    return queued.length;
  }
}
