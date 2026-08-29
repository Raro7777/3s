#!/usr/bin/env python3
"""클로드 토큰 사용량 집계기.

~/.claude/projects/**/*.jsonl 대화 기록(transcript)에서 assistant 응답의
usage 필드를 읽어 지정한 시간 구간의 토큰 사용량을 집계한다.

사용 예:
    python3 scripts/token_usage.py --since 2026-08-29T04:44:31Z --until 2026-08-29T06:41:31Z
    python3 scripts/token_usage.py --last 30m --tz +9
"""
import argparse
import json
import os
import re
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from glob import glob

DEFAULT_ROOT = os.path.expanduser("~/.claude/projects")


def parse_ts(value):
    """ISO8601(Z 포함) 문자열을 aware datetime 으로 변환."""
    return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)


def parse_duration(value):
    """'90s', '30m', '2h', '1d' 형태의 기간을 timedelta 로 변환."""
    m = re.fullmatch(r"(\d+(?:\.\d+)?)\s*([smhd])", value.strip())
    if not m:
        raise argparse.ArgumentTypeError(f"기간 형식이 올바르지 않습니다: {value} (예: 30m, 2h)")
    unit = {"s": "seconds", "m": "minutes", "h": "hours", "d": "days"}[m.group(2)]
    return timedelta(**{unit: float(m.group(1))})


def collect(root, since, until):
    """구간 내 usage 레코드를 requestId 기준으로 중복 제거하여 수집."""
    seen = set()
    rows = []
    for path in glob(os.path.join(root, "**", "*.jsonl"), recursive=True):
        with open(path, encoding="utf-8", errors="replace") as fh:
            for line in fh:
                line = line.strip()
                if not line or '"usage"' not in line:
                    continue
                try:
                    rec = json.loads(line)
                except json.JSONDecodeError:
                    continue
                usage = (rec.get("message") or {}).get("usage")
                if not isinstance(usage, dict) or not rec.get("timestamp"):
                    continue
                ts = parse_ts(rec["timestamp"])
                if not (since <= ts < until):
                    continue
                key = rec.get("requestId") or f"{rec.get('uuid')}:{rec['timestamp']}"
                if key in seen:
                    continue
                seen.add(key)
                rows.append({
                    "ts": ts,
                    "session": rec.get("sessionId", "?"),
                    "model": (rec.get("message") or {}).get("model", "unknown"),
                    "input": usage.get("input_tokens", 0) or 0,
                    "output": usage.get("output_tokens", 0) or 0,
                    "cache_write": usage.get("cache_creation_input_tokens", 0) or 0,
                    "cache_read": usage.get("cache_read_input_tokens", 0) or 0,
                })
    rows.sort(key=lambda r: r["ts"])
    return rows


FIELDS = ("input", "output", "cache_write", "cache_read")


def totals(rows):
    out = dict.fromkeys(FIELDS, 0)
    for r in rows:
        for f in FIELDS:
            out[f] += r[f]
    out["total"] = sum(out[f] for f in FIELDS)
    out["requests"] = len(rows)
    return out


def fmt(dt, tz):
    return dt.astimezone(tz).strftime("%Y-%m-%d %H:%M:%S")


def report(rows, since, until, tz, tzlabel):
    grand = totals(rows)
    lines = [
        f"■ 구간: {fmt(since, tz)} ~ {fmt(until, tz)} ({tzlabel})",
        f"■ 요청 수: {grand['requests']}건",
        "",
        "합계 (토큰)",
        f"  입력(input)          : {grand['input']:>12,}",
        f"  출력(output)         : {grand['output']:>12,}",
        f"  캐시 생성(write)     : {grand['cache_write']:>12,}",
        f"  캐시 조회(read)      : {grand['cache_read']:>12,}",
        f"  ─────────────────────────────────────",
        f"  총합                 : {grand['total']:>12,}",
    ]
    if rows:
        by_model = defaultdict(list)
        for r in rows:
            by_model[r["model"]].append(r)
        lines += ["", "모델별"]
        for model, group in sorted(by_model.items(), key=lambda kv: -totals(kv[1])["total"]):
            t = totals(group)
            lines.append(
                f"  {model:<22} {t['requests']:>4}건  총 {t['total']:>12,} "
                f"(in {t['input']:,} / out {t['output']:,} / "
                f"cw {t['cache_write']:,} / cr {t['cache_read']:,})"
            )
        lines += [
            "",
            f"첫 요청: {fmt(rows[0]['ts'], tz)}   마지막 요청: {fmt(rows[-1]['ts'], tz)}",
        ]
    return "\n".join(lines)


def main():
    ap = argparse.ArgumentParser(description="클로드 토큰 사용량 집계")
    ap.add_argument("--since", type=parse_ts, help="시작 시각 (ISO8601, 예: 2026-08-29T04:44:31Z)")
    ap.add_argument("--until", type=parse_ts, help="종료 시각 (ISO8601)")
    ap.add_argument("--last", type=parse_duration, help="지금부터 거슬러 올라갈 기간 (예: 30m)")
    ap.add_argument("--tz", default="+9", help="출력 시간대 오프셋 (기본 +9, KST)")
    ap.add_argument("--root", default=DEFAULT_ROOT, help="transcript 디렉터리")
    ap.add_argument("--json", action="store_true", help="JSON 으로 출력")
    args = ap.parse_args()

    now = datetime.now(timezone.utc)
    if args.last:
        since, until = now - args.last, now
    else:
        since = args.since or (now - timedelta(hours=24))
        until = args.until or now

    offset = float(args.tz)
    tz = timezone(timedelta(hours=offset))
    tzlabel = f"UTC{offset:+g}"

    rows = collect(args.root, since, until)
    if args.json:
        payload = totals(rows)
        payload["since"] = since.isoformat()
        payload["until"] = until.isoformat()
        print(json.dumps(payload, ensure_ascii=False, indent=2))
    else:
        print(report(rows, since, until, tz, tzlabel))


if __name__ == "__main__":
    main()
