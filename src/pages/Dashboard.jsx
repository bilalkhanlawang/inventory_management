import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import {
  Package, DollarSign, ShoppingCart, Users, Truck, TrendingUp,
  FileText, Plus, Eye
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartView, setChartView] = useState("sales");

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get("/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div className="p-6">Loading Dashboard...</div>;

  const COLORS = ['#6366f1', '#0ea5e9', '#22c55e', '#f59e0b', '#94a3b8'];

  // تابع کوتاه کردن اعداد بزرگ (مثل $349.4k)
  const formatNumber = (num) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}k`;
    return `$${Number(num).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const cards = [
    { title: "Total Items", value: stats?.totalItems || 0, icon: Package, color: "text-indigo-500", bg: "bg-indigo-50" },
    { title: "Stock Value", value: formatNumber(stats?.totalSalesAmount || 0), icon: DollarSign, color: "text-cyan-500", bg: "bg-cyan-50" },
    { title: "Total Sales", value: formatNumber(stats?.totalSalesAmount || 0), icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "Total Purchases", value: formatNumber(stats?.totalPurchasesAmount || 0), icon: ShoppingCart, color: "text-orange-500", bg: "bg-orange-50" },
    { title: "Customers", value: stats?.totalCustomers || 0, icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
    { title: "Vendors", value: stats?.totalVendors || 0, icon: Truck, color: "text-pink-500", bg: "bg-pink-50" },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* هدر بالای صفحه */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good morning, {user?.name} 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Wednesday, August 20, 2026 · Here's what's happening today</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate("/purchases")} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            <FileText className="w-4 h-4" /> New Purchase
          </button>
          <button onClick={() => navigate("/sales")} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" /> New Sale
          </button>
        </div>
      </div>

      {/* کارت‌های آماری بالا */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">↗ +12%</span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                <p className="text-sm text-gray-500">{card.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* نمودارهای وسط صفحه */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* نمودار خطی (بزرگ) */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sales & Purchase Overview</h3>
            
            {/* دکمه‌های نمودار */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setChartView("sales")}
                className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${
                  chartView === "sales" ? "bg-indigo-600 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sales
              </button>
              <button
                onClick={() => setChartView("purchases")}
                className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${
                  chartView === "purchases" ? "bg-indigo-600 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Purchases
              </button>
              <button
                onClick={() => setChartView("profit")}
                className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${
                  chartView === "profit" ? "bg-indigo-600 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Profit
              </button>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                
                <Line 
                  type="monotone" 
                  dataKey={chartView} 
                  stroke={chartView === "purchases" ? "#f59e0b" : chartView === "profit" ? "#10b981" : "#6366f1"} 
                  strokeWidth={3} 
                  dot={false} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* نمودار دایره‌ای */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Stock by Category</h3>
          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats?.pieData || []} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {(stats?.pieData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-2xl font-bold text-gray-900">100%</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {(stats?.pieData || []).map((entry, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span className="text-gray-600">{entry.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* نمودار ستونی مقایسه */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales vs Purchases Comparison</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.chartData || []} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', cursor: 'pointer' }} />
              
              <Bar dataKey="purchases" name="Purchases" fill="#e0e7ff" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="sales" name="Sales" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* جداول پایین */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* جدول Recent Sales */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
            <button onClick={() => navigate("/sales")} className="text-sm text-gray-500 hover:text-gray-900 bg-gray-50 px-3 py-1 rounded-md border hover:bg-gray-100 transition-colors">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Sale ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(stats?.recentSales || []).map((sale) => (
                  <tr key={sale.sale_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-indigo-600">SL-{sale.sale_id}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(sale.sale_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{sale.customer_name || 'Walk-in'}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">${Number(sale.total).toLocaleString()}</td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button onClick={() => navigate("/sales_detail")} className="p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* جدول Low Stock */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
            <button onClick={() => navigate("/items")} className="text-sm text-gray-500 hover:text-gray-900 bg-gray-50 px-3 py-1 rounded-md border hover:bg-gray-100 transition-colors">
              Manage Stock
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Item</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Current Stock</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(stats?.lowStock || []).map((item) => (
                  <tr key={item.item_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.item_name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                        {item.category_name || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${item.quantity === 0 ? 'text-red-500' : 'text-orange-500'}`}>{item.quantity}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => navigate("/purchases")} className="px-3 py-1 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors">
                        Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}