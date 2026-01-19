import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
- Real-time transaction monitoring
- Chargeback protection`,
        icon: '/apps/digo-payments.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'dIGO Platform',
        developerEmail: 'payments@digo.com',
    },
    {
        name: 'Stripe',
        slug: 'stripe',
        shortDescription: 'Accept credit cards, debit cards, and digital wallets globally',
        description: `Stripe is a complete payments platform for internet businesses. Accept payments from customers around the world with support for 135+ currencies.

**Features:**
- 2.9% + $0.30 per transaction
- Support for 135+ currencies
- Built-in fraud prevention with Radar
- Real-time reporting and analytics
- Stripe Connect for marketplace payments`,
        icon: '/apps/stripe.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Stripe, Inc.',
        developerEmail: 'support@stripe.com',
        developerUrl: 'https://stripe.com',
    },

    // Digital Wallets
    {
        name: 'PayPal',
        slug: 'paypal',
        shortDescription: 'Let customers pay with their PayPal balance or linked cards',
        description: `PayPal is one of the most trusted payment methods worldwide. Allow your customers to pay using their PayPal balance, linked bank accounts, or credit cards.

**Features:**
- 3.49% + $0.49 per transaction
- One-tap checkout for returning customers
- Buyer and seller protection
- Support for 200+ markets
- PayPal Credit and Pay in 4 options`,
        icon: '/apps/paypal.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'PayPal Holdings, Inc.',
        developerEmail: 'support@paypal.com',
        developerUrl: 'https://paypal.com',
    },
    {
        name: 'Apple Pay',
        slug: 'apple-pay',
        shortDescription: 'Enable one-tap checkout for Apple device users',
        description: `Apple Pay provides a seamless checkout experience for customers using iPhone, iPad, Apple Watch, and Mac. No additional fees beyond your payment processor.

**Features:**
- No additional transaction fees
- One-tap checkout with Face ID or Touch ID
- Works with existing payment processor
- Enhanced security with tokenization
- Automatic billing address and shipping info`,
        icon: '/apps/apple-pay.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Apple Inc.',
        developerUrl: 'https://apple.com/apple-pay',
    },
    {
        name: 'Google Pay',
        slug: 'google-pay',
        shortDescription: 'Quick and secure payments for Android users',
        description: `Google Pay enables fast, simple checkouts for customers with Android devices. Seamlessly integrates with your existing payment processor.

**Features:**
- No additional transaction fees
- Quick checkout with saved payment methods
- Works with existing payment processor
- Industry-standard security
- Support for loyalty cards and offers`,
        icon: '/apps/google-pay.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Google LLC',
        developerUrl: 'https://pay.google.com',
    },

    // Cryptocurrency
    {
        name: 'Cryptomus',
        slug: 'cryptomus',
        shortDescription: 'Accept Bitcoin, Ethereum, USDT, and 50+ cryptocurrencies',
        description: `Cryptomus is a comprehensive cryptocurrency payment gateway supporting 50+ digital currencies. Receive payments directly to your wallet or convert to fiat automatically.

**Features:**
- 0.5% - 1% transaction fees
- Support for 50+ cryptocurrencies
- Instant or scheduled settlements
- Multi-signature wallet security
- Auto-convert to fiat option`,
        icon: '/apps/cryptomus.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Cryptomus',
        developerEmail: 'support@cryptomus.com',
        developerUrl: 'https://cryptomus.com',
    },
    {
        name: 'Coinbase Commerce',
        slug: 'coinbase-commerce',
        shortDescription: 'Accept crypto payments with automatic conversion to fiat',
        description: `Coinbase Commerce allows you to accept cryptocurrency payments with the option to automatically convert to your local currency. Backed by the trust of Coinbase.

**Features:**
- 1% transaction fee
- Support for Bitcoin, Ethereum, Litecoin, and more
- Automatic conversion to USD, EUR, or crypto
- Easy integration
- Detailed transaction reports`,
        icon: '/apps/coinbase-commerce.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Coinbase Global, Inc.',
        developerEmail: 'support@coinbase.com',
        developerUrl: 'https://commerce.coinbase.com',
    },
    {
        name: 'NOWPayments',
        slug: 'nowpayments',
        shortDescription: 'Accept 200+ cryptocurrencies with instant settlements',
        description: `NOWPayments is a non-custodial crypto payment gateway supporting over 200 cryptocurrencies. Keep your funds secure in your own wallet.

**Features:**
- 0.5% transaction fee
- 200+ supported cryptocurrencies
- Non-custodial (you control your keys)
- Instant settlements
- Fiat conversion available`,
        icon: '/apps/nowpayments.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'NOWPayments',
        developerEmail: 'support@nowpayments.io',
        developerUrl: 'https://nowpayments.io',
    },

    // Buy Now Pay Later
    {
        name: 'Klarna',
        slug: 'klarna',
        shortDescription: 'Offer flexible Buy Now, Pay Later options to customers',
        description: `Klarna allows your customers to spread the cost of their purchase over time. Increase average order value and conversion rates with flexible payment options.

