import { getAllCategories, getAllVendors } from "@/actions/admin";
import { getSystemSetting } from '@/actions/system-settings';
import { AddProductClient } from "./page-client";

export default async function AddProductPage() {
    const [vendors, categories, aiSetting] = await Promise.all([
        getAllVendors(),
        getAllCategories(),
        getSystemSetting('ai_description_enabled')
    ]);

    const aiEnabled = aiSetting.success && aiSetting.value === 'true';

    return (
        <AddProductClient
            vendors={vendors}
            categories={categories}
            aiEnabled={aiEnabled}
        />
    );
}
