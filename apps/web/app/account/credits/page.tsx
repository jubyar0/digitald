'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import LandingNavbar from "@/components/landing/navbar"
import FooterSection from "@/components/landing/footer"
import { ChevronDown, ChevronUp, Loader2, CreditCard, ArrowUpRight, ArrowDownRight, Gift, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getUserWallet, getWalletTransactions, redeemGiftCard } from '@/actions/user-credits'

// FAQ items
const faqItems = [
    {
        id: 1,
        question: "What can gift cards be used on?",
        answer: "Gift cards and credit can be used to purchase eligible items on our marketplace. This includes digital products, 3D models, textures, and more from sellers around the world."
    },
    {
        id: 2,
        question: "How can I check my balance?",
        answer: "Your current balance is displayed at the top of this page. It updates automatically when you redeem a gift card or make a purchase."
    },
    {
        id: 3,
        question: "What if my order total is less than the amount of my gift card?",
        answer: "If your order total is less than your gift card balance, the remaining balance will stay in your account and can be used for future purchases."
    },
    {
        id: 4,
        question: "What is the difference between a gift card and credit?",
        answer: "Gift cards are purchased and can be given to others, while credit is added to your account through promotions, refunds, or other programs. Both can be used the same way at checkout."
    },
]

// Transaction type colors and icons
const transactionConfig: Record<string, { color: string; icon: typeof ArrowUpRight; label: string }> = {
    DEPOSIT: { color: 'text-green-600', icon: ArrowUpRight, label: 'Deposit' },
    GIFT_CARD_REDEMPTION: { color: 'text-green-600', icon: Gift, label: 'Gift Card' },
    CREDIT_ADJUSTMENT: { color: 'text-blue-600', icon: RefreshCw, label: 'Adjustment' },
    REFUND: { color: 'text-green-600', icon: ArrowUpRight, label: 'Refund' },
    PURCHASE: { color: 'text-red-600', icon: ArrowDownRight, label: 'Purchase' },
    WITHDRAWAL: { color: 'text-red-600', icon: ArrowDownRight, label: 'Withdrawal' },
}

interface Transaction {
    id: string
    amount: number
    type: string
    status: string
    reference: string | null
    createdAt: string
}

