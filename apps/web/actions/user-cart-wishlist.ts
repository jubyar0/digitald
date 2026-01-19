'use server'

export async function getUserCart() {
    return { success: true, data: [] }
}

export async function addToCart(productId: string, quantity: number) {
    return { success: true }
}

export async function removeFromCart(productId: string) {
    return { success: true }
}

export async function updateCartItemQuantity(productId: string, quantity: number) {
    return { success: true }
}

export async function getUserWishlist() {
    return { success: true, data: [] }
}

export async function addToWishlist(productId: string) {
    return { success: true, error: "" }
}

export async function removeFromWishlist(productId: string) {
    return { success: true, error: "" }
}

export async function clearCart() {
    return { success: true }
}

export async function mergeGuestCartToUser() {
    return { success: true }
}

export async function getCart() {
    return { items: [] as any[], total: 0, itemCount: 0 }
}

export async function getWishlist(page: number = 1, pageSize: number = 12) {
    return {
        items: [] as any[],
        total: 0,
        page,
        pageSize,
        totalPages: 0
    }
}

export async function moveWishlistToCart(wishlistItemId: string) {
    return { success: true }
}

export async function isInWishlist(productId: string) {
    return { inWishlist: false, wishlistId: undefined }
}

export async function getPurchasedProducts(page: number = 1, pageSize: number = 12) {
    return {
        products: [] as any[],
        total: 0,
        page,
        pageSize,
        totalPages: 0
    }
}
