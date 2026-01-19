import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { ShopContent } from "@/components/3dm/shop-content";

interface ShopPageProps {
    params: Promise<{ id: string }>;
}

export default async function ShopPage({ params }: ShopPageProps) {
    const { id } = await params;

    // Mock vendor data for demo
    const mockVendor = {
        id: id,
        name: "SbriStudio",
        avatar: null,
        banner: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200",
        description: "Personalised leather goods handmade in the UK",
        location: "Ringwood, United Kingdom",
        rating: 4.9,
        reviewCount: 2800,
        salesCount: 16700,
        joinedYear: 2019,
        products: [
            { id: "1", name: "Personalised Leather Coin Purse", price: 35.99, thumbnail: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400" },
            { id: "2", name: "Custom Leather Bookmark", price: 18.50, thumbnail: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400" },
            { id: "3", name: "Leather Keyring Gold Foil", price: 15.99, thumbnail: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400" },
            { id: "4", name: "Personalised Pet Tag", price: 24.99, thumbnail: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400" },
            { id: "5", name: "Leather Card Holder", price: 29.99, thumbnail: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400" },
            { id: "6", name: "Mini Coin Purse Pink", price: 22.00, thumbnail: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400" },
            { id: "7", name: "Leather Passport Cover", price: 45.00, thumbnail: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" },
            { id: "8", name: "Monogram Key Organizer", price: 19.99, thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
            { id: "9", name: "Heart Print Wallet", price: 38.50, thumbnail: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400" },
            { id: "10", name: "Leather Luggage Tag", price: 16.00, thumbnail: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400" },
            { id: "11", name: "Custom Cable Organizer", price: 12.99, thumbnail: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400" },
            { id: "12", name: "Leather Journal Cover", price: 55.00, thumbnail: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400" },
        ]
    };

    const vendorData = mockVendor;

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <div className="h-[72px]" />
            <ShopContent vendor={vendorData} />
            <Footer />
        </div>
    );
}
