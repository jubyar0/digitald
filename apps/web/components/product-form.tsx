'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProductFormContent } from '@/components/product-form-content';

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductCreated: () => void;
  isAdminContext?: boolean;
}

export function ProductForm({ open, onOpenChange, onProductCreated, isAdminContext = false }: ProductFormProps) {
  const handleSuccess = () => {
    onProductCreated();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Create a comprehensive 3D product listing with all details
          </DialogDescription>
        </DialogHeader>

        <ProductFormContent
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
          isAdminContext={isAdminContext}
        />
      </DialogContent>
    </Dialog>
  );
}