import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Eye, FileText, ShoppingCart , Printer} from "lucide-react";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("sales");
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const salesData = await api.get("/reports/sales");
        const purchasesData = await api.get("/reports/purchases");
        setSales(salesData);
        setPurchases(purchasesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading Reports...</div>;

  const currentData = activeTab === "sales" ? sales : purchases;



    // تابعی برای پرینت کردن فاکتور یک ردیف خاص
  const handlePrint = (item) => {
    // 1. ساخت یک پنجره جدید
    const printWindow = window.open('', '_blank');
    
    // 2. محاسبه جمع کل
    const totalAmount = item.total;
    const invoiceDate = new Date(item.sale_date || item.purchase_date).toLocaleDateString();
    const name = item.name || 'Walk-in';
    const invoiceNo = activeTab === 'sales' ? `SL-${item.sale_id}` : `PR-${item.purchase_id}`;
    
    // 3. نوشتن HTML داخل پنجره جدید
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #ccc; padding-bottom: 20px; margin-bottom: 40px; }
            .header h1 { margin: 0; }
            .info { display: flex; justify-content: space-between; margin-bottom: 40px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f4f4f4; }
            .total { text-align: right; font-size: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
            <div>
              <h2>Inventory System</h2>
              <p>123 Business St</p>
            </div>
          </div>
          
          <div class="info">
            <div>
              <p><strong>${activeTab === 'sales' ? 'Customer:' : 'Vendor:'}</strong> ${name}</p>
              <p><strong>Invoice No:</strong> ${invoiceNo}</p>
            </div>
            <div>
              <p><strong>Date:</strong> ${invoiceDate}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${activeTab === 'sales' ? 'Sales Transaction' : 'Purchase Transaction'}</td>
                <td>${Number(totalAmount).toLocaleString()} ${item.currency || ''}</td>
              </tr>
            </tbody>
          </table>

          <div class="total">
            Total: ${Number(totalAmount).toLocaleString()} ${item.currency || ''}
          </div>
        </body>
      </html>
    `);
    
    // 4. پرینت کردن و بستن پنجره
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* هدر صفحه */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500">View all your sales and purchase records</p>
        </div>
      </div>

      {/* دکمه‌های تب (فروش / خرید) */}
      <div className="flex bg-gray-100 rounded-lg p-1 w-max">
        <button
          onClick={() => setActiveTab("sales")}
          className={`flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "sales" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <FileText className="w-4 h-4" /> Sales Report
        </button>
        <button
          onClick={() => setActiveTab("purchases")}
          className={`flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "purchases" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <ShoppingCart className="w-4 h-4" /> Purchases Report
        </button>
      </div>

      {/* جدول داده‌ها */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">
                  {activeTab === "sales" ? "Sale ID" : "Purchase ID"}
                </th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">
                  {activeTab === "sales" ? "Customer" : "Vendor"}
                </th>
                 <th className="px-6 py-4 font-medium">Currency</th> 
                <th className="px-6 py-4 font-medium">Total Amount</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentData.map((item) => (
                <tr key={item.sale_id || item.purchase_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-indigo-600">
                    {activeTab === "sales" ? `SL-${item.sale_id}` : `PR-${item.purchase_id}`}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(item.sale_date || item.purchase_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.name || "Walk-in"}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
  {item.currency || "-"}
</td>
<td className="px-6 py-4 font-bold text-gray-900">
  {Number(item.total).toLocaleString()}
</td>
{/*                   
                    <td className="px-6 py-4 font-bold text-gray-900">
                     {Number(item.total).toLocaleString()} {item.currency || ""}
                    </td> */}
                    
                  
                  <td className="px-6 py-4 flex justify-end">
                    <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>

                     {/* 👈 دکمه پرینت جدید */}
  <button 
    onClick={() => handlePrint(item)}
    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
    title="Print Invoice"
  >
    <Printer className="w-4 h-4" />
  </button>
                  </td>
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}