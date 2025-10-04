Force the EXACT FMNZ logo as the phone home-screen icon

What this patch does
- Sets the iOS apple-touch-icon to the exact FMNZ URL:
  https://freemasonsnz.org/wp-content/uploads/2019/05/freemason_colour_standardonwhite.png
  and keeps a local fallback tag right after it (for rare cross-origin blocks).
- Sets the Android PWA manifest icons to prefer the same exact FMNZ URL,
  with local fallbacks (192/512/maskable) still available.

Steps
1) Overwrite your root index.html and public/manifest.webmanifest with these files.
2) Ensure you still have the local fallback icons in public/icons/:
   - app-180.png  (for iOS fallback)
   - app-192.png, app-512.png, app-maskable-512.png  (Android fallbacks)

iOS refresh
- Delete the existing home-screen shortcut.
- Safari → open the site → Share → Add to Home Screen.
- If the old icon persists: Settings → Safari → Advanced → Website Data →
  search your site → Remove All Website Data → try again.

Android refresh
- Chrome → open the site. You should get an Install banner, or use the menu → Install app.
- If you previously installed, uninstall first (long-press the icon → Remove) then install again.
