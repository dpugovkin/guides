# Repository rules (owner: `dpugovkin`)

These settings restrict `main`, who can merge, and who can deploy to GitHub Pages.

## Already in the repo

| File                                           | Purpose                                                                      |
| ---------------------------------------------- | ---------------------------------------------------------------------------- |
| [CODEOWNERS](./CODEOWNERS)                     | All paths require review from `@dpugovkin` when code owner review is enabled |
| [workflows/deploy.yml](./workflows/deploy.yml) | Deploy job runs **only** if `github.actor == 'dpugovkin'`                    |
| [workflows/ci.yml](./workflows/ci.yml)         | Lint, tests, and build on PRs and pushes (no deploy)                         |

## GitHub: protect branch `main`

If rules are not applied yet via `gh`, configure manually:

**Settings → Branches → Branch protection rules → `main`:**

1. **Require a pull request before merging**
   - Required approvals: **1**
   - **Require review from Code Owners**
   - **Require approval of the most recent push**
   - Dismiss stale pull request approvals when new commits are pushed
2. **Require status checks to pass** — context: `check` (CI workflow)
3. **Require conversation resolution before merging**
4. **Do not allow bypassing the above settings** (including admins, if you want strict mode)
5. Disallow force push and branch deletion

**Personal repo (`dpugovkin/guides`):** GitHub does **not** allow API/UI “restrict who can push” to named users — only **organization** repos do. The apply script skips that block automatically. Practical control:

- Do not add collaborators with **Write** unless you trust them (Settings → Collaborators).
- **PR + CODEOWNERS** still blocks merge without your review.
- **Deploy workflow** still runs only when `github.actor == 'dpugovkin'`.

Other contributors work on **their own branches** → open a PR → merge only after your approval.

## GitHub: environment `github-pages` (deploy)

**Settings → Environments → `github-pages`:**

1. **Required reviewers:** `dpugovkin` (you only)
2. **Deployment branches:** `main` only (or “Selected branches” → `main`)

Together with `if: github.actor == 'dpugovkin'` in the workflow, this blocks deploy from other accounts even if a merge somehow occurred.

## Apply rules via CLI (once)

From the repo root, authenticated as a user with **admin** on `dpugovkin/guides`:

```bash
./.github/scripts/apply-repository-protection.sh
./.github/scripts/verify-repository-protection.sh
```

Or run these after pushing the scripts to the default branch.
