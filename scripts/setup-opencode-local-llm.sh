#!/usr/bin/env bash
# Stage 1-B: OpenCode + local LLM (Ollama)
# Usage: bash setup-opencode-local-llm.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

DEFAULT_MODEL="${OLLAMA_MODEL:-qwen3-coder}"
DEFAULT_NUM_CTX="${OLLAMA_NUM_CTX:-32768}"

install_ollama() {
  if command -v ollama >/dev/null 2>&1; then
    log_info "Ollama is already installed: $(ollama --version 2>/dev/null || echo unknown)"
    return 0
  fi

  log_info "Installing Ollama..."

  case "${PLATFORM}" in
    macos)
      if command -v brew >/dev/null 2>&1; then
        brew install ollama
      else
        log_warn "Homebrew not found. Install Ollama manually:"
        log_warn "  https://ollama.com/download"
        return 1
      fi
      ;;
    linux | wsl)
      curl -fsSL https://ollama.com/install.sh | sh
      ;;
    gitbash)
      log_warn "On Windows Git Bash, install Ollama manually first:"
      log_warn "  winget install Ollama.Ollama"
      log_warn "  or download from https://ollama.com/download"
      return 1
      ;;
    *)
      log_warn "Install Ollama manually from https://ollama.com/download"
      return 1
      ;;
  esac
}

ensure_ollama_running() {
  if curl -fsS "http://localhost:11434/api/tags" >/dev/null 2>&1; then
    log_info "Ollama server is running."
    return 0
  fi

  log_info "Starting Ollama server in background..."
  nohup ollama serve >/tmp/ollama-serve.log 2>&1 &
  sleep 2

  if curl -fsS "http://localhost:11434/api/tags" >/dev/null 2>&1; then
    log_info "Ollama server started."
    return 0
  fi

  log_warn "Could not verify Ollama server."
  log_warn "Start it manually with: ollama serve"
  return 1
}

pull_model_with_context() {
  local model="$1"
  local num_ctx="$2"
  local variant="${model}-${num_ctx}"
  local modelfile

  log_info "Pulling model: ${model}"
  ollama pull "${model}"

  modelfile="$(mktemp)"
  cat >"${modelfile}" <<EOF
FROM ${model}
PARAMETER num_ctx ${num_ctx}
EOF

  log_info "Creating context variant: ${variant} (num_ctx=${num_ctx})"
  ollama create "${variant}" -f "${modelfile}"
  rm -f "${modelfile}"
}

main() {
  detect_platform
  log_info "Platform: ${PLATFORM}"
  log_info "Route: OpenCode + local LLM (Ollama)"
  log_warn "Local models need enough RAM/VRAM. 16GB+ system memory is a practical minimum."

  install_ollama
  ensure_ollama_running || true
  pull_model_with_context "${DEFAULT_MODEL}" "${DEFAULT_NUM_CTX}"

  ensure_opencode_installed

  local model_id="${DEFAULT_MODEL}-${DEFAULT_NUM_CTX}"
  local config_content

  config_content="$(cat <<EOF
{
  "\$schema": "https://opencode.ai/config.json",
  "model": "ollama/${model_id}",
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama (local)",
      "options": {
        "baseURL": "http://localhost:11434/v1"
      },
      "models": {
        "${model_id}": {
          "name": "Local coding model"
        }
      }
    }
  }
}
EOF
)"

  write_config "${config_content}"

  print_next_steps \
    "Keep Ollama running: ollama serve" \
    "cd to your project directory" \
    "Run: opencode" \
    "Run: /models  (confirm local model is selected)" \
    "Run: /init     (first time in a project)" \
    "If tool calls fail, increase num_ctx and recreate the model variant" \
    "When a workflow stabilizes, freeze it into a small app"

  log_info "Optional shortcut: ollama launch opencode"
  log_info "Reminder: follow each provider's terms of service."
}

main "$@"
