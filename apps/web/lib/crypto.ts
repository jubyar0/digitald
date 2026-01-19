import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const SALT_LENGTH = 64;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

/**
 * Get the encryption key from environment variable
 * Generates a deterministic key if not set (development only)
 */
function getEncryptionKey(): string {
    const key = process.env.API_ENCRYPTION_KEY;
    if (!key) {
        // In development, use a default key (WARNING: not secure for production)
        if (process.env.NODE_ENV === 'development') {
            console.warn('[crypto] Using default encryption key - NOT SECURE FOR PRODUCTION');
            return 'development-only-key-do-not-use-in-production-32';
        }
        throw new Error('API_ENCRYPTION_KEY environment variable is not set');
    }
    return key;
}

/**
 * Derive a key from the master key using PBKDF2
 */
function deriveKey(masterKey: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(masterKey, salt, ITERATIONS, KEY_LENGTH, 'sha512');
}

/**
 * Encrypt sensitive data (API keys)
 * Returns a base64 encoded string containing salt + iv + tag + encrypted data
 */
export function encrypt(plaintext: string): string {
    const masterKey = getEncryptionKey();

    // Generate random salt and IV
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);

    // Derive key from master key
    const key = deriveKey(masterKey, salt);

    // Encrypt
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([
        cipher.update(plaintext, 'utf8'),
        cipher.final()
    ]);
    const tag = cipher.getAuthTag();

    // Combine salt + iv + tag + encrypted data
    const combined = Buffer.concat([salt, iv, tag, encrypted]);

    return combined.toString('base64');
}

/**
 * Decrypt sensitive data (API keys)
 * Takes a base64 encoded string and returns the decrypted plaintext
 */
export function decrypt(encryptedData: string): string {
    const masterKey = getEncryptionKey();

    // Decode from base64
    const combined = Buffer.from(encryptedData, 'base64');

    // Extract components
    const salt = combined.subarray(0, SALT_LENGTH);
    const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const tag = combined.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    const encrypted = combined.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

    // Derive key from master key
    const key = deriveKey(masterKey, salt);

    // Decrypt
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
    ]);

    return decrypted.toString('utf8');
}

/**
 * Encrypt API settings object
 */
export function encryptSettings(settings: Record<string, string>): string {
    return encrypt(JSON.stringify(settings));
}

/**
 * Decrypt API settings object
 */
export function decryptSettings(encryptedSettings: string): Record<string, string> {
    const decrypted = decrypt(encryptedSettings);
    return JSON.parse(decrypted);
}

/**
 * Mask sensitive values for display (show only last 4 characters)
 */
export function maskValue(value: string): string {
    if (!value || value.length < 8) {
        return '••••••••';
    }
    return '••••••••' + value.slice(-4);
}
