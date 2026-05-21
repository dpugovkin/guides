# Guides by Dimasik

Practical guides and calculators for complex money topics. Live site: **[dpugovkin.github.io/guides](https://dpugovkin.github.io/guides)**.

**Featured guide:** [Legalizing in Poland funds from a Ukrainian property sale](https://dpugovkin.github.io/guides/uk/ukraine-property-sale-poland) — Ukraine tax calculator, border cash logistics, ATM method, and bank document checklist.

---

## Quick links

| What                    | URL                                                            |
| ----------------------- | -------------------------------------------------------------- |
| Home (default language) | [/guides/uk](https://dpugovkin.github.io/guides/uk)            |
| English                 | [/guides/en](https://dpugovkin.github.io/guides/en)            |
| Polish                  | [/guides/pl](https://dpugovkin.github.io/guides/pl)            |
| Bare `/guides`          | Redirects to `/guides/uk` (or last language in `localStorage`) |

Every page URL includes a language prefix: `/guides/{uk|en|pl}/…`.

---

## Requirements

Pinned toolchain (see [`.nvmrc`](.nvmrc), [`package.json`](package.json) `engines`, [`package-lock.json`](package-lock.json)):

| Tool        | Version   |
| ----------- | --------- |
| **Node.js** | `22.22.3` |
| **npm**     | `10.9.8`  |

Direct dependencies in `package.json` use **exact versions** (no `^`); the lockfile pins the full tree. CI uses `npm ci`.

```bash
nvm use          # installs Node 22.22.3 from .nvmrc
npm ci           # prefer over npm install — reproducible install
npm run dev
```

`.npmrc` sets `engine-strict=true` and `save-exact=true`.

CI runs `.github/scripts/install-linux-native.sh` after `npm ci` to install Linux native binaries (Rollup, Lightning CSS, Tailwind Oxide) when the lockfile was resolved on macOS.

Open **http://localhost:5173/guides/** (Vite dev server; same base path as production).

---

## Scripts

### Main commands

| Command             | When to use                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------- |
| **`npm run ready`** | **Before commit / PR** — auto-fix style (Prettier + ESLint `--fix`), then run all checks |
| **`npm run check`** | Verify only (same checks as CI, no auto-fix): lint, format, locale keys, tests           |
| **`npm run deps`**  | Security audit + outdated report + upgrade suggestions (read-only)                       |
| `npm run dev`       | Local dev server                                                                         |
| `npm run build`     | Production build → `dist/` (+ `404.html` for GitHub Pages SPA)                           |

```bash
npm run ready    # fix + check — use this most of the time
```

### Lint + Prettier (granular)

| Command                           | Purpose                          |
| --------------------------------- | -------------------------------- |
| `npm run fix`                     | Prettier write + ESLint `--fix`  |
| `npm run lint` / `lint:fix`       | ESLint check / auto-fix          |
| `npm run format` / `format:check` | Prettier write / check           |
| `npm test` / `test:locales`       | Unit tests / uk·en·pl key parity |

- **ESLint** — logic, React Hooks, a11y (`eslint.config.js`).
- **Prettier** — formatting (`.prettierrc.json`); `eslint-config-prettier` avoids rule conflicts.
- **CI** runs individual check steps (`lint`, `format:check`, tests, `build`) — no auto-fix on the server.

### Dependencies (security & updates)

```bash
npm run deps
```

Runs three read-only checks ([`scripts/check-dependencies.mjs`](scripts/check-dependencies.mjs)):

1. **`npm audit`** — known vulnerabilities (moderate and above)
2. **`npm outdated`** — installed vs versions in `package.json`
3. **`npm-check-updates`** — newer versions you could pin next

To apply suggested bumps (review diff first):

```bash
npm run deps:upgrade   # updates package.json, refreshes lockfile
npm run ready
```

---

## Project layout

```
.github/
  workflows/          # CI: lint + format:check + test + build; Deploy (owner only)
  CODEOWNERS          # All paths → @dpugovkin
  REPOSITORY_RULES.md # Branch protection & deploy policy
  scripts/            # apply / verify GitHub rules via gh

public/               # Static assets (favicon, robots, sitemap, og-cover.svg)
src/
  guides/
    registry.ts       # Guide list (slug, lazy page, i18n keys)
    shared/ua-property-sale/   # Ukraine sale tax calculator (shared)
    poland-money/              # Poland legalization guide
    property-sale-calculator/  # Standalone tax calculator page
  i18n/
    locales/{uk,en,pl}/        # common, tax, poland namespaces
  pages/              # Guides index
  routes.tsx          # /:lang/... routing
```

---

## Internationalization

- **Default language:** Ukrainian (`uk`)
- **Also:** English (`en`), Polish (`pl`)
- **Locale files:** `src/i18n/locales/{uk,en,pl}/{common,tax,poland}.json`
- **Loading:** Ukrainian bundles ship in the initial JS; `en` and `pl` load on demand when the user switches language
- **Persistence:** `localStorage` key `guides.language`
- **Routing:** Language in the path wins over `localStorage` (see `src/i18n/langPath.ts`, `I18nLanguageUrlSync.tsx`)

After adding or changing translation keys, run:

```bash
npm run test:locales
```

---

## Add a new guide

1. Create `src/guides/<slug>/` with a page component (default export).
2. Register it in [`src/guides/registry.ts`](src/guides/registry.ts) — use an **English slug** in URLs.
3. Add copy keys to `src/i18n/locales/uk/`, `en/`, and `pl/` (usually `tax.json` or `poland.json`).
4. Add URLs to [`public/sitemap.xml`](public/sitemap.xml) for each language: `/guides/uk/<slug>`, `/en/…`, `/pl/…`.

---

## Deploy (GitHub Pages)

- **Host:** GitHub Pages, base path `/guides`
- **Workflow:** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on push to `main`
- **Who can deploy:** Only GitHub user **`dpugovkin`** (workflow guard + environment rules)
- **Setup:** Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**

First-time production deploy:

1. Push `main` with the app and workflows.
2. Enable Pages (GitHub Actions) as above.
3. Apply branch/environment protection (owner account):

   ```bash
   gh auth login    # as dpugovkin
   ./.github/scripts/apply-repository-protection.sh
   ./.github/scripts/verify-repository-protection.sh
   ```

See [`.github/REPOSITORY_RULES.md`](.github/REPOSITORY_RULES.md) for merge rules, CODEOWNERS, and contributor flow.

---

## Repository access model

| Action                | Other contributors         | Owner (`dpugovkin`) |
| --------------------- | -------------------------- | ------------------- |
| Push to own branch    | Yes                        | Yes                 |
| Push to `main`        | No                         | Yes                 |
| Approve / merge PRs   | No (owner review required) | Yes                 |
| Run production deploy | No                         | Yes                 |
| CI on pull requests   | Yes                        | Yes                 |

---

## License / disclaimers

Site and calculator copy include legal disclaimers (not tax or legal advice). See `legal.*` keys in locale `common.json` files.
