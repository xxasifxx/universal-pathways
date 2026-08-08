import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/donate")({
  component: DonateLayout,
});

function DonateLayout() {
  return <Outlet />;
}

