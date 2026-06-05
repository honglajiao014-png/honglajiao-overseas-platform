"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats { totalVehicles: number; soldVehicles: number; availableVehicles: number; totalUsers: number; newInquiries: number; completedOrders: number; totalProfit: number }
interface Vehicle { id: string; brand: string; model: string; year: number; salePrice: number; basePrice: number; profit: number; status: string; dealer?: { name: string; company: string } }

export default function AdminDashboard() {
  const [token, setToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "vehicles">("dashboard");

  const login = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: (document.getElementById("login-email") as HTMLInputElement)?.value, password: (document.getElementById("login-pw") as HTMLInputElement)?.value }),
    });
    const data = await res.json();
    if (data.token) { setToken(data.token); setLoggedIn(true); }
    else alert(data.error);
  };

  useEffect(() => { if (!token) return; fetchStats(); fetchVehicles(); }, [token]);

  const fetchStats = async () => {
    const res = await fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } });
    setStats(await res.json());
  };
  const fetchVehicles = async () => {
    const res = await fetch("/api/admin/vehicles", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setVehicles(data.vehicles || []);
  };

  const addVehicle = async (e: React.FormEvent) => {
    e.preventDefault(); const form = new FormData(e.target as HTMLFormElement);
    const body: any = Object.fromEntries(form);
    body.images = [body.imageUrl || ""]; body.featured = body.featured === "on";
    await fetch("/api/admin/vehicles", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
    fetchVehicles();
  };

  const deleteVehicle = async (id: string) => {
    if (!confirm("Delete this vehicle?")) return;
    await fetch("/api/admin/vehicles", { method: "DELETE", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ id }) });
    fetchVehicles();
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg border border-border p-8 w-full max-w-sm">
          <h2 className="text-xl font-bold text-dark mb-6 text-center">Admin Login</h2>
          <div className="space-y-4">
            <input id="login-email" type="email" placeholder="Email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
            <input id="login-pw" type="password" placeholder="Password" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
            <button onClick={login} className="w-full bg-brand text-white py-3 rounded-xl font-bold text-sm hover:bg-brand-dark transition-all">Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-bold text-dark">Admin Panel</h1>
          <nav className="flex gap-1">
            <button onClick={() => setActiveTab("dashboard")} className={`px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === "dashboard" ? "bg-brand text-white" : "text-gray-600 hover:bg-gray-100"}`}>Dashboard</button>
            <button onClick={() => setActiveTab("vehicles")} className={`px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === "vehicles" ? "bg-brand text-white" : "text-gray-600 hover:bg-gray-100"}`}>Vehicles</button>
          </nav>
        </div>
        <button onClick={() => { setToken(""); setLoggedIn(false); }} className="text-sm text-gray-500 hover:text-red-500">Logout</button>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[{ label: "Total Vehicles", value: stats?.totalVehicles ?? "-", col: "bg-blue-50 text-blue-700" },
                { label: "Sold", value: stats?.soldVehicles ?? "-", col: "bg-green-50 text-green-700" },
                { label: "Available", value: stats?.availableVehicles ?? "-", col: "bg-amber-50 text-amber-700" },
                { label: "Total Profit", value: `$${(stats?.totalProfit ?? 0).toLocaleString()}`, col: "bg-purple-50 text-purple-700" },
                { label: "Users", value: stats?.totalUsers ?? "-", col: "bg-gray-100 text-gray-700" },
                { label: "New Inquiries", value: stats?.newInquiries ?? "-", col: "bg-orange-50 text-orange-700" },
                { label: "Completed Orders", value: stats?.completedOrders ?? "-", col: "bg-teal-50 text-teal-700" },
              ].map(s => (
                <div key={s.label} className={`${s.col} rounded-2xl p-5`}>
                  <div className="text-3xl font-extrabold">{s.value}</div>
                  <div className="text-sm mt-1 opacity-80">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border font-semibold text-dark">Recent Vehicles</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Vehicle</th>
                      <th className="px-6 py-3 font-semibold">Base Price</th>
                      <th className="px-6 py-3 font-semibold">Sale Price</th>
                      <th className="px-6 py-3 font-semibold">Profit</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.slice(0, 10).map(v => (
                      <tr key={v.id} className="border-t border-border hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium">{v.brand} {v.model} ({v.year})</td>
                        <td className="px-6 py-3">${v.basePrice.toLocaleString()}</td>
                        <td className="px-6 py-3 text-brand font-bold">${v.salePrice.toLocaleString()}</td>
                        <td className="px-6 py-3 text-green-600 font-bold">${v.profit.toLocaleString()}</td>
                        <td className="px-6 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${v.status === "available" ? "bg-green-100 text-green-700" : v.status === "sold" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>{v.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "vehicles" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border font-semibold text-dark">All Vehicles</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-4 py-3">Brand/Model</th>
                      <th className="px-4 py-3">Base</th>
                      <th className="px-4 py-3">Sale</th>
                      <th className="px-4 py-3">Profit</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map(v => (
                      <tr key={v.id} className="border-t border-border hover:bg-gray-50">
                        <td className="px-4 py-3">{v.brand} {v.model} ({v.year})</td>
                        <td className="px-4 py-3">${v.basePrice.toLocaleString()}</td>
                        <td className="px-4 py-3 text-brand font-bold">${v.salePrice.toLocaleString()}</td>
                        <td className="px-4 py-3 text-green-600">${v.profit.toLocaleString()}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${v.status === "available" ? "bg-green-100 text-green-700" : v.status === "sold" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>{v.status}</span></td>
                        <td className="px-4 py-3"><button onClick={() => deleteVehicle(v.id)} className="text-red-500 hover:text-red-700 text-xs">Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-bold text-dark mb-4">Add Vehicle</h3>
              <form onSubmit={addVehicle} className="space-y-3">
                <input name="brand" placeholder="Brand *" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required />
                <input name="model" placeholder="Model *" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required />
                <input name="year" placeholder="Year *" type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required />
                <input name="type" placeholder="Type (e.g., Used Passenger Car)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input name="mileage" placeholder="Mileage (km)" type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input name="transmission" placeholder="Transmission" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input name="fuel" placeholder="Fuel" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input name="color" placeholder="Color" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input name="supplier" placeholder="Supplier" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input name="location" placeholder="Location" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input name="imageUrl" placeholder="Image URL" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <input name="basePrice" placeholder="Base Price (Dealer Cost) *" type="number" step="0.01" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required />
                <input name="markup" placeholder="Markup (Your Profit) *" type="number" step="0.01" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required />
                <textarea name="description" placeholder="Description" rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="featured" /> Featured
                </label>
                <button type="submit" className="w-full bg-brand text-white py-2.5 rounded-lg font-bold text-sm hover:bg-brand-dark transition-all">Add Vehicle</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
