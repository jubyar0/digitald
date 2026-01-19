"use client";

interface CategoryFiltersProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

export function CategoryFilters({
    categories,
    activeCategory,
    onCategoryChange,
}: CategoryFiltersProps) {
    return (
        <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max pb-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeCategory === category
                            ? "bg-blue-600 text-white"
                            : "bg-[#09090b] text-gray-400 hover:text-gray-200 hover:bg-[#09090b] border border-gray-800"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}
