'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { getSystemSetting, updateSystemSetting } from '@/actions/system-settings';
import { Loader2 } from 'lucide-react';

export default function AISettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const [enabledRes, apiKeyRes] = await Promise.all([
                    getSystemSetting('ai_description_enabled'),
                    getSystemSetting('ai_api_key')
                ]);

                if (enabledRes.success) {
                    setEnabled(enabledRes.value === 'true');
                }
                if (apiKeyRes.success) {
                    setApiKey(apiKeyRes.value || '');
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
                toast.error('Failed to load settings');
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const [enabledRes, apiKeyRes] = await Promise.all([
                updateSystemSetting('ai_description_enabled', String(enabled)),
                updateSystemSetting('ai_api_key', apiKey)
            ]);

            if (enabledRes.success && apiKeyRes.success) {
                toast.success('Settings saved successfully');
            } else {
                throw new Error('Failed to save some settings');
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">AI Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Configure AI features for your marketplace.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Product Description Generation</CardTitle>
                    <CardDescription>
                        Enable AI-powered product descriptions for sellers.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="ai-enabled" className="flex flex-col space-y-1">
                            <span>Enable AI Descriptions</span>
                            <span className="font-normal text-xs text-muted-foreground">
                                Allow sellers to generate product descriptions using AI.
                            </span>
                        </Label>
                        <Switch
                            id="ai-enabled"
                            checked={enabled}
                            onCheckedChange={setEnabled}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="api-key">OpenAI API Key</Label>
                        <Input
                            id="api-key"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-..."
                        />
                        <p className="text-[0.8rem] text-muted-foreground">
                            Your OpenAI API key. This is stored securely and used to generate descriptions.
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
