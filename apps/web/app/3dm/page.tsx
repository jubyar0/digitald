import { getThemeSettings } from "@/actions/admin";
import { ThreeDMPageClient } from "./page-client";

export default async function ThreeDMPage() {
    const settings = await getThemeSettings();

    return <ThreeDMPageClient footerSettings={settings.data} />;
}
