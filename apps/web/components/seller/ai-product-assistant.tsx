'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Wand2, Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface AiProductAssistantProps {
    onGenerate: (data: { title: string, description: string, tags: string[] }) => void
}

export function AiProductAssistant({ onGenerate }: AiProductAssistantProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [keywords, setKeywords] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)

    const handleGenerate = async () => {
        if (!keywords.trim()) return

        setIsGenerating(true)

        // Simulate AI delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Mock AI generation logic
        const generatedData = {
            title: `Premium ${keywords} - High Quality & Durable`,
            description: `Experience the best with our ${keywords}. Designed for excellence and crafted with precision, this product offers unmatched performance and style. Perfect for daily use or special occasions.\n\nKey Features:\n- High-quality materials\n- Modern design\n- Durable construction\n- Satisfaction guaranteed`,
            tags: [keywords, 'premium', 'high-quality', 'best-seller', 'trending']
        }

        onGenerate(generatedData)
        setIsGenerating(false)
        setIsOpen(false)
        toast.success("Content generated successfully! ✨")
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-purple-500 text-purple-600 hover:bg-purple-50 hover:text-purple-700">
                    <Sparkles className="h-4 w-4" />
                    AI Magic Assistant
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5 text-purple-600" />
                        AI Product Generator
                    </DialogTitle>
                    <DialogDescription>
                        Enter a few keywords about your product, and let our AI generate a title, description, and tags for you.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="keywords">Product Keywords</Label>
                        <Input
                            id="keywords"
                            placeholder="e.g., leather wallet, wireless headphones"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleGenerate} disabled={isGenerating || !keywords.trim()} className="bg-purple-600 hover:bg-purple-700 text-white">
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Magic...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Content
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
