import {
  AlertCircle,
  Award,
  Badge,
  Bell,
  Bitcoin,
  Bolt,
  Book,
  Briefcase,
  Building,
  CalendarCheck,
  Captions,
  CheckCircle,
  Code,
  Codepen,
  Coffee,
  File as DocumentIcon,
  Euro,
  Eye,
  File,
  FileQuestion,
  FileText,
  Flag,
  Ghost,
  Gift,
  Grid,
  Heart,
  HelpCircle,
  Kanban,
  Key,
  Layout,
  LayoutGrid,
  LifeBuoy,
  MessageSquare,
  Monitor,
  Network,
  Users as PeopleIcon,
  Plug,
  ScrollText,
  Settings,
  Share2,
  Shield,
  ShieldUser,
  ShoppingCart,
  SquareMousePointer,
  Star,
  Theater,
  TrendingUp,
  UserCheck,
  UserCircle,
  Users,
  Briefcase as WorkIcon,
  Zap,
  Activity,
  UserPlus,
  Globe,
  Lock,
  Laptop,
  ShieldCheck,
  Handshake,
  Filter,
  Home,
  Box,
  PaintBucket,
  Megaphone as Bullhorn,
  Megaphone,
  Ticket,
  Package,
  Store,
  Database,
  User,
  ArrowUpCircle,
  BarChart,
  Camera,
  ClipboardList,
  FileCode,
  Folder,
  LayoutDashboard,
  List,
  Search,
  CreditCard,
  FileDigit,
  FileSearch,
  FileCog,
  Plus,
  Tag,
  Image,
  Truck,
  Percent,
  Wallet,
  ShoppingBag
} from 'lucide-react';
import { type MenuConfig } from './types';

export const ADMIN_MENU: MenuConfig = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/admin',
  },
  {
    heading: 'User Management',
  },
  {
    title: 'Users',
    icon: Users,
    children: [
      { title: 'All Users', path: '/admin/users' },
      { title: 'Banned Users', path: '/admin/users/banned' },
    ],
  },
  {
    title: 'Vendors',
    icon: Store,
    children: [
      { title: 'All Vendors', path: '/admin/vendors' },
      { title: 'Seller Applications', path: '/admin/seller-applications' },
    ],
  },
  {
    heading: 'Product Management',
  },
  {
    title: 'Products',
    icon: Package,
    children: [
      { title: 'All Products', path: '/admin/products' },
      { title: 'Pending Approval', path: '/admin/products/pending' },
    ],
  },
  {
    title: 'Categories',
    icon: Tag,
    path: '/admin/categories',
  },
  {
    title: 'Tags',
    icon: Tag,
    path: '/admin/tags',
  },
  {
    heading: 'Orders & Finance',
  },
  {
    title: 'Orders',
    icon: ShoppingCart,
    path: '/admin/orders',
  },
  {
    title: 'Escrow',
    icon: Wallet,
    path: '/admin/escrow',
  },
  {
    title: 'Disputes',
    icon: AlertCircle,
    path: '/admin/disputes',
  },
  {
    title: 'Transactions',
    icon: CreditCard,
    path: '/admin/transactions',
  },
  {
    title: 'Withdrawals',
    icon: ArrowUpCircle,
    path: '/admin/withdrawals',
  },
  {
    heading: 'Content & Media',
  },
  {
    title: 'Digital Files',
    icon: FileDigit,
    path: '/admin/digital-files',
  },
  {
    title: 'CMS Pages',
    icon: FileText,
    path: '/admin/cms',
  },
  {
    title: 'Landing Sections',
    icon: LayoutGrid,
    path: '/admin/sections',
  },
  {
    title: 'Collections',
    icon: Folder,
    children: [
      { title: 'All Collections', path: '/admin/collections' },
      { title: 'Featured Collections', path: '/admin/featured-collections' },
    ],
  },
  {
    title: 'Page Builder',
    icon: LayoutDashboard,
    path: '/admin/page-builder',
  },
  {
    title: 'Navigation',
    icon: List,
    path: '/admin/navigation',
  },
  {
    heading: 'Analytics & Reports',
  },
  {
    title: 'Analytics',
    icon: BarChart,
    path: '/admin/analytics',
  },
  {
    heading: 'Apps Management',
  },
  {
    title: 'Apps',
    icon: ShoppingBag,
    children: [
      { title: 'All Apps', path: '/admin/apps' },
    ],
  },
  {
    heading: 'System Management',
  },
  {
    title: 'Settings',
    icon: Settings,
    children: [
      { title: 'General', path: '/admin/settings/general' },
      { title: 'Payment', path: '/admin/settings/payment' },
      { title: 'API Settings', path: '/admin/settings/api' },
      { title: 'Email', path: '/admin/settings/email' },
      { title: 'Security', path: '/admin/settings/security' },
    ],
  },
  {
    title: 'SEO',
    icon: FileSearch,
    path: '/admin/seo',
  },
  {
    title: 'Support',
    icon: Ticket,
    children: [
      { title: 'Tickets', path: '/admin/support' },
      { title: 'Live Chat', path: '/admin/support/livechat' },
      { title: 'Knowledge Base', path: '/admin/support/knowledge-base' },
      { title: 'Canned Responses', path: '/admin/support/canned-responses' },
      { title: 'Settings', path: '/admin/support/settings/ai' },
    ],
  },
  {
    title: 'System Logs',
    icon: FileCog,
    path: '/admin/system-logs',
  },
  {
    title: 'Announcements',
    icon: Megaphone,
    path: '/admin/announcements',
  },
  {
    title: 'Admin Accounts',
    icon: Shield,
    path: '/admin/admins',
  },
  {
    title: 'Badges',
    icon: Award,
    path: '/admin/badges',
  },
  {
    title: 'Software Tools',
    icon: Code,
    path: '/admin/software-tools',
  },
];

