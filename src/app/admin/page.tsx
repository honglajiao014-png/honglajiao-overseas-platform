"use client";

import { useState, useEffect, useCallback } from "react";
import AutoSpecFill from "@/components/AutoSpecFill";

// ===== Types =====
interface Stats {
  totalVehicles: number; soldVehicles: number; availableVehicles: number;
  totalUsers: number; newInquiries: number; completedOrders: number;
  totalProfit: number; totalSpecs: number;
  submittedVehicles?: number; approvedPublishedVehicles?: number;
  dealerCount?: number; todayVehicles?: number;
}

interface Vehicle { id: string; slug: string; brand: string; model: string; year: number; type: string; mileageKm: number | null; transmission: string | null; fuelType: string | null; steering: string | null; color: string | null; condition: string; supplier: string | null; location: string | null; images: string[]; basePrice: number; markup: number; salePrice: number; profit: number; status: string; published: boolean; featured: boolean; description: string | null; specId: string | null; soldAt: string | null; createdAt: string; }

interface VehicleSpec { id: string; brand: string; model: string; yearRange: string; vehicleType: string | null; energyType: string | null; specs: string; }

interface Inquiry { id: string; name: string; contact: string; country: string | null; vehicleType: string | null; message: string; status: string; createdAt: string; vehicle?: { brand: string; model: string; year: number } | null; }

interface Order { id: string; vehicle: { brand: string; model: string; year: number; basePrice: number } | null; buyerName: string; buyerContact: string; salePrice: number; profit: number; status: string; createdAt: string; }

interface User { id: string; email: string; name: string; role: string; phone: string | null; company: string | null; country: string | null; createdAt: string; }

type TabId = "dashboard" | "vehicles" | "specs" | "inquiries" | "orders" | "users" | "customers" | "content";

// ===== Reusable UI =====
function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className={`${color || "bg-white border border-gray-200"} rounded-2xl p-5`}>
      <div className="text-3xl font-extrabold">{value ?? "-"}</div>
      <div className="text-sm mt-1 opacity-70">{label}</div>
    </div>
  );
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", small }: { children: React.ReactNode; onClick?: () => void; variant?: string; small?: boolean; type?: "button" | "submit" }) {
  const base = small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  const colors: Record<string, string> = {
    primary: "bg-accent text-white hover:bg-accent-dark",
    danger: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-500 hover:text-gray-700",
  };
  return <button onClick={onClick} className={`${base} font-semibold rounded-lg transition-all ${colors[variant] || colors.primary}`}>{children}</button>;
}

function Empty({ text }: { text?: string }) {
  return <div className="py-12 text-center text-gray-400 text-sm">{text || "No data"}</div>;
}

