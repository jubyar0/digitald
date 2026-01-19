'use server'

export async function getSellerProfileData() {
    return { success: true, data: null }
}

export async function updateSellerDetails(data: any) {
    return { success: true }
}

export async function updateSellerPhone(phone: string) {
    return { success: true }
}

export async function updateSellerAvatar(imageUrl: string) {
    return { success: true }
}

export async function createPassword(newPassword: string) {
    return { success: true }
}

export async function changeSellerPassword(currentPassword: string, newPassword: string) {
    return { success: true }
}

export async function addSecondaryEmail(email: string) {
    return { success: true }
}

export async function removeSecondaryEmail() {
    return { success: true }
}

export async function toggleTwoFactorAuth(enable: boolean) {
    return { success: true }
}

export async function getLoggedInDevices() {
    return { success: true, data: [] }
}

export async function logoutDevice(deviceId: string) {
    return { success: true }
}

export async function logoutAllDevices() {
    return { success: true }
}

export async function getConnectedServices() {
    return { success: true, data: { google: false } }
}

export async function disconnectGoogleAccount() {
    return { success: true }
}

export async function requestEmailUpdate(newEmail: string, password: string) {
    return { success: true }
}

export async function updateSellerLanguage(language: string, giveFeedback: boolean = false) {
    return { success: true }
}

export async function updateSellerTimezone(timezone: string) {
    return { success: true }
}

export async function updateRegionalFormat(regionalFormat: string) {
    return { success: true }
}
