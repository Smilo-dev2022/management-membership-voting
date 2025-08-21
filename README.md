## Batch client: GetVoterAllDetails

Run the IEC-like endpoint `GET /api/v1/Voters/GetVoterAllDetails?ID={ID}` for many IDs and save outputs.

### Quick start

1) Put voter IDs into a file (one per line), e.g. `ids.txt`.

2) Run via shell wrapper (creates venv automatically):

```bash
BASE_URL="https://your-host" \
IDS_FILE="ids.txt" \
FORMAT="json" \
OUT_DIR="outputs" \
AUTH_BEARER="optional-token" \
bash run_all.sh
```

Outputs are written into `OUT_DIR` as `<ID>.json|xml` with companion `<ID>.meta.json` and an overall `summary.json`.

### Direct Python usage

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

python3 batch_get_voter_all_details.py \
  --base-url https://your-host \
  --ids-file ids.txt \
  --format json \
  --output-dir outputs \
  --concurrency 8 \
  --timeout 30 \
  --retries 2 \
  --retry-backoff 0.75 \
  --auth-bearer "optional-token"
```

To preview without performing requests:

```bash
python3 batch_get_voter_all_details.py --base-url https://your-host --ids 123,456 --dry-run
```

### Notes

- The `ID` is sent as a query parameter; it is treated as a string.
- Select response type using `--format json|xml` (sets the `Accept` header).
- Per-ID metadata captures HTTP status and any transport error.
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
