import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  FolderKanban,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { adminApi } from "@/lib/api";

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    adminApi
      .getCategories()
      .then((res) => {
        if (res.results) setCategories(res.results);
        else if (Array.isArray(res)) setCategories(res);
        else if (res.data) setCategories(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCat(null);
    setName("");
    setDescription("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: any) => {
    setEditingCat(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCat) {
        await adminApi.updateCategory(editingCat.id, { name, description });
      } else {
        await adminApi.createCategory({ name, description });
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: any) => {
    if (!window.confirm(`Are you sure you want to delete the category "${cat.name}"?`)) return;
    try {
      await adminApi.deleteCategory(cat.id);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || "Failed to delete category");
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Job Categories
            </h2>
            <p className="text-sm text-muted-foreground">
              Create, update, and manage job categories and industries.
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2 font-semibold">
            <Plus className="h-4 w-4" />
            Add New Category
          </Button>
        </div>
      </div>

      {isModalOpen && (
        <Card className="mb-6 border-primary/40 shadow-lg bg-card">
          <CardContent className="p-6">
            <form onSubmit={handleSave} className="space-y-4">
              <h3 className="font-bold text-base text-foreground">
                {editingCat ? `Edit Category: ${editingCat.name}` : "Create New Category"}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Category Name</label>
                  <Input
                    required
                    placeholder="e.g. Cybersecurity & InfoSec"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Description (Optional)</label>
                  <Input
                    placeholder="e.g. Security operations and engineering"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving}>
                  {saving ? "Saving..." : "Save Category"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-bold">Category Name</TableHead>
                  <TableHead className="font-bold">Slug</TableHead>
                  <TableHead className="font-bold">Description</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center text-xs text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                      Loading categories...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center text-xs text-muted-foreground">
                      No categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <FolderKanban className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-foreground text-sm">{cat.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                        {cat.description || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(cat)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(cat)}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
