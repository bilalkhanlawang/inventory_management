import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function SidebarMenuItem({ item }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const Icon = item.icon;
  const isActive = location.pathname === item.path;

  if (item.children) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition w-full ${
            isActive
              ? "bg-indigo-600 text-white"
              : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <Icon className="w-5 h-5" />
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>

        <CollapsibleContent className="pl-4 space-y-1 mt-1">
          {item.children.map((child) => (
            <Link
              key={child.path}
              to={child.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
                location.pathname === child.path
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              <span>{child.label}</span>
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link
      to={item.path}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
        isActive
          ? "bg-indigo-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{item.label}</span>
    </Link>
  );
}