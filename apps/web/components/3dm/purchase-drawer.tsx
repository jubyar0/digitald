"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Material } from "@/lib/materials-data";
import { CreditCard, Download, ShieldCheck } from "lucide-react";
import Image from "next/image";

interface PurchaseDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    material: Material;
    mode: "download" | "cart";
}

export function PurchaseDrawer({ isOpen, onClose, material, mode }: PurchaseDrawerProps) {
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-md bg-zinc-950 border-zinc-800 text-white p-0 flex flex-col">
                <SheetHeader className="p-6 pb-2">
                    <SheetTitle className="text-white">
                        {mode === "download" ? "Download Asset" : "Add to Cart"}
                    </SheetTitle>
                    <SheetDescription className="text-zinc-400">
                        {mode === "download"
                            ? "Review the details below to download this asset."
                            : "Review the details below to add this item to your cart."}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {/* Product Summary */}
                    <div className="flex gap-4 mb-6">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0">
                            <Image
                                src={material.imageUrl}
                                alt={material.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate">{material.name}</h3>
                            <p className="text-sm text-zinc-400 mt-1">{material.category}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-emerald-400 font-medium">
                                    {material.isFree ? "Free" : "$29.00"}
                                </span>
                                {material.isFree && (
                                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                        Free License
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-zinc-800 my-6" />

                    {/* License Info */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-white flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-blue-400" />
                            License Information
                        </h4>
                        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                            <p className="text-sm text-zinc-300 leading-relaxed">
                                {material.license || "Standard License"}
                            </p>
                            <ul className="mt-3 space-y-2 text-xs text-zinc-400">
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-zinc-500" />
                                    Personal and commercial use
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-zinc-500" />
                                    Royalty-free
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-zinc-500" />
                                    No attribution required
                                </li>
                            </ul>
                        </div>
                    </div>

                    <Separator className="bg-zinc-800 my-6" />

                    {/* Payment/Download Info */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-white">
                            {mode === "download" ? "Download Details" : "Order Summary"}
                        </h4>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Subtotal</span>
                                <span className="text-white">{material.isFree ? "$0.00" : "$29.00"}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Taxes</span>
                                <span className="text-white">$0.00</span>
                            </div>
                            <Separator className="bg-zinc-800" />
                            <div className="flex justify-between font-medium">
                                <span className="text-white">Total</span>
                                <span className="text-white">{material.isFree ? "$0.00" : "$29.00"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <SheetFooter className="p-6 border-t border-zinc-800 bg-zinc-950">
                    <Button
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium"
                        onClick={() => {
                            // Handle payment/download logic here
                            console.log("Processing", mode);
                        }}
                    >
                        {mode === "download" ? (
                            <>
                                <Download className="w-4 h-4 mr-2" />
                                Download Now
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-4 h-4 mr-2" />
                                Complete Payment
                            </>
                        )}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
