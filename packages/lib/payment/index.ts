import { PaymentGateway, PaymentProvider } from './types';
import { StripeProvider } from './stripe';
import { PayPalProvider } from './paypal';
import { CryptomusProvider } from './cryptomus';

export * from './types';
export * from './utils';

// Configuration cache with TTL
interface ConfigCache {
    config: Record<string, string> | null;
    timestamp: number;
}

const CONFIG_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const configCache: Record<string, ConfigCache> = {};

// Type for the configuration loader function
type ConfigLoader = (provider: string) => Promise<Record<string, string> | null>;

// Global configuration loader - set this from the app
let dbConfigLoader: ConfigLoader | null = null;

/**
 * Set the database configuration loader function
 * This should be called from the app initialization
 */
export function setDbConfigLoader(loader: ConfigLoader) {
    dbConfigLoader = loader;
}

/**
 * Get provider configuration from database or env
 */
async function getProviderConfig(provider: string): Promise<Record<string, string> | null> {
    // Check cache first
    const cached = configCache[provider];
    if (cached && (Date.now() - cached.timestamp) < CONFIG_CACHE_TTL) {
        return cached.config;
    }

    // Try database first if loader is set
    if (dbConfigLoader) {
        try {
            const dbConfig = await dbConfigLoader(provider);
            if (dbConfig) {
                configCache[provider] = { config: dbConfig, timestamp: Date.now() };
                return dbConfig;
            }
        } catch (error) {
            console.error(`Failed to load ${provider} config from database:`, error);
        }
    }

    // Fallback to environment variables
    const envConfig = getEnvConfig(provider);
    configCache[provider] = { config: envConfig, timestamp: Date.now() };
    return envConfig;
}

/**
 * Get configuration from environment variables
 */
function getEnvConfig(provider: string): Record<string, string> | null {
    switch (provider.toLowerCase()) {
        case 'stripe':
            if (!process.env.STRIPE_SECRET_KEY) return null;
            return {
                secretKey: process.env.STRIPE_SECRET_KEY,
                publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
                webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
            };
        case 'paypal':
            if (!process.env.PAYPAL_CLIENT_ID) return null;
            return {
                clientId: process.env.PAYPAL_CLIENT_ID,
                clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
                mode: process.env.PAYPAL_ENVIRONMENT || 'sandbox'
            };
        case 'cryptomus':
            if (!process.env.CRYPTOMUS_MERCHANT_ID) return null;
            return {
                merchantId: process.env.CRYPTOMUS_MERCHANT_ID,
                apiKey: process.env.CRYPTOMUS_API_KEY || ''
            };
        default:
            return null;
    }
}

/**
 * Clear configuration cache (useful after admin updates)
 */
export function clearConfigCache(provider?: string) {
    if (provider) {
        delete configCache[provider.toLowerCase()];
    } else {
        Object.keys(configCache).forEach(key => delete configCache[key]);
    }
}

export class PaymentService {
    private static providers: Record<string, PaymentProvider> = {};

    /**
     * Get payment provider (synchronous - uses cached/env config)
     * For initial requests, use getProviderAsync
     */
    static getProvider(method: PaymentGateway): PaymentProvider {
        if (this.providers[method]) {
            return this.providers[method];
        }

        // Use synchronous env config for immediate access
        const config = getEnvConfig(method.toLowerCase());
        if (!config) {
            throw new Error(`No configuration found for ${method}`);
        }

        return this.createProvider(method, config);
    }

    /**
     * Get payment provider (async - checks database first)
     * Recommended for API routes where you can await
     */
    static async getProviderAsync(method: PaymentGateway): Promise<PaymentProvider> {
        // Check if we have a cached provider with fresh config
        const cacheKey = `${method}_async`;
        if (this.providers[cacheKey]) {
            return this.providers[cacheKey];
        }

        const config = await getProviderConfig(method.toLowerCase());
        if (!config) {
            throw new Error(`No configuration found for ${method}`);
        }

        const provider = this.createProvider(method, config);
        this.providers[cacheKey] = provider;
        return provider;
    }

    /**
     * Create a provider instance from config
     */
    private static createProvider(method: PaymentGateway, config: Record<string, string>): PaymentProvider {
        switch (method) {
            case 'STRIPE':
                return new StripeProvider(config.secretKey);
            case 'PAYPAL':
                return new PayPalProvider(
                    config.clientId,
                    config.clientSecret,
                    (config.mode as 'sandbox' | 'live') || 'sandbox'
                );
            case 'CRYPTOMUS':
                return new CryptomusProvider(
                    config.merchantId,
                    config.apiKey
                );
            default:
                throw new Error(`Unsupported payment method: ${method}`);
        }
    }

    /**
     * Clear cached providers (call after config changes)
     */
    static clearProviders() {
        this.providers = {};
        clearConfigCache();
    }
}

