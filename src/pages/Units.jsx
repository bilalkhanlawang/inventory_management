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

export default function Units() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  // Edit Dialog
  const [editing, setEditing] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [deleteUnit , setDeleteUnit] = useState(null);
  const [isDeleteDialogOpen , setIsDeleteDialogOpen] = useState(false);


  // Search

const [searchTerm , setSearchTerm] = useState("");

  // this for search units 

  const filteredUnits = units.filter((unit) => {
    const search = searchTerm.toLowerCase();
    return unit.unit_name?.toLowerCase().includes(search);
  });


  useEffect(() => {
    fetchUnits();
  }, []);

  async function fetchUnits() {
    try {
      setLoading(true);
      const data = await api.get("/units");
      setUnits(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(el) {
    const { name, value } = el.target;
    setFormData((pre) => ({ ...pre, [name]: value }));
  }

  // ========== ADD ==========
  async function handleAdd(e) {
    e.preventDefault();
    try {
      await api.post("/units", formData);
      setIsDialogOpen(false);
      setFormData({ name: "" });
      fetchUnits();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // ========== EDIT ==========
  function handleEdit(unit) {
    setEditing({
      unit_id: unit.unit_id,
      name: unit.unit_name,
    });
    setIsEditDialogOpen(true);
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditing((pre) => ({ ...pre, [name]: value }));
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      await api.put(`/units/${editing.unit_id}`, {
        name: editing.name,
      });
      setIsEditDialogOpen(false);
      setEditing(null);
      fetchUnits();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // this function for delete method 


  // THIS function for when we click the delete button its take the some id and then give to useSTATE  

  function handleDeleteClick (unit) {
    setDeleteUnit(unit);
    setIsDeleteDialogOpen(true);
  }
  // IN THIS function delete the unit 

  async function handleDelete () {
    try {
    await api.delete(`/units/${deleteUnit.unit_id}`);
    setIsDeleteDialogOpen(false);
    setDeleteUnit(null);
    fetchUnits();
    }catch (err) {
      alert("error:" + err.message);
    }
  }












  // ========== LOADING / ERROR (بیرون از fetchUnits) ==========
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
          <h1 className="text-3xl font-bold">Units</h1>
          <p className="text-gray-500">Total: {units.length} units</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Unit
        </Button>
      </div> */}



      <div className="flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-bold">Units</h1>
    <p className="text-gray-500">
      Total: {filteredUnits.length} units
      {searchTerm && ` (filtered from ${units.length})`}
    </p>
  </div>

  <div className="flex items-center gap-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        placeholder="Search units..."
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
      Add Unit
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
            {filteredUnits.map((unit) => (
              <TableRow key={unit.unit_id}>
                <TableCell className="font-medium">{unit.unit_id}</TableCell>
                <TableCell>{unit.unit_name}</TableCell>

                {/* <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(unit)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell> */}


                    <TableCell className="text-right">
       <div className="flex justify-end gap-2">
       <Button
      variant="outline"
      size="icon"
      onClick={() => handleEdit(unit)}
       >
      <Pencil className="w-4 h-4" />
      </Button>
      <Button
      variant="outline"
      size="icon"
      onClick={() => handleDeleteClick(unit)}
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
            <DialogTitle>Add New Unit</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter unit name"
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
            <DialogTitle>Edit Unit</DialogTitle>
          </DialogHeader>

          {editing && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_name">Name</Label>
                <Input
                  id="edit_name"
                  name="name"
                  value={editing.name}
                  onChange={handleEditChange}
                  placeholder="Enter unit name"
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
        Do you want to delete "{deleteUnit?.unit_name}"? This action cannot be
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