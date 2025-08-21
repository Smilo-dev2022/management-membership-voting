#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-}"
IDS_FILE="${IDS_FILE:-}"
FORMAT="${FORMAT:-json}"
OUT_DIR="${OUT_DIR:-outputs}"
CONCURRENCY="${CONCURRENCY:-8}"
TIMEOUT="${TIMEOUT:-30}"
RETRIES="${RETRIES:-2}"
BACKOFF="${BACKOFF:-0.75}"
AUTH_BEARER="${AUTH_BEARER:-}"
DRY_RUN="${DRY_RUN:-}"

usage() {
  echo "Usage: BASE_URL=... IDS_FILE=... [FORMAT=json|xml] [OUT_DIR=outputs] [AUTH_BEARER=token] $0" >&2
}

if [[ -z "$BASE_URL" || -z "$IDS_FILE" ]]; then
  usage
  exit 1
fi

cd "$(dirname "$0")"

# Try to create and use venv; if ensurepip missing, fall back to system python
USE_VENV=1
if [[ ! -d .venv ]]; then
  if ! python3 -m venv .venv 2>/dev/null; then
    echo "WARN: python3-venv unavailable; proceeding without virtualenv" >&2
    USE_VENV=0
  fi
fi
if [[ "$USE_VENV" == "1" ]]; then
  # shellcheck disable=SC1091
  source .venv/bin/activate || USE_VENV=0
fi
pip -q install -r requirements.txt || echo "WARN: Failed to install deps globally; ensure 'requests' is available" >&2

mkdir -p "$OUT_DIR"

PY_ARGS=(
  --base-url "$BASE_URL"
  --ids-file "$IDS_FILE"
  --format "$FORMAT"
  --output-dir "$OUT_DIR"
  --concurrency "$CONCURRENCY"
  --timeout "$TIMEOUT"
  --retries "$RETRIES"
  --retry-backoff "$BACKOFF"
)

if [[ -n "$AUTH_BEARER" ]]; then
  PY_ARGS+=( --auth-bearer "$AUTH_BEARER" )
fi

if [[ -n "$DRY_RUN" ]]; then
  PY_ARGS+=( --dry-run )
fi

python3 batch_get_voter_all_details.py "${PY_ARGS[@]}"
