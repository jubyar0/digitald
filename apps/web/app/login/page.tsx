'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import LandingNavbar from "@/components/landing/navbar";
import { toast } from 'sonner';

// Google Icon
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

// Facebook Icon
const FacebookIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

// Apple Icon
const AppleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
);

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [staySignedIn, setStaySignedIn] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid email or password');
                toast.error('Invalid email or password');
            } else {
                toast.success('Signed in successfully!');
                // Redirect will be handled by NextAuth based on role
                router.push('/');
                router.refresh();
            }
        } catch (err) {
            setError('An unexpected error occurred');
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/' });
    };

    return (
        <div className="flex min-h-screen flex-col bg-white">
            {/* Etsy-style Header */}
            <LandingNavbar />

            {/* Main Content */}
            <main className="flex flex-col items-center justify-center px-4 py-12 flex-1">
                <div className="w-full max-w-[480px]">
                    {/* Register Button - Top Right positioning for mobile context */}
                    <div className="flex justify-end mb-6">
                        <Link
                            href="/signup"
                            className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-400 rounded-full hover:bg-gray-50 transition-colors"
                        >
                            Register
                        </Link>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-medium text-gray-900 mb-8">
                        Sign in to continue
                    </h1>

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Field */}
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="peer w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 focus:ring-0 transition-colors"
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 transition-all duration-200 peer-focus:top-3 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none"
                            >
                                Email address
                            </label>
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="peer w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 focus:ring-0 transition-colors"
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 transition-all duration-200 peer-focus:top-3 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none"
                            >
                                Password
                            </label>
                        </div>

                        {/* Stay signed in & Forgot password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={staySignedIn}
                                    onChange={(e) => setStaySignedIn(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-0 focus:ring-offset-0"
                                />
                                <span className="text-sm text-gray-900">Stay signed in</span>
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-gray-500 hover:underline"
                            >
                                Forgot your password?
                            </Link>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 text-white bg-gray-900 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    {/* Trouble signing in */}
                    <div className="text-center mt-6">
                        <Link href="/help" className="text-sm text-gray-500 hover:underline">
                            Trouble signing in?
                        </Link>
                    </div>

                    {/* OR Divider */}
                    <div className="text-center my-4">
                        <span className="text-sm text-gray-500">OR</span>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="space-y-3">
                        {/* Google */}
                        <button
                            onClick={handleGoogleSignIn}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                        >
                            <GoogleIcon />
                            <span className="text-sm font-medium text-gray-700">Continue with Google</span>
                        </button>

                        {/* Facebook */}
                        <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                            <FacebookIcon />
                            <span className="text-sm font-medium text-gray-700">Continue with Facebook</span>
                        </button>

                        {/* Apple */}
                        <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                            <AppleIcon />
                            <span className="text-sm font-medium text-gray-700">Continue with Apple</span>
                        </button>
                    </div>

                    {/* Terms & Privacy */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-500">
                            By clicking Sign in, Continue with Google, Facebook, or Apple,
                        </p>
                        <p className="text-xs text-gray-500">
                            you agree to Etsy&apos;s{' '}
                            <Link href="/terms" className="underline hover:text-gray-700">
                                Terms of Use
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="underline hover:text-gray-700">
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>

                    {/* Email preferences note */}
                    <p className="mt-4 text-xs text-gray-500 text-center">
                        Etsy may send you communications; you may change your preferences in your
                        <br />
                        account settings. We&apos;ll never post without your permission.
                    </p>
                </div>
            </main>
        </div>
    );
}
