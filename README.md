# Freemasons NZ Passport (Demo)

A minimal React (Vite) demo implementing:
- Automated **prefix entitlement** from a simple Book of Constitution (BOC) mapping
- **Current** and **Past Grand Rank** with post-nominals (e.g., `GSWB`, `PGSWB`)
- Dashboard name line showing: `Prefix First Last PostNominals`
- **Lodges summary** including **resigned dates**
- Client-side storage only (localStorage) for testing

> Replace the placeholders in `src/bocMapping.js` with the official BOC mapping when you have it.

## Local quick start

```bash
npm i
npm run dev
```

## Deploy to GitHub Pages (recommended)

1. Create an empty repo on GitHub (e.g. `freemasons-nz-passport`).
2. Initialize locally and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/freemasons-nz-passport.git
   git push -u origin main
   ```
3. In GitHub: **Settings → Pages**. If asked, set **Source** to “GitHub Actions”.
4. The included workflow `.github/workflows/deploy.yml` builds the app with the correct base path and publishes to Pages automatically on every push to `main`.
5. Your site will be available at:  
   `https://<your-username>.github.io/freemasons-nz-passport/`

> If you fork or rename the repo later, the workflow still works because it sets `VITE_BASE` to `/<repo-name>/` automatically at build time.

## Customisation checklist

- `src/bocMapping.js` — update titles, entitlement prefixes, and post-nominals to match the Book of Constitution.
- `src/App.jsx` — UI/logic for ranks, name line, lodges.
- `public/logo.svg` — replace with the official Freemasons NZ brand mark.
- `vite.config.js` — already configured to respect a dynamic base for GitHub Pages.

## License

MIT
