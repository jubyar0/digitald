'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { adminApi } from '@repo/lib/api';
import { Checkbox } from '@/components/ui/checkbox';

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryCreated: () => void;
  category?: any; // Optional category object for editing
}

export function CategoryForm({ open, onOpenChange, onCategoryCreated, category }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    isActive: category?.isActive !== undefined ? category.isActive : true,
    parentId: category?.parentId || '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Submitting category data:', formData);
      if (category) {
        // Update existing category
        console.log('Updating existing category:', category.id);
        await adminApi.updateCategory(category.id, formData);
      } else {
        // Create new category
        console.log('Creating new category');
        await adminApi.createCategory(formData);
      }
      
      console.log('Category saved successfully');
      
      // Reset form
      setFormData({
        name: '',
        isActive: true,
        parentId: '',
      });
      
      onCategoryCreated();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save category:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          <DialogDescription>
            {category ? 'Edit the category details' : 'Create a new product category'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="parentId">Parent Category (Optional)</Label>
            <Input
              id="parentId"
              name="parentId"
              value={formData.parentId}
              onChange={handleChange}
              placeholder="Enter parent category ID"
            />
          </div>
          
          <div className="space-y-2 flex items-center space-x-2 rounded-md border p-3">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleCheckboxChange('isActive', checked as boolean)}
            />
            <div>
              <Label htmlFor="isActive">Active</Label>
              <p className="text-sm text-muted-foreground">
                Make this category available for products
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (category ? 'Update Category' : 'Create Category')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}