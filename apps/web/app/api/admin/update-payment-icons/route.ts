import { NextResponse } from 'next/server'
import { updatePaymentAppIcons } from '@/actions/update-payment-app-icons'

export async function GET() {
    try {
        const results = await updatePaymentAppIcons()
        return NextResponse.json({
            success: true,
            message: 'Payment app icons updated',
            results
        })
    } catch (error) {
        console.error('Error updating payment app icons:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to update payment app icons'
        }, { status: 500 })
    }
}
