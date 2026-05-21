#!/usr/bin/env bash
# Lockfiles resolved on macOS may omit Linux optional native binaries (npm optional-deps bug).
set -euo pipefail

npm ci

pkg_version() {
  node -pe "JSON.parse(require('fs').readFileSync('node_modules/${1}/package.json','utf8')).version"
}

npm install --no-save \
  "@rollup/rollup-linux-x64-gnu@$(pkg_version rollup)" \
  "lightningcss-linux-x64-gnu@$(pkg_version lightningcss)" \
  "@tailwindcss/oxide-linux-x64-gnu@$(pkg_version '@tailwindcss/oxide')"
