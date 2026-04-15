# Rune Realm

An immersive Elder Futhark experience built with React, TypeScript, GSAP, and canvas effects.

## Features

- Matrix-like rune loading sequence with smooth intro handoff
- Interactive Historical Explorer for all 24 Elder Futhark runes
- Daily Draw scratch-to-reveal ritual with animated transition
- Multi-theme aesthetic (Ember, Void, Frost, Gold)
- Responsive design for mobile, tablet, and desktop

## Tech Stack

- React + TypeScript + Vite
- GSAP for transitions and motion
- Lucide React for iconography
- Canvas for nebula, rune rain, and particle effects

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Deploying to GitHub Pages

This repository includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.

To enable deployment:

1. Push this project to a GitHub repository.
2. In GitHub, open **Settings -> Pages**.
3. Set **Source** to **GitHub Actions**.
4. Ensure the default branch is `main`.
5. On push to `main`, the site will auto-deploy.

## Project Structure

```text
src/
  App.tsx
  main.tsx
  styles/
    global.css
  legacy/
    RuneRealm.jsx
.github/
  workflows/
    deploy-pages.yml
```

## License

MIT
