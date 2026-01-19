"use client";

interface Specification {
    label: string;
    value: string;
}

interface ProductSpecificationsProps {
    specifications: Specification[];
}

export function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Technical Specifications</h2>
            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <div className="divide-y divide-white/10">
                    {specifications.map((spec, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-2 gap-4 p-4 hover:bg-white/5 transition-colors"
                        >
                            <span className="text-gray-400 text-sm font-medium">
                                {spec.label}
                            </span>
                            <span className="text-white font-medium">{spec.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