export const SELLER_MENU: MenuConfig = [
  {
    title: 'Dashboard',
    icon: Home,
    path: '/seller',
  },
  {
    title: 'Products',
    icon: Package,
    children: [
      { title: 'All Products', path: '/seller/products' },
      { title: 'Add Product', path: '/seller/products/add' },
      { title: 'Categories', path: '/seller/products/categories' },
      { title: 'Inventory', path: '/seller/products/inventory' },
    ],
  },
  {
    title: 'Orders',
    icon: ShoppingCart,
    children: [
      { title: 'All Orders', path: '/seller/orders' },
      { title: 'Pending', path: '/seller/orders/pending' },
      { title: 'Completed', path: '/seller/orders/completed' },
      { title: 'Returns', path: '/seller/orders/returns' },
    ],
  },
  {
    title: 'Customers',
    icon: Users,
    children: [
      { title: 'All Customers', path: '/seller/customers' },
      { title: 'Segments', path: '/seller/customers/segments' },
      { title: 'Reviews', path: '/seller/customers/reviews' },
    ],
  },
  {
    title: 'Marketing',
    icon: TrendingUp,
    children: [
      { title: 'Offers', path: '/seller/marketing/discounts' }, // Consolidated Discounts & Coupons
      { title: 'Promotions', path: '/seller/marketing/promotions' },
      { title: 'Featured Products', path: '/seller/marketing/featured' },
    ],
  },
  {
    title: 'Analytics',
    icon: BarChart,
    path: '/seller/analytics',
  },
  {
    title: 'Finance',
    icon: CreditCard,
    children: [
      { title: 'Payments', path: '/seller/finance/payments' },
      { title: 'Payouts', path: '/seller/finance/payouts' },
      { title: 'Invoices', path: '/seller/finance/invoices' },
    ],
  },
  {
    title: 'Apps',
    icon: ShoppingBag,
    children: [
      { title: 'My Apps', path: '/seller/apps' },
      { title: 'App Store', path: '/seller/app-store' },
    ],
  },
  {
    title: 'Store Settings',
    icon: Settings,
    children: [
      { title: 'Store Profile', path: '/seller/settings/profile' },
      { title: 'Storefront', path: '/seller/settings/storefront' }, // New link
      { title: 'Payout Methods', path: '/seller/settings/payout-methods' },
      { title: 'Shipping', path: '/seller/settings/shipping' },
      { title: 'Tax Settings', path: '/seller/settings/tax' },
      { title: 'Notifications', path: '/seller/settings/notifications' },
    ],
  },
  {
    title: 'Messages',
    icon: MessageSquare,
    path: '/seller/messages',
  },
  {
    title: 'Support',
    icon: Ticket,
    path: '/seller/support',
  },
];

