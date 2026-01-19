'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Settings2, Search, Store, CreditCard, Globe, ShoppingBag,
    Smartphone, Instagram, Facebook, ChevronRight, ExternalLink,
    Calendar, MapPin, Check, Info
} from 'lucide-react';
import { SalesChannel } from '../types';
import { cn } from '@/lib/utils';

interface PublishingCardProps {
    productName: string;
    salesChannels: SalesChannel[];
    setSalesChannels: React.Dispatch<React.SetStateAction<SalesChannel[]>>;
    publishingDialogOpen: boolean;
    setPublishingDialogOpen: (open: boolean) => void;
    channelSearch: string;
    setChannelSearch: (search: string) => void;
}

interface Market {
    id: string;
    name: string;
    countries: string[];
    enabled: boolean;
}

const DEFAULT_MARKETS: Market[] = [
    { id: 'primary', name: 'Primary Market', countries: ['Algeria', 'Tunisia', 'Morocco'], enabled: true },
    { id: 'international', name: 'International', countries: ['France', 'USA', 'UK', 'Germany'], enabled: false },
];

export function PublishingCard({
    productName,
    salesChannels,
    setSalesChannels,
    publishingDialogOpen,
    setPublishingDialogOpen,
    channelSearch,
    setChannelSearch
}: PublishingCardProps) {
    const [activeTab, setActiveTab] = useState<'channels' | 'markets'>('channels');
    const [markets, setMarkets] = useState<Market[]>(DEFAULT_MARKETS);
    const [selectedChannels, setSelectedChannels] = useState<Set<string>>(
        new Set(salesChannels.filter(c => c.isActive).map(c => c.id))
    );

    const enabledCount = salesChannels.filter(c => c.isActive).length;
    const enabledMarketsCount = markets.filter(m => m.enabled).length;

    const handleToggleChannel = (channelId: string, isActive: boolean) => {
        setSalesChannels(prev =>
            prev.map(c => c.id === channelId ? { ...c, isActive } : c)
        );
        if (isActive) {
            setSelectedChannels(prev => new Set([...prev, channelId]));
        } else {
            setSelectedChannels(prev => {
                const newSet = new Set(prev);
                newSet.delete(channelId);
                return newSet;
            });
        }
    };

    const handleToggleMarket = (marketId: string, enabled: boolean) => {
        setMarkets(prev =>
            prev.map(m => m.id === marketId ? { ...m, enabled } : m)
        );
    };

    return (
        <>
            <Card className="overflow-hidden">
                <CardHeader className="px-4 py-3 border-b bg-muted/30">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold">Publishing</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                        onClick={() => setPublishingDialogOpen(true)}
                                        type="button"
                                    >
                                        <Settings2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Manage sales channels and markets</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    {/* Sales Channels Summary */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Sales Channels
                            </span>
                            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                                {enabledCount} active
                            </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {salesChannels.filter(c => c.isActive).map((channel) => (
                                <div
                                    key={channel.id}
                                    className="group flex items-center gap-1.5 bg-muted/50 hover:bg-muted px-2.5 py-1.5 rounded-md transition-colors cursor-pointer"
                                    onClick={() => setPublishingDialogOpen(true)}
                                >
                                    {channel.icon && <channel.icon className="h-3.5 w-3.5 text-muted-foreground" />}
                                    <span className="text-xs font-medium">{channel.name}</span>
                                    <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                            {enabledCount === 0 && (
                                <p className="text-xs text-muted-foreground italic">
                                    No channels selected
                                </p>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Markets Summary */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Markets
                            </span>
                            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                                {enabledMarketsCount} active
                            </Badge>
                        </div>
                        <div className="space-y-1.5">
                            {markets.filter(m => m.enabled).slice(0, 2).map((market) => (
                                <div
                                    key={market.id}
                                    className="flex items-center gap-2 text-xs"
                                >
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <span className="font-medium">{market.name}</span>
                                    <span className="text-muted-foreground">
                                        ({market.countries.length} countries)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs h-8"
                        onClick={() => setPublishingDialogOpen(true)}
                    >
                        Manage publishing settings
                        <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                </CardContent>
            </Card>

            {/* Enhanced Publishing Dialog */}
            <Dialog open={publishingDialogOpen} onOpenChange={setPublishingDialogOpen}>
                <DialogContent className="sm:max-w-[800px] p-0 gap-0 max-h-[85vh] overflow-hidden">
                    <DialogHeader className="px-6 py-4 border-b bg-muted/20">
                        <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            Manage publishing for {productName || 'this product'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex min-h-[500px] max-h-[calc(85vh-130px)]">
                        {/* Left Sidebar - Tabs */}
                        <div className="w-56 border-r bg-muted/20 p-3 shrink-0">
                            <div className="space-y-1">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('channels')}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        activeTab === 'channels'
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <Store className="h-4 w-4" />
                                        Sales Channels
                                    </div>
                                    <Badge variant={activeTab === 'channels' ? 'secondary' : 'outline'} className="h-5 px-1.5 text-xs">
                                        {enabledCount}
                                    </Badge>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('markets')}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        activeTab === 'markets'
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Markets
                                    </div>
                                    <Badge variant={activeTab === 'markets' ? 'secondary' : 'outline'} className="h-5 px-1.5 text-xs">
                                        {enabledMarketsCount}
                                    </Badge>
                                </button>
                            </div>

                            <Separator className="my-4" />

                            <div className="px-2">
                                <p className="text-xs text-muted-foreground">
                                    Control where this product appears and who can purchase it.
                                </p>
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            {activeTab === 'channels' && (
                                <div className="space-y-4">
                                    {/* Search */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search channels..."
                                            className="pl-9 h-9"
                                            value={channelSearch}
                                            onChange={(e) => setChannelSearch(e.target.value)}
                                        />
                                    </div>

                                    {/* Select All */}
                                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={salesChannels.every(c => c.isActive)}
                                                onCheckedChange={(checked) => {
                                                    setSalesChannels(prev => prev.map(c => ({ ...c, isActive: !!checked })));
                                                }}
                                            />
                                            <span className="text-sm font-medium">Select all channels</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {salesChannels.length} total
                                        </span>
                                    </div>

                                    {/* Channels List */}
                                    <div className="space-y-2">
                                        {salesChannels
                                            .filter(c => c.name.toLowerCase().includes(channelSearch.toLowerCase()))
                                            .map((channel) => (
                                                <div
                                                    key={channel.id}
                                                    className={cn(
                                                        "flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer",
                                                        channel.isActive
                                                            ? "border-primary/50 bg-primary/5"
                                                            : "border-transparent bg-muted/20 hover:bg-muted/40"
                                                    )}
                                                    onClick={() => handleToggleChannel(channel.id, !channel.isActive)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "h-10 w-10 rounded-lg flex items-center justify-center",
                                                            channel.isActive ? "bg-primary/10" : "bg-muted"
                                                        )}>
                                                            {channel.icon && <channel.icon className={cn(
                                                                "h-5 w-5",
                                                                channel.isActive ? "text-primary" : "text-muted-foreground"
                                                            )} />}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-sm">{channel.name}</span>
                                                                {channel.isActive && (
                                                                    <Badge variant="secondary" className="h-4 text-[10px] px-1">
                                                                        Active
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">
                                                                {channel.id === 'online-store' && 'Your main storefront'}
                                                                {channel.id === 'pos' && 'In-person sales terminal'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Switch
                                                        checked={channel.isActive}
                                                        onCheckedChange={(checked) => handleToggleChannel(channel.id, checked)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                            ))}
                                    </div>

                                    {/* Info Banner */}
                                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg text-blue-900">
                                        <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                        <div className="text-xs">
                                            <p className="font-medium mb-1">Publishing updates</p>
                                            <p className="text-blue-700">
                                                Changes to sales channels take effect immediately after saving.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'markets' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium">Available Markets</h3>
                                        <Button variant="outline" size="sm" className="h-8 text-xs">
                                            Add market
                                        </Button>
                                    </div>

                                    {/* Markets List */}
                                    <div className="space-y-2">
                                        {markets.map((market) => (
                                            <div
                                                key={market.id}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 transition-all",
                                                    market.enabled
                                                        ? "border-primary/50 bg-primary/5"
                                                        : "border-transparent bg-muted/20"
                                                )}
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className={cn(
                                                            "h-4 w-4",
                                                            market.enabled ? "text-primary" : "text-muted-foreground"
                                                        )} />
                                                        <span className="font-medium">{market.name}</span>
                                                        {market.id === 'primary' && (
                                                            <Badge variant="secondary" className="text-[10px]">Primary</Badge>
                                                        )}
                                                    </div>
                                                    <Switch
                                                        checked={market.enabled}
                                                        onCheckedChange={(checked) => handleToggleMarket(market.id, checked)}
                                                    />
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {market.countries.map((country) => (
                                                        <Badge key={country} variant="outline" className="text-xs font-normal">
                                                            {country}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-4 border-t bg-muted/20">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Check className="h-3 w-3 text-emerald-500" />
                                <span>
                                    {enabledCount} channels, {enabledMarketsCount} markets selected
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setPublishingDialogOpen(false)}>Cancel</Button>
                                <Button onClick={() => setPublishingDialogOpen(false)}>
                                    Save changes
                                </Button>
                            </div>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
