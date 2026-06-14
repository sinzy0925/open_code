#!/usr/bin/env bash
# Stage 0: OpenCode + NVIDIA NIM (free tier)
# Usage: bash setup-opencode-nvidia.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

main() {
  detect_platform
  log_info "Platform: ${PLATFORM}"
  log_info "Route: OpenCode + NVIDIA NIM (free tier)"

  ensure_opencode_installed

  log_info "NVIDIA API key is required."
  log_info "Get one at: https://build.nvidia.com/models"
  prompt_env_var "NVIDIA_API_KEY" "Paste your NVIDIA API key (nvapi-...). Input is hidden:" || true

  if [[ -n "${NVIDIA_API_KEY:-}" ]]; then
    append_env_to_shell_rc "NVIDIA_API_KEY" "${NVIDIA_API_KEY}" || true
  fi

  write_config "$(cat <<'EOF'
{
  "$schema": "https://opencode.ai/config.json",
  "model": "nvidia/moonshotai/kimi-k2.6",
  "provider": {
    "nvidia": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "NVIDIA NIM",
      "options": {
        "baseURL": "https://integrate.api.nvidia.com/v1",
        "apiKey": "{env:NVIDIA_API_KEY}"
      },
      "models": {
        "moonshotai/kimi-k2.6": {
          "name": "Kimi K2.6"
        },
        "nvidia/nemotron-3-super-120b-a12b": {
          "name": "Nemotron 3 Super"
        }
      }
    }
  }
}
EOF
)"

  print_next_steps \
    "Open a new terminal if you just set NVIDIA_API_KEY" \
    "cd to your project directory" \
    "Run: opencode" \
    "Run: /models  (switch models if needed)" \
    "Run: /init     (first time in a project)" \
    "Use only for building apps, not daily production runs" \
    "When a workflow stabilizes, freeze it into a small app"

  log_info "Reminder: follow each provider's terms of service."
}

main "$@"
