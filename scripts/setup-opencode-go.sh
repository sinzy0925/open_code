#!/usr/bin/env bash
# Stage 1-A: OpenCode Go (fixed monthly cost)
# Usage: bash setup-opencode-go.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

main() {
  detect_platform
  log_info "Platform: ${PLATFORM}"
  log_info "Route: OpenCode Go (about \$5 first month, then \$10/month)"

  ensure_opencode_installed

  log_info "Subscribe to OpenCode Go:"
  log_info "  https://opencode.ai/go"
  log_info "After subscribing, copy your API key from the dashboard."

  prompt_env_var "OPENCODE_GO_API_KEY" "Paste your OpenCode Go API key. Input is hidden:" || true

  if [[ -n "${OPENCODE_GO_API_KEY:-}" ]]; then
    append_env_to_shell_rc "OPENCODE_GO_API_KEY" "${OPENCODE_GO_API_KEY}" || true
  fi

  write_config "$(cat <<'EOF'
{
  "$schema": "https://opencode.ai/config.json",
  "model": "opencode-go/kimi-k2.6",
  "provider": {
    "opencode-go": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "OpenCode Go",
      "options": {
        "baseURL": "https://opencode.ai/zen/go/v1",
        "apiKey": "{env:OPENCODE_GO_API_KEY}"
      },
      "models": {
        "kimi-k2.6": {
          "name": "Kimi K2.6"
        },
        "glm-5.1": {
          "name": "GLM 5.1"
        },
        "minimax-m2.7": {
          "name": "MiniMax M2.7"
        }
      }
    }
  }
}
EOF
)"

  print_next_steps \
    "Subscribe at https://opencode.ai/go if you have not yet" \
    "Open a new terminal if you just set OPENCODE_GO_API_KEY" \
    "cd to your project directory" \
    "Run: opencode" \
    "If needed, run: /connect  and choose OpenCode Go" \
    "Run: /models  (pick a Go model)" \
    "Run: /init     (first time in a project)" \
    "When a workflow stabilizes, freeze it into a small app"

  log_warn "If models do not appear, use /connect in the OpenCode TUI as a fallback."
  log_info "Reminder: follow each provider's terms of service."
}

main "$@"
