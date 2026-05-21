#!/usr/bin/env bash
# Applies main branch protection and github-pages environment rules for dpugovkin/guides.
# Requires: gh auth login with admin access to the repository.
#
# Note: "Restrict who can push" (restrictions.users) works only on ORGANIZATION repos.
# Personal repos (owner.type == User) get PR reviews + status checks + no force push instead.

set -euo pipefail

REPO="${REPO:-dpugovkin/guides}"
OWNER="${OWNER:-dpugovkin}"
BRANCH="${BRANCH:-main}"
OWNER_USER_ID="${OWNER_USER_ID:-48239577}"

OWNER_TYPE="$(gh api "repos/${REPO}" --jq .owner.type)"
echo "Repository ${REPO} (owner type: ${OWNER_TYPE})"

if [[ "${OWNER_TYPE}" == "Organization" ]]; then
  echo "→ Branch protection with push restrictions (org repo)"
  gh api --method PUT "repos/${REPO}/branches/${BRANCH}/protection" \
    --input - <<EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["check"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 1,
    "require_last_push_approval": true
  },
  "restrictions": {
    "users": ["${OWNER}"],
    "teams": [],
    "apps": []
  },
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": true
}
EOF
else
  echo "→ Branch protection without push restrictions (personal repo)"
  echo "  (GitHub API does not allow restrictions.users on User-owned repos.)"
  gh api --method PUT "repos/${REPO}/branches/${BRANCH}/protection" \
    --input - <<EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["check"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 1,
    "require_last_push_approval": true
  },
  "restrictions": null,
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": true
}
EOF
fi

echo "→ Environment github-pages (required reviewer: ${OWNER})"
gh api --method PUT "repos/${REPO}/environments/github-pages" \
  --input - <<EOF
{
  "wait_timer": 0,
  "reviewers": [
    {
      "type": "User",
      "id": ${OWNER_USER_ID}
    }
  ],
  "deployment_branch_policy": {
    "protected_branches": false,
    "custom_branch_policies": true
  }
}
EOF

gh api --method POST "repos/${REPO}/environments/github-pages/deployment-branch-policies" \
  -f name="${BRANCH}" 2>/dev/null || true

echo ""
echo "Done. Verify: ./.github/scripts/verify-repository-protection.sh"
if [[ "${OWNER_TYPE}" != "Organization" ]]; then
  echo ""
  echo "Personal repo: do not add collaborators with write access unless you trust them."
  echo "They still cannot merge without your CODEOWNERS approval if PR rules are enabled."
fi
