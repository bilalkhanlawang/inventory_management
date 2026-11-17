import { Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Items from "@/pages/Items";
import Categories from "@/pages/Categories";
import Units from "@/pages/Units";
import Currencies from "@/pages/Currencies";
import Customers from "@/pages/Customers";
import Vendors from "@/pages/Vendors";
import Users from "@/pages/Users";
import ExchangeRate from "@/pages/ExchangeRate";   
import Purchases from "./pages/Purchases";
import Sales from "./pages/sales";
import PurchasePayment from "./pages/PurchasePayment";
import CustomerPayment from "@/pages/CustomerPayment";
import PurchaseDetails from "./pages/PurchaseDetails";
import SalesDetails from "./pages/SalesDetails";
import SalesPurchaseAllocation from "./pages/SalesPurchaseAllocation";

// import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";

import Reports from "@/pages/Reports";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/items" element={<Items />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/units" element={<Units />} />
          <Route path="/currencies" element={<Currencies />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/users" element={<Users />} />
          <Route path="/exchange_rate" element={<ExchangeRate />} />
          <Route path="/purchases" element={<Purchases/>}/>
          <Route path="/sales" element={<Sales/>}/>
          <Route path="/purchasePayment" element={<PurchasePayment/>}/>
          <Route path="/customer_payment" element={<CustomerPayment />} />
          <Route path="/purchase_detail" element={<PurchaseDetails />} />
          <Route path="/sales_detail" element={<SalesDetails/>}/>
          <Route path="/sale_purchase_allocation" element={<SalesPurchaseAllocation/>}/>

          {/* <Route path="/settings" element={<Settings />} /> */}
          <Route path="/profile" element={<Profile />} />

          <Route path="/reports" element={<Reports />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;