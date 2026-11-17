import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Electronics", value: 45 },
  { name: "Clothing", value: 25 },
  { name: "Food", value: 18 },
  { name: "Furniture", value: 12 },
];

const colors = ["#6366f1", "#f97316", "#10b981", "#ef4444"];

export default function StockChart() {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Stock by Category</h3>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* نمودار */}
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* لیست دسته‌ها */}
        <div className="w-full lg:w-1/2 space-y-2">
          {data.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: colors[index] }}
                ></span>
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <span className="text-sm font-semibold">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}