#!/bin/bash
# 紧急回滚脚本 — 当检测到站点被错误代码覆盖时使用
# 用法: bash scripts/emergency-rollback.sh [--auto]
#   --auto  自动模式，不询问确认

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

AUTO_MODE=false
if [ "$1" = "--auto" ]; then
  AUTO_MODE=true
fi

echo -e "${YELLOW}══════════════════════════════════════${NC}"
echo -e "${YELLOW}  紧急回滚脚本${NC}"
echo -e "${YELLOW}══════════════════════════════════════${NC}"
echo ""

# 读取站点身份
IDENTITY=$(cat .site-identity 2>/dev/null)
if [ -z "$IDENTITY" ]; then
  echo -e "${RED}错误: .site-identity 文件不存在${NC}"
  exit 1
fi

SITE=$(echo "$IDENTITY" | python3 -c "import json,sys; print(json.load(sys.stdin)['site'])")
PROJECT=$(echo "$IDENTITY" | python3 -c "import json,sys; print(json.load(sys.stdin)['projectName'])")
TITLE=$(echo "$IDENTITY" | python3 -c "import json,sys; print(json.load(sys.stdin)['title'])")

echo -e "站点: ${GREEN}$SITE${NC}"
echo -e "项目: ${GREEN}$PROJECT${NC}"
echo ""

# 1. 检查当前生产环境标题
echo "正在检查生产环境..."
ACTUAL_TITLE=$(curl -s --max-time 10 "https://$SITE" | grep -o '<title>[^<]*</title>' | sed 's/<[^>]*>//g' | sed 's/&amp;/\&/g')
echo "  期望标题: $TITLE"
echo "  实际标题: $ACTUAL_TITLE"

if [ "$ACTUAL_TITLE" = "$TITLE" ]; then
  echo -e "${GREEN}  标题匹配，无需回滚${NC}"
  exit 0
fi

echo -e "${RED}  标题不匹配! 开始回滚...${NC}"
echo ""

# 2. 尝试 Vercel 回滚（优先使用快照）
SNAPSHOT_FILE=".deploy-snapshot.json"
if [ -f "$SNAPSHOT_FILE" ]; then
  DEPLOY_ID=$(python3 -c "import json; print(json.load(open('$SNAPSHOT_FILE')).get('deployId',''))" 2>/dev/null)
  if [ -n "$DEPLOY_ID" ]; then
    echo -e "${CYAN}从快照找到部署 ID: $DEPLOY_ID${NC}"
    echo "正在执行 Vercel 回滚..."
    if npx vercel rollback "$DEPLOY_ID" --yes 2>&1; then
      echo -e "${GREEN}Vercel 回滚成功!${NC}"
      sleep 5
      # 验证回滚结果
      NEW_TITLE=$(curl -s --max-time 10 "https://$SITE" | grep -o '<title>[^<]*</title>' | sed 's/<[^>]*>//g' | sed 's/&amp;/\&/g')
      if [ "$NEW_TITLE" = "$TITLE" ]; then
        echo -e "${GREEN}回滚验证通过 ✓${NC}"
        exit 0
      else
        echo -e "${RED}回滚后标题仍不匹配，尝试重新部署...${NC}"
      fi
    else
      echo -e "${RED}Vercel 回滚失败，尝试重新部署...${NC}"
    fi
  fi
fi

# 3. 确保 .vercel 链接正确
echo "正在校验项目链接..."
CURRENT_PROJECT=$(cat .vercel/project.json 2>/dev/null | python3 -c "import json,sys; print(json.load(sys.stdin).get('projectName',''))" 2>/dev/null)
if [ "$CURRENT_PROJECT" != "$PROJECT" ]; then
  echo "  修正项目链接: $CURRENT_PROJECT -> $PROJECT"
  npx vercel link --project "$PROJECT" --yes
fi

# 4. 强制重新部署
echo ""
echo "正在强制重新部署..."
npx vercel deploy --prod --yes --force

echo ""
echo -e "${GREEN}回滚部署已触发，等待构建完成...${NC}"
echo "运行验证: node scripts/post-deploy-verify.js"
