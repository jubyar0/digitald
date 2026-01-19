import { NextResponse } from 'next/server'
import { seedPaymentApps } from '@/actions/seed-payment-apps'

export async function GET() {
    try {
        const results = await seedPaymentApps()
        return NextResponse.json({
            success: true,
            message: 'Payment apps seeding complete',
            results
        })
    } catch (error) {
        console.error('Error seeding payment apps:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to seed payment apps'
        }, { status: 500 })
    }
}
