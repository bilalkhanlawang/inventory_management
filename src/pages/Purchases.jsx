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

export default function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    vendor_id: "",
    currency_id: "",
    purchase_date: "",
    invoice_no: "",
  });

  // Edit Dialog
  const [editing, setEditing] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Delete Dialog
  const [deletePurchase, setDeletePurchase] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPurchases = purchases.filter((purchase) => {
    const search = searchTerm.toLowerCase();
    return (
      purchase.vendor_name?.toLowerCase().includes(search) ||
      purchase.currency_name?.toLowerCase().includes(search) ||
      purchase.invoice_no?.toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    fetchPurchases();
    fetchVendors();
    fetchCurrencies();
  }, []);

  async function fetchPurchases() {
    try {
      setLoading(true);
      const data = await api.get("/purchases");
      setPurchases(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
    e.preventDefault();
    try {
      await api.post("/purchases", formData);
      setIsDialogOpen(false);
      setFormData({
        vendor_id: "",
        currency_id: "",
        purchase_date: "",
        invoice_no: "",
      });
      fetchPurchases();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // ========== EDIT ==========
  function handleEdit(purchase) {
    setEditing({
      purchase_id: purchase.purchase_id,
      vendor_id: purchase.vendor_id || "",
      currency_id: purchase.currency_id || "",
      purchase_date: purchase.purchase_date
        ? purchase.purchase_date.split("T")[0]
        : "",
      invoice_no: purchase.invoice_no || "",
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
      await api.put(`/purchases/${editing.purchase_id}`, {
        vendor_id: editing.vendor_id,
        currency_id: editing.currency_id,
        purchase_date: editing.purchase_date,
        invoice_no: editing.invoice_no,
      });
      setIsEditDialogOpen(false);
      setEditing(null);
      fetchPurchases();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // ========== DELETE ==========
  function handleDeleteClick(purchase) {
    setDeletePurchase(purchase);
    setIsDeleteDialogOpen(true);
  }

  async function handleDelete() {
    try {
      await api.delete(`/purchases/${deletePurchase.purchase_id}`);
      setIsDeleteDialogOpen(false);
      setDeletePurchase(null);
      fetchPurchases();
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
          <h1 className="text-3xl font-bold">Purchases</h1>
          <p className="text-gray-500">
            Total: {filteredPurchases.length} purchases
            {searchTerm && ` (filtered from ${purchases.length})`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search purchases..."
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
            Add Purchase
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Invoice No</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPurchases.map((purchase) => (
              <TableRow key={purchase.purchase_id}>
                <TableCell className="font-medium">
                  {purchase.purchase_id}
                </TableCell>
                <TableCell>{purchase.vendor_name}</TableCell>
                <TableCell>{purchase.currency_name}</TableCell>
                <TableCell>
                  {purchase.purchase_date
                    ? purchase.purchase_date.split("T")[0]
                    : "-"}
                </TableCell>
                <TableCell>{purchase.invoice_no}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(purchase)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteClick(purchase)}
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
            <DialogTitle>Add New Purchase</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAdd} className="space-y-4">
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
              <Label htmlFor="purchase_date">Purchase Date</Label>
              <Input
                id="purchase_date"
                name="purchase_date"
                type="date"
                value={formData.purchase_date}
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
                placeholder="e.g. INV-001"
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
            <DialogTitle>Edit Purchase</DialogTitle>
          </DialogHeader>

          {editing && (
            <form onSubmit={handleUpdate} className="space-y-4">
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
                <Label htmlFor="edit_purchase_date">Purchase Date</Label>
                <Input
                  id="edit_purchase_date"
                  name="purchase_date"
                  type="date"
                  value={editing.purchase_date}
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
                  placeholder="e.g. INV-001"
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
              Do you want to delete invoice "{deletePurchase?.invoice_no}"?
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