'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import LandingNavbar from "@/components/landing/navbar"
import FooterSection from "@/components/landing/footer"
import { Eye, EyeOff, Loader2, Plus, Trash2, Edit2, Shield, MapPin, Download, AlertTriangle, Bell, User, Lock, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { changePassword } from '@/actions/user-profile'
import {
    getLocationSettings,
    updateLocationSettings,
    getCommunicationPreferences,
    updateCommunicationPreferences,
    closeUserAccount,
    updateEmail,
    getUserSettingsOverview,
    getUserAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getNotificationSettings,
    updateNotificationSettings,
    getPrivacySettings,
    updatePrivacySettings,
    requestDataExport,
    requestAccountDeletion,
    cancelDeletionRequest,
    getPublicProfileSettings,
    updatePublicProfile,
} from '@/actions/user-settings'
import {
    getSecurityOverview,
    getActiveSessions,
    revokeAllSessions,
} from '@/actions/user-security'

// Settings tabs
const settingsTabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'public-profile', label: 'Public Profile', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'credit-cards', label: 'Credit Cards', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
]

// Toggle Switch Component
function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <p className="text-sm font-medium text-gray-700">{label}</p>
                {description && <p className="text-xs text-gray-500">{description}</p>}
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={cn(
                    "relative w-12 h-6 rounded-full transition-colors",
                    checked ? "bg-gray-900" : "bg-gray-300"
                )}
            >
                <span className={cn(
                    "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                    checked && "translate-x-6"
                )} />
            </button>
        </div>
    )
}