**Features:**
- Pay in 4 interest-free installments
- Pay in 30 days
- Financing up to 36 months
- Instant credit decisions
- Seller protection included`,
        icon: '/apps/klarna.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Klarna Bank AB',
        developerEmail: 'merchant@klarna.com',
        developerUrl: 'https://klarna.com',
    },
    {
        name: 'Afterpay',
        slug: 'afterpay',
        shortDescription: 'Split payments into 4 interest-free installments',
        description: `Afterpay enables customers to split their purchase into 4 interest-free payments. You get paid in full upfront while your customers pay over time.

**Features:**
- 4-6% + $0.30 per transaction
- You get paid upfront
- No credit check for customers
- Increased average order value
- Built-in buyer protection`,
        icon: '/apps/afterpay.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Afterpay Limited',
        developerEmail: 'merchant@afterpay.com',
        developerUrl: 'https://afterpay.com',
    },
    {
        name: 'Affirm',
        slug: 'affirm',
        shortDescription: 'Offer monthly payment plans up to 36 months',
        description: `Affirm provides customers with transparent, flexible financing options. Offer monthly payment plans with no hidden fees or compounding interest.

**Features:**
- Monthly payments up to 36 months
- Real-time credit decisions
- You get paid in 1-3 business days
- No late fees for customers
- Increase AOV by up to 85%`,
        icon: '/apps/affirm.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Affirm, Inc.',
        developerEmail: 'merchant@affirm.com',
        developerUrl: 'https://affirm.com',
    },

    // Local Payment Methods
    {
        name: 'Alipay',
        slug: 'alipay',
        shortDescription: 'Popular payment method for Chinese customers',
        description: `Alipay is the most widely used digital payment platform in China. Reach over 1 billion active users and expand your business into the Chinese market.

**Features:**
- 2.9% transaction fee
- 1+ billion active users
- Cross-border payments
- QR code payments
- Mobile-first design`,
        icon: '/apps/alipay.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Ant Group',
        developerUrl: 'https://intl.alipay.com',
    },
    {
        name: 'WeChat Pay',
        slug: 'wechat-pay',
        shortDescription: 'Accept payments from WeChat users in China',
        description: `WeChat Pay is integrated into the WeChat super-app used by over 1.2 billion people. Accept payments from Chinese customers through their everyday messaging app.

**Features:**
- 2.9% transaction fee
- 1.2+ billion WeChat users
- In-app payment experience
- Cross-border support
- QR code and in-app payments`,
        icon: '/apps/wechat-pay.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Tencent Holdings',
        developerUrl: 'https://pay.weixin.qq.com',
    },
    {
        name: 'iDEAL',
        slug: 'ideal',
        shortDescription: 'Bank transfer payments for Dutch customers',
        description: `iDEAL is the most popular online payment method in the Netherlands. Allow Dutch customers to pay directly from their bank accounts.

**Features:**
- €0.29 per transaction
- 60%+ of Dutch e-commerce payments
- Real-time bank transfers
- Strong customer authentication
- Instant payment confirmation`,
        icon: '/apps/ideal.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'Currence iDEAL',
        developerUrl: 'https://ideal.nl',
    },
    {
        name: 'SEPA Direct Debit',
        slug: 'sepa-direct-debit',
        shortDescription: 'Direct bank payments across the Eurozone',
        description: `SEPA Direct Debit enables you to collect payments directly from customer bank accounts across the entire Eurozone. Ideal for subscriptions and recurring payments.

**Features:**
- 0.8% per transaction (capped)
- 36 European countries
- Perfect for subscriptions
- Secure bank-level protection
- Automatic recurring payments`,
        icon: '/apps/sepa.svg',
        category: 'payments',
        pricingType: 'free',
        createdByAdmin: true,
        developerName: 'European Payments Council',
        developerUrl: 'https://europeanpaymentscouncil.eu',
    },
]

async function seedPaymentApps() {
    console.log('🚀 Seeding payment apps...')

    for (const app of paymentApps) {
        try {
            const existing = await prisma.app.findUnique({
                where: { slug: app.slug }
            })

            if (existing) {
                console.log(`⏭️  Skipping ${app.name} (already exists)`)
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

            console.log(`✅ Created ${app.name}`)
        } catch (error) {
            console.error(`❌ Error creating ${app.name}:`, error)
        }
    }

    console.log('\n🎉 Payment apps seeding complete!')
}

seedPaymentApps()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
