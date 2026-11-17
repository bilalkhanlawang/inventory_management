import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: "",
    currency_id: "",
    sale_date: "",
    invoice_no: "",
  });

  // Edit Dialog
  const [editing, setEditing] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Delete Dialog
  const [deleteSale, setDeleteSale] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSales = sales.filter((sale) => {
    const search = searchTerm.toLowerCase();
    return (
      sale.customer_name?.toLowerCase().includes(search) ||
      sale.currency_name?.toLowerCase().includes(search) ||
      sale.invoice_no?.toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    fetchSales();
    fetchCustomers();
    fetchCurrencies();
  }, []);

  async function fetchSales() {
    try {
      setLoading(true);
      const data = await api.get("/sales");
      setSales(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCustomers() {
    try {
      const data = await api.get("/customers");
      setCustomers(data);
    } catch (err) {
      console.error("Error loading customers:", err);
    }
  }

  async function fetchCurrencies() {
    try {
      const data = await api.get("/currencies");
      setCurrencies(data);
    } catch (err) {
      console.error("Error loading currencies:", err);
    }
  }

  // ========== ADD ==========
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAdd(e) {
    e.preventDefault();
    try {
      await api.post("/sales", formData);
      setIsDialogOpen(false);
      setFormData({
        customer_id: "",
        currency_id: "",
        sale_date: "",
        invoice_no: "",
      });
      fetchSales();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // ========== EDIT ==========
  function handleEdit(sale) {
    setEditing({
      sale_id: sale.sale_id,
      customer_id: sale.customer_id || "",
      currency_id: sale.currency_id || "",
      sale_date: sale.sale_date ? sale.sale_date.split("T")[0] : "",
      invoice_no: sale.invoice_no || "",
    });
    setIsEditDialogOpen(true);
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditing((prev) => ({ ...prev, [name]: value }));
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      await api.put(`/sales/${editing.sale_id}`, {
        customer_id: editing.customer_id,
        currency_id: editing.currency_id,
        sale_date: editing.sale_date,
        invoice_no: editing.invoice_no,
      });
      setIsEditDialogOpen(false);
      setEditing(null);
      fetchSales();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // ========== DELETE ==========
  function handleDeleteClick(sale) {
    setDeleteSale(sale);
    setIsDeleteDialogOpen(true);
  }

  async function handleDelete() {
    try {
      await api.delete(`/sales/${deleteSale.sale_id}`);
      setIsDeleteDialogOpen(false);
      setDeleteSale(null);
      fetchSales();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales</h1>
          <p className="text-gray-500">
            Total: {filteredSales.length} sales
            {searchTerm && ` (filtered from ${sales.length})`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-9 w-64"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Add Button */}
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Sale
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Invoice No</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale.sale_id}>
                <TableCell className="font-medium">{sale.sale_id}</TableCell>
                <TableCell>{sale.customer_name}</TableCell>
                <TableCell>{sale.currency_name}</TableCell>
                <TableCell>
                  {sale.sale_date ? sale.sale_date.split("T")[0] : "-"}
                </TableCell>
                <TableCell>{sale.invoice_no}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(sale)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteClick(sale)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ========== ADD DIALOG ========== */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Sale</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer_id">Customer</Label>
              <select
                id="customer_id"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                className="w-full border border-input rounded-md p-2 bg-background text-sm"
                required
              >
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.customer_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency_id">Currency</Label>
              <select
                id="currency_id"
                name="currency_id"
                value={formData.currency_id}
                onChange={handleChange}
                className="w-full border border-input rounded-md p-2 bg-background text-sm"
                required
              >
                <option value="">Select currency</option>
                {currencies.map((c) => (
                  <option key={c.currency_id} value={c.currency_id}>
                    {c.currency_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sale_date">Sale Date</Label>
              <Input
                id="sale_date"
                name="sale_date"
                type="date"
                value={formData.sale_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice_no">Invoice No</Label>
              <Input
                id="invoice_no"
                name="invoice_no"
                value={formData.invoice_no}
                onChange={handleChange}
                placeholder="e.g. INV-101"
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========== EDIT DIALOG ========== */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sale</DialogTitle>
          </DialogHeader>

          {editing && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_customer">Customer</Label>
                <select
                  id="edit_customer"
                  name="customer_id"
                  value={editing.customer_id}
                  onChange={handleEditChange}
                  className="w-full border border-input rounded-md p-2 bg-background text-sm"
                  required
                >
                  <option value="">Select customer</option>
                  {customers.map((c) => (
                    <option key={c.customer_id} value={c.customer_id}>
                      {c.customer_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_currency">Currency</Label>
                <select
                  id="edit_currency"
                  name="currency_id"
                  value={editing.currency_id}
                  onChange={handleEditChange}
                  className="w-full border border-input rounded-md p-2 bg-background text-sm"
                  required
                >
                  <option value="">Select currency</option>
                  {currencies.map((c) => (
                    <option key={c.currency_id} value={c.currency_id}>
                      {c.currency_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_sale_date">Sale Date</Label>
                <Input
                  id="edit_sale_date"
                  name="sale_date"
                  type="date"
                  value={editing.sale_date}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_invoice_no">Invoice No</Label>
                <Input
                  id="edit_invoice_no"
                  name="invoice_no"
                  value={editing.invoice_no}
                  onChange={handleEditChange}
                  placeholder="e.g. INV-101"
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ========== DELETE DIALOG ========== */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to delete invoice "{deleteSale?.invoice_no}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}