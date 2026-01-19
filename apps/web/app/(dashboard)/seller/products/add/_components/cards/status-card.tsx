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

    const currentStatus = status === 'ACTIVE' ? 'active' : status === 'DRAFT' ? 'draft' : 'archived';
    const currentOption = STATUS_OPTIONS.find(opt => opt.value === currentStatus) || STATUS_OPTIONS[1];

    const handleStatusChange = (value: ProductStatus) => {
        const mappedValue = value === 'active' ? 'ACTIVE' : value === 'draft' ? 'DRAFT' : 'ARCHIVED';
        onStatusChange(mappedValue);
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="px-4 py-3 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">Status</CardTitle>
                    <div className={cn(
                        "flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full",
                        currentStatus === 'active' && "bg-emerald-50 text-emerald-700",
                        currentStatus === 'draft' && "bg-amber-50 text-amber-700",
                        currentStatus === 'archived' && "bg-muted text-muted-foreground"
                    )}>
                        <currentOption.icon className="h-3 w-3" />
                        {currentOption.label}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <RadioGroup
                    value={currentStatus}
                    onValueChange={(value) => handleStatusChange(value as ProductStatus)}
                    className="space-y-3"
                >
                    {STATUS_OPTIONS.map((option) => (
                        <div
                            key={option.value}
                            className={cn(
                                "relative flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/30",
                                currentStatus === option.value
                                    ? "border-primary bg-primary/5"
                                    : "border-transparent bg-muted/20"
                            )}
                            onClick={() => handleStatusChange(option.value)}
                        >
                            <RadioGroupItem
                                value={option.value}
                                id={option.value}
                                className="mt-0.5 shrink-0"
                            />
                            <div className="ml-3 flex-1 min-w-0">
                                <Label
                                    htmlFor={option.value}
                                    className="flex items-center gap-2 font-medium text-sm cursor-pointer"
                                >
                                    <option.icon className={cn("h-4 w-4", option.iconColor)} />
                                    {option.label}
                                </Label>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                    {option.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </RadioGroup>

                {/* Schedule Publishing */}
                {currentStatus === 'draft' && (
                    <div className="mt-4 pt-4 border-t">
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
