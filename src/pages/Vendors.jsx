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


export default function Vendors () {
    const [vendor , setVendor] = useState([]);
    const [loading , setLoading] = useState(true);
    const [error , setError] = useState("");

    // add 
    const [addData , setAddData] = useState({name: ""});
    const [isDialogOpen , setIsDialogOpen] = useState(false);

    // Edit
    const [editData , setEditData] = useState(null);
    const [isEditDialogOpen , setIsEditDialogOpen] = useState(false);

    // delete
    const [deleteData , setDeleteData] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] =useState(false);


    const [searchTerm, setSearchTerm] = useState("");


    
  // 🆕 فیلتر لیست بر اساس جستجو
  const filteredVendor = vendor.filter((vendor) => {
    const search = searchTerm.toLowerCase();
    return (
      vendor.vendor_name?.toLowerCase().includes(search) 
     
    );
  });

    useEffect(() => {
        fetchData();
    },[]);

    // for get data
    async function fetchData () {
        try {
            setLoading(true);
           const data = await api.get("/vendors");
            setVendor(data);
            setError("");
        }catch (err) {
            alert("Error:" + err.message);
        }finally {
            setLoading(false);
        }
    }

    // for create data
    function handleChange (e) {
      const { name , value} = e.target;
      setAddData((pre) => ({...pre , [name]: value}));
    }

    async function handleAdd (e) {
      e.preventDefault();
      try {
        await api.post("/vendors" , addData);
        setIsDialogOpen(false);
        setAddData({name: ""});
        fetchData();
        
      }catch (err) {
        alert("Error:" + err.message);
      }
    }

    // Edit

    function handleEdit (vendor) {
      setEditData({vendor_id: vendor.vendor_id, name: vendor.vendor_name});
      setIsEditDialogOpen(true);
    }

    function handleEditChange (e) {
      const {name , value} = e.target;
      setEditData((pre) => ({...pre , [name]:  value}));
    }

    async function handleUpdate (e) {
      e.preventDefault();
      try {
        await api.put(`/vendors/${editData.vendor_id}`,{
          name: editData.name
        });
        setIsEditDialogOpen(false);
        setEditData(null);
        fetchData();
      }catch (err) {
        alert("Error:" + err.message);
      }
    }
    // Delete
    function handleDeleteClick (vendor) {
      setDeleteData(vendor);
      setIsDeleteDialogOpen(true);
    }
    async function handleDelete () {
      try {
        await api.delete(`/vendors/${deleteData.vendor_id}`);
        setIsDeleteDialogOpen(false);
        setDeleteData(null);
        fetchData();
      }catch (err) {
        alert("Error:" + err.message);
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
              {/* Header
<div className="flex items-center justify-between">
      <div>
          <h1 className="text-3xl font-bold">Vendors</h1>
          <p className="text-gray-500">Total: {vendor.length} vendors</p>
        </div>
    </div>

  <div className="flex items-center gap-4">
    
    <Button onClick={() => setIsDialogOpen(true)}>
      <Plus className="w-4 h-4 mr-2" />
      Add vendor
    </Button>
    </div> */}



    {/* Header */}
<div className="flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-bold">Vendor</h1>
    <p className="text-gray-500">
      Total: {filteredVendor.length} vendor
      {searchTerm && ` (filtered from ${vendor.length})`}
    </p>
  </div>

  <div className="flex items-center gap-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        placeholder="Search vendor..."
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
      Add vendor
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
            {filteredVendor.map((vendor) => (
              <TableRow key={vendor.vendor_id}>
                <TableCell className="font-medium">{vendor.vendor_id}</TableCell>
                <TableCell>{vendor.vendor_name}</TableCell>
              
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(vendor)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteClick(vendor)}
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

         {/* ========== ADD DIALOG ========== */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New vendor</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vendor_name">Name</Label>
              <Input
                id="name"
                name="name"
                value={addData.vendor_name}
                onChange={handleChange}
                placeholder="Enter vendor name"
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
            <DialogTitle>Edit vendor</DialogTitle>
          </DialogHeader>

          {editData && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_vendor_name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  placeholder="Enter vendor name"
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
              Do you want to delete "{deleteData?.vendor_name}"? This action
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

</div>
  )
}