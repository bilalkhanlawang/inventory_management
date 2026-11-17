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
import { Plus, Pencil, Trash2 , Search, X  } from "lucide-react";

export default function Currencies() {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  // Edit Dialog
  const [editingCurrencies, setEditingCurrencies] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

//   delete data
const [deleteCurrency,setDeleteCurrency] = useState(null);
const [isDeleteDialogOpen,setIsDeleteDialogOpen] = useState(false);


// Search
const [searchTerm, setSearchTerm] = useState("");

const filteredCurrencies = currencies.filter((currency) => {
  const search = searchTerm.toLowerCase();
  return currency.currency_name?.toLowerCase().includes(search);
});

  useEffect(() => {
    fetchCurrencies();
  }, []);

  async function fetchCurrencies() {
    try {
      setLoading(true);
      const data = await api.get("/currencies");
      setCurrencies(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
      await api.post("/currencies", formData);
      setIsDialogOpen(false);
      setFormData({ name: "" });
      fetchCurrencies();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // ========== EDIT ==========
  function handleEdit(currency) {
    setEditingCurrencies({
      currency_id: currency.currency_id,
      name: currency.currency_name,
    });
    setIsEditDialogOpen(true);
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditingCurrencies((prev) => ({ ...prev, [name]: value }));
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      await api.put(`/currencies/${editingCurrencies.currency_id}`, {
        name: editingCurrencies.name,
      });
      setIsEditDialogOpen(false);
      setEditingCurrencies(null);
      fetchCurrencies();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }
//   for delete data 
 function handleDeleteClick (currency) {
    setDeleteCurrency(currency);
    setIsDeleteDialogOpen(true);
 }
 async function handleDelete (e) {
    e.preventDefault();
    try {
        await api.delete(`/currencies/${deleteCurrency.currency_id}`);
        setIsDeleteDialogOpen(false);
        setDeleteCurrency(null);
        fetchCurrencies();
    }catch(err) {
        alert("error:" + err.message);
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
          <h1 className="text-3xl font-bold">Currencies</h1>
          <p className="text-gray-500">Total: {currencies.length} currencies</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Currency
        </Button>
      </div> */}

      <div className="flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-bold">Currencies</h1>
    <p className="text-gray-500">
      Total: {filteredCurrencies.length} currencies
      {searchTerm && ` (filtered from ${currencies.length})`}
    </p>
  </div>

  <div className="flex items-center gap-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        placeholder="Search currencies..."
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
      Add Currency
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
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCurrencies.map((currency) => (
              <TableRow key={currency.currency_id}>
                <TableCell className="font-medium">
                  {currency.currency_id}
                </TableCell>
                <TableCell>{currency.currency_name}</TableCell>
                {/* <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(currency)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell> */}
                <TableCell className="text-right">
  <div className="flex justify-end gap-2">
    <Button
      variant="outline"
      size="icon"
      onClick={() => handleEdit(currency)}
    >
      <Pencil className="w-4 h-4" />
    </Button>
    <Button
      variant="outline"
      size="icon"
      onClick={() => handleDeleteClick(currency)}
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
            <DialogTitle>Add New Currency</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter currency name"
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
            <DialogTitle>Edit Currency</DialogTitle>
          </DialogHeader>

          {editingCurrencies && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_name">Name</Label>
                <Input
                  id="edit_name"
                  name="name"
                  value={editingCurrencies.name}
                  onChange={handleEditChange}
                  placeholder="Enter currency name"
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
<AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        Do you want to delete "{deleteCurrency?.currency_name}"? This action
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