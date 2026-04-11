# Icare-caresystem

React 19 + TypeScript + Vite 7 app. **All Node tooling runs inside Docker** — you don't install Node, npm, or any packages on your host.

## Prerequisites

- Docker Engine 24+ and `docker compose` v2 (tested with Docker 29.x).
  - macOS: [Colima](https://github.com/abiosoft/colima) (`brew install colima docker docker-compose && colima start`) or Docker Desktop.
  - Linux: your distro's `docker` + `docker-compose-plugin` packages.
  - Windows: Docker Desktop with WSL2.

That's it. No Node, no nvm, no `npm install` on your machine.

## Quickstart

```bash
git clone git@github.com:saumyapathak2493/Icare-caresystem.git
cd Icare-caresystem

# Build the dev image (runs `npm ci` inside the container, one-time).
docker compose build

# Start the Vite dev server on http://localhost:5173
docker compose up
```

Open http://localhost:5173. HMR works — edit anything under `src/` and the browser updates.

To stop: `Ctrl+C`, then `docker compose down` to remove the container.

## Common tasks (all containerised)

```bash
# Install a new dependency and persist it to package.json / package-lock.json
docker compose run --rm app npm install <pkg>

# Type-check
docker compose run --rm app npx tsc -b --noEmit

# Lint
docker compose run --rm app npm run lint

# Production build (output lands in ./dist on the host via the bind mount)
docker compose run --rm app npm run build

# Open a shell in the container
docker compose run --rm app sh
```

After any dependency change (`package.json` or `package-lock.json` edit), rebuild the image so the baked-in `node_modules` matches:

```bash
docker compose build
```

## How the isolation works

- `Dockerfile.dev` pins `node:22-slim` and runs `npm ci` at image build time, so `node_modules` lives *inside* the image.
- `docker-compose.yml` bind-mounts the repo at `/app` for live source edits, but declares an **anonymous volume at `/app/node_modules`**. That volume shadows the bind-mount, so the container always uses the image's deps even though your host has no `node_modules` directory.
- `.dockerignore` keeps `node_modules`, `.git`, env files, etc. out of the build context.

Result: clone, `docker compose up`, done. Your host stays untouched — no Node on PATH, no global npm packages, no native modules compiled against your libc.

### IDE note

Because `node_modules` is only inside the container, your editor's TypeScript language server won't find it on the host and you'll see "Cannot find module" squiggles. Two options:

- **VS Code Dev Containers** (recommended): install the Dev Containers extension and "Reopen in Container" — the editor runs inside the same image and gets full IntelliSense.
- **Quick escape hatch**: run `docker compose run --rm app npm install` once and let the anonymous volume populate. (It still doesn't touch your host Node.)

---

## Upstream template docs

This project was scaffolded from the Vite React-TS template. The original template docs follow.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
