#!/usr/bin/env python3
"""클로드 코드 토큰 사용량 분석기 - "어디서 토큰이 쓰였나"를 본다.

~/.claude/projects/**/*.jsonl (Claude Code 대화 기록)를 읽어
프로젝트별 / 세션별 / 날짜별 / 모델별로 토큰과 예상 비용을 집계한다.
본인 PC에서 돌리면 그 PC의 모든 프로젝트·세션이 한 번에 집계된다.

사용 예:
    python3 token_usage.py                      # 최근 30일, 프로젝트별
    python3 token_usage.py --by session --last 7d
    python3 token_usage.py --by day --last 14d
    python3 token_usage.py --by project --detail # 프로젝트 안의 세션까지
"""
import argparse
import json
import os
import re
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from glob import glob

DEFAULT_ROOT = os.path.expanduser("~/.claude/projects")

# 100만 토큰당 USD (입력, 출력). 캐시 쓰기는 입력가의 1.25배(5분)/2배(1시간),
# 캐시 읽기는 입력가의 0.1배.
PRICES = {
    "claude-fable-5": (10.0, 50.0),
    "claude-mythos-5": (10.0, 50.0),
    "claude-opus-5": (5.0, 25.0),
    "claude-opus-4-8": (5.0, 25.0),
    "claude-opus-4-7": (5.0, 25.0),
    "claude-opus-4-6": (5.0, 25.0),
    "claude-sonnet-5": (2.0, 10.0),
    "claude-sonnet-4-6": (3.0, 15.0),
    "claude-haiku-4-5": (1.0, 5.0),
}
FIELDS = ("input", "output", "cache_write_5m", "cache_write_1h", "cache_read")


def parse_ts(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)


def parse_duration(value):
    m = re.fullmatch(r"(\d+(?:\.\d+)?)\s*([smhd])", value.strip())
    if not m:
        raise argparse.ArgumentTypeError(f"기간 형식 오류: {value} (예: 30m, 24h, 7d)")
    unit = {"s": "seconds", "m": "minutes", "h": "hours", "d": "days"}[m.group(2)]
    return timedelta(**{unit: float(m.group(1))})


def price_of(model, row):
    """모델 단가를 모르면 None (비용 집계에서 제외)."""
    rate = PRICES.get(model)
    if rate is None:
        return None
    inp, out = rate
    return (
        row["input"] * inp
        + row["output"] * out
        + row["cache_write_5m"] * inp * 1.25
        + row["cache_write_1h"] * inp * 2.0
        + row["cache_read"] * inp * 0.1
    ) / 1_000_000


def collect(root, since, until):
    """구간 내 usage 레코드를 requestId 기준 중복 제거하여 수집."""
    seen, rows = set(), []
    for path in glob(os.path.join(root, "**", "*.jsonl"), recursive=True):
        cwd_hint = os.path.basename(os.path.dirname(path))
        cwd = None
        pending = []
        with open(path, encoding="utf-8", errors="replace") as fh:
            for line in fh:
                if '"usage"' not in line and '"cwd"' not in line:
                    continue
                try:
                    rec = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if not cwd and rec.get("cwd"):
                    cwd = rec["cwd"]
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
                creation = usage.get("cache_creation") or {}
                w5 = creation.get("ephemeral_5m_input_tokens")
                w1h = creation.get("ephemeral_1h_input_tokens")
                if w5 is None and w1h is None:
                    # 세부 내역이 없으면 보수적으로 5분 TTL 로 간주
                    w5, w1h = usage.get("cache_creation_input_tokens", 0) or 0, 0
                pending.append({
                    "ts": ts,
                    "session": rec.get("sessionId", "?")[:8],
                    "model": (rec.get("message") or {}).get("model", "unknown"),
                    "branch": rec.get("gitBranch") or "-",
                    "input": usage.get("input_tokens", 0) or 0,
                    "output": usage.get("output_tokens", 0) or 0,
                    "cache_write_5m": w5 or 0,
                    "cache_write_1h": w1h or 0,
                    "cache_read": usage.get("cache_read_input_tokens", 0) or 0,
                })
        for row in pending:
            row["project"] = cwd or cwd_hint
            rows.append(row)
    rows.sort(key=lambda r: r["ts"])
    return rows


def totals(rows):
    out = dict.fromkeys(FIELDS, 0)
    cost, priced = 0.0, True
    for r in rows:
        for f in FIELDS:
            out[f] += r[f]
        c = price_of(r["model"], r)
        if c is None:
            priced = False
        else:
            cost += c
    out["cache_write"] = out["cache_write_5m"] + out["cache_write_1h"]
    out["total"] = sum(out[f] for f in FIELDS)
    out["requests"] = len(rows)
    out["cost"] = cost if priced else None
    return out


