# Replace Hero Photo

Replace the current home-page portrait (`src/assets/saqeeb-portrait.jpg.asset.json`) with the newly uploaded campaign graphic.

## Steps

1. **Upload the new image as a Lovable Asset**
   - Use `lovable-assets create` on the uploaded file (`user-uploads://688fca5e-7997-4951-9e09-adb84ed1d982.jpeg`).
   - Save the resulting `.asset.json` pointer under `src/assets/`.

2. **Update the home page**
   - Change the import in `src/routes/index.tsx` from the old portrait asset to the new asset.
   - Keep the existing `<img>` usage and alt text; only the source changes.

3. **Clean up the old asset**
   - Delete the old `saqeeb-portrait.jpg.asset.json` pointer file once it is no longer referenced.
   - Optionally remove the old CDN object with `lovable-assets delete`.

4. **Verify**
   - Confirm the new hero image renders on the home page preview.
   - Check that no build errors occur.
