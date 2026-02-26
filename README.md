# Hosting Demo — static website

This repository contains a minimal static website you can use to demonstrate hosting on GitHub.

Quick preview locally:

```bash
# from the repo root
python -m http.server 8000
# then open http://localhost:8000
```

Publish with GitHub Pages (GUI):

1. Push this repository to GitHub (e.g. `git push origin main`).
2. Go to the repository on GitHub → Settings → Pages.
3. Under "Build and deployment" choose "Deploy from a branch" and select `main` (or create a `gh-pages` branch).
4. Save. The site will be available at `https://<your-username>.github.io/<repo-name>/`.

Alternative: Create a `gh-pages` branch and push the static files there.

This site includes:

- `index.html` — page content
- `style.css` — styles
- `script.js` — simple demo interactions

That's it — no build step required.
