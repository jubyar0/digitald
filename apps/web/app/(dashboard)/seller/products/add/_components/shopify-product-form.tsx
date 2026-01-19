'use client';

import { useState, useEffect } from 'react';
import { ProductHeader } from './sections/product-header';
import { TitleDescriptionSection } from './sections/title-description';
import { MediaSection } from './sections/media-section';
import { PriceSection } from './sections/price-section';
import { InventorySection } from './sections/inventory-section';
import { ShippingSection } from './sections/shipping-section';
import { VariantsSection } from './sections/variants-section';
import { SEOListingSection } from './sections/seo-listing';
import { StatusCard } from './cards/status-card';
import { PublishingCard } from './cards/publishing-card';
import { OrganizationCard } from './cards/organization-card';
import { EditVariantDialog } from './dialogs/edit-variant-dialog';
import { useProductForm } from './hooks/use-product-form';
import { Category, Vendor } from './types';

interface ShopifyProductFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialData?: any;
    isEditMode?: boolean;
    vendors: Vendor[];
    categories: Category[];
    aiEnabled?: boolean;
}

export function ShopifyProductForm({
    onSuccess,
    onCancel,
    initialData,
    isEditMode = false,
    vendors,
    categories,
    aiEnabled = false
}: ShopifyProductFormProps) {
    const {
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
        // New/Updated props from hook
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
    } = useProductForm({
        onSuccess,
        initialData,
        isEditMode,
        categories
    });

    const thumbnailIndex = images.findIndex(img => img.isMain);
    const formatCategoryName = (category: any) => category.name; // Simple helper for now

    // Local state for UI toggles
    const [showInventoryDetails, setShowInventoryDetails] = useState(false);
    const [showCustomsInfo, setShowCustomsInfo] = useState(false);
    const [editingVariant, setEditingVariant] = useState<any | null>(null);

    // Variants Section State
    const [isAddingOption, setIsAddingOption] = useState(false);
    const [newOptionName, setNewOptionName] = useState('');
    const [newOptionValues, setNewOptionValues] = useState<string[]>([]);
    const [newOptionValueInput, setNewOptionValueInput] = useState('');

    // Handlers for Variants Section
    const handleAddOptionClick = () => {
        setIsAddingOption(true);
    };

    const handleSaveOption = () => {
        if (newOptionName && newOptionValues.length > 0) {
            addOption(newOptionName, newOptionValues);
            setIsAddingOption(false);
            setNewOptionName('');
            setNewOptionValues([]);
            setNewOptionValueInput('');
        }
    };

    const handleOptionValueAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newOptionValueInput.trim()) {
            e.preventDefault();
            if (!newOptionValues.includes(newOptionValueInput.trim())) {
                setNewOptionValues([...newOptionValues, newOptionValueInput.trim()]);
            }
            setNewOptionValueInput('');
        }
    };

    const handleOptionValueRemove = (value: string) => {
        setNewOptionValues(newOptionValues.filter(v => v !== value));
    };

    // Handler for saving variant from dialog
    const handleSaveVariant = () => {
        if (editingVariant) {
            setVariants(prev => prev.map(v =>
                v.id === editingVariant.id ? editingVariant : v
            ));
            setEditingVariant(null);
        }
    };

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <ProductHeader
                isEditMode={isEditMode}
                productName={formData.name}
                loading={loading}
                onCancel={onCancel}
                onSave={handleSubmit}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title & Description */}
                    <TitleDescriptionSection
                        name={formData.name}
                        description={formData.description}
                        aiEnabled={aiEnabled}
                        aiDialogOpen={aiDialogOpen}
                        aiPrompt={aiPrompt}
                        isGenerating={isGenerating}
                        onNameChange={handleChange}
                        onDescriptionChange={(e) => handleSelectChange('description', e.target.value)}
                        setAiDialogOpen={setAiDialogOpen}
                        setAiPrompt={setAiPrompt}
                        handleAIGenerate={handleAIGenerate}
                    />

                    {/* Media */}
                    <MediaSection
                        images={images}
                        thumbnailIndex={thumbnailIndex}
                        onImageUpload={(e) => {
                            if (e.target.files) {
                                handleImageUpload(Array.from(e.target.files));
                            }
                        }}
                        removeImage={removeImage}
                        setThumbnailIndex={(index) => {
                            if (images[index]) {
                                setMainImage(images[index].id);
                            }
                        }}
                    />

                    {/* Pricing */}
                    <PriceSection
                        formData={formData}
                        showAdditionalPrices={showAdditionalPrices}
                        setShowAdditionalPrices={setShowAdditionalPrices}
                        unitPriceOpen={unitPriceOpen}
                        setUnitPriceOpen={setUnitPriceOpen}
                        unitPriceData={unitPriceData}
                        setUnitPriceData={setUnitPriceData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                    />

                    {/* Inventory */}
                    <InventorySection
                        formData={formData}
                        showInventoryDetails={showInventoryDetails}
                        setShowInventoryDetails={setShowInventoryDetails}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        handleSwitchChange={handleSwitchChange}
                    />

                    {/* Shipping */}
                    <ShippingSection
                        formData={formData}
                        showCustomsInfo={showCustomsInfo}
                        setShowCustomsInfo={setShowCustomsInfo}
                        handleChange={handleChange}
                        handleSelectChange={handleSelectChange}
                        handleSwitchChange={handleSwitchChange}
                    />

                    {/* Variants */}
                    <VariantsSection
                        options={options}
                        variants={variants}
                        setVariants={setVariants}
                        isAddingOption={isAddingOption}
                        newOptionName={newOptionName}
                        newOptionValues={newOptionValues}
                        newOptionValueInput={newOptionValueInput}
                        setIsAddingOption={setIsAddingOption}
                        setNewOptionName={setNewOptionName}
                        setNewOptionValues={setNewOptionValues}
                        setNewOptionValueInput={setNewOptionValueInput}
                        handleAddOption={handleAddOptionClick}
                        handleSaveOption={handleSaveOption}
                        handleDeleteOption={removeOption}
                        handleOptionValueAdd={handleOptionValueAdd}
                        handleOptionValueRemove={handleOptionValueRemove}
                        handleVariantClick={setEditingVariant}
                    />

                    {/* SEO Listing */}
                    <SEOListingSection
                        productTitle={formData.name}
                        productDescription={formData.description}
                        seoTitle={formData.seoTitle}
                        seoDescription={formData.seoDescription}
                        urlHandle={formData.urlHandle}
                        onSeoTitleChange={(val) => handleSelectChange('seoTitle', val)}
                        onSeoDescriptionChange={(val) => handleSelectChange('seoDescription', val)}
                        onUrlHandleChange={(val) => handleSelectChange('urlHandle', val)}
                    />
                </div>

                {/* Sidebar - Right Column */}
                <div className="space-y-6">
                    {/* Status */}
                    <StatusCard
                        status={formData.status}
                        onStatusChange={(val) => handleSelectChange('status', val)}
                    />

                    {/* Publishing */}
                    <PublishingCard
                        productName={formData.name}
                        salesChannels={salesChannels}
                        setSalesChannels={setSalesChannels}
                        publishingDialogOpen={publishingDialogOpen}
                        setPublishingDialogOpen={setPublishingDialogOpen}
                        channelSearch={channelSearch}
                        setChannelSearch={setChannelSearch}
                    />

                    {/* Organization */}
                    <OrganizationCard
                        categoryId={formData.categoryId}
                        sortedCategories={categories}
                        formatCategoryName={formatCategoryName}
                        productType={formData.type}
                        setProductType={(type) => handleSelectChange('type', type)}
                        productTypeOpen={productTypeOpen}
                        setProductTypeOpen={setProductTypeOpen}
                        vendorInput={vendorInput}
                        setVendorInput={setVendorInput}
                        collectionsOpen={collectionsOpen}
                        setCollectionsOpen={setCollectionsOpen}
                        collectionsSearch={collectionsSearch}
                        setCollectionsSearch={setCollectionsSearch}
                        selectedCollections={selectedCollections}
                        setSelectedCollections={setSelectedCollections}
                        availableCollections={availableCollections}
                        tagsOpen={tagsOpen}
                        setTagsOpen={setTagsOpen}
                        tagsSearch={tagsSearch}
                        setTagsSearch={setTagsSearch}
                        selectedTags={selectedTags}
                        setSelectedTags={setSelectedTags}
                        availableTags={availableTags}
                        onCategorySelect={(categoryId) => handleSelectChange('categoryId', categoryId)}
                    />
                </div>
            </div>

            {/* Edit Variant Dialog */}
            <EditVariantDialog
                editingVariant={editingVariant}
                setEditingVariant={setEditingVariant}
                handleSaveVariant={handleSaveVariant}
            />
        </div>
    );
}
