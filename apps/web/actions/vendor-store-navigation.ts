'use server'

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import { getVendorApplicationStatus } from "./user-vendor-application"

/**
 * Determines the correct redirect URL for a vendor based on their onboarding status
 * @returns The URL to redirect the vendor to
 */
export async function getVendorStoreRedirectUrl(): Promise<string> {
    try {
        const session = await getServerSession(authOptions)

        // If not logged in or not a vendor, redirect to home
        if (!session?.user?.id || session.user.role !== 'VENDOR') {
            return '/'
        }

        // Get vendor application status
        const status = await getVendorApplicationStatus()

        // No vendor record yet - direct to application form
        if (!status.isVendor) {
            return '/account/become-seller'
        }

        // Has vendor record - check application status
        if (!status.application) {
            // Vendor exists but no application (shouldn't happen, but handle it)
            return '/account/become-seller'
        }

        // Check application status
        switch (status.application.status) {
            case 'APPROVED':
                // Approved - go to seller dashboard
                return '/seller/dashboard'

            case 'PENDING':
                // Pending - show application status
                return '/account/become-seller'

            case 'REJECTED':
                // Rejected - show rejection with resubmit option
                return '/account/become-seller'

            default:
                // Fallback to application page
                return '/account/become-seller'
        }
    } catch (error) {
        console.error('Error getting vendor store redirect URL:', error)
        // On error, redirect to application page
        return '/account/become-seller'
    }
}
