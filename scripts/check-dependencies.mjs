#!/usr/bin/env node
/**
 * Reports dependency health: npm audit, npm outdated, and npm-check-updates suggestions.
 * Does not modify package.json or package-lock.json.
 */
import { execSync } from 'node:child_process'

const section = (title) => {
  console.log(`\n${'='.repeat(60)}\n${title}\n${'='.repeat(60)}\n`)
}

const run = (title, command) => {
  section(title)
  try {
    execSync(command, { stdio: 'inherit', env: process.env })
  } catch {
    console.error(
      `\n[${title}] finished with warnings or failures (see output above).`,
    )
  }
}

console.log('Dependency check (read-only — no installs or upgrades)\n')

run('1/3 Security — npm audit (moderate+)', 'npm audit --audit-level=moderate')

run('2/3 Installed vs wanted — npm outdated', 'npm outdated || true')

run(
  '3/3 Available upgrades — npm-check-updates (package.json ranges)',
  'npm-check-updates',
)

section('Next steps')
console.log(`  Upgrade package.json versions:  npm run deps:upgrade
  Reinstall lockfile:             npm install
  Verify:                         npm run ready
`)
