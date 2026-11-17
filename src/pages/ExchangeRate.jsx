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

export default function ExchangeRate() {
  const [rates, setRates] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    from_currency_id: "",
    to_currency_id: "",
    exchange_rate: "",
    effective_date: "",
  });

  // Edit Dialog
  const [editing, setEditing] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Delete Dialog
  const [deleteRate, setDeleteRate] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRates = rates.filter((rate) => {
    const search = searchTerm.toLowerCase();
    const fromName =
      currencies
        .find((c) => c.currency_id === rate.from_currency_id)
        ?.currency_name?.toLowerCase() || "";
    const toName =
      currencies
        .find((c) => c.currency_id === rate.to_currency_id)
        ?.currency_name?.toLowerCase() || "";
    return fromName.includes(search) || toName.includes(search);
  });

  useEffect(() => {
    fetchRates();
    fetchCurrencies();
  }, []);

  async function fetchRates() {
    try {
      setLoading(true);
      const data = await api.get("/exchange_rate");
      setRates(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
      await api.post("/exchange_rate", formData);
      setIsDialogOpen(false);
      setFormData({
        from_currency_id: "",
        to_currency_id: "",
        exchange_rate: "",
        effective_date: "",
      });
      fetchRates();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // ========== EDIT ==========
  function handleEdit(rate) {
    setEditing({
      rate_id: rate.rate_id,
      from_currency_id: rate.from_currency_id || "",
      to_currency_id: rate.to_currency_id || "",
      exchange_rate: rate.exchange_rate || "",
      effective_date: rate.effective_date
        ? rate.effective_date.split("T")[0]
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
      await api.put(`/exchange_rate/${editing.rate_id}`, {
        from_currency_id: editing.from_currency_id,
        to_currency_id: editing.to_currency_id,
        exchange_rate: editing.exchange_rate,
        effective_date: editing.effective_date,
      });
      setIsEditDialogOpen(false);
      setEditing(null);
      fetchRates();
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // ========== DELETE ==========
  function handleDeleteClick(rate) {
    setDeleteRate(rate);
    setIsDeleteDialogOpen(true);
  }

  async function handleDelete() {
    try {
      await api.delete(`/exchange_rate/${deleteRate.rate_id}`);
      setIsDeleteDialogOpen(false);
      setDeleteRate(null);
      fetchRates();
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
          <h1 className="text-3xl font-bold">Exchange Rates</h1>
          <p className="text-gray-500">
            Total: {filteredRates.length} rates
            {searchTerm && ` (filtered from ${rates.length})`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by currency..."
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
            Add Rate
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>From Currency</TableHead>
              <TableHead>To Currency</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRates.map((rate) => (
              <TableRow key={rate.rate_id}>
                <TableCell className="font-medium">{rate.rate_id}</TableCell>
                <TableCell>
                  {currencies.find(
                    (c) => c.currency_id === rate.from_currency_id
                  )?.currency_name || rate.from_currency_id}
                </TableCell>
                <TableCell>
                  {currencies.find(
                    (c) => c.currency_id === rate.to_currency_id
                  )?.currency_name || rate.to_currency_id}
                </TableCell>
                <TableCell>{rate.exchange_rate}</TableCell>
                <TableCell>
                  {rate.effective_date
                    ? rate.effective_date.split("T")[0]
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(rate)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteClick(rate)}
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
            <DialogTitle>Add New Exchange Rate</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="from_currency_id">From Currency</Label>
              <select
                id="from_currency_id"
                name="from_currency_id"
                value={formData.from_currency_id}
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
              <Label htmlFor="to_currency_id">To Currency</Label>
              <select
                id="to_currency_id"
                name="to_currency_id"
                value={formData.to_currency_id}
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
              <Label htmlFor="exchange_rate">Exchange Rate</Label>
              <Input
                id="exchange_rate"
                name="exchange_rate"
                type="number"
                step="0.01"
                value={formData.exchange_rate}
                onChange={handleChange}
                placeholder="e.g. 75.50"
                required
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="effective_date">Effective Date</Label>
              <Input
                id="effective_date"
                name="effective_date"
                type="date"
                value={formData.effective_date}
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
            <DialogTitle>Edit Exchange Rate</DialogTitle>
          </DialogHeader>

          {editing && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_from_currency">From Currency</Label>
                <select
                  id="edit_from_currency"
                  name="from_currency_id"
                  value={editing.from_currency_id}
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
                <Label htmlFor="edit_to_currency">To Currency</Label>
                <select
                  id="edit_to_currency"
                  name="to_currency_id"
                  value={editing.to_currency_id}
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
                <Label htmlFor="edit_exchange_rate">Exchange Rate</Label>
                <Input
                  id="edit_exchange_rate"
                  name="exchange_rate"
                  type="number"
                  step="0.01"
                  value={editing.exchange_rate}
                  onChange={handleEditChange}
                  placeholder="e.g. 75.50"
                  required
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_effective_date">Effective Date</Label>
                <Input
                  id="edit_effective_date"
                  name="effective_date"
                  type="date"
                  value={editing.effective_date}
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
              Do you want to delete this exchange rate? This action cannot be
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