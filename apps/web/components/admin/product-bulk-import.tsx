'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download, Upload } from 'lucide-react'
import { toast } from 'sonner'

export default function ProductBulkImport() {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [uploadedFileName, setUploadedFileName] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            setUploadedFile(file)
            setUploadedFileName(file.name)
        }
    }

    const handleDownloadCSV = () => {
        // Create a sample CSV template
        const csvContent = `Product Name,SKU,Price,Description,Category,Stock,Brand,Weight,HSN Code,GST Rate
Sample Product,SKU001,29.99,Sample Description,Electronics,100,Sample Brand,0.5,1234567,18
Sample Product 2,SKU002,49.99,Another Description,Clothing,50,Brand Name,0.3,9876543,12`

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'product_template.csv'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success('CSV template downloaded successfully')
    }

    const handleDownloadCSVPy = () => {
        // Create a sample Python CSV template
        const csvContent = `ID,Product Name,SKU,Price,Description,Category,Stock,Brand,Weight,HSN Code,GST Rate
1,Sample Product,SKU001,29.99,Sample Description,Electronics,100,Sample Brand,0.5,1234567,18
2,Sample Product 2,SKU002,49.99,Another Description,Clothing,50,Brand Name,0.3,9876543,12`

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'product_template_with_id.csv'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success('CSV.py template downloaded successfully')
    }

    const handleDownloadSheet = () => {
        // For a real implementation, you'd want to use a library like SheetJS
        // For now, we'll download the same CSV with .xlsx extension
        const csvContent = `Product Name,SKU,Price,Description,Category,Stock,Brand,Weight,HSN Code,GST Rate
Sample Product,SKU001,29.99,Sample Description,Electronics,100,Sample Brand,0.5,1234567,18
Sample Product 2,SKU002,49.99,Another Description,Clothing,50,Brand Name,0.3,9876543,12`

        const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'product_template.xlsx'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success('Excel template downloaded successfully')
    }

    const handleUploadCSV = async () => {
        if (!uploadedFile) {
            toast.error('Please select a file first')
            return
        }

        setIsUploading(true)
        try {
            // Here you would implement the actual upload logic
            // For now, we'll simulate a delay
            await new Promise(resolve => setTimeout(resolve, 2000))

            toast.success('File uploaded successfully')
            setUploadedFile(null)
            setUploadedFileName('')
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        } catch (error) {
            toast.error('Failed to upload file')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-8 text-foreground">Product Bulk Upload</h1>

            {/* Step 1 */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 text-foreground">Step 1</h2>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
                    <li>Download the skeleton file and fill it with proper product data.</li>
                    <li>You can download the example file to understand how the data must be filled.</li>
                    <li>Once you have downloaded the file, open it and fill it with proper data and make sure you save it in .csv format.</li>
                    <li>After uploading products you need to edit them and set product images and choices.</li>
                </ol>
                <div className="mt-4">
                    <Button
                        onClick={handleDownloadCSV}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download CSV
                    </Button>
                </div>
            </div>

            {/* Step 2 */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 text-foreground">Step 2</h2>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
                    <li>Category and brand should be in numerical IDs</li>
                    <li>You can download the Category and Brand code in .csv format</li>
                </ol>
                <div className="mt-4 flex gap-3">
                    <Button
                        onClick={handleDownloadCSVPy}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download CSV.py
                    </Button>
                    <Button
                        onClick={handleDownloadSheet}
                        variant="outline"
                        className="border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download Sheet
                    </Button>
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-foreground">Upload Product File</h2>
                <div className="flex gap-3 items-center">
                    <Input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx"
                        onChange={handleFileChange}
                        className="flex-1"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="px-4 py-2 bg-muted hover:bg-muted/80 border border-border rounded-md cursor-pointer text-sm text-foreground transition-colors"
                    >
                        Choose file
                    </label>
                </div>
                {uploadedFileName && (
                    <p className="text-sm text-muted-foreground mt-2">
                        Selected file: {uploadedFileName}
                    </p>
                )}
                <div className="mt-4">
                    <Button
                        onClick={handleUploadCSV}
                        disabled={!uploadedFile || isUploading}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                    >
                        {isUploading ? (
                            <>
                                <Upload className="w-4 h-4 mr-2 animate-pulse" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload CSV
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground mt-8">
                © Relax eCommerce CMS v3.2.2
            </div>
        </div>
    )
}
