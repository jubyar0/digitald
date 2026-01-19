// API client for user endpoints

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const userApi = {
    // Get dashboard stats
    async getDashboardStats(userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);

        const response = await fetch(`${API_BASE_URL}/user/dashboard?${params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch dashboard stats');
        }
        return response.json();
    },

    // Get orders
    async getOrders(page: number = 1, limit: number = 10, status?: string, userId?: string) {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (status) params.append('status', status);
        if (userId) params.append('userId', userId);

        const response = await fetch(`${API_BASE_URL}/user/orders?${params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        return response.json();
    },

    // Get wishlist
    async getWishlist(page: number = 1, limit: number = 10, userId?: string) {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (userId) params.append('userId', userId);

        const response = await fetch(`${API_BASE_URL}/user/wishlist?${params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch wishlist');
        }
        return response.json();
    },

    // Add to wishlist
    async addToWishlist(productId: string, userId?: string) {
        const response = await fetch(`${API_BASE_URL}/user/wishlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                productId
            })
        });

        if (!response.ok) {
            throw new Error('Failed to add to wishlist');
        }
        return response.json();
    },

    // Remove from wishlist
    async removeFromWishlist(productId: string, userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);

        const response = await fetch(`${API_BASE_URL}/user/wishlist/${productId}?${params}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to remove from wishlist');
        }
        return response.json();
    },

    // Get reviews
    async getReviews(page: number = 1, limit: number = 10, userId?: string) {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (userId) params.append('userId', userId);

        const response = await fetch(`${API_BASE_URL}/user/reviews?${params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }
        return response.json();
    },

    // Create review
    async createReview(productId: string, rating: number, comment: string, userId?: string) {
        const response = await fetch(`${API_BASE_URL}/user/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                productId,
                rating,
                comment
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create review');
        }
        return response.json();
    },

    // Get wallet
    async getWallet(userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);

        const response = await fetch(`${API_BASE_URL}/user/wallet?${params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch wallet');
        }
        return response.json();
    },

    // Get wallet transactions
    async getWalletTransactions(page: number = 1, limit: number = 10, userId?: string) {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (userId) params.append('userId', userId);

        const response = await fetch(`${API_BASE_URL}/user/wallet/transactions?${params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch wallet transactions');
        }
        return response.json();
    },

    // Get addresses
    async getAddresses(userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);

        const response = await fetch(`${API_BASE_URL}/user/addresses?${params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch addresses');
        }
        return response.json();
    },

    // Get purchased products
    async getPurchasedProducts(page: number = 1, limit: number = 10, userId?: string) {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (userId) params.append('userId', userId);

        const response = await fetch(`${API_BASE_URL}/user/products/purchased?${params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch purchased products');
        }
        return response.json();
    },

    // Get payment methods
    async getPaymentMethods(userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);

        const response = await fetch(`${API_BASE_URL}/user/payment-methods?${params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch payment methods');
        }
        return response.json();
    },

    // Get downloads
    async getDownloads(userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);

        const response = await fetch(`${API_BASE_URL}/user/downloads?${params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch downloads');
        }
        return response.json();
    }
};