export default function CreditsPage() {
    const { data: session, status } = useSession()
    const [giftCardCode, setGiftCardCode] = useState('')
    const [isRedeeming, setIsRedeeming] = useState(false)
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

    // Wallet state
    const [balance, setBalance] = useState(0)
    const [currency, setCurrency] = useState('USD')
    const [isLoadingWallet, setIsLoadingWallet] = useState(true)

    // Transactions state
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [transactionsPage, setTransactionsPage] = useState(1)
    const [totalTransactions, setTotalTransactions] = useState(0)
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(true)

    // Feedback state
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    // Fetch wallet data
    useEffect(() => {
        if (session?.user) {
            loadWallet()
            loadTransactions(1)
        } else if (status !== 'loading') {
            setIsLoadingWallet(false)
            setIsLoadingTransactions(false)
        }
    }, [session, status])

    const loadWallet = async () => {
        setIsLoadingWallet(true)
        try {
            const result = await getUserWallet()
            if (result.success && result.data) {
                setBalance(result.data.balance)
                setCurrency(result.data.currency)
            }
        } catch (error) {
            console.error('Error loading wallet:', error)
        } finally {
            setIsLoadingWallet(false)
        }
    }

    const loadTransactions = async (page: number) => {
        setIsLoadingTransactions(true)
        try {
            const result = await getWalletTransactions(page, 5)
            if (result.success && result.data) {
                setTransactions(result.data.transactions)
                setTotalTransactions(result.data.pagination.total)
                setTransactionsPage(page)
            }
        } catch (error) {
            console.error('Error loading transactions:', error)
        } finally {
            setIsLoadingTransactions(false)
        }
    }

    const handleRedeemGiftCard = async () => {
        if (!giftCardCode.trim()) return

        setIsRedeeming(true)
        setMessage(null)

        try {
            const result = await redeemGiftCard(giftCardCode)

            if (result.success && result.data) {
                setMessage({
                    type: 'success',
                    text: result.data.message || `Successfully redeemed ${result.data.currency} ${result.data.amountRedeemed.toFixed(2)}!`
                })
                setBalance(result.data.newBalance)
                setGiftCardCode('')
                // Refresh transactions
                loadTransactions(1)
            } else {
                setMessage({
                    type: 'error',
                    text: result.error || 'Failed to redeem gift card'
                })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while redeeming the gift card' })
        } finally {
            setIsRedeeming(false)
        }
    }

    const toggleFaq = (id: number) => {
        setExpandedFaq(expandedFaq === id ? null : id)
    }

    const formatCurrency = (amount: number) => {
        const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency
        return `${symbol}${Math.abs(amount).toFixed(2)}`
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Navbar */}
            <LandingNavbar />

            {/* Spacer for fixed navbar */}
            <div className="h-[140px]" />

            {/* Main Content */}
            <main className="flex-1">
                {/* Header Section */}
                <div className="text-center py-8 border-b border-gray-200">
                    <h1 className="text-3xl font-light text-gray-900 mb-2">
                        Your gift cards & credit
                    </h1>
                    <Link
                        href="/gift-cards"
                        className="text-sm text-gray-600 underline hover:text-gray-900"
                    >
                        Send a gift card
                    </Link>
                </div>

                {/* Balance Section */}
                <div className="container mx-auto px-4 lg:px-6 py-6">
                    <div className="flex items-center justify-between max-w-2xl mx-auto">
                        <span className="text-base font-semibold text-gray-900">Total balance</span>
                        {isLoadingWallet ? (
                            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                        ) : (
                            <span className="text-xl font-medium text-gray-900">
                                {formatCurrency(balance)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Redeem Gift Card Section */}
                <div className="bg-[#D4E9E2] py-8">
                    <div className="container mx-auto px-4 lg:px-6">
                        <div className="max-w-lg mx-auto">
                            <h2 className="text-base font-semibold text-gray-900 mb-4">
                                Redeem your gift card
                            </h2>

                            {/* Feedback Message */}
                            {message && (
                                <div className={cn(
                                    "flex items-center gap-2 p-3 rounded-lg mb-4",
                                    message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                )}>
                                    {message.type === 'success' ? (
                                        <CheckCircle className="h-4 w-4 shrink-0" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                    )}
                                    <span className="text-sm">{message.text}</span>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter your code (e.g., ABCD-1234-EFGH-5678)"
                                    value={giftCardCode}
                                    onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                                    className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 bg-white font-mono"
                                    disabled={!session}
                                />
                                <button
                                    onClick={handleRedeemGiftCard}
                                    disabled={isRedeeming || !giftCardCode.trim() || !session}
                                    className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isRedeeming ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        'Redeem'
                                    )}
                                </button>
                            </div>
                            {!session && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Please <Link href="/login" className="underline hover:text-gray-900">sign in</Link> to redeem a gift card.
                                </p>
                            )}
                            <Link
                                href="/gift-cards/policy"
                                className="text-sm text-gray-600 underline hover:text-gray-900 mt-3 inline-block"
                            >
                                Gift Cards Policy
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Transaction History Section */}
                {session && (
                    <div className="container mx-auto px-4 lg:px-6 py-8">
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Transaction History
                            </h2>

                            {isLoadingTransactions ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                </div>
                            ) : transactions.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                    <p>No transactions yet</p>
                                    <p className="text-sm mt-1">Redeem a gift card or make a purchase to see your history.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {transactions.map((tx) => {
                                        const config = transactionConfig[tx.type] || transactionConfig.DEPOSIT
                                        const Icon = config.icon
                                        const isPositive = tx.amount > 0

                                        return (
                                            <div
                                                key={tx.id}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                                        isPositive ? "bg-green-100" : "bg-red-100"
                                                    )}>
                                                        <Icon className={cn(
                                                            "h-5 w-5",
                                                            isPositive ? "text-green-600" : "text-red-600"
                                                        )} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {config.label}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {tx.reference || formatDate(tx.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={cn(
                                                        "text-sm font-semibold",
                                                        isPositive ? "text-green-600" : "text-red-600"
                                                    )}>
                                                        {isPositive ? '+' : '-'}{formatCurrency(tx.amount)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatDate(tx.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalTransactions > 5 && (
                                <div className="flex justify-center gap-2 mt-4">
                                    <button
                                        onClick={() => loadTransactions(transactionsPage - 1)}
                                        disabled={transactionsPage === 1 || isLoadingTransactions}
                                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => loadTransactions(transactionsPage + 1)}
                                        disabled={transactionsPage * 5 >= totalTransactions || isLoadingTransactions}
                                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* FAQ Section */}
                <div className="container mx-auto px-4 lg:px-6 py-12 border-t border-gray-200">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Left Column - Title */}
                            <div>
                                <h2 className="text-2xl font-light text-gray-900 mb-2">
                                    Frequently asked questions
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Find even more answers in our{' '}
                                    <Link href="/help" className="underline hover:text-gray-900">
                                        Help Center
                                    </Link>
                                </p>
                            </div>

                            {/* Right Column - FAQ Items */}
                            <div className="space-y-0">
                                {faqItems.map((item) => (
                                    <div key={item.id} className="border-b border-gray-200">
                                        <button
                                            onClick={() => toggleFaq(item.id)}
                                            className="w-full flex items-center justify-between py-4 text-left group"
                                        >
                                            <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                                {item.question}
                                            </span>
                                            {expandedFaq === item.id ? (
                                                <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                                            )}
                                        </button>
                                        {expandedFaq === item.id && (
                                            <div className="pb-4">
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <FooterSection />
        </div>
    )
}
