export default function ThemeSettingsPage() {
    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Theme Settings</h3>
                            <p className="dashboard-card-description">
                                Customize platform theme and branding
                            </p>
                        </div>
                        <div className="mt-6">
                            <p className="text-muted-foreground">Theme customization coming soon...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
