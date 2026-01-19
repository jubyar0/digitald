import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import {
    ProductFormData,
    ProductOption,
    ProductVariant,
    ImageFile,
    SalesChannel,
    DEFAULT_FORM_DATA,
    DEFAULT_UNIT_PRICE_DATA,
    DEFAULT_COLLECTIONS,
    DEFAULT_TAGS,
    Category,
    UnitPriceData
} from '../types';
import { generateId } from '@/lib/utils';

interface UseProductFormProps {
    onSuccess: () => void;
    initialData?: any;
    isEditMode?: boolean;
    categories: Category[];
}

export function useProductForm({ onSuccess, initialData, isEditMode, categories }: UseProductFormProps) {
    // Form Data State
    const [formData, setFormData] = useState<ProductFormData>(initialData || DEFAULT_FORM_DATA);
    const [images, setImages] = useState<ImageFile[]>(initialData?.images || []);
    const [loading, setLoading] = useState(false);

    // AI Generation State
    const [aiDialogOpen, setAiDialogOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Variants & Options State
    const [options, setOptions] = useState<ProductOption[]>(initialData?.options || []);
    const [variants, setVariants] = useState<ProductVariant[]>(initialData?.variants || []);

    // Publishing State
    const [salesChannels, setSalesChannels] = useState<SalesChannel[]>([
        { id: 'online-store', name: 'Online Store', type: 'web', isActive: true },
        { id: 'pos', name: 'Point of Sale', type: 'pos', isActive: false },
        { id: 'google', name: 'Google & YouTube', type: 'social', isActive: true },
        { id: 'facebook', name: 'Facebook & Instagram', type: 'social', isActive: false },
    ]);

    const [markets, setMarkets] = useState([
        { id: 'dz', name: 'Algeria', code: 'DZ', isActive: true, currency: 'DZD' },
        { id: 'intl', name: 'International', code: 'INTL', isActive: false, currency: 'USD' },
    ]);
    const [publishingDialogOpen, setPublishingDialogOpen] = useState(false);
    const [channelSearch, setChannelSearch] = useState('');

    // Price Section State
    const [showAdditionalPrices, setShowAdditionalPrices] = useState(false);
    const [unitPriceOpen, setUnitPriceOpen] = useState(false);
    const [unitPriceData, setUnitPriceData] = useState<UnitPriceData>(DEFAULT_UNIT_PRICE_DATA);

    // Organization Section State
    const [productTypeOpen, setProductTypeOpen] = useState(false);
    const [vendorInput, setVendorInput] = useState('');
    const [collectionsOpen, setCollectionsOpen] = useState(false);
    const [collectionsSearch, setCollectionsSearch] = useState('');
    const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
    const [tagsOpen, setTagsOpen] = useState(false);
    const [tagsSearch, setTagsSearch] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Derived State
    const availableCollections = DEFAULT_COLLECTIONS;
    const availableTags = DEFAULT_TAGS;

    // Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSwitchChange = (name: string) => (checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    // Image Handlers
    const handleImageUpload = (files: File[]) => {
        const newImages = files.map(file => ({
            id: generateId(),
            url: URL.createObjectURL(file),
            file,
            isMain: images.length === 0 // First image is main by default
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (id: string) => {
        setImages(prev => {
            const newImages = prev.filter(img => img.id !== id);
            // If we removed the main image, make the first one main
            if (prev.find(img => img.id === id)?.isMain && newImages.length > 0) {
                newImages[0].isMain = true;
            }
            return newImages;
        });
    };

    const setMainImage = (id: string) => {
        setImages(prev => prev.map(img => ({
            ...img,
            isMain: img.id === id
        })));
    };

    // AI Generation Handler
    const handleAIGenerate = async () => {
        setIsGenerating(true);
        try {
            // Simulate AI generation
            await new Promise(resolve => setTimeout(resolve, 1500));
            const generatedDescription = `Experience premium quality with our ${formData.name}. Crafted with precision and designed for durability, this product features ${aiPrompt || 'state-of-the-art materials'}. Perfect for everyday use, it combines style and functionality seamlessly.`;

            setFormData(prev => ({
                ...prev,
                description: generatedDescription
            }));
            setAiDialogOpen(false);
            toast.success("Description generated successfully!");
        } catch (error) {
            toast.error("Failed to generate description");
        } finally {
            setIsGenerating(false);
        }
    };

    // Variant Handlers
    const handleOptionChange = (id: string, field: keyof ProductOption, value: any) => {
        setOptions(prev => prev.map(opt =>
            opt.id === id ? { ...opt, [field]: value } : opt
        ));
    };

    const addOptionValue = (optionId: string, value: string) => {
        setOptions(prev => prev.map(opt => {
            if (opt.id === optionId && !opt.values.includes(value)) {
                return { ...opt, values: [...opt.values, value] };
            }
            return opt;
        }));
    };

    const removeOptionValue = (optionId: string, valueToRemove: string) => {
        setOptions(prev => prev.map(opt =>
            opt.id === optionId
                ? { ...opt, values: opt.values.filter(v => v !== valueToRemove) }
                : opt
        ));
    };

    const removeOption = (id: string) => {
        setOptions(prev => prev.filter(opt => opt.id !== id));
    };

    const addOption = (name: string = '', values: string[] = []) => {
        setOptions(prev => [...prev, {
            id: generateId(),
            name,
            values
        }]);
    };

    const handleVariantChange = (id: string, field: keyof ProductVariant, value: any) => {
        setVariants(prev => prev.map(v =>
            v.id === id ? { ...v, [field]: value } : v
        ));
    };

    // Regenerate variants when options change
    useEffect(() => {
        if (options.length === 0) {
            setVariants([]);
            return;
        }

        // Simple cartesian product for variants
        // Note: In a real app, you'd want to be smarter about preserving existing variant data
        const generateVariants = (opts: ProductOption[], index = 0, current: any[] = []): any[] => {
            if (index === opts.length) return [current];

            const option = opts[index];
            const res = [];

            if (option.values.length === 0) {
                // If option has no values, just continue
                return generateVariants(opts, index + 1, current);
            }

            for (const val of option.values) {
                res.push(...generateVariants(opts, index + 1, [...current, { name: option.name, value: val }]));
            }
            return res;
        };

        // Only regenerate if options structure changed significantly
        // This is a simplified logic
        const combinations = generateVariants(options);

        const newVariants = combinations.map(combo => {
            const title = combo.map((c: any) => c.value).join(' / ');
            // Try to find existing variant to preserve price/sku
            const existing = variants.find(v => v.title === title);

            return existing || {
                id: generateId(),
                title,
                price: formData.price,
                sku: '',
                quantity: 0,
                options: combo
            };
        });

        // Only update if count matches (basic check to avoid infinite loops)
        if (newVariants.length !== variants.length || !variants.every((v, i) => v.title === newVariants[i].title)) {
            setVariants(newVariants);
        }
    }, [options]);


    // Publishing Handlers
    const toggleSalesChannel = (id: string) => {
        setSalesChannels(prev => prev.map(ch =>
            ch.id === id ? { ...ch, isActive: !ch.isActive } : ch
        ));
    };

    const toggleMarket = (id: string) => {
        setMarkets(prev => prev.map(m =>
            m.id === id ? { ...m, isActive: !m.isActive } : m
        ));
    };

    // Submit Handler
    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Submitting Product:', {
                ...formData,
                images,
                options,
                variants,
                salesChannels,
                markets
            });

            toast.success(isEditMode ? "Product updated successfully" : "Product created successfully");
            onSuccess();
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        setFormData,
        images,
        setImages,
        options,
        setOptions,
        variants,
        setVariants,
        loading,
        aiDialogOpen,
        setAiDialogOpen,
        aiPrompt,
        setAiPrompt,
        isGenerating,
        handleChange,
        handleSelectChange,
        handleSwitchChange,
        handleImageUpload,
        removeImage,
        setMainImage,
        handleAIGenerate,
        handleSubmit,
        handleOptionChange,
        addOptionValue,
        removeOptionValue,
        removeOption,
        addOption,
        handleVariantChange,
        salesChannels, setSalesChannels, toggleSalesChannel, markets, toggleMarket,
        publishingDialogOpen, setPublishingDialogOpen, channelSearch, setChannelSearch,
        showAdditionalPrices, setShowAdditionalPrices, unitPriceOpen, setUnitPriceOpen, unitPriceData, setUnitPriceData,
        productTypeOpen, setProductTypeOpen, vendorInput, setVendorInput,
        collectionsOpen, setCollectionsOpen, collectionsSearch, setCollectionsSearch, selectedCollections, setSelectedCollections,
        tagsOpen, setTagsOpen, tagsSearch, setTagsSearch, selectedTags, setSelectedTags,
        availableCollections, availableTags
    };
}
