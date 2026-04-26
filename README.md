# Rune Realm

An immersive Elder Futhark experience built with React, TypeScript, GSAP, and canvas effects.

## Features

- Matrix-like rune loading sequence with smooth intro handoff
- Interactive Historical Explorer for all 24 Elder Futhark runes
- Daily Draw scratch-to-reveal ritual with animated transition
- Multi-theme aesthetic (Ember, Void, Frost, Gold)
- Responsive design for mobile, tablet, and desktop

## Tech Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=fff)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=fff)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=fff)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=fff)
![GSAP](https://img.shields.io/badge/GSAP-0AE448?style=for-the-badge&logo=greensock&logoColor=000)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222?style=for-the-badge&logo=github&logoColor=fff)

- **UI**: React + TypeScript (Vite)
- **Animation**: GSAP
- **Icons**: Lucide React
- **FX**: Canvas (nebula background, rune rain, particles)
- **Deploy**: GitHub Actions → GitHub Pages

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
