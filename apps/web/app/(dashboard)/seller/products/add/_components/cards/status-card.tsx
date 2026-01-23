'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { CalendarIcon, Clock, CircleCheck, FileEdit, EyeOff, ChevronDown } from 'lucide-react';

interface StatusCardProps {
    status: string;
    onStatusChange: (value: string) => void;
}

type ProductStatus = 'active' | 'draft' | 'archived';

interface StatusOption {
    value: ProductStatus;
    label: string;
    description: string;
    icon: any;
    iconColor: string;
}

const STATUS_OPTIONS: StatusOption[] = [
    {
        value: 'active',
        label: 'Active',
        description: 'This product will be available for purchase on all selected sales channels',
        icon: CircleCheck,
        iconColor: 'text-emerald-500'
    },
    {
        value: 'draft',
        label: 'Draft',
        description: 'This product is hidden from all sales channels',
        icon: FileEdit,
        iconColor: 'text-amber-500'
    },
    {
        value: 'archived',
        label: 'Archived',
        description: 'This product is hidden and no longer available for sale',
        icon: EyeOff,
        iconColor: 'text-muted-foreground'
    }
];

export function StatusCard({ status, onStatusChange }: StatusCardProps) {
    const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
    const [isScheduling, setIsScheduling] = useState(false);

    // Map internal status to UI value
    const getUiStatus = (s: string) => {
        if (s === 'PUBLISHED' || s === 'ACTIVE') return 'active';
        if (s === 'DRAFT') return 'draft';
        if (s === 'SUSPENDED' || s === 'ARCHIVED') return 'unlisted';
        return 'draft'; // Default
    };

    const currentUiStatus = getUiStatus(status);

    const handleStatusChange = (value: string) => {
        let mappedValue = 'DRAFT';
        if (value === 'active') mappedValue = 'PUBLISHED';
        if (value === 'draft') mappedValue = 'DRAFT';
        if (value === 'unlisted') mappedValue = 'SUSPENDED';
        onStatusChange(mappedValue);
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="px-4 py-3 border-b bg-muted/30">
                <CardTitle className="text-sm font-semibold">Status</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                    <Select
                        name="status"
                        value={currentUiStatus}
                        onValueChange={handleStatusChange}
                    >
                        <SelectTrigger className="w-full h-auto py-2">
                            <div className="flex items-start gap-2 text-left">
                                <SelectValue placeholder="Select status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active" className="py-2">
                                <div className="font-medium">Active</div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Sell via selected sales channels and markets
                                </p>
                            </SelectItem>
                            <SelectItem value="draft" className="py-2">
                                <div className="font-medium">Draft</div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Not visible on selected sales channels or markets
                                </p>
                            </SelectItem>
                            <SelectItem value="unlisted" className="py-2">
                                <div className="font-medium">Unlisted</div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Accessible only by direct link
                                </p>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Schedule Publishing */}
                {currentUiStatus === 'draft' && (
                    <div className="pt-2 border-t">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Schedule publishing</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => setIsScheduling(!isScheduling)}
                            >
                                {isScheduling ? 'Cancel' : 'Set date'}
                            </Button>
                        </div>

                        {isScheduling && (
                            <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal h-9",
                                                !scheduledDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {scheduledDate ? format(scheduledDate, "PPP") : "Select publish date"}
                                            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={scheduledDate}
                                            onSelect={setScheduledDate}
                                            initialFocus
                                            disabled={(date: Date) => date < new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {scheduledDate && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <CircleCheck className="h-3 w-3 text-emerald-500" />
                                        Will be published on {format(scheduledDate, "MMMM do, yyyy")}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