def key_of(row, by, tz):
    if by == "project":
        return row["project"]
    if by == "session":
        return f"{row['project']}  [{row['session']}]"
    if by == "day":
        return row["ts"].astimezone(tz).strftime("%Y-%m-%d")
    if by == "branch":
        return f"{row['project']}  ({row['branch']})"
    return row["model"]


def money(cost):
    return f"${cost:,.2f}" if cost is not None else "  (단가미상)"


def report(rows, since, until, by, tz, tzlabel, detail):
    grand = totals(rows)
    lines = [
        f"■ 구간   : {since.astimezone(tz):%Y-%m-%d %H:%M} ~ {until.astimezone(tz):%Y-%m-%d %H:%M} ({tzlabel})",
        f"■ 요청   : {grand['requests']:,}건   총 토큰 {grand['total']:,}   예상비용 {money(grand['cost'])}",
        f"■ 내역   : 입력 {grand['input']:,} / 출력 {grand['output']:,} / "
        f"캐시쓰기 {grand['cache_write']:,} / 캐시읽기 {grand['cache_read']:,}",
    ]
    if not rows:
        lines.append("\n해당 구간에 기록된 사용량이 없습니다.")
        return "\n".join(lines)

    groups = defaultdict(list)
    for r in rows:
        groups[key_of(r, by, tz)].append(r)
    ranked = sorted(groups.items(), key=lambda kv: -totals(kv[1])["total"])

    label = {"project": "프로젝트", "session": "세션", "day": "날짜",
             "model": "모델", "branch": "브랜치"}[by]
    candidates = list(groups)
    if detail:
        candidates += [f"  \u2514 {r['model']}" for r in rows]
    width = min(52, max(24, max(len(k) for k in candidates)))
    lines += ["", f"{label}별 (사용량 많은 순)", "-" * (width + 46)]
    for name, group in ranked:
        t = totals(group)
        share = t["total"] / grand["total"] * 100 if grand["total"] else 0
        lines.append(
            f"{name[:width]:<{width}} {t['requests']:>5}건 "
            f"{t['total']:>13,} ({share:5.1f}%) {money(t['cost']):>12}"
        )
        if detail:
            for model, sub in sorted(
                defaultdict(list, {m: [r for r in group if r["model"] == m]
                                   for m in {r["model"] for r in group}}).items(),
                key=lambda kv: -totals(kv[1])["total"],
            ):
                st = totals(sub)
                lines.append(
                    f"  └ {model[:width - 4]:<{width - 4}} {st['requests']:>5}건 "
                    f"{st['total']:>13,}          {money(st['cost']):>12}"
                )
    lines += [
        "",
        "※ 비용은 Anthropic API 공개 단가 기준 환산값입니다. Claude Pro/Max 구독으로",
        "   Claude Code 를 쓰는 경우 실제로 청구되는 금액이 아니라 '얼마어치 썼는지' 참고치입니다.",
        "※ 캐시 읽기는 입력 단가의 0.1배, 캐시 쓰기는 1.25배(5분)/2배(1시간)로 계산했습니다.",
    ]
    return "\n".join(lines)


def main():
    ap = argparse.ArgumentParser(description="클로드 코드 토큰 사용량 분석")
    ap.add_argument("--by", default="project",
                    choices=["project", "session", "day", "model", "branch"],
                    help="집계 기준 (기본: project)")
    ap.add_argument("--last", type=parse_duration, default=parse_duration("30d"),
                    help="최근 기간 (예: 24h, 7d, 30d). 기본 30d")
    ap.add_argument("--since", type=parse_ts, help="시작 시각 (ISO8601). --last 보다 우선")
    ap.add_argument("--until", type=parse_ts, help="종료 시각 (ISO8601)")
    ap.add_argument("--detail", action="store_true", help="그룹 안의 모델별 내역까지 표시")
    ap.add_argument("--tz", default="+9", help="출력 시간대 오프셋 (기본 +9, KST)")
    ap.add_argument("--root", default=DEFAULT_ROOT, help="Claude Code 대화 기록 디렉터리")
    ap.add_argument("--json", action="store_true", help="JSON 으로 출력")
    args = ap.parse_args()

    now = datetime.now(timezone.utc)
    until = args.until or now
    since = args.since or (until - args.last)
    offset = float(args.tz)
    tz = timezone(timedelta(hours=offset))

    if not os.path.isdir(args.root):
        raise SystemExit(f"대화 기록 디렉터리를 찾을 수 없습니다: {args.root}")

    rows = collect(args.root, since, until)
    if args.json:
        groups = defaultdict(list)
        for r in rows:
            groups[key_of(r, args.by, tz)].append(r)
        print(json.dumps({
            "since": since.isoformat(), "until": until.isoformat(), "by": args.by,
            "overall": totals(rows),
            "groups": {k: totals(v) for k, v in groups.items()},
        }, ensure_ascii=False, indent=2))
    else:
        print(report(rows, since, until, args.by, tz, f"UTC{offset:+g}", args.detail))


if __name__ == "__main__":
    main()