export const DEVELOPER_MENU: MenuConfig = [
  {
    title: 'My Apps',
    icon: ShoppingBag,
    path: '/developer',
  },
  {
    title: 'Documentation',
    icon: Book,
    path: '/developer/docs', // Placeholder
  },
];

export const MENU_SIDEBAR: MenuConfig = ADMIN_MENU;

export const MENU_MEGA: MenuConfig = [
  { title: 'Home', path: '/' },
  {
    title: 'Profiles',
    children: [
      {
        title: 'Profiles',
        children: [
          {
            children: [
              {
                title: 'Default',
                icon: Badge,
                path: '/public-profile/profiles/default',
              },
              {
                title: 'Creator',
                icon: Coffee,
                path: '/public-profile/profiles/creator',
              },
              {
                title: 'Company',
                icon: Building,
                path: '/public-profile/profiles/company',
              },
              {
                title: 'NFT',
                icon: Bitcoin,
                path: '/public-profile/profiles/nft',
              },
              {
                title: 'Blogger',
                icon: MessageSquare,
                path: '/public-profile/profiles/blogger',
              },
              {
                title: 'CRM',
                icon: Monitor,
                path: '/public-profile/profiles/crm',
              },
              {
                title: 'Gamer',
                icon: Ghost,
                path: '/public-profile/profiles/gamer',
              },
            ],
          },
          {
            children: [
              {
                title: 'Feeds',
                icon: Book,
                path: '/public-profile/profiles/feeds',
              },
              {
                title: 'Plain',
                icon: File,
                path: '/public-profile/profiles/plain',
              },
              {
                title: 'Modal',
                icon: SquareMousePointer,
                path: '/public-profile/profiles/modal',
              },
              {
                title: 'Freelancer',
                icon: Briefcase,
                path: '#',
                disabled: true,
              },
              {
                title: 'Developer',
                icon: Code,
                path: '#',
                disabled: true,
              },
              {
                title: 'Team',
                icon: Users,
                path: '#',
                disabled: true,
              },
              {
                title: 'Events',
                icon: CalendarCheck,
                path: '#',
                disabled: true,
              },
            ],
          },
        ],
      },
      {
        title: 'Other',
        children: [
          {
            children: [
              {
                title: 'Projects - 3 Columns',
                icon: Folder,
                path: '/public-profile/projects/3-columns',
              },
              {
                title: 'Projects - 2 Columns',
                icon: LayoutGrid,
                path: '/public-profile/projects/2-columns',
              },
              {
                title: 'Works',
                icon: PaintBucket,
                path: '/public-profile/works',
              },
              {
                title: 'Teams',
                icon: Users,
                path: '/public-profile/teams',
              },
              {
                title: 'Network',
                icon: Network,
                path: '/public-profile/network',
              },
              {
                title: 'Activity',
                icon: Activity,
                path: '/public-profile/activity',
              },
              {
                title: 'Campaigns - Card',
                icon: Bullhorn,
                path: '/public-profile/campaigns/card',
              },
              {
                title: 'Campaigns - List',
                icon: List,
                path: '/public-profile/campaigns/list',
              },
              {
                title: 'Empty',
                icon: File,
                path: '/public-profile/empty',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'My Account',
    children: [
      {
        title: 'General',
        children: [
          {
            children: [
              {
                title: 'Get Started',
                icon: Badge,
                path: '/account/home/get-started',
              },
              {
                title: 'User Profile',
                icon: UserCircle,
                path: '/account/home/user-profile',
              },
              {
                title: 'Company Profile',
                icon: Building,
                path: '/account/home/company-profile',
              },
              {
                title: 'Settings - With Sidebar',
                icon: Settings,
                path: '/account/home/settings-sidebar',
              },
              {
                title: 'Settings - Enterprise',
                icon: Settings,
                path: '/account/home/settings-enterprise',
              },
              {
                title: 'Settings - Plain',
                icon: Settings,
                path: '/account/home/settings-plain',
              },
              {
                title: 'Settings - Modal',
                icon: Settings,
                path: '/account/home/settings-modal',
              },
              {
                title: 'Billing - Basic',
                icon: FileText,
                path: '/account/billing/basic',
              },
              {
                title: 'Billing - Enterprise',
                icon: FileText,
                path: '/account/billing/enterprise',
              },
              {
                title: 'Plans',
                icon: FileText,
                path: '/account/billing/plans',
              },
              {
                title: 'Billing History',
                icon: FileText,
                path: '/account/billing/history',
              },
            ],
          },
        ],
      },
      {
        title: 'Other',
        children: [
          {
            children: [
              {
                title: 'Security - Get Started',
                icon: ShieldCheck,
                path: '/account/security/get-started',
              },
              {
                title: 'Security - Overview',
                icon: ShieldCheck,
                path: '/account/security/overview',
              },
              {
                title: 'Allowed IP Addresses',
                icon: Globe,
                path: '/account/security/allowed-ip-addresses',
              },
              {
                title: 'Privacy Settings',
                icon: Lock,
                path: '/account/security/privacy-settings',
              },
              {
                title: 'Device Management',
                icon: Laptop,
                path: '/account/security/device-management',
              },
              {
                title: 'Backup & Recovery',
                icon: Database,
                path: '/account/security/backup-and-recovery',
              },
              {
                title: 'Current Sessions',
                icon: Key,
                path: '/account/security/current-sessions',
              },
              {
                title: 'Security Log',
                icon: FileText,
                path: '/account/security/security-log',
              },
              {
                title: 'Members & Roles',
                icon: Users,
                path: '/account/members/team-starter',
              },
              {
                title: 'Integrations',
                icon: Zap,
                path: '/account/integrations',
              },
              {
                title: 'Notifications',
                icon: Bell,
                path: '/account/notifications',
              },
              {
                title: 'API Keys',
                icon: Key,
                path: '/account/api-keys',
              },
              {
                title: 'Appearance',
                icon: Eye,
                path: '/account/appearance',
              },
              {
                title: 'Invite a Friend',
                icon: UserPlus,
                path: '/account/invite-a-friend',
              },
              {
                title: 'Activity',
                icon: Activity,
                path: '/account/activity',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Network',
    children: [
      {
        title: 'General',
        children: [
          {
            children: [
              {
                title: 'Get Started',
                icon: Flag,
                path: '/network/get-started',
              },
              {
                title: 'User Cards - Mini Cards',
                icon: UserCircle,
                path: '/network/user-cards/mini-cards',
              },
              {
                title: 'User Cards - Team Crew',
                icon: Users,
                path: '/network/user-cards/team-crew',
              },
              {
                title: 'User Cards - Author',
                icon: UserCheck,
                path: '/network/user-cards/author',
              },
              {
                title: 'User Cards - NFT',
                icon: Bitcoin,
                path: '/network/user-cards/nft',
              },
              {
                title: 'User Cards - Social',
                icon: Share2,
                path: '/network/user-cards/social',
              },
              {
                title: 'User Table - Team Crew',
                icon: Users,
                path: '/network/user-table/team-crew',
              },
              {
                title: 'User Table - App Roster',
                icon: Users,
                path: '/network/user-table/app-roster',
              },
              {
                title: 'User Table - Market Authors',
                icon: UserCheck,
                path: '/network/user-table/market-authors',
              },
              {
                title: 'User Table - SaaS Users',
                icon: Users,
                path: '/network/user-table/saas-users',
              },
              {
                title: 'User Table - Store Clients',
                icon: Store,
                path: '/network/user-table/store-clients',
              },
              {
                title: 'User Table - Visitors',
                icon: Eye,
                path: '/network/user-table/visitors',
              },
            ],
          },
        ],
      },
      {
        title: 'Other',
        children: [
          {
            children: [
              {
                title: 'Cooperations',
                icon: Handshake,
                path: '/network/cooperations',
                disabled: true,
              },
              {
                title: 'Leads',
                icon: Filter,
                path: '/network/leads',
                disabled: true,
              },
              {
                title: 'Donators',
                icon: Heart,
                path: '/network/donators',
                disabled: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Apps',
    children: [
      {
        title: 'User Management',
        children: [
          {
            children: [
              {
                title: 'Users',
                icon: Users,
                path: '/user-management/users',
              },
              {
                title: 'Roles',
                icon: ShieldCheck,
                path: '/user-management/roles',
              },
              {
                title: 'Permissions',
                icon: Lock,
                path: '/user-management/permissions',
              },
              {
                title: 'Account',
                icon: UserCircle,
                path: '/user-management/account',
              },
              {
                title: 'Logs',
                icon: FileText,
                path: '/user-management/logs',
              },
              {
                title: 'Settings',
                icon: Settings,
                path: '/user-management/settings',
              },
            ],
          },
        ],
      },
      {
        title: 'Store - Client',
        children: [
          {
            children: [
              {
                title: 'Home',
                icon: Home,
                path: '/store-client/home',
              },
              {
                title: 'Search Results - Grid',
                icon: LayoutGrid,
                path: '/store-client/search-results-grid',
              },
              {
                title: 'Search Results - List',
                icon: List,
                path: '/store-client/search-results-list',
              },
              {
                title: 'Product Details',
                icon: Package,
                path: '/store-client/product-details',
              },
              {
                title: 'Wishlist',
                icon: Heart,
                path: '/store-client/wishlist',
              },
              {
                title: 'Checkout',
                icon: ShoppingCart,
                path: '/store-client/checkout/order-summary',
              },
              {
                title: 'My Orders',
                icon: Package,
                path: '/store-client/my-orders',
              },
              {
                title: 'Order Receipt',
                icon: FileText,
                path: '/store-client/order-receipt',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Help',
    children: [
      {
        title: 'General',
        children: [
          {
            children: [
              {
                title: 'Layouts',
                icon: Layout,
                path: 'https://keenthemes.com/metronic/tailwind/docs/layouts/demo1',
              },
              {
                title: 'Documentation',
                icon: Book,
                path: 'https://keenthemes.com/metronic/tailwind/docs',
              },
              {
                title: 'Components',
                icon: Box,
                path: 'https://keenthemes.com/metronic/tailwind/docs/components/accordion',
              },
              {
                title: 'Support',
                icon: LifeBuoy,
                path: 'https://devs.keenthemes.com',
              },
              {
                title: 'Changelog',
                icon: FileText,
                path: 'https://keenthemes.com/metronic/tailwind/docs/changelog',
              },
            ],
          },
        ],
      },
    ],
  },
];

// Export mobile version (same as desktop for now)
export const MENU_MEGA_MOBILE: MenuConfig = MENU_MEGA;
