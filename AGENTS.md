# 永久规则 — 自动化流程禁止修改

国内站 → 海外站的同步流程：
  车商上传 → DeepSeek 审核 → 创建车辆 → POST 海外站 /api/vehicles/publish → 客户浏览

**绝对禁止**：
- 添加中间审核层（runAutoReview 已在 route.ts 删除，不得恢复）
- 添加兜底 cron 同步（sync-overseas cron 已删除，不得恢复）
- 改为 DOMESTIC_DB_URL 直读
- 改为任何其他同步方式
- 删除或修改 /api/vehicles/publish 端点
- 修改 VehicleForm 的上传→审核→发布链路

违反即恢复并报告。
