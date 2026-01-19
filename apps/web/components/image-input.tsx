"use client"

import * as React from "react"

export interface ImageInputFile {
    dataURL?: string;
    file?: File;
}

export interface ImageInputProps {
    onImageUpload?: (file: File) => void;
    value?: string | ImageInputFile[];
    onChange?: (value: string | ImageInputFile[]) => void;
    children?: (props: { onImageUpload: () => void }) => React.ReactNode;
}

export function ImageInput({ onImageUpload, value, onChange, children }: ImageInputProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (onImageUpload) {
                onImageUpload(file);
            }
            if (onChange) {
                const reader = new FileReader();
                reader.onload = () => {
                    onChange([{ dataURL: reader.result as string, file }]);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    // Render prop pattern
    if (children) {
        return (
            <>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
                {children({ onImageUpload: handleClick })}
            </>
        );
    }

    // Default input rendering
    const displayValue = typeof value === 'string' ? value : (Array.isArray(value) && value.length > 0 ? value[0].dataURL : undefined);

    return (
        <div className="flex flex-col gap-2">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-primary file:text-primary-foreground
          hover:file:bg-primary/90"
            />
            {displayValue && (
                <img src={displayValue} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
            )}
        </div>
    );
}
