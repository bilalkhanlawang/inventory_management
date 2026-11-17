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

export default function PurchasePayment() {
  const [payments, setPayments] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    purchase_id: "",
    vendor_id: "",
    currency_id: "",
    amount: "",
    payment_date: "",
  });

  // Edit Dialog
  const [editing, setEditing] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Delete Dialog
  const [deletePayment, setDeletePayment] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayments = payments.filter((payment) => {
    const search = searchTerm.toLowerCase();
    return (
      payment.vendor_name?.toLowerCase().includes(search) ||
      payment.currency_name?.toLowerCase().includes(search) ||
      payment.invoice_no?.toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    fetchPayments();
    fetchPurchases();
    fetchVendors();
    fetchCurrencies();
  }, []);

  async function fetchPayments() {
    try {
      setLoading(true);
      const data = await api.get("/purchase_payment");
      setPayments(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPurchases() {
    try {
      const data = await api.get("/purchases");
      setPurchases(data);
    } catch (err) {
      console.error("Error loading purchases:", err);
    }
  }

  async function fetchVendors() {
    try {
      const data = await api.get("/vendors");
      setVendors(data);
    } catch (err) {
      console.error("Error loading vendors:", err);
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
    e.preventDefault();                    // ← ✅ prevent (نه pervent)
    console.log("handleAdd called");
    console.log("formData:", formData);

    try {
      await api.post("/purchase_payment", formData);
      setFormData({
        purchase_id: "",
        vendor_id: "",
        currency_id: "",
        amount: "",
        payment_date: "",
      });
      setIsDialogOpen(false);
      fetchPayments();
    } catch (err) {
      console.error("Error:", err);
      alert("Error: " + err.message);
    }
  }

  // ========== EDIT ==========
  function handleEdit(payment) {
    setEditing({
      payment_id: payment.payment_id,
      purchase_id: payment.purchase_id || "",
      vendor_id: payment.vendor_id || "",
      currency_id: payment.currency_id || "",
      amount: payment.amount || "",
      payment_date: payment.payment_date
        ? payment.payment_date.split("T")[0]
        : "",
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
      await api.put(`/purchase_payment/${editing.payment_id}`, {
        purchase_id: editing.purchase_id,
        vendor_id: editing.vendor_id,
        currency_id: editing.currency_id,
        amount: editing.amount,
        payment_date: editing.payment_date,
      });
      setIsEditDialogOpen(false);
      setEditing(null);
      fetchPayments();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // ========== DELETE ==========
  function handleDeleteClick(payment) {
    setDeletePayment(payment);
    setIsDeleteDialogOpen(true);
  }

  async function handleDelete() {
    try {
      await api.delete(`/purchase_payment/${deletePayment.payment_id}`);
      setIsDeleteDialogOpen(false);
      setDeletePayment(null);
      fetchPayments();
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
          <h1 className="text-3xl font-bold">Purchase Payments</h1>
          <p className="text-gray-500">
            Total: {filteredPayments.length} payments
            {searchTerm && ` (filtered from ${payments.length})`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search payments..."
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
            Add Payment
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.payment_id}>
                <TableCell className="font-medium">
                  {payment.payment_id}
                </TableCell>
                <TableCell>{payment.invoice_no || "-"}</TableCell>
                <TableCell>{payment.vendor_name || "-"}</TableCell>
                <TableCell>{payment.currency_name || "-"}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>
                  {payment.payment_date
                    ? payment.payment_date.split("T")[0]
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(payment)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteClick(payment)}
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
            <DialogTitle>Add New Purchase Payment</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purchase_id">Purchase (Invoice)</Label>
              <select
                id="purchase_id"
                name="purchase_id"
                value={formData.purchase_id}
                onChange={handleChange}
                className="w-full border border-input rounded-md p-2 bg-background text-sm"
                required
              >
                <option value="">Select purchase</option>
                {purchases.map((p) => (
                  <option key={p.purchase_id} value={p.purchase_id}>
                    {p.invoice_no} - {p.vendor_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor_id">Vendor</Label>
              <select
                id="vendor_id"
                name="vendor_id"
                value={formData.vendor_id}
                onChange={handleChange}
                className="w-full border border-input rounded-md p-2 bg-background text-sm"
                required
              >
                <option value="">Select vendor</option>
                {vendors.map((v) => (
                  <option key={v.vendor_id} value={v.vendor_id}>
                    {v.vendor_name}
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
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g. 1500.00"
                required
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_date">Payment Date</Label>
              <Input
                id="payment_date"
                name="payment_date"
                type="date"
                value={formData.payment_date}
                onChange={handleChange}
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
            <DialogTitle>Edit Purchase Payment</DialogTitle>
          </DialogHeader>

          {editing && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_purchase">Purchase (Invoice)</Label>
                <select
                  id="edit_purchase"
                  name="purchase_id"
                  value={editing.purchase_id}
                  onChange={handleEditChange}
                  className="w-full border border-input rounded-md p-2 bg-background text-sm"
                  required
                >
                  <option value="">Select purchase</option>
                  {purchases.map((p) => (
                    <option key={p.purchase_id} value={p.purchase_id}>
                      {p.invoice_no} - {p.vendor_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_vendor">Vendor</Label>
                <select
                  id="edit_vendor"
                  name="vendor_id"
                  value={editing.vendor_id}
                  onChange={handleEditChange}
                  className="w-full border border-input rounded-md p-2 bg-background text-sm"
                  required
                >
                  <option value="">Select vendor</option>
                  {vendors.map((v) => (
                    <option key={v.vendor_id} value={v.vendor_id}>
                      {v.vendor_name}
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
                <Label htmlFor="edit_amount">Amount</Label>
                <Input
                  id="edit_amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={editing.amount}
                  onChange={handleEditChange}
                  placeholder="e.g. 1500.00"
                  required
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_payment_date">Payment Date</Label>
                <Input
                  id="edit_payment_date"
                  name="payment_date"
                  type="date"
                  value={editing.payment_date}
                  onChange={handleEditChange}
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
              Do you want to delete this payment of amount "{deletePayment?.amount}"?
              This action cannot be undone.
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