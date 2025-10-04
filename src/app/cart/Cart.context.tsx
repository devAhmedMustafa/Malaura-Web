'use client';

import { createContext, useContext, useEffect, useState } from "react";

interface CartContextType {
    cartItemCount: number;
    cartItems: { itemId: string; quantity: number }[];
    addToCart: (itemId: string, quantity?: number) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
    getItemQuantity: (itemId: string) => number;
    updateItemQuantity: (itemId: string, quantity: number) => void;
    isInCart: (itemId: string) => boolean;
}

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({children}: {children: React.ReactNode})=> {

    const [cartItems, setCartItems] = useState<{ itemId: string; quantity: number }[]>(
        localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')!) : []
    );

    useEffect(()=> {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (itemId: string, quantity: number = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.itemId === itemId);
            if (existingItem) {
                // If item exists, update quantity
                return prevItems.map(item =>
                    item.itemId === itemId ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            // If item doesn't exist, add it
            return [...prevItems, { itemId, quantity }];
        });
    };

    const removeFromCart = (itemId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.itemId !== itemId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getItemQuantity = (itemId: string): number => {
        const item = cartItems.find(item => item.itemId === itemId);
        return item ? item.quantity : 0;
    };

    const updateItemQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.itemId === itemId);
            if (existingItem) {
                return prevItems.map(item =>
                    item.itemId === itemId ? { ...item, quantity } : item
                );
            }
            // If item doesn't exist, add it
            return [...prevItems, { itemId, quantity }];
        });
    };

    const isInCart = (itemId: string): boolean => {
        return cartItems.some(item => item.itemId === itemId);
    };

    return (
        <CartContext.Provider value={{
            cartItemCount: cartItems.reduce((total, item) => total + item.quantity, 0),
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            getItemQuantity,
            updateItemQuantity,
            isInCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};