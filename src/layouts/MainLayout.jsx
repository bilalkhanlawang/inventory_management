import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
// import { useTheme } from "@/context/ThemeContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  BarChart3,
  LogOut,
  Bell,
  Menu,
  User,
  Settings,
  //  Settings as SettingsIcon,     // ← تغییر بده
  LogOut as LogOutIcon,

  // LogOut as LogOutIcon,
  Users,

  // Moon,
  // Sun
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SidebarMenuItem from "@/components/SidebarMenuItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  {
    icon: Package,
    label: "Inventory",
    children: [
      { label: "Items", path: "/items" },
      { label: "Categories", path: "/categories" },
      { label: "Units", path: "/units" },
      { label: "Currencies", path: "/currencies" },
      { label: "Exchange Rate", path: "/exchange_rate" },
    ],
  },
  {
    icon: ShoppingCart,
    label: "Purchasing",
    children: [
      { label: "Purchases", path: "/purchases" },
      { label: "Vendors", path: "/vendors" },
      { label: "PurchasePayment", path: "/purchasePayment" },
      { label: "PurchaseDetails", path: "/purchase_detail" },
      { label: "SalesPurchaseAllocation", path: "/sale_purchase_allocation" },
    ],
  },
  {
    icon: DollarSign,
    label: "Sales",
    children: [
      { label: "Sales", path: "/sales" },
      { label: "Customers", path: "/customers" },
      { label: "Customer Payments", path: "/customer_payment" },
      { label: "Sales Details", path: "/sales_detail" },
    ],
  },
  { icon: BarChart3, label: "Reports", path: "/reports" },
  { icon: Users, label: "Users", path: "/users" },
  // { icon: SettingsIcon, label: "Settings", path: "/settings" }, 
];

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

// const { theme, toggleTheme } = useTheme();


  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {/* ==================== Sidebar ==================== */}
      <aside
        className={`bg-gray-900 text-white flex flex-col transition-all duration-300 overflow-y-auto ${
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">Inventory</h1>
          <p className="text-xs text-gray-400">Management System</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item, index) => (
            <SidebarMenuItem key={item.label || index} item={item} />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ==================== Main Content ==================== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ==================== Header ==================== */}
        <header className="bg-white border-b p-4 flex items-center justify-between flex-shrink-0">
          {/* سمت چپ Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold">Dashboard</h2>
          </div>

          {/* سمت راست Header */}
          <div className="flex items-center gap-4">


            {/* Dark mode toggle */}
{/* <button
  onClick={toggleTheme}
  className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
  title={theme === "dark" ? "Switch to light" : "Switch to dark"}
>
  {theme === "dark" ? (
    <Sun className="w-5 h-5 text-yellow-400" />
  ) : (
    <Moon className="w-5 h-5 text-gray-700" />
  )}
</button> */}

            {/* Notification */}
            <button className="relative p-2 hover:bg-gray-100 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition cursor-pointer">
                {/* <Avatar>
                  <AvatarFallback>
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar> */}

                        {/* <Avatar className="bg-blue-600 text-white font-bold">
    <AvatarFallback className="bg-blue-600 text-white font-bold">
      {user?.name?.charAt(0).toUpperCase() || "U"}
    </AvatarFallback>
  </Avatar> */}
      

<div 
  style={{ 
    backgroundColor: '#2563eb', 
    color: '#ffffff', 
    width: '40px', 
    height: '40px', 
    borderRadius: '50%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontWeight: 'bold', 
    fontSize: '18px',
    textTransform: 'uppercase' 
  }}
>
  {user?.name?.trim()?.charAt(0) || "U"}
</div>
                  
                <div className="text-right">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-500">Management System</p>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 bg-background">
                <div className="flex flex-col px-2 py-1.5">
                  <span className="text-sm font-semibold">{user?.name}</span>
                  <span className="text-xs text-gray-500">{user?.email}</span>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                
                onClick={() => navigate("/profile")}
                className="cursor-pointer" 
                
                >

                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />

                   {/* <SettingsIcon className="w-4 h-4 mr-2" /> */}
                  Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOutIcon className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* ==================== Page Content ==================== */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}