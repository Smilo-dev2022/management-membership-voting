#!/usr/bin/env python3

import argparse
import concurrent.futures
import json
import os
import sys
import time
from typing import Dict, Any, List, Optional, Tuple
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Batch call GET api/v1/Voters/GetVoterAllDetails for multiple IDs"
    )
    parser.add_argument(
        "--base-url",
        required=True,
        help="Base URL, e.g., https://example.com",
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "--ids",
        help="Comma-separated list of voter IDs",
    )
    group.add_argument(
        "--ids-file",
        help="Path to a file with one voter ID per line",
    )
    parser.add_argument(
        "--format",
        choices=["json", "xml"],
        default="json",
        help="Desired response format (Accept header)",
    )
    parser.add_argument(
        "--output-dir",
        default="outputs",
        help="Directory to write individual response files",
    )
    parser.add_argument(
        "--concurrency",
        type=int,
        default=8,
        help="Max concurrent requests",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=30.0,
        help="HTTP timeout in seconds",
    )
    parser.add_argument(
        "--retries",
        type=int,
        default=2,
        help="Number of retry attempts per ID on failures",
    )
    parser.add_argument(
        "--retry-backoff",
        type=float,
        default=0.75,
        help="Exponential backoff base (seconds)",
    )
    parser.add_argument(
        "--auth-bearer",
        help="Optional Bearer token for Authorization header",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Only print what would be requested, do not perform calls",
    )
    return parser.parse_args()


def load_ids(args: argparse.Namespace) -> List[str]:
    if args.ids:
        return [i.strip() for i in args.ids.split(",") if i.strip()]
    assert args.ids_file is not None
    with open(args.ids_file, "r", encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip()]


def build_headers(fmt: str, bearer: Optional[str]) -> Dict[str, str]:
    accept = "application/json" if fmt == "json" else "application/xml"
    headers = {"Accept": accept}
    if bearer:
        headers["Authorization"] = f"Bearer {bearer}"
    return headers


def build_url(base_url: str, voter_id: str) -> str:
    # Ensure no trailing slash issues
    base = base_url[:-1] if base_url.endswith("/") else base_url
    return f"{base}/api/v1/Voters/GetVoterAllDetails"


def fetch_one(
    base_url: str,
    voter_id: str,
    headers: Dict[str, str],
    timeout: float,
    retries: int,
    backoff: float,
) -> Tuple[str, int, str, Optional[str]]:
    url = build_url(base_url, voter_id)
    params = {"ID": voter_id}
    attempt = 0
    last_error: Optional[str] = None
    while True:
        try:
            full_url = f"{url}?{urlencode(params)}"
            req = Request(full_url, method="GET", headers=headers)
            with urlopen(req, timeout=timeout) as resp:
                status_code = getattr(resp, "status", 200)
                body_bytes = resp.read()
                body_text = body_bytes.decode("utf-8", errors="replace")
                return voter_id, int(status_code), body_text, None
        except HTTPError as exc:
            try:
                body_bytes = exc.read()
                body_text = body_bytes.decode("utf-8", errors="replace")
            except Exception:
                body_text = ""
            return voter_id, int(exc.code), body_text, None
        except Exception as exc:  # noqa: BLE001 - surface errors to caller
            last_error = f"{type(exc).__name__}: {exc}"
            if attempt >= retries:
                return voter_id, -1, "", last_error
            sleep_time = backoff * (2 ** attempt)
            time.sleep(sleep_time)
            attempt += 1


def ensure_output_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def write_output(
    output_dir: str,
    voter_id: str,
    fmt: str,
    status_code: int,
    body: str,
    error: Optional[str],
) -> None:
    extension = "json" if fmt == "json" else "xml"
    safe_id = voter_id.replace("/", "_")
    body_path = os.path.join(output_dir, f"{safe_id}.{extension}")
    meta_path = os.path.join(output_dir, f"{safe_id}.meta.json")

    # Write body
    with open(body_path, "w", encoding="utf-8") as f:
        f.write(body)

    # Write metadata
    meta: Dict[str, Any] = {
        "voter_id": voter_id,
        "status_code": status_code,
        "error": error,
    }
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2, ensure_ascii=False)


def main() -> int:
    args = parse_args()
    voter_ids = load_ids(args)

    if args.dry_run:
        print("Dry run - would call:")
        for vid in voter_ids:
            print(
                f"GET {build_url(args.base_url, vid)}?ID={vid} Accept={'application/json' if args.format == 'json' else 'application/xml'}"
            )
        return 0

    ensure_output_dir(args.output_dir)
    headers = build_headers(args.format, args.auth_bearer)

    results: List[Tuple[str, int, str, Optional[str]]] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.concurrency) as pool:
        futures = [
            pool.submit(
                fetch_one,
                args.base_url,
                voter_id,
                headers,
                args.timeout,
                args.retries,
                args.retry_backoff,
            )
            for voter_id in voter_ids
        ]
        for fut in concurrent.futures.as_completed(futures):
            results.append(fut.result())

    # Write individual outputs
    for voter_id, status_code, body, error in results:
        write_output(args.output_dir, voter_id, args.format, status_code, body, error)

    # Write summary
    summary_path = os.path.join(args.output_dir, "summary.json")
    summary = [
        {
            "voter_id": voter_id,
            "status_code": status_code,
            "ok": error is None and status_code == 200,
            "error": error,
        }
        for voter_id, status_code, _body, error in results
    ]
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    # Print a short report to stdout
    total = len(results)
    successes = sum(1 for _vid, sc, _b, err in results if err is None and sc == 200)
    print(f"Completed {total} requests. Successes: {successes}. See {summary_path} for details.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

