'use server'

export async function getMyEligibleProducts() {
    return { success: true, data: [] }
}

export async function getMyFeaturedSubmissions() {
    return { success: true, data: [] }
}

export async function submitProductForFeatured(productId: string, sectionId: string) {
    return { success: true }
}

export async function cancelFeaturedSubmission(submissionId: string) {
    return { success: true }
}

export async function getPendingFeaturedSubmissions() {
    return { success: true, data: [] }
}

export async function reviewFeaturedSubmission(
    submissionId: string,
    action: 'APPROVED' | 'REJECTED',
    notes?: string
) {
    return { success: true }
}
