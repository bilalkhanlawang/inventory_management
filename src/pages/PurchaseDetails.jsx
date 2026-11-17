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

export default function PurchaseDetails() {
  const [details, setDetails] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============ Add Dialog Stateها ============
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    purchase_id: "",
    item_id: "",
    quantity: "",
    unit_price: "",
  });

  // ============ Edit Dialog Stateها ============
  const [editing, setEditing] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // ============ Delete Dialog Stateها ============
  const [deleteDetail, setDeleteDetail] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // ============ Search State ============
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDetails = details.filter((detail) => {
    const search = searchTerm.toLowerCase();
    return (
      detail.invoice_no?.toLowerCase().includes(search) ||
      detail.item_name?.toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    fetchDetails();
    fetchPurchases();
    fetchItems();
  }, []);

  async function fetchDetails() {
    try {
      setLoading(true);
      const data = await api.get("/purchase_detail");
      setDetails(data);
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

  async function fetchItems() {
    try {
      const data = await api.get("/items");
      setItems(data);
    } catch (err) {
      console.error("Error loading items:", err);
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
      await api.post("/purchase_detail", formData);
      setIsDialogOpen(false);
      setFormData({
        purchase_id: "",
        item_id: "",
        quantity: "",
        unit_price: "",
      });
      fetchDetails();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // ============ EDIT ============
  function handleEdit(detail) {
    setEditing({
      purchase_detail_id: detail.purchase_detail_id,
      purchase_id: detail.purchase_id || "",
      item_id: detail.item_id || "",
      quantity: detail.quantity || "",
      unit_price: detail.unit_price || "",
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
      await api.put(`/purchase_detail/${editing.purchase_detail_id}`, {
        purchase_id: editing.purchase_id,
        item_id: editing.item_id,
        quantity: editing.quantity,
        unit_price: editing.unit_price,
      });
      setIsEditDialogOpen(false);
      setEditing(null);
      fetchDetails();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // ============ DELETE ============
  function handleDeleteClick(detail) {
    setDeleteDetail(detail);
    setIsDeleteDialogOpen(true);
  }

  async function handleDelete() {
    try {
      await api.delete(
        `/purchase_detail/${deleteDetail.purchase_detail_id}`
      );
      setIsDeleteDialogOpen(false);
      setDeleteDetail(null);
      fetchDetails();
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
          <h1 className="text-3xl font-bold">Purchase Details</h1>
          <p className="text-gray-500">
            Total: {filteredDetails.length} details
            {searchTerm && ` (filtered from ${details.length})`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search details..."
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
            Add Detail
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
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDetails.map((detail) => (
              <TableRow key={detail.purchase_detail_id}>
                <TableCell className="font-medium">
                  {detail.purchase_detail_id}
                </TableCell>
                <TableCell>{detail.invoice_no || "-"}</TableCell>
                <TableCell>{detail.item_name || "-"}</TableCell>
                <TableCell>{detail.quantity}</TableCell>
                <TableCell>{detail.unit_price}</TableCell>
                <TableCell>
                  {(detail.quantity * detail.unit_price).toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(detail)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteClick(detail)}
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
            <DialogTitle>Add New Purchase Detail</DialogTitle>
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
              <Label htmlFor="item_id">Item</Label>
              <select
                id="item_id"
                name="item_id"
                value={formData.item_id}
                onChange={handleChange}
                className="w-full border border-input rounded-md p-2 bg-background text-sm"
                required
              >
                <option value="">Select item</option>
                {items.map((i) => (
                  <option key={i.item_id} value={i.item_id}>
                    {i.item_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g. 5"
                required
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_price">Unit Price</Label>
              <Input
                id="unit_price"
                name="unit_price"
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={handleChange}
                placeholder="e.g. 100.00"
                required
                dir="ltr"
              />
            </div>

            {/* نمایش Subtotal به‌صورت زنده */}
            {formData.quantity && formData.unit_price && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-600">
                  Subtotal:{" "}
                  <span className="font-semibold text-gray-900">
                    {(formData.quantity * formData.unit_price).toFixed(2)}
                  </span>
                </p>
              </div>
            )}

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
            <DialogTitle>Edit Purchase Detail</DialogTitle>
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
                <Label htmlFor="edit_item">Item</Label>
                <select
                  id="edit_item"
                  name="item_id"
                  value={editing.item_id}
                  onChange={handleEditChange}
                  className="w-full border border-input rounded-md p-2 bg-background text-sm"
                  required
                >
                  <option value="">Select item</option>
                  {items.map((i) => (
                    <option key={i.item_id} value={i.item_id}>
                      {i.item_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_quantity">Quantity</Label>
                <Input
                  id="edit_quantity"
                  name="quantity"
                  type="number"
                  value={editing.quantity}
                  onChange={handleEditChange}
                  placeholder="e.g. 5"
                  required
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_unit_price">Unit Price</Label>
                <Input
                  id="edit_unit_price"
                  name="unit_price"
                  type="number"
                  step="0.01"
                  value={editing.unit_price}
                  onChange={handleEditChange}
                  placeholder="e.g. 100.00"
                  required
                  dir="ltr"
                />
              </div>

              
              {editing.quantity && editing.unit_price && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600">
                    Subtotal:{" "}
                    <span className="font-semibold text-gray-900">
                      {(editing.quantity * editing.unit_price).toFixed(2)}
                    </span>
                  </p>
                </div>
              )}

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

                  {/*  DELETE DIALOG  */}
                  <AlertDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                  >
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Do you want to delete this purchase detail? This action cannot be
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