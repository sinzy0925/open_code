#!/usr/bin/env bash
# .gas_env を反映して clasp push する
# 使い方: bash push.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

if ! command -v node >/dev/null 2>&1; then
  echo "[push] ERROR: Node.js が必要です"
  exit 1
fi

if ! command -v clasp >/dev/null 2>&1; then
  echo "[push] ERROR: clasp が見つかりません"
  echo "  npm install -g @google/clasp"
  echo "  clasp login   # 初回のみ必須"
  exit 1
fi

node sync-env.js

echo "[push] clasp push を実行します..."
echo "[push] ※ 未ログインの場合は先に clasp login を実行してください"
clasp push --force

echo "[push] 完了"
