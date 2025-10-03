'use client';

import { useParams } from "next/navigation";
import ItemPreview from "./components/ItemPreview";

export default function ItemPage() {

    // Fetch itemId from URL params
    const { itemId } = useParams<{ itemId: string }>();

    if (!itemId) {
        return <div>Item ID is missing.</div>;
    }

    return (
        <main>
            <ItemPreview itemId={itemId as string} />
        </main>
    )
    
}