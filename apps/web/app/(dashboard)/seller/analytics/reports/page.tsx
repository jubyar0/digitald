'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, FileText, ChevronDown, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// Site name - replace dIGO with this
const SITE_NAME = "DigitalD"

interface Report {
    id: string
    name: string
    category: 'Acquisition' | 'Behavior' | 'Customers' | 'Finances'
    lastViewed?: string
    createdBy: string
}

const REPORTS: Report[] = [
    // Acquisition
    { id: '1', name: 'Sessions by location', category: 'Acquisition', lastViewed: 'Jan 12, 2026', createdBy: SITE_NAME },
    { id: '2', name: 'Sessions by referrer', category: 'Acquisition', createdBy: SITE_NAME },
    { id: '3', name: 'Sessions by social referrer', category: 'Acquisition', createdBy: SITE_NAME },
    { id: '4', name: 'Sessions over time', category: 'Acquisition', createdBy: SITE_NAME },
    { id: '5', name: 'Visitors over time', category: 'Acquisition', createdBy: SITE_NAME },
    { id: '6', name: 'Visitors right now', category: 'Acquisition', createdBy: SITE_NAME },
    { id: '7', name: 'Bounce rate over time', category: 'Acquisition', createdBy: SITE_NAME },

    // Behavior
    { id: '8', name: 'Checkout conversion rate over time', category: 'Behavior', createdBy: SITE_NAME },
    { id: '9', name: 'Conversion rate breakdown', category: 'Behavior', createdBy: SITE_NAME },
    { id: '10', name: 'Conversion rate over time', category: 'Behavior', createdBy: SITE_NAME },
    { id: '11', name: 'Customer behavior', category: 'Behavior', createdBy: SITE_NAME },
    { id: '12', name: 'Product recommendation conversions over time', category: 'Behavior', createdBy: SITE_NAME },
    { id: '13', name: 'Product recommendations with low engagement', category: 'Behavior', createdBy: SITE_NAME },
    { id: '14', name: 'Search conversions over time', category: 'Behavior', createdBy: SITE_NAME },
    { id: '15', name: 'Searches by search query', category: 'Behavior', createdBy: SITE_NAME },
    { id: '16', name: 'Searches with no clicks', category: 'Behavior', createdBy: SITE_NAME },
    { id: '17', name: 'Searches with no results', category: 'Behavior', createdBy: SITE_NAME },
    { id: '18', name: 'Sessions by device type', category: 'Behavior', createdBy: SITE_NAME },
    { id: '19', name: 'Sessions by landing page', category: 'Behavior', createdBy: SITE_NAME },
    { id: '20', name: 'Shop Campaign ROAS', category: 'Behavior', createdBy: SITE_NAME },

    // Customers
    { id: '21', name: 'Customer cohort analysis', category: 'Customers', createdBy: SITE_NAME },
    { id: '22', name: 'Customers by location', category: 'Customers', createdBy: SITE_NAME },
    { id: '23', name: 'New customer sales over time', category: 'Customers', createdBy: SITE_NAME },
    { id: '24', name: 'New customers over time', category: 'Customers', createdBy: SITE_NAME },
    { id: '25', name: 'New vs returning customers', category: 'Customers', createdBy: SITE_NAME },
    { id: '26', name: 'One-time customers', category: 'Customers', createdBy: SITE_NAME },
    { id: '27', name: 'Predicted spend tiers', category: 'Customers', createdBy: SITE_NAME },
    { id: '28', name: 'Returning customer rate over time', category: 'Customers', createdBy: SITE_NAME },
    { id: '29', name: 'Returning customers', category: 'Customers', createdBy: SITE_NAME },
    { id: '30', name: 'RFM customer analysis', category: 'Customers', createdBy: SITE_NAME },
    { id: '31', name: 'RFM customer list', category: 'Customers', createdBy: SITE_NAME },

    // Finances
    { id: '32', name: 'Cost of goods sold by order', category: 'Finances', createdBy: SITE_NAME },
    { id: '33', name: 'Discounts by order', category: 'Finances', createdBy: SITE_NAME },
    { id: '34', name: 'Finance Summary', category: 'Finances', createdBy: SITE_NAME },
    { id: '35', name: 'Gross payments from Payments', category: 'Finances', createdBy: SITE_NAME },
    { id: '36', name: 'Gross profit breakdown', category: 'Finances', createdBy: SITE_NAME },
    { id: '37', name: 'Gross profit by order', category: 'Finances', createdBy: SITE_NAME },
    { id: '38', name: 'Gross sales by order', category: 'Finances', createdBy: SITE_NAME },
    { id: '39', name: 'Net payments by gateway', category: 'Finances', createdBy: SITE_NAME },
    { id: '40', name: 'Net payments by method', category: 'Finances', createdBy: SITE_NAME },
    { id: '41', name: 'Net payments by order', category: 'Finances', createdBy: SITE_NAME },
    { id: '42', name: 'Net payments over time', category: 'Finances', createdBy: SITE_NAME },
    { id: '43', name: 'Net sales by order', category: 'Finances', createdBy: SITE_NAME },
    { id: '44', name: 'Net sales from gift cards', category: 'Finances', createdBy: SITE_NAME },
    { id: '45', name: 'Net sales with cost by order', category: 'Finances', createdBy: SITE_NAME },
    { id: '46', name: 'Net sales without cost by order', category: 'Finances', createdBy: SITE_NAME },
    { id: '47', name: 'Outstanding gift card balance', category: 'Finances', createdBy: SITE_NAME },
    { id: '48', name: 'Outstanding store credit balance', category: 'Finances', createdBy: SITE_NAME },
    { id: '49', name: 'Payments by gateway summary', category: 'Finances', createdBy: SITE_NAME },
]

