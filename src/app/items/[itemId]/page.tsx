'use client';

import { useParams, useRouter } from "next/navigation";
import { Icon } from '@iconify/react';
import { useCart } from '../../cart/Cart.context';
import ItemPreview from "./components/ItemPreview";

export default function ItemPage() {
    const router = useRouter();
    const { cartItemCount } = useCart();

    // Fetch itemId from URL params
    const { itemId } = useParams<{ itemId: string }>();

    if (!itemId) {
        return <div>Item ID is missing.</div>;
    }

    return (
        <main className="relative">
            {/* Fixed Cart Button */}
            <div className="fixed top-4 right-4 z-50">
                <button
                    onClick={() => router.push('/cart')}
                    className="relative flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-300 hover:border-primary text-gray-700 hover:text-primary px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    <Icon icon="mdi:shopping-cart" className="text-lg" />
                    <span className="font-medium">Cart</span>
                    {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-5">
                            {cartItemCount > 99 ? '99+' : cartItemCount}
                        </span>
                    )}
                </button>
            </div>

            <ItemPreview itemId={itemId as string} />
        </main>
    )
    
}