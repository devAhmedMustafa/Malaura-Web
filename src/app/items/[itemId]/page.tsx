'use client';

import { useParams, useRouter } from "next/navigation";
import { Icon } from '@iconify/react';
import { useCart } from '../../cart/Cart.context';
import ItemPreview from "./components/ItemPreview";
import Navbar from "@/components/Navbar";

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

            <Navbar />

            <ItemPreview itemId={itemId as string} />
        </main>
    )
    
}