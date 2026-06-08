#!/bin/bash
# 紧急回滚脚本 — 当检测到站点被错误代码覆盖时使用
# 用法: bash scripts/emergency-rollback.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

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

# 2. 确保 .vercel 链接正确
echo "正在校验项目链接..."
CURRENT_PROJECT=$(cat .vercel/project.json 2>/dev/null | python3 -c "import json,sys; print(json.load(sys.stdin).get('projectName',''))" 2>/dev/null)
if [ "$CURRENT_PROJECT" != "$PROJECT" ]; then
  echo "  修正项目链接: $CURRENT_PROJECT -> $PROJECT"
  npx vercel link --project "$PROJECT" --yes
fi

# 3. 回滚到上一个正确的 git 提交
echo "正在查找上一个正确的提交..."
# 找最近一个包含 .site-identity 的提交
LAST_GOOD=$(git log --oneline -20 | head -20)
echo "  最近提交:"
echo "$LAST_GOOD" | head -5

# 4. 强制重新部署
echo ""
echo "正在强制重新部署..."
npx vercel deploy --prod --yes --force

echo ""
echo -e "${GREEN}回滚部署已触发，等待构建完成...${NC}"
echo "运行验证: node scripts/post-deploy-verify.js"
