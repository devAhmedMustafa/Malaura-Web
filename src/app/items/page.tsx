'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '../cart/Cart.context';
import ItemsListWithFilters from "./components/ItemsListWithFilters";
import Navbar from '@/components/Navbar';

export default function ItemsPage() {
    const router = useRouter();
    const { cartItemCount } = useCart();

    return (
        <main>
            <Navbar />

            {/* Main Content */}
            <ItemsListWithFilters />
        </main>
    );
}