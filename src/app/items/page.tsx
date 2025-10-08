'use client';

import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useCart } from '../cart/Cart.context';
import ItemsListWithFilters from "./components/ItemsListWithFilters";
import Image from 'next/image';

export default function ItemsPage() {
    const router = useRouter();
    const { cartItemCount } = useCart();

    return (
        <main>
            {/* Header with Logo and Breadcrumb Navigation */}
            <section className="bg-gray-100 py-6">
                <div className="container mx-auto px-4">
                    {/* Logo */}
                    <div className="flex justify-center mb-4">
                        <Image 
                            src="/logo_tiny.png"
                            alt="Malaura Logo"
                            className="w-auto object-contain"
                            width={50}
                            height={50}
                            priority
                        />
                    </div>
                    
                    {/* Navigation Header */}
                    <div className="flex justify-between items-center mb-4">
                        {/* Breadcrumb Navigation */}
                        <nav className="flex gap-4 items-center text-sm text-gray-600">
                            <a href="/" className="hover:text-primary transition-colors">
                                <i className="fas fa-home mr-1"></i>
                                Home
                            </a>
                            <span className="mx-2">
                                <i className="fas fa-chevron-right text-xs"></i>
                            </span>
                            <span className="text-dark font-medium">Products</span>
                        </nav>

                        {/* Cart Button */}
                        <button
                            onClick={() => router.push('/cart')}
                            className="relative flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-300 hover:border-primary text-gray-700 hover:text-primary px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
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
                </div>
            </section>

            {/* Main Content */}
            <ItemsListWithFilters />
        </main>
    );
}