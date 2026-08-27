#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .nvmrc ]]; then
  echo "Missing $ROOT/.nvmrc; run this script from a complete PowerChain checkout." >&2
  exit 1
fi

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if ! command -v nvm >/dev/null 2>&1; then
  if [[ -s "$NVM_DIR/nvm.sh" ]]; then
    # shellcheck disable=SC1090
    . "$NVM_DIR/nvm.sh"
  else
    echo "nvm is not installed/loaded." >&2
    echo 'Install nvm 0.40.7:' >&2
    echo '  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.7/install.sh | bash' >&2
    echo 'Then reopen the shell or run: export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"' >&2
    exit 1
  fi
fi

NODE_VERSION="$(tr -d '[:space:]' < .nvmrc)"
echo "Using repository runtime Node $NODE_VERSION"
nvm install "$NODE_VERSION"
nvm use "$NODE_VERSION"

if ! command -v corepack >/dev/null 2>&1; then
  echo "Corepack is not available in this Node installation; installing the Corepack CLI."
  npm install --global corepack@latest
fi

corepack enable
if ! corepack install --global pnpm@11.23.0; then
  echo "Corepack could not activate pnpm; falling back to npm global pnpm install." >&2
  npm install --global pnpm@11.23.0
fi

printf 'Node: '; node --version
printf 'pnpm: '; pnpm --version

pnpm runtime:check
pnpm deps:policy:check
pnpm install

echo "PowerChain dependencies installed successfully."
echo "Run 'pnpm dev' for frontend + backend or 'pnpm build' for the production build gate."
