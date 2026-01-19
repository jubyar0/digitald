'use server'

import { prisma } from "@/lib/db"

const iconUpdates = [
    { slug: 'digo-payments', icon: '/apps/digo-payments.svg' },
    { slug: 'stripe', icon: '/apps/stripe.svg' },
    { slug: 'paypal', icon: '/apps/paypal.svg' },
    { slug: 'apple-pay', icon: '/apps/apple-pay.svg' },
    { slug: 'google-pay', icon: '/apps/google-pay.svg' },
    { slug: 'cryptomus', icon: '/apps/cryptomus.svg' },
    { slug: 'coinbase-commerce', icon: '/apps/coinbase-commerce.svg' },
    { slug: 'nowpayments', icon: '/apps/nowpayments.svg' },
    { slug: 'klarna', icon: '/apps/klarna.svg' },
    { slug: 'afterpay', icon: '/apps/afterpay.svg' },
    { slug: 'affirm', icon: '/apps/affirm.svg' },
    { slug: 'alipay', icon: '/apps/alipay.png' },
    { slug: 'wechat-pay', icon: '/apps/wechat-pay.png' },
    { slug: 'ideal', icon: '/apps/ideal.png' },
    { slug: 'sepa-direct-debit', icon: '/apps/sepa.jpg' },
]

export async function updatePaymentAppIcons() {
    const results = {
        updated: [] as string[],
        failed: [] as string[]
    }

    for (const { slug, icon } of iconUpdates) {
        try {
            await prisma.app.update({
                where: { slug },
                data: { icon }
            })
            results.updated.push(slug)
        } catch (error) {
            console.error(`Error updating ${slug}:`, error)
            results.failed.push(slug)
        }
    }

    return results
}