export default function ReportsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedCreatedBy, setSelectedCreatedBy] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 50

    const filteredReports = REPORTS.filter(report => {
        const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = !selectedCategory || report.category === selectedCategory
        const matchesCreatedBy = !selectedCreatedBy || report.createdBy === selectedCreatedBy
        return matchesSearch && matchesCategory && matchesCreatedBy
    })

    const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage)

    const categories = ['Acquisition', 'Behavior', 'Customers', 'Finances']

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <div className="max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="border-b px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            <h1 className="text-xl font-semibold">Reports</h1>
                        </div>
                        <Button size="sm" className="bg-zinc-800 text-white hover:bg-zinc-700 gap-1">
                            <Plus className="h-4 w-4" />
                            New exploration
                        </Button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="border-b px-6 py-3">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="reportsSearch"
                                name="reportsSearch"
                                placeholder="Search reports"
                                className="pl-9 h-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 gap-1 font-normal">
                                    Created by
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={() => setSelectedCreatedBy(null)}>
                                    All
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSelectedCreatedBy(SITE_NAME)}>
                                    {SITE_NAME}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 gap-1 font-normal">
                                    Category
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                                    All categories
                                </DropdownMenuItem>
                                {categories.map(cat => (
                                    <DropdownMenuItem key={cat} onClick={() => setSelectedCategory(cat)}>
                                        {cat}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 gap-1 font-normal">
                                    Includes
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem>All fields</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="ml-auto flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-9 gap-1 font-normal">
                                A-Z
                                <ArrowUpDown className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[400px]">Name</TableHead>
                                <TableHead className="w-[150px]">Category</TableHead>
                                <TableHead className="w-[150px]">
                                    <div className="flex items-center gap-1">
                                        Last viewed
                                        <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </TableHead>
                                <TableHead className="w-[150px]">
                                    <div className="flex items-center gap-1">
                                        Created by
                                        <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedReports.map((report) => (
                                <TableRow key={report.id} className="cursor-pointer">
                                    <TableCell className="font-medium">{report.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{report.category}</TableCell>
                                    <TableCell className="text-muted-foreground">{report.lastViewed || '—'}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 w-5 rounded bg-emerald-500 flex items-center justify-center">
                                                <span className="text-white text-xs font-medium">
                                                    {SITE_NAME.charAt(0)}
                                                </span>
                                            </div>
                                            <span className="text-muted-foreground">{report.createdBy}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                            <FileText className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="border-t px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredReports.length)}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t px-6 py-4 text-center">
                    <span className="text-sm text-muted-foreground">
                        Learn more about the{' '}
                        <a href="#" className="text-blue-600 hover:underline">
                            new reporting experience
                        </a>
                    </span>
                </div>
            </div>
        </div>
    )
}
