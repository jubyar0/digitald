"use client";

import { useState, useEffect } from "react";
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
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";
import {
    getNavigationItems,
    getAllNavigationItems,
    createNavigationItem,
    updateNavigationItem,
    deleteNavigationItem,
    reorderNavigationItems,
    NavigationItem,
} from "@/actions/navigation-actions";
import { toast } from "sonner";

export default function NavigationPage() {
    const [items, setItems] = useState<NavigationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
    const [addingChildTo, setAddingChildTo] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        label: "",
        url: "",
        isSection: false,
        icon: "",
        description: "",
        image: "",
        isFeatured: false,
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setIsLoading(true);
        const result = await getAllNavigationItems();
        if (result.success && result.data) {
            setItems(result.data);
        } else {
            toast.error("Failed to fetch navigation items");
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSubmit = {
            label: formData.label,
            url: formData.url,
            isSection: formData.isSection,
            icon: formData.icon || null,
            description: formData.description || null,
            image: formData.image || null,
            isFeatured: formData.isFeatured,
        };

        if (editingItem) {
            const result = await updateNavigationItem(editingItem.id, dataToSubmit);
            if (result.success) {
                toast.success("Item updated successfully");
                fetchItems();
                setIsDialogOpen(false);
                // Reset form
                setFormData({
                    label: "",
                    url: "",
                    isSection: false,
                    icon: "",
                    description: "",
                    image: "",
                    isFeatured: false,
                });
                setEditingItem(null);
            } else {
                toast.error("Failed to update item");
            }
        } else {
            const result = await createNavigationItem({
                ...dataToSubmit,
                parentId: addingChildTo,
            });
            if (result.success) {
                toast.success("Item created successfully");
                fetchItems();
                setIsDialogOpen(false);
                // Reset form
                setFormData({
                    label: "",
                    url: "",
                    isSection: false,
                    icon: "",
                    description: "",
                    image: "",
                    isFeatured: false,
                });
                setAddingChildTo(null);
            } else {
                toast.error("Failed to create item");
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            const result = await deleteNavigationItem(id);
            if (result.success) {
                toast.success("Item deleted successfully");
                fetchItems();
            } else {
                toast.error("Failed to delete item");
            }
        }
    };

    const handleMove = async (index: number, direction: "up" | "down", parentId: string | null = null) => {
        // Find the list to reorder (root items or children of a specific parent)
        let listToReorder: NavigationItem[];
        if (parentId) {
            const parent = items.find(i => i.id === parentId);
            if (!parent || !parent.children) return;
            listToReorder = [...parent.children];
        } else {
            listToReorder = items.filter(i => !i.parentId);
        }

        if (direction === "up" && index > 0) {
            [listToReorder[index], listToReorder[index - 1]] = [listToReorder[index - 1], listToReorder[index]];
        } else if (direction === "down" && index < listToReorder.length - 1) {
            [listToReorder[index], listToReorder[index + 1]] = [listToReorder[index + 1], listToReorder[index]];
        } else {
            return;
        }

        // Optimistic update is complex with nesting, so we'll just reload for now or implement deeper state update logic
        // For simplicity, let's just call the backend reorder
        const updates = listToReorder.map((item, idx) => ({ id: item.id, order: idx }));
        const result = await reorderNavigationItems(updates);

        if (result.success) {
            fetchItems();
        } else {
            toast.error("Failed to reorder items");
        }
    };

    const openDialog = (item?: NavigationItem, parentId?: string) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                label: item.label,
                url: item.url,
                isSection: item.isSection || false,
                icon: item.icon || "",
                description: item.description || "",
                image: item.image || "",
                isFeatured: item.isFeatured || false,
            });
            setAddingChildTo(null);
        } else {
            setEditingItem(null);
            setFormData({
                label: "",
                url: "",
                isSection: false,
                icon: "",
                description: "",
                image: "",
                isFeatured: false,
            });
            setAddingChildTo(parentId || null);
        }
        setIsDialogOpen(true);
    };

    // Helper to render rows recursively
    const renderRows = (items: NavigationItem[], level = 0): JSX.Element[] => {
        return items.map((item, index) => (
            <>
                <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-gray-200">
                        <div style={{ paddingLeft: `${level * 24}px` }} className="flex items-center gap-2">
                            {level > 0 && <span className="text-gray-600">└</span>}
                            {item.label}
                            {item.isSection && <span className="text-xs bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">Section</span>}
                            {item.isFeatured && <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">Featured</span>}
                        </div>
                    </TableCell>
                    <TableCell className="text-gray-400">{item.url}</TableCell>
                    <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMove(index, "up", item.parentId)}
                                disabled={index === 0}
                                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                            >
                                <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMove(index, "down", item.parentId)}
                                disabled={index === items.length - 1}
                                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                            >
                                <ArrowDown className="h-4 w-4" />
                            </Button>
                            {level === 0 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openDialog(undefined, item.id)}
                                    className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-400/10"
                                    title="Add Sub-item"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDialog(item)}
                                className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(item.id)}
                                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
                {item.children && item.children.length > 0 && renderRows(item.children, level + 1)}
            </>
        ));
    };

    // Filter root items for initial render
    const rootItems = items.filter(item => !item.parentId);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Navigation Menu</h1>
                <Button onClick={() => openDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                </Button>
            </div>

            <div className="bg-[#1c1c1c] border border-white/10 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-gray-400">Label</TableHead>
                            <TableHead className="text-gray-400">URL</TableHead>
                            <TableHead className="text-gray-400 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8 text-gray-400">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8 text-gray-400">
                                    No items found. Add one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            renderRows(rootItems)
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-[#1c1c1c] border-white/10 text-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingItem ? "Edit Item" : addingChildTo ? "Add Sub-item" : "Add New Item"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="label">Label</Label>
                                <Input
                                    id="label"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    placeholder="e.g. Textures"
                                    className="bg-white/5 border-white/10 text-white focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="url">URL</Label>
                                <Input
                                    id="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    placeholder="e.g. /textures or #"
                                    className="bg-white/5 border-white/10 text-white focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Short description for mega menu"
                                className="bg-white/5 border-white/10 text-white focus:border-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="icon">Icon (Optional)</Label>
                                <Input
                                    id="icon"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    placeholder="Lucide icon name or URL"
                                    className="bg-white/5 border-white/10 text-white focus:border-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">Image URL (Optional)</Label>
                                <Input
                                    id="image"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://..."
                                    className="bg-white/5 border-white/10 text-white focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isSection"
                                checked={formData.isSection}
                                onChange={(e) => setFormData({ ...formData, isSection: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <Label htmlFor="isSection">Section Header (Non-clickable grouping)</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isFeatured"
                                checked={formData.isFeatured}
                                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="isFeatured">Featured Item (Show as card in Mega Menu)</Label>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsDialogOpen(false)}
                                className="hover:bg-white/10 hover:text-white"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                {editingItem ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