// ===== Admin Main =====
export default function AdminDashboard() {
  // Auth
  const [token, setToken] = useState("");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Data
  const [stats, setStats] = useState<Stats | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [specs, setSpecs] = useState<VehicleSpec[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [loading, setLoading] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [editSpec, setEditSpec] = useState<VehicleSpec | null>(null);
  const [showNewSpec, setShowNewSpec] = useState(false);
  const [showNewVehicle, setShowNewVehicle] = useState(false);
  const [specPage, setSpecPage] = useState(0);
  const [specFilter, setSpecFilter] = useState("");
  const [vehPage, setVehPage] = useState(0);
  const [vehFilter, setVehFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [publishedFilter, setPublishedFilter] = useState<"published" | "unpublished" | "all">("published");

  const PER_PAGE = 20;

  // ===== Auth =====
  const login = async () => {
    setLoginError("");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(loginForm) });
    const data = await res.json();
    if (data.token) { setToken(data.token); setLoggedIn(true); fetchAll(data.token); }
    else setLoginError(data.error || "Login failed");
  };

  const headers = useCallback(() => ({ "Content-Type": "application/json", Authorization: `Bearer ${token}` }), [token]);

  /** 上传文件到 /api/upload，失败自动重试 3 次 */
  const uploadFile = async (file: File, angle: string): Promise<string> => {
    let lastErr: Error | null = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("angle", angle);
        const res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "上传失败" }));
          throw new Error(err.error || `上传失败 (${res.status})`);
        }
        const data = await res.json();
        return data.url as string;
      } catch (err: any) {
        lastErr = err;
        if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
      }
    }
    throw lastErr || new Error("上传失败");
  };

  /** 预检 Blob 服务 */
  const checkBlobHealth = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/health/blob");
      const data = await res.json();
      return data.status === "healthy";
    } catch {
      return false;
    }
  };

  const fetchAll = async (tok?: string) => {
    const t = tok || token;
    const h = { Authorization: `Bearer ${t}` };
    setLoading(true);

    // 每个请求独立 catch，一个接口挂了不影响其他
    const safeFetch = (url: string) =>
      fetch(url, { headers: h })
        .then(r => { if (!r.ok) throw new Error(`${url} ${r.status}`); return r.json(); })
        .catch(e => { console.warn(`[admin] ${url} 请求失败:`, e.message); return null; });

    const [s, v, sp, iq, o, u] = await Promise.all([
      safeFetch("/api/admin/stats"),
      safeFetch("/api/admin/vehicles"),
      safeFetch("/api/admin/specs"),
      safeFetch("/api/admin/inquiries"),
      safeFetch("/api/admin/orders"),
      safeFetch("/api/admin/users"),
    ]);
    if (s) setStats(s);
    if (v) setVehicles(v.vehicles || []);
    if (sp) setSpecs(sp.specs || []);
    if (iq) setInquiries(iq.inquiries || []);
    if (o) setOrders(o.orders || []);
    if (u) setUsers(u.users || []);

    fetch("/api/admin/leads", { headers: h }).then(r => r.json()).then(d => setLeads(d.leads || [])).catch(() => {});
    setLoading(false);
  };

  // ===== Sync to Overseas =====
  const syncToOverseas = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/sync", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ exchangeRate: 6.8 }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ 同步完成！\n总计: ${data.total}\n成功: ${data.success}\n失败: ${data.failed}`);
        fetchAll();
      } else {
        alert(`❌ 同步失败: ${data.error || res.statusText}`);
      }
    } catch (e: any) {
      alert(`❌ 同步异常: ${e.message}`);
    }
    setSyncing(false);
  };

  // ===== 删除车辆（级联） =====
  const deleteVehicle = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/vehicles", { method: "DELETE", headers: headers(), body: JSON.stringify({ id: deleteTarget.id }) });
      const data = await res.json();
      if (!res.ok) {
        alert(`❌ 删除失败: ${data.error || res.statusText}`);
        setDeleting(false);
        return;
      }
      const detail = data.detail;
      const msg = detail
        ? `✅ 已删除 ${detail.vehicle}\n级联删除: ${detail.deletedInquiries} 条询价、${detail.deletedOrders} 条订单`
        : "✅ 删除成功";
      alert(msg);
      setDeleteTarget(null);
      setDeleting(false);
      fetchAll();
    } catch (e: any) {
      alert(`❌ 删除异常: ${e.message}`);
      setDeleting(false);
    }
  };

  // ===== Tab Ref =====
  const scrollRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {};

  // ===== Login Screen =====
  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">后台管理</h2>
            <p className="text-xs text-gray-500 text-center mb-6">Honglajiao Auto Export Admin</p>
            {loginError && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{loginError}</div>}
            <div className="space-y-4">
              <input type="text" placeholder="Username" value={loginForm.username}
                onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && login()}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
              <input type="password" placeholder="Password" value={loginForm.password}
                onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && login()}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
              <button onClick={login} className="w-full bg-accent text-white py-3 rounded-xl font-bold text-sm hover:bg-accent-dark transition-all">解锁</button>
              <div className="text-center"><a href="/" className="text-xs text-gray-400 hover:text-accent">返回前台</a></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ===== Dashboard Tab =====
  const DashboardTab = () => (
    <div>
      {/* 核心数据卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="text-3xl font-extrabold text-yellow-600">{stats?.submittedVehicles ?? "-"}</div>
          <div className="text-sm mt-1 text-gray-500">待审核 (SUBMITTED)</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="text-3xl font-extrabold text-green-600">{stats?.approvedPublishedVehicles ?? "-"}</div>
          <div className="text-sm mt-1 text-gray-500">已上架 (APPROVED+PUBLISHED)</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="text-3xl font-extrabold text-blue-600">{stats?.dealerCount ?? "-"}</div>
          <div className="text-sm mt-1 text-gray-500">车商数 (DEALER)</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="text-3xl font-extrabold text-purple-600">{stats?.todayVehicles ?? "-"}</div>
          <div className="text-sm mt-1 text-gray-500">今日新增</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="车辆总数" value={stats?.totalVehicles ?? "-"} color="bg-blue-50 border-0 text-blue-700" />
        <StatCard label="可售车辆" value={stats?.availableVehicles ?? "-"} color="bg-green-50 border-0 text-green-700" />
        <StatCard label="已售车辆" value={stats?.soldVehicles ?? "-"} color="bg-amber-50 border-0 text-amber-700" />
        <StatCard label="总利润" value={`$${(stats?.totalProfit ?? 0).toLocaleString()}`} color="bg-purple-50 border-0 text-purple-700" />
        <StatCard label="车型规格数" value={stats?.totalSpecs ?? specs.length} color="bg-indigo-50 border-0 text-indigo-700" />
        <StatCard label="新询价" value={stats?.newInquiries ?? "-"} color="bg-orange-50 border-0 text-orange-700" />
        <StatCard label="已完成订单" value={stats?.completedOrders ?? "-"} color="bg-teal-50 border-0 text-teal-700" />
        <StatCard label="注册用户" value={stats?.totalUsers ?? "-"} color="bg-pink-50 border-0 text-pink-700" />
      </div>

      {/* Latest Inquiries */}
      <div className="bg-white rounded-2xl border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200 font-semibold text-gray-900 flex items-center justify-between">
          <span>最新询价 ({inquiries.length})</span>
          <button onClick={() => setActiveTab("inquiries")} className="text-xs text-accent hover:underline">查看全部</button>
        </div>
        {inquiries.length === 0 ? <Empty /> : (
          <div className="divide-y divide-gray-100">
            {inquiries.slice(0, 5).map(iq => (
              <div key={iq.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <span className="font-medium text-sm">{iq.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{iq.contact} {iq.country ? `(${iq.country})` : ""}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  iq.status === "new" ? "bg-orange-100 text-orange-700" : iq.status === "contacted" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                }`}>{iq.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">快捷操作</h3>
        <div className="flex flex-wrap gap-3">
          <Btn onClick={() => { setShowNewVehicle(true); setActiveTab("vehicles"); }}>新增车辆</Btn>
          <Btn onClick={() => { setShowNewSpec(true); setActiveTab("specs"); }}>新增车型规格</Btn>
          <Btn variant="outline" onClick={() => setActiveTab("inquiries")}>查看询价</Btn>
          <Btn variant="outline" onClick={() => setActiveTab("orders")}>查看订单</Btn>
        </div>
      </div>
    </div>
  );

  // ===== Vehicles Tab =====
  const VehiclesTab = () => {
    const filtered = vehicles
      .filter(v => !vehFilter || v.brand.includes(vehFilter) || v.model.includes(vehFilter))
      .filter(v => publishedFilter === "all" ? true : publishedFilter === "published" ? v.published : !v.published);
    const paged = filtered.slice(vehPage * PER_PAGE, (vehPage + 1) * PER_PAGE);
    const totalPages = Math.ceil(filtered.length / PER_PAGE);

    const updateStatus = async (id: string, status: string) => {
      await fetch("/api/admin/vehicles", { method: "PATCH", headers: headers(), body: JSON.stringify({ id, status }) });
      fetchAll();
    };

    const togglePublish = async (id: string, published: boolean) => {
      await fetch("/api/admin/vehicles", { method: "PATCH", headers: headers(), body: JSON.stringify({ id, published }) });
      fetchAll();
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">车辆管理</h2>
          <Btn onClick={() => setShowNewVehicle(true)}>+ 新增车辆</Btn>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <input placeholder="搜索品牌/车型..." value={vehFilter} onChange={e => { setVehFilter(e.target.value); setVehPage(0); }}
            className="w-full md:w-72 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent" />
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {(["published", "unpublished", "all"] as const).map(opt => (
              <button key={opt} onClick={() => { setPublishedFilter(opt); setVehPage(0); }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  publishedFilter === opt ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}>
                {opt === "published" ? "已上架" : opt === "unpublished" ? "已下架" : "全部"}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">车辆</th>
                  <th className="px-4 py-3 font-semibold">年份</th>
                  <th className="px-4 py-3 font-semibold">里程</th>
                  <th className="px-4 py-3 font-semibold">底价</th>
                  <th className="px-4 py-3 font-semibold">售价</th>
                  <th className="px-4 py-3 font-semibold">利润</th>
                  <th className="px-4 py-3 font-semibold">状态</th>
                  <th className="px-4 py-3 font-semibold">上架</th>
                  <th className="px-4 py-3 font-semibold">公开</th>
                  <th className="px-4 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? <tr><td colSpan={10}><Empty /></td></tr> :
                  paged.map(v => (
                    <tr key={v.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium">{v.brand} {v.model}</div>
                        <div className="text-xs text-gray-400">{v.type} · {v.steering || "LHD"}</div>
                      </td>
                      <td className="px-4 py-3">{v.year}</td>
                      <td className="px-4 py-3">{v.mileageKm ? `${v.mileageKm.toLocaleString()}km` : "-"}</td>
                      <td className="px-4 py-3">${v.basePrice.toLocaleString()}</td>
                      <td className="px-4 py-3 text-accent font-bold">${v.salePrice.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={v.profit > 0 ? "text-green-600 font-bold" : "text-gray-400"}>${v.profit.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <select value={v.status} onChange={e => updateStatus(v.id, e.target.value)}
                          className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${
                            v.status === "PUBLISHED" ? "bg-green-100 text-green-700" :
                            v.soldAt ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                          }`}>
                          <option value="PUBLISHED">Published</option>
                          <option value="APPROVED">Approved</option>
                          <option value="SUBMITTED">Submitted</option>
                          <option value="DRAFT">Draft</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${v.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {v.published ? "已上架" : "已下架"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => togglePublish(v.id, !v.published)}
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${v.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                          {v.published ? "显示" : "隐藏"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setEditVehicle(v)} className="text-accent hover:text-accent-dark text-xs">编辑</button>
                          <button onClick={() => setDeleteTarget(v)} className="text-red-400 hover:text-red-600 text-xs ml-2">删除</button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button disabled={vehPage === 0} onClick={() => setVehPage(p => p - 1)}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-30">上一页</button>
            <span className="text-sm text-gray-500">{vehPage + 1} / {totalPages}</span>
            <button disabled={vehPage >= totalPages - 1} onClick={() => setVehPage(p => p + 1)}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-30">下一页</button>
          </div>
        )}
      </div>
    );
  };

  // ===== Specs Tab =====
  const SpecsTab = () => {
    const filtered = specs.filter(s => !specFilter || s.brand.includes(specFilter) || s.model.includes(specFilter));
    const paged = filtered.slice(specPage * PER_PAGE, (specPage + 1) * PER_PAGE);
    const totalPages = Math.ceil(filtered.length / PER_PAGE);

    const deleteSpec = async (id: string) => {
      if (!confirm("确认删除该规格？")) return;
      await fetch("/api/admin/specs", { method: "DELETE", headers: headers(), body: JSON.stringify({ id }) });
      fetchAll();
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">车型规格管理 ({specs.length})</h2>
          <Btn onClick={() => setShowNewSpec(true)}>+ 新增规格</Btn>
        </div>

        <input placeholder="搜索品牌/车型..." value={specFilter} onChange={e => { setSpecFilter(e.target.value); setSpecPage(0); }}
          className="w-full md:w-72 border border-gray-200 rounded-lg px-4 py-2 text-sm mb-4 focus:outline-none focus:border-accent" />

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">品牌</th>
                  <th className="px-4 py-3 font-semibold">车型</th>
                  <th className="px-4 py-3 font-semibold">年份范围</th>
                  <th className="px-4 py-3 font-semibold">类型</th>
                  <th className="px-4 py-3 font-semibold">能源</th>
                  <th className="px-4 py-3 font-semibold">规格字段数</th>
                  <th className="px-4 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? <tr><td colSpan={7}><Empty /></td></tr> :
                  paged.map(s => {
                    let specCount = 0;
                    try { specCount = Object.keys(JSON.parse(s.specs)).length; } catch {}
                    return (
                      <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{s.brand}</td>
                        <td className="px-4 py-3">{s.model}</td>
                        <td className="px-4 py-3">{s.yearRange || "-"}</td>
                        <td className="px-4 py-3">{s.vehicleType || "-"}</td>
                        <td className="px-4 py-3">{s.energyType || "-"}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{specCount}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => setEditSpec(s)} className="text-accent hover:text-accent-dark text-xs mr-2">编辑</button>
                          <button onClick={() => deleteSpec(s.id)} className="text-red-400 hover:text-red-600 text-xs">删除</button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button disabled={specPage === 0} onClick={() => setSpecPage(p => p - 1)}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-30">上一页</button>
            <span className="text-sm text-gray-500">{specPage + 1} / {totalPages}</span>
            <button disabled={specPage >= totalPages - 1} onClick={() => setSpecPage(p => p + 1)}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-30">下一页</button>
          </div>
        )}
      </div>
    );
  };

  // ===== Inquiries Tab =====
  const InquiriesTab = () => {
    const updateStatus = async (id: string, status: string) => {
      await fetch("/api/admin/inquiries", { method: "PATCH", headers: headers(), body: JSON.stringify({ id, status }) });
      fetchAll();
    };

    return (
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">询价管理 ({inquiries.length})</h2>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {inquiries.length === 0 ? <Empty text="暂无询价" /> : (
            <div className="divide-y divide-gray-100">
              {inquiries.map(iq => (
                <div key={iq.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{iq.name}</span>
                        <span className="text-xs text-gray-400">{iq.contact}</span>
                        {iq.country && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{iq.country}</span>}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{iq.message}</p>
                      {iq.vehicle && <p className="text-xs text-gray-400">咨询车辆: {iq.vehicle.brand} {iq.vehicle.model} ({iq.vehicle.year})</p>}
                      <p className="text-xs text-gray-400 mt-1">{new Date(iq.createdAt).toLocaleString("zh-CN")}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <select value={iq.status} onChange={e => updateStatus(iq.id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-3 py-1 border-0 ${
                          iq.status === "new" ? "bg-orange-100 text-orange-700" :
                          iq.status === "contacted" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                        }`}>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ===== Orders Tab =====
  const OrdersTab = () => {
    const updateStatus = async (id: string, status: string) => {
      await fetch("/api/admin/orders", { method: "PATCH", headers: headers(), body: JSON.stringify({ id, status }) });
      fetchAll();
    };

    return (
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">订单管理 ({orders.length})</h2>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">车辆</th>
                  <th className="px-4 py-3 font-semibold">买家</th>
                  <th className="px-4 py-3 font-semibold">联系方式</th>
                  <th className="px-4 py-3 font-semibold">售价</th>
                  <th className="px-4 py-3 font-semibold">利润</th>
                  <th className="px-4 py-3 font-semibold">状态</th>
                  <th className="px-4 py-3 font-semibold">时间</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? <tr><td colSpan={7}><Empty /></td></tr> :
                  orders.map(o => (
                    <tr key={o.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {o.vehicle ? `${o.vehicle.brand} ${o.vehicle.model} (${o.vehicle.year})` : "-"}
                      </td>
                      <td className="px-4 py-3 font-medium">{o.buyerName}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{o.buyerContact}</td>
                      <td className="px-4 py-3 text-accent font-bold">${o.salePrice.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={o.profit > 0 ? "text-green-600 font-bold" : "text-gray-400"}>${o.profit.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                          className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${
                            o.status === "completed" ? "bg-green-100 text-green-700" :
                            o.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"
                          }`}>
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString("zh-CN")}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ===== Users Tab =====
  const UsersTab = () => (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">用户管理 ({users.length})</h2>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">名称</th>
                <th className="px-4 py-3 font-semibold">邮箱</th>
                <th className="px-4 py-3 font-semibold">角色</th>
                <th className="px-4 py-3 font-semibold">电话</th>
                <th className="px-4 py-3 font-semibold">公司</th>
                <th className="px-4 py-3 font-semibold">注册时间</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? <tr><td colSpan={6}><Empty /></td></tr> :
                users.map(u => (
                  <tr key={u.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">{u.phone || "-"}</td>
                    <td className="px-4 py-3">{u.company || "-"}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString("zh-CN")}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ===== Customers Tab =====
  const CustomersTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">客户数据</h2>
          <p className="text-xs text-gray-400 mt-1">来自聊天会话、注册表单和询价的客户线索</p>
        </div>
        <button onClick={async () => {
          const res = await fetch("/api/admin/leads/export", { headers: headers() });
          if (!res.ok) { alert("导出失败"); return; }
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = `customer_data_${new Date().toISOString().slice(0, 10)}.xlsx`;
          a.click(); URL.revokeObjectURL(url);
        }} className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-bold hover:bg-accent-dark transition-all">
          📥 导出 .xlsx
        </button>
      </div>
      {leads.length === 0 ? (
        <div className="text-center py-16 text-gray-400">暂无客户数据</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">姓名</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">邮箱</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">电话</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">国家</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">需求</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">意向</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">开发信</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">来源</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">时间</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(l => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{l.name || "—"}</td>
                  <td className="px-4 py-3">{l.email || "—"}</td>
                  <td className="px-4 py-3">{l.phone || "—"}</td>
                  <td className="px-4 py-3">{l.country || "—"}</td>
                  <td className="px-4 py-3 max-w-[150px] truncate">{l.vehicleReq || "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={[
                      "px-2 py-0.5 rounded text-xs font-medium",
                      l.intentLevel >= 4 ? "bg-green-100 text-green-700" :
                      l.intentLevel >= 3 ? "bg-blue-100 text-blue-700" :
                      l.intentLevel >= 2 ? "bg-orange-100 text-orange-700" :
                      "bg-gray-100 text-gray-500"
                    ].join(" ")}>
                      L{l.intentLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {l.emailSent ? (
                      <span className="text-green-600 text-xs">✅ {l.emailSentAt ? new Date(l.emailSentAt).toLocaleDateString() : ""}</span>
                    ) : (
                      <span className="text-gray-300 text-xs">⬜ 未发</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-400">{l.source || "—"}</td>
                  <td className="px-4 py-3 text-right text-xs text-gray-400">{new Date(l.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // ===== Content Tab =====
  const ContentTab = () => {
    const [featuredIds, setFeaturedIds] = useState<string[]>([]);
    const [pageTitle, setPageTitle] = useState("");

    useEffect(() => {
      setFeaturedIds(vehicles.filter(v => v.featured).map(v => v.id));
    }, [vehicles]);

    const toggleFeatured = async (id: string) => {
      const isFeatured = featuredIds.includes(id);
      await fetch("/api/admin/vehicles", { method: "PATCH", headers: headers(), body: JSON.stringify({ id, featured: !isFeatured }) });
      fetchAll();
    };

    return (
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">内容管理</h2>

        {/* Featured Vehicles */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">精选推荐车辆</h3>
          <p className="text-xs text-gray-400 mb-3">勾选的车辆将显示在首页精选推荐区</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
            {vehicles.filter(v => v.published).slice(0, 50).map(v => (
              <label key={v.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer text-sm">
                <input type="checkbox" checked={featuredIds.includes(v.id)} onChange={() => toggleFeatured(v.id)}
                  className="rounded accent-accent" />
                <span>{v.brand} {v.model} ({v.year})</span>
              </label>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">站点概况</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-gray-400">车辆总数</span><div className="font-bold">{stats?.totalVehicles ?? 0}</div></div>
            <div><span className="text-gray-400">可售车辆</span><div className="font-bold">{stats?.availableVehicles ?? 0}</div></div>
            <div><span className="text-gray-400">车型规格</span><div className="font-bold">{specs.length}</div></div>
            <div><span className="text-gray-400">注册用户</span><div className="font-bold">{stats?.totalUsers ?? 0}</div></div>
            <div><span className="text-gray-400">询价总数</span><div className="font-bold">{inquiries.length}</div></div>
            <div><span className="text-gray-400">订单总数</span><div className="font-bold">{orders.length}</div></div>
            <div><span className="text-gray-400">总利润</span><div className="font-bold text-green-600">${(stats?.totalProfit ?? 0).toLocaleString()}</div></div>
          </div>
        </div>
      </div>
    );
  };

  // ===== Edit Vehicle Modal =====
  const EditVehicleModal = () => {
    if (!editVehicle) return null;
    const [form, setForm] = useState({ ...editVehicle });

    const save = async () => {
      try {
        const { id, ...rest } = form;
        const res = await fetch("/api/admin/vehicles", { method: "PATCH", headers: headers(), body: JSON.stringify({ id, ...rest }) });
        const data = await res.json();
        if (!res.ok) { alert(data.error || "保存失败"); return; }
        setEditVehicle(null);
        fetchAll();
      } catch (e: any) {
        alert("保存失败: " + (e?.message || "网络错误"));
      }
    };

    return (
      <Modal open={!!editVehicle} onClose={() => setEditVehicle(null)} title="编辑车辆">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs text-gray-500">品牌</label><input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
          <div><label className="text-xs text-gray-500">车型</label><input value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
          <div><label className="text-xs text-gray-500">年份</label><input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: +e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
          <div><label className="text-xs text-gray-500">里程</label><input value={form.mileageKm ?? ""} onChange={e => setForm(f => ({ ...f, mileageKm: +e.target.value || null }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
          <div><label className="text-xs text-gray-500">底价 $</label><input type="number" value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: +e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
          <div>
            <label className="text-xs text-gray-500">预计售价（自动计算）</label>
            <div className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 bg-gray-50 text-accent font-bold">
              ${(() => {
                const bp = form.basePrice || 0;
                const rate = bp <= 5000 ? 0.45 : bp <= 10000 ? 0.35 : bp <= 20000 ? 0.28 : bp <= 50000 ? 0.22 : bp <= 100000 ? 0.18 : 0.15;
                const sale = bp + Math.round(bp * rate);
                return `${sale.toLocaleString()} USD`;
              })()}
            </div>
          </div>
          <div><label className="text-xs text-gray-500">变速箱</label><input value={form.transmission ?? ""} onChange={e => setForm(f => ({ ...f, transmission: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
          <div><label className="text-xs text-gray-500">燃料类型</label><input value={form.fuelType ?? ""} onChange={e => setForm(f => ({ ...f, fuelType: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
          <div className="col-span-2"><label className="text-xs text-gray-500">描述</label><textarea value={form.description ?? ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Btn variant="outline" onClick={() => setEditVehicle(null)}>取消</Btn>
          <Btn onClick={save}>保存</Btn>
        </div>
      </Modal>
    );
  };

  // ===== New Vehicle Modal =====
  const NewVehicleModal = () => {
    if (!showNewVehicle) return null;
    const [form, setForm] = useState({
      brand: "", model: "", year: 2024, type: "Used Passenger Car",
      mileageKm: 0, transmission: "Automatic", fuelType: "Petrol",
      steering: "LHD", color: "", supplier: "", location: "China",
      basePrice: 0, description: "",
      // 自动填充扩展字段
      displacement: null as number | null,
      engineModel: "", bodyStyle: "", seatCount: null as number | null,
      vehicleLengthM: null as number | null, motorPowerKw: null as number | null,
      series: "",
    });
    const [saving, setSaving] = useState(false);
    const [showAutoFill, setShowAutoFill] = useState(false);
    const [autoFillData, setAutoFillData] = useState<Record<string, any> | null>(null);

    // 自动填充回调
    const handleAutoFill = (data: { vehicleFields: Record<string, any>; formFields: Record<string, any> }) => {
      setAutoFillData(data.formFields);
      setForm(f => ({
        ...f,
        // 映射 vehicleFields 到表单字段
        displacement: data.vehicleFields.displacement ?? f.displacement,
        engineModel: data.vehicleFields.engineModel ?? f.engineModel,
        bodyStyle: data.vehicleFields.bodyStyle ?? f.bodyStyle,
        seatCount: data.vehicleFields.seatCount ?? f.seatCount,
        vehicleLengthM: data.vehicleFields.vehicleLengthM ?? f.vehicleLengthM,
        motorPowerKw: data.vehicleFields.motorPowerKw ?? f.motorPowerKw,
        series: data.vehicleFields.series ?? f.series,
        // 自动映射变速箱和燃料
        transmission: data.vehicleFields.transmission
          ? (["Automatic","Manual","CVT","DCT"].find(t => data.vehicleFields.transmission.toLowerCase().includes(t.toLowerCase())) || data.vehicleFields.transmission)
          : f.transmission,
        fuelType: data.vehicleFields.fuelType
          ? (data.vehicleFields.fuelType.includes("电动") ? "Electric" :
             data.vehicleFields.fuelType.includes("柴油") ? "Diesel" :
             data.vehicleFields.fuelType.includes("混合") ? "Hybrid" : "Petrol")
          : f.fuelType,
      }));
      setShowAutoFill(false);
    };

    const create = async () => {
      setSaving(true);
      try {
        // 合并自动填充的 vehicleFields
        const body = { ...form, autoFillData };
        const res = await fetch("/api/admin/vehicles", { method: "POST", headers: headers(), body: JSON.stringify(body) });
        const data = await res.json();
        if (!res.ok) { alert(data.error || "创建失败"); setSaving(false); return; }
        setShowNewVehicle(false);
        setAutoFillData(null);
        fetchAll();
      } catch (e: any) {
        alert("创建失败: " + (e?.message || "网络错误"));
      }
      setSaving(false);
    };

    // 是否已填写品牌+车型（触发自动填充的前置条件）
    const canAutoFill = form.brand.trim() && form.model.trim();

    return (
      <Modal open={showNewVehicle} onClose={() => { setShowNewVehicle(false); setShowAutoFill(false); setAutoFillData(null); }} title="新增车辆">
        {/* 自动填充面板 */}
        {showAutoFill && (
          <div className="mb-6">
            <AutoSpecFill
              brand={form.brand}
              model={form.model}
              year={form.year}
              onFill={handleAutoFill}
              onClose={() => setShowAutoFill(false)}
            />
          </div>
        )}

        {/* 自动填充状态提示 */}
        {!showAutoFill && autoFillData && (
          <div className="mb-4 p-3 bg-green-50 rounded-xl flex items-center justify-between">
            <span className="text-sm text-green-700">
              ✅ 已自动填充配置参数
              <button onClick={() => setShowAutoFill(true)} className="ml-2 text-accent underline text-xs">查看/修改</button>
            </span>
            <button onClick={() => setAutoFillData(null)} className="text-xs text-gray-400 hover:text-red-500">清除</button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs text-gray-500">品牌 *</label><input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
          <div><label className="text-xs text-gray-500">车型 *</label><input value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
          <div><label className="text-xs text-gray-500">年份</label><input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: +e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
          <div><label className="text-xs text-gray-500">里程</label><input type="number" value={form.mileageKm} onChange={e => setForm(f => ({ ...f, mileageKm: +e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
          <div><label className="text-xs text-gray-500">变速箱</label>
            <select value={form.transmission} onChange={e => setForm(f => ({ ...f, transmission: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1">
              <option>Automatic</option><option>Manual</option><option>CVT</option><option>DCT</option>
            </select></div>
          <div><label className="text-xs text-gray-500">燃料</label>
              <select value={form.fuelType} onChange={e => setForm(f => ({ ...f, fuelType: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1">
              <option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option>
            </select></div>
          <div><label className="text-xs text-gray-500">方向盘位置</label>
            <select value={form.steering} onChange={e => setForm(f => ({ ...f, steering: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1">
              <option>LHD</option><option>RHD</option>
            </select></div>
          <div><label className="text-xs text-gray-500">颜色</label><input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" placeholder="如 White, Black" /></div>
          <div><label className="text-xs text-gray-500">供应商</label><input value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
          <div><label className="text-xs text-gray-500">所在地</label><input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
          <div><label className="text-xs text-gray-500">底价 $ *</label><input type="number" value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: +e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
          <div>
            <label className="text-xs text-gray-500">预计售价（自动计算）</label>
            <div className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 bg-green-50 text-accent font-bold">
              ${(() => {
                const bp = form.basePrice || 0;
                const rate = bp <= 5000 ? 0.45 : bp <= 10000 ? 0.35 : bp <= 20000 ? 0.28 : bp <= 50000 ? 0.22 : bp <= 100000 ? 0.18 : 0.15;
                const sale = bp + Math.round(bp * rate);
                return `${sale.toLocaleString()} USD`;
              })()}
            </div>
          </div>

          {/* 自动填充的扩展字段 */}
          {autoFillData && (
            <>
              <div className="col-span-2 mt-2 pt-3 border-t border-gray-100">
                <span className="text-xs text-accent font-semibold">📋 自动填充配置参数</span>
              </div>
              <div><label className="text-xs text-gray-500">排量(L)</label><input type="number" step="0.1" value={form.displacement ?? ""} onChange={e => setForm(f => ({ ...f, displacement: parseFloat(e.target.value) || null }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1 bg-blue-50" /></div>
              <div><label className="text-xs text-gray-500">发动机型号</label><input value={form.engineModel} onChange={e => setForm(f => ({ ...f, engineModel: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1 bg-blue-50" /></div>
              <div><label className="text-xs text-gray-500">车身形式</label><input value={form.bodyStyle} onChange={e => setForm(f => ({ ...f, bodyStyle: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1 bg-blue-50" /></div>
              <div><label className="text-xs text-gray-500">座位数</label><input type="number" value={form.seatCount ?? ""} onChange={e => setForm(f => ({ ...f, seatCount: parseInt(e.target.value) || null }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1 bg-blue-50" /></div>
              <div><label className="text-xs text-gray-500">车长(m)</label><input type="number" step="0.01" value={form.vehicleLengthM ?? ""} onChange={e => setForm(f => ({ ...f, vehicleLengthM: parseFloat(e.target.value) || null }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1 bg-blue-50" /></div>
              <div><label className="text-xs text-gray-500">电机功率(kW)</label><input type="number" step="0.1" value={form.motorPowerKw ?? ""} onChange={e => setForm(f => ({ ...f, motorPowerKw: parseFloat(e.target.value) || null }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1 bg-blue-50" /></div>
              <div><label className="text-xs text-gray-500">车系</label><input value={form.series} onChange={e => setForm(f => ({ ...f, series: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1 bg-blue-50" /></div>
              <div><label className="text-xs text-gray-500">能源类型</label><input value={form.fuelType} onChange={e => setForm(f => ({ ...f, fuelType: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1 bg-blue-50" /></div>
            </>
          )}

          <div className="col-span-2"><label className="text-xs text-gray-500">描述</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div>
            {canAutoFill && !showAutoFill && (
              <button
                onClick={() => setShowAutoFill(true)}
                className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-dashed border-accent/40 text-accent hover:bg-accent/5 hover:border-accent transition-all"
              >
                🔍 自动填充配置
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <Btn variant="outline" onClick={() => { setShowNewVehicle(false); setShowAutoFill(false); setAutoFillData(null); }}>取消</Btn>
            <Btn onClick={create}>{saving ? "保存中..." : "创建"}</Btn>
          </div>
        </div>
      </Modal>
    );
  };

  // ===== New Spec Modal =====
  const NewSpecModal = () => {
    if (!showNewSpec && !editSpec) return null;
    const isEdit = !!editSpec;
    const [form, setForm] = useState({
      brand: editSpec?.brand || "", model: editSpec?.model || "",
      yearRange: editSpec?.yearRange || "2020-2026", vehicleType: editSpec?.vehicleType || "",
      energyType: editSpec?.energyType || "", specs: editSpec?.specs || "{}",
    });
    const [saving, setSaving] = useState(false);

    const save = async () => {
      setSaving(true);
      let specsStr = form.specs;
      try { JSON.parse(specsStr); } catch { specsStr = JSON.stringify({}); }
      const body = { ...form, specs: specsStr };
      if (isEdit) {
        await fetch("/api/admin/specs", { method: "PATCH", headers: headers(), body: JSON.stringify({ id: editSpec!.id, ...body }) });
      } else {
        await fetch("/api/admin/specs", { method: "POST", headers: headers(), body: JSON.stringify(body) });
      }
      setShowNewSpec(false); setEditSpec(null);
      fetchAll();
      setSaving(false);
    };

    return (
      <Modal open={showNewSpec || !!editSpec} onClose={() => { setShowNewSpec(false); setEditSpec(null); }}
        title={isEdit ? "编辑规格" : "新增规格"}>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs text-gray-500">品牌 *</label><input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
          <div><label className="text-xs text-gray-500">车型 *</label><input value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
          <div><label className="text-xs text-gray-500">年份范围</label><input value={form.yearRange} onChange={e => setForm(f => ({ ...f, yearRange: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
          <div><label className="text-xs text-gray-500">车辆类型</label><input value={form.vehicleType} onChange={e => setForm(f => ({ ...f, vehicleType: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
          <div><label className="text-xs text-gray-500">能源类型</label>
            <select value={form.energyType} onChange={e => setForm(f => ({ ...f, energyType: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm mt-1">
              <option value="">不限</option><option value="汽油">汽油</option><option value="柴油">柴油</option><option value="纯电动">纯电动</option><option value="插电式混合动力">插电式混合动力</option>
            </select></div>
          <div className="col-span-2"><label className="text-xs text-gray-500">规格配置 (JSON)</label>
            <textarea value={form.specs} onChange={e => setForm(f => ({ ...f, specs: e.target.value }))} rows={8}
              className="w-full border rounded-lg px-3 py-2 text-xs font-mono mt-1"
              placeholder='{"engine":{"model":"...","displacement":2.0},"body":{"length":4800,...}}' /></div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Btn variant="outline" onClick={() => { setShowNewSpec(false); setEditSpec(null); }}>取消</Btn>
          <Btn onClick={save}>{saving ? "保存中..." : "保存"}</Btn>
        </div>
      </Modal>
    );
  };

  // ===== Tab Config =====
  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: "dashboard", label: "总览" },
    { id: "vehicles", label: "车辆", count: vehicles.length },
    { id: "specs", label: "车型规格", count: specs.length },
    { id: "inquiries", label: "询价", count: inquiries.length },
    { id: "orders", label: "订单", count: orders.length },
    { id: "users", label: "用户", count: users.length },
    { id: "customers", label: "客户", count: leads.length },
    { id: "content", label: "内容" },
  ];

  // ===== Render =====
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6 overflow-x-auto">
          <h1 className="text-lg font-bold text-gray-900 whitespace-nowrap">后台管理</h1>
          <nav className="flex gap-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id ? "bg-accent text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
                }`}>
                {tab.label}
                {tab.count !== undefined && <span className="ml-1.5 text-xs opacity-70">({tab.count})</span>}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={syncToOverseas} disabled={syncing}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              syncing ? "bg-gray-100 text-gray-400" : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}>
            {syncing ? "同步中..." : "🔄 同步到海外站"}
          </button>
          <a href="/" className="text-xs text-gray-400 hover:text-accent">返回前台</a>
          <button onClick={() => { setToken(""); setLoggedIn(false); }} className="text-sm text-gray-500 hover:text-red-500">退出</button>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-[1400px] mx-auto px-6 py-8">
        {loading && <div className="text-center text-gray-400 text-sm mb-4">加载中...</div>}
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "vehicles" && <VehiclesTab />}
        {activeTab === "specs" && <SpecsTab />}
        {activeTab === "inquiries" && <InquiriesTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "customers" && <CustomersTab />}
        {activeTab === "content" && <ContentTab />}
      </section>

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { if (!deleting) setDeleteTarget(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-bold text-red-600">⚠️ 确认删除</h3>
            </div>
            <div className="p-6">
              <p className="text-base font-bold text-gray-900 mb-4">
                确定删除 {deleteTarget.brand} {deleteTarget.model}？
              </p>
              <div className="mb-4 p-4 bg-red-50 rounded-xl text-sm text-red-800">
                <p className="mb-1">年份: <strong>{deleteTarget.year}</strong></p>
                <p className="mb-1">底价: <strong>${deleteTarget.basePrice.toLocaleString()}</strong></p>
                <p className="mb-1">售价: <strong>${deleteTarget.salePrice.toLocaleString()}</strong></p>
                {deleteTarget.published && <p className="text-orange-700 mt-2">⚠ 该车辆当前已公开显示在前台</p>}
              </div>
              <p className="text-sm text-gray-600 mb-2">删除此车辆将<strong className="text-red-600">同时删除</strong>其关联的：</p>
              <ul className="text-sm text-gray-600 list-disc list-inside mb-4 space-y-1">
                <li>所有询价记录</li>
                <li>所有订单记录</li>
              </ul>
              <p className="text-xs text-red-500 font-semibold mb-4">此操作不可撤销！</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteTarget(null)} disabled={deleting}
                  className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40">
                  取消
                </button>
                <button onClick={deleteVehicle} disabled={deleting}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-40">
                  {deleting ? "删除中..." : "确认删除"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <EditVehicleModal />
      <NewVehicleModal />
      <NewSpecModal />
    </main>
  );
}
