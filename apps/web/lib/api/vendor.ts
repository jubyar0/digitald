// API client for vendor/seller endpoints

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const vendorApi = {
    // Get dashboard stats
    async getDashboardStats(userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);

        const response = await fetch(`${API_BASE_URL}/vendor/dashboard?${params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch dashboard stats');
        }
        return response.json();
    },

    // Get sales data
    async getSalesData(days: number = 30, userId?: string) {
        const params = new URLSearchParams();
        params.append('days', days.toString());
        if (userId) params.append('userId', userId);

        const response = await fetch(`${API_BASE_URL}/vendor/sales?${params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch sales data');
        }
        return response.json();
    },

    // Get products
    async getProducts(page: number = 1, limit: number = 10, search?: string, status?: string, userId?: string) {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        if (userId) params.append('userId', userId);

        const response = await fetch(`${API_BASE_URL}/vendor/products?${params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
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

        const response = await fetch(`${API_BASE_URL}/vendor/orders?${params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        return response.json();
    },

    // Get customers
    async getCustomers(page: number = 1, limit: number = 10, userId?: string) {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (userId) params.append('userId', userId);

        const response = await fetch(`${API_BASE_URL}/vendor/customers?${params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch customers');
        }
        return response.json();
    },

    // Get payouts
    async getPayouts(page: number = 1, limit: number = 10, userId?: string) {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (userId) params.append('userId', userId);

        const response = await fetch(`${API_BASE_URL}/vendor/payouts?${params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch payouts');
        }
        return response.json();
    },

    // Request payout
    async requestPayout(amount: number, method: string, userId?: string) {
        const response = await fetch(`${API_BASE_URL}/vendor/payouts/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                amount,
                method
            })
        });

        if (!response.ok) {
            throw new Error('Failed to request payout');
        }
        return response.json();
    },

    // Get store settings (General)
    async getStoreSettings(userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);

        const response = await fetch(`${API_BASE_URL}/vendor/settings?${params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch store settings');
        }
        return response.json();
    },

    // Update store settings (General)
    async updateStoreSettings(data: any, userId?: string) {
        const response = await fetch(`${API_BASE_URL}/vendor/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                ...data
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update store settings');
        }
        return response.json();
    },

    // --- Marketing ---

    // Discounts
    async getDiscounts(userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        const response = await fetch(`${API_BASE_URL}/vendor/marketing/discounts?${params}`);
        if (!response.ok) throw new Error('Failed to fetch discounts');
        return response.json();
    },

    async createDiscount(data: any, userId?: string) {
        const response = await fetch(`${API_BASE_URL}/vendor/marketing/discounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, ...data })
        });
        if (!response.ok) throw new Error('Failed to create discount');
        return response.json();
    },

    async updateDiscount(id: string, data: any, userId?: string) {
        const response = await fetch(`${API_BASE_URL}/vendor/marketing/discounts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, ...data })
        });
        if (!response.ok) throw new Error('Failed to update discount');
        return response.json();
    },

    async deleteDiscount(id: string, userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        const response = await fetch(`${API_BASE_URL}/vendor/marketing/discounts/${id}?${params}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete discount');
        return response.json();
    },

    // Coupons
    async getCoupons(userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        const response = await fetch(`${API_BASE_URL}/vendor/marketing/coupons?${params}`);
        if (!response.ok) throw new Error('Failed to fetch coupons');
        return response.json();
    },

    async createCoupon(data: any, userId?: string) {
        const response = await fetch(`${API_BASE_URL}/vendor/marketing/coupons`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, ...data })
        });
        if (!response.ok) throw new Error('Failed to create coupon');
        return response.json();
    },

    async updateCoupon(id: string, data: any, userId?: string) {
        const response = await fetch(`${API_BASE_URL}/vendor/marketing/coupons/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, ...data })
        });
        if (!response.ok) throw new Error('Failed to update coupon');
        return response.json();
    },

    async deleteCoupon(id: string, userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        const response = await fetch(`${API_BASE_URL}/vendor/marketing/coupons/${id}?${params}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete coupon');
        return response.json();
    },

    // Promotions
    async getPromotions(userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        const response = await fetch(`${API_BASE_URL}/vendor/marketing/promotions?${params}`);
        if (!response.ok) throw new Error('Failed to fetch promotions');
        return response.json();
    },

    async createPromotion(data: any, userId?: string) {
        const response = await fetch(`${API_BASE_URL}/vendor/marketing/promotions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, ...data })
        });
        if (!response.ok) throw new Error('Failed to create promotion');
        return response.json();
    },

    async updatePromotion(id: string, data: any, userId?: string) {
        const response = await fetch(`${API_BASE_URL}/vendor/marketing/promotions/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, ...data })
        });
        if (!response.ok) throw new Error('Failed to update promotion');
        return response.json();
    },

    async deletePromotion(id: string, userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        const response = await fetch(`${API_BASE_URL}/vendor/marketing/promotions/${id}?${params}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete promotion');
        return response.json();
    },

    // Affiliates
    async getAffiliates(userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        const response = await fetch(`${API_BASE_URL}/vendor/marketing/affiliates?${params}`);
        if (!response.ok) throw new Error('Failed to fetch affiliates');
        return response.json();
    },

    async createAffiliate(data: any, userId?: string) {
        const response = await fetch(`${API_BASE_URL}/vendor/marketing/affiliates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, ...data })
        });
        if (!response.ok) throw new Error('Failed to create affiliate');
        return response.json();
    },

    async updateAffiliate(id: string, data: any, userId?: string) {
        const response = await fetch(`${API_BASE_URL}/vendor/marketing/affiliates/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, ...data })
        });
        if (!response.ok) throw new Error('Failed to update affiliate');
        return response.json();
    },

    // --- Analytics ---
    async getSalesAnalytics(period: string = 'month', userId?: string) {
        const params = new URLSearchParams();
        params.append('period', period);
        if (userId) params.append('userId', userId);
        const response = await fetch(`${API_BASE_URL}/vendor/analytics/sales?${params}`);
        if (!response.ok) throw new Error('Failed to fetch sales analytics');
        return response.json();
    },

    async getProductAnalytics(userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        const response = await fetch(`${API_BASE_URL}/vendor/analytics/products?${params}`);
        if (!response.ok) throw new Error('Failed to fetch product analytics');
        return response.json();
    },

    async getCustomerAnalytics(userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        const response = await fetch(`${API_BASE_URL}/vendor/analytics/customers?${params}`);
        if (!response.ok) throw new Error('Failed to fetch customer analytics');
        return response.json();
    },

    async getRevenueAnalytics(userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        const response = await fetch(`${API_BASE_URL}/vendor/analytics/revenue?${params}`);
        if (!response.ok) throw new Error('Failed to fetch revenue analytics');
        return response.json();
    },

    // --- Finance ---
    async getPayments(page: number = 1, limit: number = 10, userId?: string) {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (userId) params.append('userId', userId);
        const response = await fetch(`${API_BASE_URL}/vendor/finance/payments?${params}`);
        if (!response.ok) throw new Error('Failed to fetch payments');
        return response.json();
    },

    async getInvoices(page: number = 1, limit: number = 10, userId?: string) {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (userId) params.append('userId', userId);
        const response = await fetch(`${API_BASE_URL}/vendor/finance/invoices?${params}`);
        if (!response.ok) throw new Error('Failed to fetch invoices');
        return response.json();
    },

    async createInvoice(data: any, userId?: string) {
        const response = await fetch(`${API_BASE_URL}/vendor/finance/invoices`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, ...data })
        });
        if (!response.ok) throw new Error('Failed to create invoice');
        return response.json();
    },

    async getFinancialReports(period: string = 'month', userId?: string) {
        const params = new URLSearchParams();
        params.append('period', period);
        if (userId) params.append('userId', userId);
        const response = await fetch(`${API_BASE_URL}/vendor/finance/reports?${params}`);
        if (!response.ok) throw new Error('Failed to fetch financial reports');
        return response.json();
    },

    // --- Settings (Extended) ---
    async getStoreProfile(userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        const response = await fetch(`${API_BASE_URL}/vendor/settings/profile?${params}`);
        if (!response.ok) throw new Error('Failed to fetch store profile');
        return response.json();
    },

    async updateStoreProfile(data: any, userId?: string) {
        const response = await fetch(`${API_BASE_URL}/vendor/settings/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, ...data })
        });
        if (!response.ok) throw new Error('Failed to update store profile');
        return response.json();
    },

    async getShippingSettings(userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        const response = await fetch(`${API_BASE_URL}/vendor/settings/shipping?${params}`);
        if (!response.ok) throw new Error('Failed to fetch shipping settings');
        return response.json();
    },

    async updateShippingSettings(data: any, userId?: string) {
        const response = await fetch(`${API_BASE_URL}/vendor/settings/shipping`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, ...data })
        });
        if (!response.ok) throw new Error('Failed to update shipping settings');
        return response.json();
    },

    async getTaxSettings(userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        const response = await fetch(`${API_BASE_URL}/vendor/settings/tax?${params}`);
        if (!response.ok) throw new Error('Failed to fetch tax settings');
        return response.json();
    },

    async updateTaxSettings(data: any, userId?: string) {
        const response = await fetch(`${API_BASE_URL}/vendor/settings/tax`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, ...data })
        });
        if (!response.ok) throw new Error('Failed to update tax settings');
        return response.json();
    },

    async getNotificationSettings(userId?: string) {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        const response = await fetch(`${API_BASE_URL}/vendor/settings/notifications?${params}`);
        if (!response.ok) throw new Error('Failed to fetch notification settings');
        return response.json();
    },

    async updateNotificationSettings(data: any, userId?: string) {
        const response = await fetch(`${API_BASE_URL}/vendor/settings/notifications`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, ...data })
        });
        if (!response.ok) throw new Error('Failed to update notification settings');
        return response.json();
    }
};
