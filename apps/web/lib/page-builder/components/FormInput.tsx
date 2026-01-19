// lib/page-builder/components/FormInput.tsx
// Form Input component for Page Builder

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormInputProps {
    label?: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel';
    required?: boolean;
    className?: string;
}

export function FormInput({
    label = 'Label',
    placeholder = 'Enter text...',
    type = 'text',
    required = false,
    className,
}: FormInputProps) {
    return (
        <div className={cn('space-y-2', className)}>
            {label && (
                <Label>
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </Label>
            )}
            <Input
                type={type}
                placeholder={placeholder}
                required={required}
                className="w-full"
            />
        </div>
    );
}
