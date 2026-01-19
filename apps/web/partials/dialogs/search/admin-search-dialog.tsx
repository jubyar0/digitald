'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Loader2,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchResultItem } from '@/components/search/search-result-item';
import { searchAll } from '@/actions/admin-search';
import { SearchResults } from '@/types/search';
import { useDebounce } from '@/hooks/use-debounce';

export function AdminSearchDialog({ trigger }: { trigger: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<SearchResults | null>(null);
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        const performSearch = async () => {
            if (!debouncedQuery || debouncedQuery.length < 2) {
                setResults(null);
                return;
            }

            setIsLoading(true);
            try {
                const data = await searchAll(debouncedQuery);
                setResults(data);
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        performSearch();
    }, [debouncedQuery]);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setQuery('');
            setResults(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="p-0 gap-0 lg:max-w-[700px] top-[10%] translate-y-0 [&_[data-slot=dialog-close]]:hidden">
                <DialogHeader className="p-4 border-b space-y-0">
                    <DialogTitle className="sr-only">Search</DialogTitle>
                    <div className="flex items-center gap-3">
                        <Search className="size-5 text-muted-foreground shrink-0" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search users, vendors, products, orders..."
                            className="border-0 shadow-none focus-visible:ring-0 px-0 h-auto text-lg bg-transparent"
                            autoFocus
                        />
                        {isLoading ? (
                            <Loader2 className="size-5 animate-spin text-muted-foreground shrink-0" />
                        ) : query && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 shrink-0"
                                onClick={() => setQuery('')}
                            >
                                <X className="size-4" />
                            </Button>
                        )}
                        <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded border">
                            <span className="font-mono">ESC</span> to close
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-0">
                    <Tabs defaultValue="all" className="w-full">
                        <div className="px-4 pt-2 border-b">
                            <TabsList className="w-full justify-start bg-transparent p-0 h-auto gap-4 pb-2">
                                <TabsTrigger
                                    value="all"
                                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-2 h-auto"
                                >
                                    All Results
                                </TabsTrigger>
                                <TabsTrigger
                                    value="users"
                                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-2 h-auto"
                                    disabled={!results?.users.length}
                                >
                                    Users ({results?.users.length || 0})
                                </TabsTrigger>
                                <TabsTrigger
                                    value="vendors"
                                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-2 h-auto"
                                    disabled={!results?.vendors.length}
                                >
                                    Vendors ({results?.vendors.length || 0})
                                </TabsTrigger>
                                <TabsTrigger
                                    value="products"
                                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-2 h-auto"
                                    disabled={!results?.products.length}
                                >
                                    Products ({results?.products.length || 0})
                                </TabsTrigger>
                                <TabsTrigger
                                    value="orders"
                                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-2 h-auto"
                                    disabled={!results?.orders.length}
                                >
                                    Orders ({results?.orders.length || 0})
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <ScrollArea className="h-[500px]">
                            <div className="p-2">
                                {!query ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                        <Search className="size-12 mb-4 opacity-20" />
                                        <p className="text-sm">Start typing to search across the admin panel</p>
                                    </div>
                                ) : !results?.all.length && !isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                        <p className="text-sm">No results found for "{query}"</p>
                                    </div>
                                ) : (
                                    <>
                                        <TabsContent value="all" className="mt-0 space-y-1">
                                            {results?.all.map(result => (
                                                <SearchResultItem
                                                    key={`${result.type}-${result.id}`}
                                                    result={result}
                                                    onClick={() => setIsOpen(false)}
                                                />
                                            ))}
                                        </TabsContent>
                                        <TabsContent value="users" className="mt-0 space-y-1">
                                            {results?.users.map(result => (
                                                <SearchResultItem
                                                    key={result.id}
                                                    result={result}
                                                    onClick={() => setIsOpen(false)}
                                                />
                                            ))}
                                        </TabsContent>
                                        <TabsContent value="vendors" className="mt-0 space-y-1">
                                            {results?.vendors.map(result => (
                                                <SearchResultItem
                                                    key={result.id}
                                                    result={result}
                                                    onClick={() => setIsOpen(false)}
                                                />
                                            ))}
                                        </TabsContent>
                                        <TabsContent value="products" className="mt-0 space-y-1">
                                            {results?.products.map(result => (
                                                <SearchResultItem
                                                    key={result.id}
                                                    result={result}
                                                    onClick={() => setIsOpen(false)}
                                                />
                                            ))}
                                        </TabsContent>
                                        <TabsContent value="orders" className="mt-0 space-y-1">
                                            {results?.orders.map(result => (
                                                <SearchResultItem
                                                    key={result.id}
                                                    result={result}
                                                    onClick={() => setIsOpen(false)}
                                                />
                                            ))}
                                        </TabsContent>
                                    </>
                                )}
                            </div>
                        </ScrollArea>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
