import { useState, useEffect } from "react";
import { api } from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Pencil, Trash2  , Search , X} from "lucide-react";

export default function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    item_name: "",
    category_name: "",
    unit_name: "",
  });

  // Edit Dialog
  const [editingItem, setEditingItem] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Delete Dialog
  const [deleteItem, setDeleteItem] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");


    
  // 🆕 فیلتر لیست بر اساس جستجو
  const filteredItems = items.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.item_name?.toLowerCase().includes(search) ||
      item.category_name?.toLowerCase().includes(search) ||
      item.unit_name?.toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      const data = await api.get("/items");
      setItems(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // ========== ADD ==========
  async function handleAdd(e) {
    e.preventDefault();
    try {
      await api.post("/items", formData);
      setIsDialogOpen(false);
      setFormData({ item_name: "", category_name: "", unit_name: "" });
      fetchItems();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // ========== EDIT ==========
  function handleEdit(item) {
    setEditingItem({
      item_id: item.item_id,
      item_name: item.item_name,
      category_name: item.category_name,
      unit_name: item.unit_name,
    });
    setIsEditDialogOpen(true);
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditingItem((prev) => ({ ...prev, [name]: value }));
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      await api.put(`/items/${editingItem.item_id}`, {
        item_name: editingItem.item_name,
        category_name: editingItem.category_name,
        unit_name: editingItem.unit_name,
      });
      setIsEditDialogOpen(false);
      setEditingItem(null);
      fetchItems();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // ========== DELETE ==========
  function handleDeleteClick(item) {
    setDeleteItem(item);
    setIsDeleteDialogOpen(true);
  }

  async function handleDelete() {
    try {
      await api.delete(`/items/${deleteItem.item_id}`);
      setIsDeleteDialogOpen(false);
      setDeleteItem(null);
      fetchItems();
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
      {/* <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Items</h1>
          <p className="text-gray-500">Total: {items.length} items</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div> */}



      {/* Header */}
<div className="flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-bold">Items</h1>
    <p className="text-gray-500">
      Total: {filteredItems.length} items
      {searchTerm && ` (filtered from ${items.length})`}
    </p>
  </div>

  <div className="flex items-center gap-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-9 pr-9 w-64"
      />

        <button
      type="button"
      onClick={() => setSearchTerm("")}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      <X className="w-4 h-4" />
    </button>
  
    </div>

    <Button onClick={() => setIsDialogOpen(true)}>
      <Plus className="w-4 h-4 mr-2" />
      Add Item
    </Button>
  </div>
</div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.item_id}>
                <TableCell className="font-medium">{item.item_id}</TableCell>
                <TableCell>{item.item_name}</TableCell>
                <TableCell>{item.category_name}</TableCell>
                <TableCell>{item.unit_name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteClick(item)}
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
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="item_name">Name</Label>
              <Input
                id="item_name"
                name="item_name"
                value={formData.item_name}
                onChange={handleChange}
                placeholder="Enter item name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_name">Category</Label>
              <Input
                id="category_name"
                name="category_name"
                value={formData.category_name}
                onChange={handleChange}
                placeholder="Enter category"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_name">Unit</Label>
              <Input
                id="unit_name"
                name="unit_name"
                value={formData.unit_name}
                onChange={handleChange}
                placeholder="Enter unit"
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
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>

          {editingItem && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_item_name">Name</Label>
                <Input
                  id="edit_item_name"
                  name="item_name"
                  value={editingItem.item_name}
                  onChange={handleEditChange}
                  placeholder="Enter item name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_category_name">Category</Label>
                <Input
                  id="edit_category_name"
                  name="category_name"
                  value={editingItem.category_name}
                  onChange={handleEditChange}
                  placeholder="Enter category"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_unit_name">Unit</Label>
                <Input
                  id="edit_unit_name"
                  name="unit_name"
                  value={editingItem.unit_name}
                  onChange={handleEditChange}
                  placeholder="Enter unit"
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
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to delete "{deleteItem?.item_name}"? This action
              cannot be undone.
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