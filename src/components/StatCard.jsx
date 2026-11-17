import { cn } from "@/lib/utils";

export default function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );
}