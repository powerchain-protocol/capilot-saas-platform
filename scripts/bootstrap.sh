#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v nvm >/dev/null 2>&1; then
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [[ -s "$NVM_DIR/nvm.sh" ]]; then
    # shellcheck disable=SC1090
    . "$NVM_DIR/nvm.sh"
  else
    echo "nvm is not loaded. Install nvm 0.40.7, reopen the shell, then rerun this script." >&2
    echo 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.7/install.sh | bash' >&2
    exit 1
  fi
fi

nvm install "$(cat .nvmrc)"
nvm use "$(cat .nvmrc)"

if ! command -v corepack >/dev/null 2>&1; then
  npm install --global corepack@latest
fi

corepack enable
corepack prepare pnpm@11.23.0 --activate
pnpm runtime:check
pnpm deps:policy:check
pnpm install
