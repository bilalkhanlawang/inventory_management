import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", sales: 4000, purchases: 2400 },
  { month: "Feb", sales: 3000, purchases: 1398 },
  { month: "Mar", sales: 5000, purchases: 3800 },
  { month: "Apr", sales: 4500, purchases: 3908 },
  { month: "May", sales: 6000, purchases: 4800 },
  { month: "Jun", sales: 5500, purchases: 3800 },
];


export default function SalesChart() {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Sales & Purchase Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#6366f1"
            strokeWidth={2}
            name="Sales"
          />
          <Line
            type="monotone"
            dataKey="purchases"
            stroke="#f97316"
            strokeWidth={2}
            name="Purchases"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}