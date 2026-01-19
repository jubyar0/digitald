// lib/page-builder/components/FormTextarea.tsx
// Form Textarea component for Page Builder

import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface FormTextareaProps {
    label?: string;
    placeholder?: string;
    rows?: number;
    required?: boolean;
    className?: string;
}

export function FormTextarea({
    label = 'Message',
    placeholder = 'Enter your message...',
    rows = 4,
    required = false,
    className,
}: FormTextareaProps) {
    return (
        <div className={cn('space-y-2', className)}>
            {label && (
                <Label>
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </Label>
            )}
            <Textarea
                placeholder={placeholder}
                rows={rows}
                required={required}
                className="w-full resize-none"
            />
        </div>
    );
}
