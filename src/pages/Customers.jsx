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

export default function Customers () {
    const[getData,setGetData] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");

    // for add data 
    const [addData , setAddData] = useState({name: ""});
    const [isDialogOpen,setIsDialogOpen] = useState(false);

    // for Edit
    const [edit,setEdit] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // for delete
    const [deleteData , setDeleteData] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


  const [searchTerm, setSearchTerm] = useState("");
  // 🆕 فیلتر لیست بر اساس جستجو
  const filteredCustomer = getData.filter((customer) => {
    const search = searchTerm.toLowerCase();
    return (
      customer.customer_name?.toLowerCase().includes(search)
      
    );
  });


    useEffect(() => {
        fetchData();
    },[]);

    // this function for get data from databse

     async function fetchData () {
        try {
            setLoading(true);
            const data = await api.get("/customers");
            setGetData(data);
            
            setError("");
        }catch (err) {
            alert("error:" + err.message);
        }finally{
            setLoading(false);
        }
    }

    // this function for create data to database 

    function handleChange (customer) {
        const {name , value} = customer.target;
        setAddData((pre) => ({...pre , [name]: value}))
    }

    async function handleAdd(customerss) {
        customerss.preventDefault();
        try {
            
            await api.post("/customers" , addData);
            setAddData({name: ""});
            fetchData();
            setIsDialogOpen(false);
        }catch(err) {
            alert("Error:" + err.message);
        }
    } 

    // for update data 
    function handleEdit (customer) {
        setEdit({
            customer_id:customer.customer_id,
            customer_name: customer.customer_name || "",
        });
        setIsEditDialogOpen(true);
    }
    function handleEditChange (e) {
        const {name, value} = e.target;
       setEdit((pre) => ({...pre , [name]: value}));
    }

    async function handleUpdate (e) {
        e.preventDefault();
        try {
            await api.put(`/customers/${edit.customer_id}`,{
                name: edit.customer_name,
            });
            setIsEditDialogOpen(false);
            setEdit(null);
            fetchData();
        }catch (err) {
            alert("Error:" + err.message);
        }
    }

    // for delete data from database 
    function handleDeleteCustomer (customer) {
        setDeleteData(customer);
        setIsDeleteDialogOpen(true);
    }
    async function handleDelete () {
        try {
            await api.delete(`/customers/${deleteData.customer_id}`);
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

    return(
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Customers</h1>
                    {/* <p className="text-gray-500">Total: {getData.length} Customers</p>         */}

                    <p className="text-gray-500">
                    Total: {filteredCustomer.length} Customers
                    {searchTerm && ` (filtered from ${getData.length})`}
                    </p>
                </div>

                <div className="flex items-center gap-5">

                <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search customer..."
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
                       


                <Button onClick={()=>setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2"/>
                    Add Customer
                </Button>
                </div>
                 </div>

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
                                {filteredCustomer.map((customer) => (
                                    <TableRow key={customer.customer_id}>
                                    <TableCell className="font-medium">
                                        {customer.customer_id}
                                    </TableCell>
                                    <TableCell>{customer.customer_name}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleEdit(customer)}
                                        >
                                        <Pencil className="w-4 h-4" />
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDeleteCustomer(customer)}
                                            className="text-red-600 hover:text-red-700"
                                            >
                                                 <Trash2 className="w-4 h-4" />
                    
                                            </Button>
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
                            <DialogTitle>Add New Customer</DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleAdd} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="customer_name">Name</Label>
                                <Input
                                id="customer_name"
                                name="name"
                                value={addData.name}
                                onChange={handleChange}
                                placeholder="Enter customer name"
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
                                <DialogTitle>Edit Customer</DialogTitle>
                                </DialogHeader>

                                {edit && (
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div className="space-y-2">
                                    <Label htmlFor="edit_name">Name</Label>
                                    <Input
                                        id="edit_name"
                                        name="customer_name"
                                        value={edit.customer_name || ""}
                                        onChange={handleEditChange}
                                        placeholder="Enter customer name"
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
                                        Do you want to delete "{deleteData?.customer_name}"? This action
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





    )



}