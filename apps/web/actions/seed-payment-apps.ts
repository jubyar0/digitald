'use server'

import { prisma } from "@/lib/db"

const paymentApps = [
    // Card Payment Providers
    {
        name: 'dIGO Payments',
        slug: 'digo-payments',
        shortDescription: 'Accept all major credit cards with competitive rates',
        description: `dIGO Payments is the primary payment solution for your store, powered by Stripe. Accept Visa, Mastercard, American Express, and Discover cards with industry-leading security.

**Features:**
- 2.9% + $0.30 per transaction
- Automatic fraud protection
- PCI DSS compliant
- Real-time transaction monitoring`,
        icon: '/apps/digo-payments.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'dIGO Platform',
    },
    {
        name: 'Stripe',
        slug: 'stripe',
        shortDescription: 'Accept credit cards, debit cards, and digital wallets globally',
        description: `Stripe is a complete payments platform for internet businesses. Accept payments from customers around the world with support for 135+ currencies.`,
        icon: '/apps/stripe.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Stripe, Inc.',
        developerUrl: 'https://stripe.com',
    },
    {
        name: 'PayPal',
        slug: 'paypal',
        shortDescription: 'Let customers pay with their PayPal balance or linked cards',
        description: `PayPal is one of the most trusted payment methods worldwide. Allow your customers to pay using their PayPal balance, linked bank accounts, or credit cards.`,
        icon: '/apps/paypal.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'PayPal Holdings, Inc.',
        developerUrl: 'https://paypal.com',
    },
    {
        name: 'Apple Pay',
        slug: 'apple-pay',
        shortDescription: 'Enable one-tap checkout for Apple device users',
        description: `Apple Pay provides a seamless checkout experience for customers using iPhone, iPad, Apple Watch, and Mac. No additional fees beyond your payment processor.`,
        icon: '/apps/apple-pay.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Apple Inc.',
    },
    {
        name: 'Google Pay',
        slug: 'google-pay',
        shortDescription: 'Quick and secure payments for Android users',
        description: `Google Pay enables fast, simple checkouts for customers with Android devices. Seamlessly integrates with your existing payment processor.`,
        icon: '/apps/google-pay.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Google LLC',
    },
    {
        name: 'Cryptomus',
        slug: 'cryptomus',
        shortDescription: 'Accept Bitcoin, Ethereum, USDT, and 50+ cryptocurrencies',
        description: `Cryptomus is a comprehensive cryptocurrency payment gateway supporting 50+ digital currencies. Receive payments directly to your wallet or convert to fiat automatically.`,
        icon: '/apps/cryptomus.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Cryptomus',
        developerUrl: 'https://cryptomus.com',
    },
    {
        name: 'Coinbase Commerce',
        slug: 'coinbase-commerce',
        shortDescription: 'Accept crypto payments with automatic conversion to fiat',
        description: `Coinbase Commerce allows you to accept cryptocurrency payments with the option to automatically convert to your local currency.`,
        icon: '/apps/coinbase-commerce.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Coinbase Global, Inc.',
        developerUrl: 'https://commerce.coinbase.com',
    },
    {
        name: 'NOWPayments',
        slug: 'nowpayments',
        shortDescription: 'Accept 200+ cryptocurrencies with instant settlements',
        description: `NOWPayments is a non-custodial crypto payment gateway supporting over 200 cryptocurrencies.`,
        icon: '/apps/nowpayments.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'NOWPayments',
        developerUrl: 'https://nowpayments.io',
    },
    {
        name: 'Klarna',
        slug: 'klarna',
        shortDescription: 'Offer flexible Buy Now, Pay Later options to customers',
        description: `Klarna allows your customers to spread the cost of their purchase over time. Increase average order value and conversion rates.`,
        icon: '/apps/klarna.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Klarna Bank AB',
        developerUrl: 'https://klarna.com',
    },
    {
        name: 'Afterpay',
        slug: 'afterpay',
        shortDescription: 'Split payments into 4 interest-free installments',
        description: `Afterpay enables customers to split their purchase into 4 interest-free payments. You get paid in full upfront.`,
        icon: '/apps/afterpay.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Afterpay Limited',
        developerUrl: 'https://afterpay.com',
    },
    {
        name: 'Affirm',
        slug: 'affirm',
        shortDescription: 'Offer monthly payment plans up to 36 months',
        description: `Affirm provides customers with transparent, flexible financing options with monthly payment plans.`,
        icon: '/apps/affirm.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Affirm, Inc.',
        developerUrl: 'https://affirm.com',
    },
    {
        name: 'Alipay',
        slug: 'alipay',
        shortDescription: 'Popular payment method for Chinese customers',
        description: `Alipay is the most widely used digital payment platform in China. Reach over 1 billion active users.`,
        icon: '/apps/alipay.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Ant Group',
    },
    {
        name: 'WeChat Pay',
        slug: 'wechat-pay',
        shortDescription: 'Accept payments from WeChat users in China',
        description: `WeChat Pay is integrated into the WeChat super-app used by over 1.2 billion people.`,
        icon: '/apps/wechat-pay.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Tencent Holdings',
    },
    {
        name: 'iDEAL',
        slug: 'ideal',
        shortDescription: 'Bank transfer payments for Dutch customers',
        description: `iDEAL is the most popular online payment method in the Netherlands.`,
        icon: '/apps/ideal.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Currence iDEAL',
    },
    {
        name: 'SEPA Direct Debit',
        slug: 'sepa-direct-debit',
        shortDescription: 'Direct bank payments across the Eurozone',
        description: `SEPA Direct Debit enables you to collect payments directly from customer bank accounts across the entire Eurozone.`,
        icon: '/apps/sepa.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'European Payments Council',
    },
]

export async function seedPaymentApps() {
    const results = {
        created: [] as string[],
        skipped: [] as string[],
        failed: [] as { name: string; error: string }[]
    }

    for (const app of paymentApps) {
        try {
            const existing = await prisma.app.findUnique({
                where: { slug: app.slug }
            })

            if (existing) {
                results.skipped.push(app.name)
                continue
            }

            await prisma.app.create({
                data: {
                    ...app,
                    status: 'APPROVED',
                    permissions: {
                        create: [
                            { permission: 'read_orders', description: 'View order information' },
                            { permission: 'process_payments', description: 'Process customer payments' },
                        ]
                    }
                }
            })

            results.created.push(app.name)
        } catch (error: any) {
            console.error(`Error creating ${app.name}:`, error)
            results.failed.push({
                name: app.name,
                error: error?.message || error?.toString() || 'Unknown error'
            })
        }
    }

    return results
}
