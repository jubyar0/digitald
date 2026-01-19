export type SearchEntityType =
    | 'USER'
    | 'VENDOR'
    | 'PRODUCT'
    | 'ORDER'
    | 'TICKET'

export interface SearchResult {
    id: string
    type: SearchEntityType
    title: string
    subtitle: string
    metadata?: Record<string, any>
    url: string
    icon?: string
    badge?: {
        text: string
        variant: 'default' | 'success' | 'destructive' | 'warning'
    }
}

export interface SearchResults {
    all: SearchResult[]
    users: SearchResult[]
    vendors: SearchResult[]
    products: SearchResult[]
    orders: SearchResult[]
    tickets: SearchResult[]
}
