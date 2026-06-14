#!/usr/bin/env bash
# Shared helpers for OpenCode setup scripts.

set -euo pipefail

OPENCODE_CONFIG_DIR="${HOME}/.config/opencode"
OPENCODE_CONFIG_FILE="${OPENCODE_CONFIG_DIR}/opencode.json"

log_info() {
  printf '\033[1;32m[INFO]\033[0m %s\n' "$*"
}

log_warn() {
  printf '\033[1;33m[WARN]\033[0m %s\n' "$*"
}

log_err() {
  printf '\033[1;31m[ERR ]\033[0m %s\n' "$*" >&2
}

detect_platform() {
  local uname_s
  uname_s="$(uname -s 2>/dev/null || echo unknown)"

  case "${uname_s}" in
    Darwin)
      PLATFORM="macos"
      ;;
    Linux)
      if grep -qi microsoft /proc/version 2>/dev/null; then
        PLATFORM="wsl"
      else
        PLATFORM="linux"
      fi
      ;;
    MINGW* | MSYS* | CYGWIN*)
      PLATFORM="gitbash"
      ;;
    *)
      PLATFORM="unknown"
      ;;
  esac
}

ensure_path_includes() {
  local dir="$1"
  if [[ ":${PATH}:" != *":${dir}:"* ]]; then
    export PATH="${dir}:${PATH}"
  fi
}

ensure_opencode_installed() {
  if command -v opencode >/dev/null 2>&1; then
    log_info "OpenCode is already installed: $(opencode --version 2>/dev/null || echo unknown)"
    return 0
  fi

  log_info "Installing OpenCode..."

  case "${PLATFORM}" in
    macos)
      if command -v brew >/dev/null 2>&1; then
        brew install anomalyco/tap/opencode
      else
        curl -fsSL https://opencode.ai/install | bash
      fi
      ;;
    linux | wsl | gitbash | unknown)
      curl -fsSL https://opencode.ai/install | bash
      ;;
  esac

  ensure_path_includes "${HOME}/.local/bin"
  ensure_path_includes "${HOME}/.opencode/bin"

  if ! command -v opencode >/dev/null 2>&1; then
    log_warn "OpenCode was installed, but 'opencode' is not on PATH yet."
    log_warn "Add this to your shell profile, then open a new terminal:"
    printf '  export PATH="$HOME/.local/bin:$PATH"\n'
    return 1
  fi

  log_info "OpenCode installed: $(opencode --version 2>/dev/null || echo unknown)"
}

ensure_config_dir() {
  mkdir -p "${OPENCODE_CONFIG_DIR}"
}

backup_existing_config() {
  if [[ -f "${OPENCODE_CONFIG_FILE}" ]]; then
    local backup
    backup="${OPENCODE_CONFIG_FILE}.bak.$(date +%Y%m%d-%H%M%S)"
    cp "${OPENCODE_CONFIG_FILE}" "${backup}"
    log_info "Backed up existing config to ${backup}"
  fi
}

write_config() {
  local content="$1"
  ensure_config_dir
  backup_existing_config
  printf '%s\n' "${content}" >"${OPENCODE_CONFIG_FILE}"
  log_info "Wrote ${OPENCODE_CONFIG_FILE}"
}

prompt_env_var() {
  local var_name="$1"
  local prompt_text="$2"
  local current="${!var_name-}"

  if [[ -n "${current}" ]]; then
    log_info "${var_name} is already set in this shell."
    return 0
  fi

  printf '%s\n' "${prompt_text}"
  read -r -s -p "${var_name}: " value
  printf '\n'

  if [[ -z "${value}" ]]; then
    log_warn "${var_name} was not entered. You can set it later manually."
    return 1
  fi

  export "${var_name}=${value}"
}

append_env_to_shell_rc() {
  local var_name="$1"
  local value="$2"
  local rc_file=""

  if [[ -n "${BASH_VERSION:-}" ]]; then
    rc_file="${HOME}/.bashrc"
  elif [[ -n "${ZSH_VERSION:-}" ]]; then
    rc_file="${HOME}/.zshrc"
  elif [[ "${PLATFORM}" == "macos" ]]; then
    rc_file="${HOME}/.zprofile"
  fi

  if [[ -z "${rc_file}" ]]; then
    log_warn "Could not detect shell rc file. Set ${var_name} manually."
    return 1
  fi

  touch "${rc_file}"
  if grep -q "export ${var_name}=" "${rc_file}" 2>/dev/null; then
    log_info "${var_name} already exists in ${rc_file}"
    return 0
  fi

  {
    printf '\n# Added by OpenCode setup script\n'
    printf 'export %s="%s"\n' "${var_name}" "${value}"
  } >>"${rc_file}"

  log_info "Appended ${var_name} to ${rc_file}"
}

print_next_steps() {
  printf '\n'
  log_info 'Next steps:'
  while (($# > 0)); do
    printf '  - %s\n' "$1"
    shift
  done
  printf '\n'
}
