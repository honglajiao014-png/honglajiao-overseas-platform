#!/bin/bash
# 国内站→海外站 自动同步脚本
# 用法: bash scripts/auto-sync.sh
# crontab: */5 * * * * cd /Users/mj/honglajiao-overseas-platform && bash scripts/auto-sync.sh >> logs/sync-cron.log 2>&1

cd "$(dirname "$0")/.." || exit 1

# 读取环境变量
SYNC_KEY=$(grep '^export SYNC_API_KEY=' .env.local.sync_key 2>/dev/null | sed 's/^export SYNC_API_KEY="//;s/"$//')
if [ -z "$SYNC_KEY" ]; then
  SYNC_KEY=$(grep '^SYNC_API_KEY=' .env.local 2>/dev/null | head -1 | sed 's/^SYNC_API_KEY="*//;s/"$//')
fi

if [ -z "$SYNC_KEY" ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: SYNC_API_KEY not found" >> logs/sync-cron.log
  exit 1
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting sync..."

# 调用海外站 API (Vercel)
curl -s --max-time 120 -X POST "https://honglajiao1688.com/api/admin/sync" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $SYNC_KEY" \
  -d '{"exchangeRate":6.8}' | python3 -c "
import json,sys
try:
  d = json.load(sys.stdin)
  print(f'Total: {d.get(\"total\",0)}, Success: {d.get(\"success\",0)}, Failed: {d.get(\"failed\",0)}')
  if d.get('failed',0) > 0:
    for r in d.get('results',[]):
      if not r.get('success'):
        print(f'  FAIL: {r.get(\"brand\",\"?\")} {r.get(\"model\",\"?\")}: {r.get(\"error\",\"?\")}')
except: print('Parse error, check logs')
"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Sync done"