export default function AccountSettingsPage() {
    const { data: session, status } = useSession()
    const [activeTab, setActiveTab] = useState('account')
    const [isLoading, setIsLoading] = useState(true)

    // Form states
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Location settings
    const [region, setRegion] = useState('United States')
    const [language, setLanguage] = useState('English (US)')
    const [currency, setCurrency] = useState('USD')

    // Password form
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isPasswordLoading, setIsPasswordLoading] = useState(false)

    // Email form
    const [newEmail, setNewEmail] = useState('')
    const [emailPassword, setEmailPassword] = useState('')
    const [isEmailLoading, setIsEmailLoading] = useState(false)

    // Communication preferences
    const [postalMail, setPostalMail] = useState(false)
    const [phoneCalls, setPhoneCalls] = useState(false)

    // Close account
    const [closeReason, setCloseReason] = useState('')
    const [closeConfirm, setCloseConfirm] = useState(false)
    const [isClosingAccount, setIsClosingAccount] = useState(false)

    // User info
    const [memberSince, setMemberSince] = useState<string>('')

    // Security state
    const [securityData, setSecurityData] = useState<any>(null)
    const [sessions, setSessions] = useState<any[]>([])

    // Addresses state
    const [addresses, setAddresses] = useState<any[]>([])
    const [showAddressForm, setShowAddressForm] = useState(false)
    const [editingAddress, setEditingAddress] = useState<any>(null)
    const [addressForm, setAddressForm] = useState({
        name: '', street: '', city: '', state: '', zip: '', country: 'United States'
    })

    // Notifications state
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        orderUpdates: true,
        promotions: false,
        reviewReminders: true,
        securityAlerts: true,
        newsletterSubscribed: false,
        emailFrequency: 'immediate' as 'immediate' | 'daily' | 'weekly',
    })

    // Privacy state
    const [privacy, setPrivacy] = useState({
        profileVisibility: 'public' as 'public' | 'private',
        showPurchaseHistory: true,
        showReviews: true,
        showWishlist: false,
        allowMessageFromAnyone: true,
        deletionRequested: false,
    })

    // Public Profile state
    const [profile, setProfile] = useState({
        displayName: '',
        bio: '',
        location: '',
        website: '',
    })

    // Load settings on mount
    const loadSettings = useCallback(async () => {
        setIsLoading(true)
        try {
            const [locationResult, commResult, overviewResult] = await Promise.all([
                getLocationSettings(),
                getCommunicationPreferences(),
                getUserSettingsOverview()
            ])

            if (locationResult.success && locationResult.data) {
                setRegion(locationResult.data.region)
                setLanguage(locationResult.data.language)
                setCurrency(locationResult.data.currency)
            }

            if (commResult.success && commResult.data) {
                setPostalMail(commResult.data.postalMail)
                setPhoneCalls(commResult.data.phoneCalls)
            }

            if (overviewResult.success && overviewResult.data) {
                setMemberSince(new Date(overviewResult.data.user.memberSince).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }))
            }
        } catch (error) {
            console.error('Error loading settings:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Load tab-specific data
    const loadTabData = useCallback(async (tab: string) => {
        try {
            switch (tab) {
                case 'security': {
                    const [secResult, sessResult] = await Promise.all([
                        getSecurityOverview(),
                        getActiveSessions()
                    ])
                    if (secResult.success) setSecurityData(secResult.data)
                    if (sessResult.success) setSessions(sessResult.data?.sessions || [])
                    break
                }
                case 'addresses': {
                    const addrResult = await getUserAddresses()
                    if (addrResult.success) setAddresses(addrResult.data || [])
                    break
                }
                case 'notifications': {
                    const notifResult = await getNotificationSettings()
                    if (notifResult.success && notifResult.data) {
                        setNotifications({
                            emailNotifications: notifResult.data.emailNotifications,
                            orderUpdates: notifResult.data.orderUpdates,
                            promotions: notifResult.data.promotions,
                            reviewReminders: notifResult.data.reviewReminders,
                            securityAlerts: notifResult.data.securityAlerts,
                            newsletterSubscribed: notifResult.data.newsletterSubscribed,
                            emailFrequency: notifResult.data.emailFrequency,
                        })
                    }
                    break
                }
                case 'privacy': {
                    const privResult = await getPrivacySettings()
                    if (privResult.success && privResult.data) {
                        setPrivacy({
                            profileVisibility: privResult.data.profileVisibility,
                            showPurchaseHistory: privResult.data.showPurchaseHistory,
                            showReviews: privResult.data.showReviews,
                            showWishlist: privResult.data.showWishlist,
                            allowMessageFromAnyone: privResult.data.allowMessageFromAnyone,
                            deletionRequested: privResult.data.deletionRequested,
                        })
                    }
                    break
                }
                case 'public-profile': {
                    const profResult = await getPublicProfileSettings()
                    if (profResult.success && profResult.data) {
                        setProfile({
                            displayName: profResult.data.displayName,
                            bio: profResult.data.bio,
                            location: profResult.data.location,
                            website: profResult.data.website,
                        })
                    }
                    break
                }
            }
        } catch (error) {
            console.error('Error loading tab data:', error)
        }
    }, [])

    useEffect(() => {
        if (status === 'authenticated') {
            loadSettings()
        }
    }, [status, loadSettings])

    useEffect(() => {
        if (status === 'authenticated') {
            loadTabData(activeTab)
        }
    }, [activeTab, status, loadTabData])

    // Handlers
    const handleSaveLocationSettings = async () => {
        const result = await updateLocationSettings({ region, language, currency })
        if (result.success) toast.success('Location settings saved!')
        else toast.error(result.error || 'Failed to save')
    }

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match!')
            return
        }
        if (!currentPassword || !newPassword || newPassword.length < 6) {
            toast.error('Please fill all fields. Password must be at least 6 characters.')
            return
        }
        setIsPasswordLoading(true)
        const result = await changePassword(currentPassword, newPassword)
        if (result.success) {
            toast.success('Password changed!')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } else {
            toast.error(result.error || 'Failed')
        }
        setIsPasswordLoading(false)
    }

    const handleChangeEmail = async () => {
        if (!newEmail || !emailPassword) {
            toast.error('Please fill all fields')
            return
        }
        setIsEmailLoading(true)
        const result = await updateEmail(newEmail, emailPassword)
        if (result.success) {
            toast.success('Email changed!')
            setNewEmail('')
            setEmailPassword('')
        } else {
            toast.error(result.error || 'Failed')
        }
        setIsEmailLoading(false)
    }

    const handleSaveCommunicationPreferences = async () => {
        const result = await updateCommunicationPreferences({ postalMail, phoneCalls })
        if (result.success) toast.success('Preferences saved!')
        else toast.error(result.error || 'Failed')
    }

    const handleCloseAccount = async () => {
        if (!closeConfirm || !closeReason) {
            toast.error('Please complete all requirements')
            return
        }
        setIsClosingAccount(true)
        const result = await closeUserAccount(closeReason)
        if (result.success) toast.success('Account closed.')
        else toast.error(result.error || 'Failed')
        setIsClosingAccount(false)
    }

    const handleSaveAddress = async () => {
        const data = { ...addressForm, isDefault: addresses.length === 0 }
        const result = editingAddress
            ? await updateAddress(editingAddress.id, data)
            : await createAddress(data)
        if (result.success) {
            toast.success(editingAddress ? 'Address updated!' : 'Address added!')
            setShowAddressForm(false)
            setEditingAddress(null)
            setAddressForm({ name: '', street: '', city: '', state: '', zip: '', country: 'United States' })
            loadTabData('addresses')
        } else {
            toast.error(result.error || 'Failed')
        }
    }

    const handleDeleteAddress = async (id: string) => {
        const result = await deleteAddress(id)
        if (result.success) {
            toast.success('Address deleted!')
            loadTabData('addresses')
        } else {
            toast.error(result.error || 'Failed')
        }
    }

    const handleSetDefaultAddress = async (id: string) => {
        const result = await setDefaultAddress(id)
        if (result.success) {
            toast.success('Default address set!')
            loadTabData('addresses')
        } else {
            toast.error(result.error || 'Failed')
        }
    }

    const handleSaveNotifications = async () => {
        const result = await updateNotificationSettings(notifications)
        if (result.success) toast.success('Notifications saved!')
        else toast.error(result.error || 'Failed')
    }

    const handleSavePrivacy = async () => {
        const result = await updatePrivacySettings(privacy)
        if (result.success) toast.success('Privacy settings saved!')
        else toast.error(result.error || 'Failed')
    }

    const handleExportData = async () => {
        const result = await requestDataExport()
        if (result.success && result.data) {
            const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'my-data-export.json'
            a.click()
            toast.success('Data exported!')
        } else {
            toast.error('Failed to export')
        }
    }

    const handleSaveProfile = async () => {
        const result = await updatePublicProfile(profile)
        if (result.success) toast.success('Profile saved!')
        else toast.error(result.error || 'Failed')
    }

    const handleRevokeAllSessions = async () => {
        const result = await revokeAllSessions()
        if (result.success) toast.success('All sessions revoked!')
        else toast.error(result.error || 'Failed')
    }

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <LandingNavbar />
            <div className="h-[140px]" />

            <main className="flex-1 bg-gray-50">
                <div className="bg-[#232347] text-white py-4">
                    <div className="container mx-auto px-4 lg:px-6">
                        <h1 className="text-xl font-medium">Account settings</h1>
                    </div>
                </div>

                <div className="bg-[#232347] border-t border-white/10">
                    <div className="container mx-auto px-4 lg:px-6">
                        <nav className="flex items-center gap-6 overflow-x-auto">
                            {settingsTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2",
                                        activeTab === tab.id
                                            ? "text-white border-white"
                                            : "text-white/70 border-transparent hover:text-white"
                                    )}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="container mx-auto px-4 lg:px-6 py-8 max-w-3xl">
                    {/* ACCOUNT TAB */}
                    {activeTab === 'account' && (
                        <div className="space-y-8">
                            <section className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">About You</h2>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Name</span>
                                        <p className="text-sm text-gray-600">{session?.user?.name || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Member since</span>
                                        <p className="text-sm text-gray-600">{memberSince || 'Loading...'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveTab('public-profile')}
                                    className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50"
                                >
                                    Edit public profile
                                </button>
                            </section>

                            <section className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">Location Settings</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                                        <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
                                            <option>United States</option><option>France</option><option>United Kingdom</option><option>Germany</option><option>Canada</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
                                            <option>English (US)</option><option>English (UK)</option><option>Français</option><option>Deutsch</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
                                            <option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option>
                                        </select>
                                    </div>
                                </div>
                                <button onClick={handleSaveLocationSettings} className="mt-4 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800">
                                    Save Settings
                                </button>
                            </section>

                            <section className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Email</h2>
                                <div className="space-y-3 mb-6">
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Current email</span>
                                        <p className="text-sm text-gray-600">{session?.user?.email || 'Not set'}</p>
                                    </div>
                                </div>
                                <h3 className="text-base font-medium text-gray-900 mb-4">Change your email</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">New email</label>
                                        <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Your password</label>
                                        <input type="password" value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" placeholder="Enter your current password" />
                                    </div>
                                </div>
                                <button onClick={handleChangeEmail} disabled={isEmailLoading} className="mt-4 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 disabled:opacity-50">
                                    {isEmailLoading ? 'Changing...' : 'Change email'}
                                </button>
                            </section>

                            <section className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Communication Preferences</h2>
                                <Toggle checked={postalMail} onChange={setPostalMail} label="Postal Mail" description="Allow us to send you postal mail" />
                                <Toggle checked={phoneCalls} onChange={setPhoneCalls} label="Phone Calls" description="Allow us to contact you by phone" />
                                <button onClick={handleSaveCommunicationPreferences} className="mt-4 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800">
                                    Save Preferences
                                </button>
                            </section>

                            <section className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Close your account</h2>
                                <div className="mb-4">
                                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                                        <li>Your account will be inactive until you reopen it.</li>
                                        <li>Your profile will no longer appear anywhere.</li>
                                        <li>Your settings will remain intact.</li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <select value={closeReason} onChange={(e) => setCloseReason(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
                                        <option value="">Select a reason...</option>
                                        <option value="not-using">I&apos;m not using the platform anymore</option>
                                        <option value="privacy">Privacy concerns</option>
                                        <option value="experience">Bad experience</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <label className="flex items-start gap-2">
                                        <input type="checkbox" checked={closeConfirm} onChange={(e) => setCloseConfirm(e.target.checked)} className="mt-1 w-4 h-4" />
                                        <span className="text-sm text-gray-600">Yes, I want to close this account.</span>
                                    </label>
                                </div>
                                <button onClick={handleCloseAccount} disabled={!closeConfirm || !closeReason || isClosingAccount} className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 disabled:bg-gray-400">
                                    {isClosingAccount ? 'Closing...' : 'Close account'}
                                </button>
                            </section>
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === 'security' && (
                        <div className="space-y-8">
                            <section className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Password</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                        <div className="relative">
                                            <input type={showCurrentPassword ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg pr-10" />
                                            <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                        <div className="relative">
                                            <input type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg pr-10" />
                                            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                        <div className="relative">
                                            <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg pr-10" />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleChangePassword} disabled={isPasswordLoading} className="mt-4 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 disabled:opacity-50">
                                    {isPasswordLoading ? 'Changing...' : 'Change Password'}
                                </button>
                            </section>

                            <section className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h2>
                                <div className="flex items-center gap-4">
                                    <Shield className="w-10 h-10 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">
                                            {securityData?.twoFactorEnabled ? '2FA is enabled' : '2FA is not enabled'}
                                        </p>
                                        <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                                    </div>
                                </div>
                                <button className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50">
                                    {securityData?.twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
                                </button>
                                <p className="mt-2 text-xs text-gray-400">Full 2FA requires additional setup</p>
                            </section>

                            <section className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h2>
                                <div className="space-y-3">
                                    {sessions.map((s, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">{s.device}</p>
                                                <p className="text-xs text-gray-500">{s.browser} • {s.location}</p>
                                            </div>
                                            {s.isCurrent && <span className="text-xs text-green-600 font-medium">Current</span>}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={handleRevokeAllSessions} className="mt-4 px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-full hover:bg-red-50">
                                    Sign out all other sessions
                                </button>
                            </section>

                            {securityData?.recentSecurityEvents?.length > 0 && (
                                <section className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Activity</h2>
                                    <div className="space-y-2">
                                        {securityData.recentSecurityEvents.map((e: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between text-sm">
                                                <span className="text-gray-700">{e.action.replace(/_/g, ' ')}</span>
                                                <span className="text-gray-500">{new Date(e.date).toLocaleDateString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}

                    {/* PUBLIC PROFILE TAB */}
                    {activeTab === 'public-profile' && (
                        <div className="space-y-8">
                            <section className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Public Profile</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                                        <input type="text" value={profile.displayName} onChange={(e) => setProfile({ ...profile, displayName: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                        <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" placeholder="Tell us about yourself" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input type="text" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" placeholder="City, Country" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                        <input type="url" value={profile.website} onChange={(e) => setProfile({ ...profile, website: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" placeholder="https://" />
                                    </div>
                                </div>
                                <button onClick={handleSaveProfile} className="mt-4 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800">
                                    Save Profile
                                </button>
                            </section>
                        </div>
                    )}

                    {/* PRIVACY TAB */}
                    {activeTab === 'privacy' && (
                        <div className="space-y-8">
                            <section className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Visibility</h2>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3">
                                        <input type="radio" checked={privacy.profileVisibility === 'public'} onChange={() => setPrivacy({ ...privacy, profileVisibility: 'public' })} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Public</p>
                                            <p className="text-xs text-gray-500">Anyone can see your profile</p>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3">
                                        <input type="radio" checked={privacy.profileVisibility === 'private'} onChange={() => setPrivacy({ ...privacy, profileVisibility: 'private' })} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Private</p>
                                            <p className="text-xs text-gray-500">Only you can see your profile</p>
                                        </div>
                                    </label>
                                </div>
                            </section>

                            <section className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Visibility</h2>
                                <Toggle checked={privacy.showPurchaseHistory} onChange={(v) => setPrivacy({ ...privacy, showPurchaseHistory: v })} label="Show Purchase History" description="Others can see what you've bought" />
                                <Toggle checked={privacy.showReviews} onChange={(v) => setPrivacy({ ...privacy, showReviews: v })} label="Show Reviews" description="Others can see your reviews" />
                                <Toggle checked={privacy.showWishlist} onChange={(v) => setPrivacy({ ...privacy, showWishlist: v })} label="Show Wishlist" description="Others can see your wishlist" />
                                <Toggle checked={privacy.allowMessageFromAnyone} onChange={(v) => setPrivacy({ ...privacy, allowMessageFromAnyone: v })} label="Allow Messages" description="Anyone can send you messages" />
                                <button onClick={handleSavePrivacy} className="mt-4 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800">
                                    Save Privacy Settings
                                </button>
                            </section>

                            <section className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Data</h2>
                                <button onClick={handleExportData} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50">
                                    <Download className="w-4 h-4" />
                                    Download your data
                                </button>
                                <p className="mt-2 text-xs text-gray-500">Get a copy of your data in JSON format</p>
                            </section>

                            <section className="bg-white rounded-lg border border-red-200 p-6">
                                <h2 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5" />
                                    Delete Account
                                </h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    Permanently delete your account and all data. This action cannot be undone.
                                </p>
                                {privacy.deletionRequested ? (
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <p className="text-sm text-red-700 mb-2">Deletion request pending...</p>
                                        <button onClick={async () => { await cancelDeletionRequest(); loadTabData('privacy') }} className="text-sm text-red-600 underline">
                                            Cancel deletion request
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => setActiveTab('account')} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700">
                                        Request Account Deletion
                                    </button>
                                )}
                            </section>
                        </div>
                    )}

                    {/* ADDRESSES TAB */}
                    {activeTab === 'addresses' && (
                        <div className="space-y-8">
                            <section className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">Your Addresses</h2>
                                    <button onClick={() => { setShowAddressForm(true); setEditingAddress(null); setAddressForm({ name: '', street: '', city: '', state: '', zip: '', country: 'United States' }) }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800">
                                        <Plus className="w-4 h-4" />
                                        Add Address
                                    </button>
                                </div>

                                {addresses.length === 0 ? (
                                    <div className="text-center py-8">
                                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No addresses saved yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {addresses.map((addr) => (
                                            <div key={addr.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{addr.name}</p>
                                                    <p className="text-sm text-gray-600">{addr.street}</p>
                                                    <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.zip}</p>
                                                    <p className="text-sm text-gray-600">{addr.country}</p>
                                                    {addr.isDefault && <span className="inline-block mt-2 text-xs text-green-600 font-medium">Default</span>}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => { setEditingAddress(addr); setAddressForm(addr); setShowAddressForm(true) }} className="p-2 text-gray-400 hover:text-gray-600">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDeleteAddress(addr.id)} className="p-2 text-gray-400 hover:text-red-600">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    {!addr.isDefault && (
                                                        <button onClick={() => handleSetDefaultAddress(addr.id)} className="text-xs text-blue-600 underline">
                                                            Set default
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {showAddressForm && (
                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                        <h3 className="text-base font-medium text-gray-900 mb-4">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                                        <div className="space-y-4">
                                            <input type="text" placeholder="Full Name" value={addressForm.name} onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                                            <input type="text" placeholder="Street Address" value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input type="text" placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                                                <input type="text" placeholder="State" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input type="text" placeholder="ZIP Code" value={addressForm.zip} onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                                                <select value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
                                                    <option>United States</option><option>Canada</option><option>United Kingdom</option><option>France</option><option>Germany</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            <button onClick={handleSaveAddress} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800">
                                                {editingAddress ? 'Update' : 'Add'} Address
                                            </button>
                                            <button onClick={() => { setShowAddressForm(false); setEditingAddress(null) }} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </section>
                        </div>
                    )}

                    {/* CREDIT CARDS TAB */}
                    {activeTab === 'credit-cards' && (
                        <div className="space-y-8">
                            <section className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h2>
                                <div className="text-center py-8">
                                    <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 mb-4">Payment methods are saved during checkout</p>
                                    <p className="text-sm text-gray-400">When you make a purchase, you can choose to save your payment method for faster checkout.</p>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* NOTIFICATIONS TAB */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-8">
                            <section className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h2>
                                <Toggle checked={notifications.emailNotifications} onChange={(v) => setNotifications({ ...notifications, emailNotifications: v })} label="Email Notifications" description="Receive notifications via email" />
                                <Toggle checked={notifications.orderUpdates} onChange={(v) => setNotifications({ ...notifications, orderUpdates: v })} label="Order Updates" description="Get updates about your orders" />
                                <Toggle checked={notifications.promotions} onChange={(v) => setNotifications({ ...notifications, promotions: v })} label="Promotions & Deals" description="Receive promotional emails" />
                                <Toggle checked={notifications.reviewReminders} onChange={(v) => setNotifications({ ...notifications, reviewReminders: v })} label="Review Reminders" description="Reminders to review your purchases" />
                                <Toggle checked={notifications.securityAlerts} onChange={(v) => setNotifications({ ...notifications, securityAlerts: v })} label="Security Alerts" description="Important security notifications" />
                                <Toggle checked={notifications.newsletterSubscribed} onChange={(v) => setNotifications({ ...notifications, newsletterSubscribed: v })} label="Newsletter" description="Subscribe to our newsletter" />
                            </section>

                            <section className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Frequency</h2>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3">
                                        <input type="radio" checked={notifications.emailFrequency === 'immediate'} onChange={() => setNotifications({ ...notifications, emailFrequency: 'immediate' })} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Immediate</p>
                                            <p className="text-xs text-gray-500">Get notified as things happen</p>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3">
                                        <input type="radio" checked={notifications.emailFrequency === 'daily'} onChange={() => setNotifications({ ...notifications, emailFrequency: 'daily' })} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Daily Digest</p>
                                            <p className="text-xs text-gray-500">Receive a daily summary</p>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3">
                                        <input type="radio" checked={notifications.emailFrequency === 'weekly'} onChange={() => setNotifications({ ...notifications, emailFrequency: 'weekly' })} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Weekly Digest</p>
                                            <p className="text-xs text-gray-500">Receive a weekly summary</p>
                                        </div>
                                    </label>
                                </div>
                            </section>

                            <button onClick={handleSaveNotifications} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800">
                                Save Notification Settings
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <FooterSection />
        </div>
    )
}
