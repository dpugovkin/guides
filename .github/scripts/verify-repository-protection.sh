#!/usr/bin/env bash
# Verifies branch protection and github-pages environment on dpugovkin/guides (requires admin).
set -euo pipefail

REPO="${REPO:-dpugovkin/guides}"

echo "=== gh auth ==="
gh auth status
echo ""

echo "=== repo permissions ==="
gh api "repos/${REPO}" --jq '{login: .owner.login, permissions}'
echo ""

echo "=== branch protection (main) ==="
if gh api "repos/${REPO}/branches/main/protection" 2>/dev/null; then
  echo "(protection is configured)"
else
  echo "NOT CONFIGURED or no access to read"
fi
echo ""

echo "=== environment github-pages ==="
gh api "repos/${REPO}/environments/github-pages" --jq '{
  reviewers: .reviewers,
  deployment_branch_policy: .deployment_branch_policy
}' 2>/dev/null || echo "NOT CONFIGURED or no access"
echo ""

echo "=== latest Deploy workflow runs ==="
gh run list --repo "${REPO}" --workflow "Deploy to GitHub Pages" --limit 3 2>/dev/null || true
