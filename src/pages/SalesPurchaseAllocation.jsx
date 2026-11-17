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

export default function SalesPurchaseAllocation() {
  const [ allocations, setAllocations] = useState([]);
  const [saleDetails, setSaleDetails] = useState([]);
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============ Add Dialog ============
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    sale_detail_id: "",
    purchase_detail_id: "",
    allocated_quantity: "",
  });

  // ============ Edit Dialog ============
  const [editing, setEditing] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // ============ Delete Dialog ============
  const [deleteItem, setDeleteItem] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // ============ Search ============
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAllocations = allocations.filter((a) => {
    const s = searchTerm.toLowerCase();
    return (
      String(a.allocation_id).includes(s) ||
      String(a.sale_detail_id).includes(s) ||
      String(a.purchase_detail_id).includes(s)
    );
  });

  useEffect(() => {
    fetchAllocations();
    fetchSaleDetails();
    fetchPurchaseDetails();
  }, []);

  async function fetchAllocations() {
    try {
      setLoading(true);
      const data = await api.get("/sale_purchase_allocation");
      setAllocations(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSaleDetails() {
    try {
      const data = await api.get("/sales_details");
      setSaleDetails(data);
    } catch (err) {
      console.error("Error loading sale details:", err);
    }
  }

  async function fetchPurchaseDetails() {
    try {
      const data = await api.get("/purchase_detail");
      setPurchaseDetails(data);
    } catch (err) {
      console.error("Error loading purchase details:", err);
    }
  }

  // ============ ADD ============
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAdd(e) {
    e.preventDefault();
    try {
      await api.post("/sale_purchase_allocation", formData);
      setIsDialogOpen(false);
      setFormData({
        sale_detail_id: "",
        purchase_detail_id: "",
        allocated_quantity: "",
      });
      fetchAllocations();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // ============ EDIT ============
  function handleEdit(a) {
    setEditing({
      allocation_id: a.allocation_id,
      sale_detail_id: a.sale_detail_id || "",
      purchase_detail_id: a.purchase_detail_id || "",
      allocated_quantity: a.allocated_quantity || "",
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
      await api.put(`/sale_purchase_allocation/${editing.allocation_id}`, {
        sale_detail_id: editing.sale_detail_id,
        purchase_detail_id: editing.purchase_detail_id,
        allocated_quantity: editing.allocated_quantity,
      });
      setIsEditDialogOpen(false);
      setEditing(null);
      fetchAllocations();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // ============ DELETE ============
  function handleDeleteClick(a) {
    setDeleteItem(a);
    setIsDeleteDialogOpen(true);
  }

  async function handleDelete() {
    try {
      await api.delete(`/sale_purchase_allocation/${deleteItem.allocation_id}`);
      setIsDeleteDialogOpen(false);
      setDeleteItem(null);
      fetchAllocations();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Purchase Allocation</h1>
          <p className="text-gray-500">
            Total: {filteredAllocations.length} records
            {searchTerm && ` (filtered from ${allocations.length})`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search allocation..."
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

          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Allocation
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">ID</TableHead>
              <TableHead>Sale Detail ID</TableHead>
              <TableHead>Purchase Detail ID</TableHead>
              <TableHead>Allocated Quantity</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAllocations.map((a) => (
              <TableRow key={a.allocation_id}>
                <TableCell className="font-medium">{a.allocation_id}</TableCell>
                <TableCell>{a.sale_detail_id ?? "-"}</TableCell>
                <TableCell>{a.purchase_detail_id ?? "-"}</TableCell>
                <TableCell>{a.allocated_quantity}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(a)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteClick(a)}
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
            <DialogTitle>Add New Allocation</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sale_detail_id">Sale Detail</Label>
              <select
                id="sale_detail_id"
                name="sale_detail_id"
                value={formData.sale_detail_id}
                onChange={handleChange}
                className="w-full border border-input rounded-md p-2 bg-background text-sm"
                required
              >
                <option value="">Select sale detail</option>
                {saleDetails.map((s) => (
                  <option key={s.sale_detail_id} value={s.sale_detail_id}>
                    #{s.sale_detail_id} - Item: {s.item_name || s.item_id} - Qty: {s.quantity}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchase_detail_id">Purchase Detail</Label>
              <select
                id="purchase_detail_id"
                name="purchase_detail_id"
                value={formData.purchase_detail_id}
                onChange={handleChange}
                className="w-full border border-input rounded-md p-2 bg-background text-sm"
                required
              >
                <option value="">Select purchase detail</option>
                {purchaseDetails.map((p) => (
                  <option key={p.purchase_detail_id} value={p.purchase_detail_id}>
                   #{p.purchase_detail_id} - Item: {p.item_name || p.item_id} - Qty: {p.quantity}
                     {/* Item: {p.item_name || p.item_id} - Qty: {p.quantity} */}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allocated_quantity">Allocated Quantity</Label>
              <Input
                id="allocated_quantity"
                name="allocated_quantity"
                type="number"
                step="0.01"
                value={formData.allocated_quantity}
                onChange={handleChange}
                placeholder="e.g. 5"
                required
                dir="ltr"
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
            <DialogTitle>Edit Allocation</DialogTitle>
          </DialogHeader>

          {editing && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_sale_detail">Sale Detail</Label>
                <select
                  id="edit_sale_detail"
                  name="sale_detail_id"
                  value={editing.sale_detail_id}
                  onChange={handleEditChange}
                  className="w-full border border-input rounded-md p-2 bg-background text-sm"
                  required
                >
                  <option value="">Select sale detail</option>
                  {saleDetails.map((s) => (
                    <option key={s.sale_detail_id} value={s.sale_detail_id}>
                      #{s.sale_detail_id} - Item: {s.item_name || s.item_id} - Qty: {s.quantity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_purchase_detail">Purchase Detail</Label>
                <select
                  id="edit_purchase_detail"
                  name="purchase_detail_id"
                  value={editing.purchase_detail_id}
                  onChange={handleEditChange}
                  className="w-full border border-input rounded-md p-2 bg-background text-sm"
                  required
                >
                  <option value="">Select purchase detail</option>
                  {purchaseDetails.map((p) => (
                    <option key={p.purchase_detail_id} value={p.purchase_detail_id}>
                      #{p.purchase_detail_id} - Item: {p.item_name || p.item_id} - Qty: {p.quantity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_allocated_quantity">Allocated Quantity</Label>
                <Input
                  id="edit_allocated_quantity"
                  name="allocated_quantity"
                  type="number"
                  step="0.01"
                  value={editing.allocated_quantity}
                  onChange={handleEditChange}
                  placeholder="e.g. 5"
                  required
                  dir="ltr"
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
              Do you want to delete this allocation? This action cannot be
              undone.
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