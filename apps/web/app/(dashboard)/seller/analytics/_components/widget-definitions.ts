// Widget type definitions and constants
// Extracted from draggable-dashboard.tsx for better code splitting

export type WidgetId = string

export interface DashboardItem {
    id: WidgetId
    colSpan: string
}

export interface WidgetDefinition {
    id: WidgetId
    title: string
    category: string
    defaultColSpan: string
}

export const AVAILABLE_WIDGETS: WidgetDefinition[] = [
    { id: 'gross_sales', title: 'Gross sales', category: 'Sales', defaultColSpan: 'col-span-1' },
    { id: 'net_sales', title: 'Net sales', category: 'Sales', defaultColSpan: 'col-span-1' },
    { id: 'orders', title: 'Orders', category: 'Sales', defaultColSpan: 'col-span-1' },
    { id: 'avg_order_value', title: 'Average order value', category: 'Sales', defaultColSpan: 'col-span-1' },
    { id: 'returns', title: 'Returns', category: 'Sales', defaultColSpan: 'col-span-1' },
    { id: 'discounts', title: 'Discounts', category: 'Sales', defaultColSpan: 'col-span-1' },
    { id: 'sales_over_time', title: 'Total sales over time', category: 'Sales', defaultColSpan: 'col-span-1 md:col-span-2' },
    { id: 'sales_breakdown', title: 'Total sales breakdown', category: 'Sales', defaultColSpan: 'col-span-1' },
    { id: 'sales_by_channel', title: 'Sales by channel', category: 'Sales', defaultColSpan: 'col-span-1' },
    { id: 'sales_by_product', title: 'Sales by product', category: 'Sales', defaultColSpan: 'col-span-1' },
    { id: 'sessions_over_time', title: 'Sessions over time', category: 'Acquisition', defaultColSpan: 'col-span-1' },
    { id: 'sessions_by_referrer', title: 'Sessions by referrer', category: 'Acquisition', defaultColSpan: 'col-span-1' },
    { id: 'sessions_by_location', title: 'Sessions by location', category: 'Acquisition', defaultColSpan: 'col-span-1' },
    { id: 'device_sessions', title: 'Sessions by device', category: 'Acquisition', defaultColSpan: 'col-span-1' },
    { id: 'social_sessions', title: 'Sessions by social', category: 'Acquisition', defaultColSpan: 'col-span-1' },
    { id: 'returning_rate', title: 'Returning customer rate', category: 'Customers', defaultColSpan: 'col-span-1' },
    { id: 'cohort_analysis', title: 'Cohort analysis', category: 'Customers', defaultColSpan: 'col-span-1 md:col-span-2' },
    { id: 'orders_fulfilled', title: 'Orders fulfilled', category: 'Customers', defaultColSpan: 'col-span-1' },
    { id: 'conversion_rate', title: 'Conversion rate', category: 'Behavior', defaultColSpan: 'col-span-1' },
    { id: 'conversion_breakdown', title: 'Conversion funnel', category: 'Behavior', defaultColSpan: 'col-span-1' },
    { id: 'landing_page', title: 'Sessions by landing page', category: 'Behavior', defaultColSpan: 'col-span-1' },
]

export const CURRENCIES = [
    { code: 'DZD', name: 'Algerian Dinar', symbol: 'DZD' },
    { code: 'AED', name: 'United Arab Emirates Dirham', symbol: 'AED' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
]

export const DATE_PRESETS = [
    'Today', 'Yesterday', 'Last 30 minutes', 'Last 12 hours',
    'Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 365 days',
    'Last 12 months', 'Last week', 'Last month'
]

export const COMPARISON_PRESETS = [
    'No comparison', 'Yesterday', 'Previous week', 'Previous month',
    'Previous quarter', 'Previous year', 'Previous year (match day of week)',
    'Black Friday Cyber Monday'
]

export const DEFAULT_DASHBOARD_ITEMS: DashboardItem[] = [
    { id: 'gross_sales', colSpan: 'col-span-1' },
    { id: 'returning_rate', colSpan: 'col-span-1' },
    { id: 'orders_fulfilled', colSpan: 'col-span-1' },
    { id: 'orders', colSpan: 'col-span-1' },
    { id: 'sales_over_time', colSpan: 'col-span-1 md:col-span-2' },
    { id: 'sales_breakdown', colSpan: 'col-span-1' },
    { id: 'sales_by_channel', colSpan: 'col-span-1' },
    { id: 'avg_order_value', colSpan: 'col-span-1' },
    { id: 'sales_by_product', colSpan: 'col-span-1' },
    { id: 'sessions_over_time', colSpan: 'col-span-1' },
    { id: 'conversion_rate', colSpan: 'col-span-1' },
    { id: 'conversion_breakdown', colSpan: 'col-span-1' },
    { id: 'device_sessions', colSpan: 'col-span-1' },
    { id: 'sessions_by_location', colSpan: 'col-span-1' },
    { id: 'cohort_analysis', colSpan: 'col-span-1 md:col-span-2' },
    { id: 'landing_page', colSpan: 'col-span-1' },
]
