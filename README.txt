FORCING A HOME‑SCREEN ICON (iOS + Android, GitHub Pages friendly)

1) Copy everything in this ZIP to your repo root, preserving folders.
   - public/manifest.webmanifest
   - public/icons/app-180.png
   - public/icons/app-192.png
   - public/icons/app-512.png
   - public/icons/app-maskable-512.png

2) Edit your ROOT index.html <head> to include these lines (use RELATIVE paths):
   <link rel="manifest" href="manifest.webmanifest">
   <meta name="apple-mobile-web-app-capable" content="yes">
   <meta name="apple-mobile-web-app-title" content="My Masonic Passport">
   <link rel="apple-touch-icon" sizes="180x180" href="icons/app-180.png">

   If you already have these tags, ensure the paths match the files above
   (no leading slash). On GH Pages, relative paths are crucial.

3) Build & deploy, then refresh.

4) iOS (Safari) – refresh the icon:
   - Delete any existing home-screen shortcut for the app.
   - Re-open the site in Safari.
   - Share → Add to Home Screen (you should see the new icon/name).
   - If it still shows the old icon, Settings → Safari → Advanced → Website Data →
     search your domain → Remove All Website Data, then try again.

5) Android (Chrome):
   - Open the site → you should get an "Install" prompt soon (or from the overflow menu).
   - Android uses the icons from manifest.webmanifest (192 + 512 + maskable).

Notes:
- You can replace the PNGs with your FMNZ artwork; keep the same filenames.
- "maskable" lets Android crop the icon nicely in adaptive shapes.
- Ensure HTTPS and that "manifest.webmanifest" is accessible at /<repo>/manifest.webmanifest.
