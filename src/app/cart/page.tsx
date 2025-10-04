'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useCart } from './Cart.context';
import ItemService from '../items/services/ItemService';
import Item from '../items/models/Item';
import Link from 'next/link';
import styles from './Cart.module.css';

interface CartItem {
    item: Item;
    quantity: number;
}

export default function CartPage() {
    const { cartItems, removeFromCart, updateItemQuantity, clearCart, cartItemCount } = useCart();
    const [cartItemsWithDetails, setCartItemsWithDetails] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    // Fetch item details for cart items
    useEffect(() => {
        const fetchCartItemDetails = async () => {
            if (cartItems.length === 0) {
                setCartItemsWithDetails([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const itemDetailsPromises = cartItems.map(async (cartItem) => {
                    try {
                        const item = await ItemService.getItemById(cartItem.itemId);
                        if (item) {
                            return { item, quantity: cartItem.quantity };
                        }
                        return null;
                    } catch (error) {
                        console.error(`Error fetching item ${cartItem.itemId}:`, error);
                        return null;
                    }
                });

                const results = await Promise.all(itemDetailsPromises);
                const validItems = results.filter((result): result is CartItem => result !== null);
                
                setCartItemsWithDetails(validItems);
            } catch (err) {
                console.error('Error fetching cart item details:', err);
                setError('Failed to load cart items');
            } finally {
                setLoading(false);
            }
        };

        fetchCartItemDetails();
    }, [cartItems]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EGP',
        }).format(price);
    };

    const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            handleRemoveItem(itemId);
            return;
        }

        setIsUpdating(itemId);
        try {
            updateItemQuantity(itemId, newQuantity);
        } finally {
            setIsUpdating(null);
        }
    };

    const handleRemoveItem = (itemId: string) => {
        removeFromCart(itemId);
    };

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear all items from your cart?')) {
            clearCart();
        }
    };

    const calculateSubtotal = () => {
        return cartItemsWithDetails.reduce((total, cartItem) => {
            return total + (cartItem.item.price * cartItem.quantity);
        }, 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const shipping = subtotal > 500 ? 0 : 50; // Free shipping over 500 EGP
        return subtotal + shipping;
    };

    const getShippingCost = () => {
        return calculateSubtotal() > 500 ? 0 : 50;
    };

    // Loading state
    if (loading) {
        return (
            <main className={styles.container}>
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingCard}>
                        <div className={styles.skeletonPulse}>
                            <div className={`${styles.skeletonBar} ${styles.skeletonTitle}`}></div>
                            <div>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className={styles.skeletonItem}>
                                        <div className={styles.skeletonImage}></div>
                                        <div className={styles.skeletonContent}>
                                            <div className={`${styles.skeletonLine}`}></div>
                                            <div className={`${styles.skeletonLine} ${styles.skeletonShort}`}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // Error state
    if (error) {
        return (
            <main className={styles.container}>
                <div className={styles.errorState}>
                    <div className={styles.errorCard}>
                        <Icon icon="mdi:alert-circle" className={styles.errorIcon} />
                        <h2 className={styles.errorTitle}>Something went wrong</h2>
                        <p className={styles.errorDescription}>{error}</p>
                        <button 
                            className={styles.errorButton}
                            onClick={() => window.location.reload()}
                        >
                            <Icon icon="mdi:refresh" />
                            Try Again
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    // Empty cart state
    if (cartItemsWithDetails.length === 0) {
        return (
            <main className={styles.container}>
                <div className={styles.emptyState}>
                    <div className={styles.emptyCard}>
                        <Icon icon="mdi:cart-outline" className={styles.emptyIcon} />
                        <h2 className={styles.emptyTitle}>Your cart is empty</h2>
                        <p className={styles.emptyDescription}>
                            Looks like you haven't added any items to your cart yet.
                        </p>
                        <Link href="/items" className={styles.emptyButton}>
                            <Icon icon="mdi:shopping" />
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.container}>
            <div className={styles.maxWidth}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Shopping Cart</h1>
                    <p className={styles.subtitle}>
                        {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                <div className={styles.gridLayout}>
                    {/* Cart Items */}
                    <div>
                        <div className={styles.cartSection}>
                                {/* Cart Header */}
                                <div className={styles.cartHeader}>
                                    <h2 className={styles.cartTitle}>Cart Items</h2>
                                    <button 
                                        onClick={handleClearCart}
                                        className={styles.clearButton}
                                    >
                                        <Icon icon="mdi:trash-can" />
                                        Clear Cart
                                    </button>
                                </div>

                                {/* Cart Items List */}
                                <div className={styles.cartItems}>
                                    {cartItemsWithDetails.map(({ item, quantity }) => (
                                        <div key={item.id} className={styles.cartItem}>
                                            <div className={styles.itemLayout}>
                                                {/* Item Image */}
                                                <div className={styles.itemImage}>
                                                    {item.imageUrl ? (
                                                        <img 
                                                            src={item.imageUrl} 
                                                            alt={item.name}
                                                        />
                                                    ) : (
                                                        <Icon icon="mdi:image" className={styles.itemImagePlaceholder} />
                                                    )}
                                                </div>

                                                {/* Item Details */}
                                                <div className={styles.itemDetails}>
                                                    <div className={styles.itemHeader}>
                                                        <div className={styles.itemInfo}>
                                                            <Link 
                                                                href={`/items/${item.id}`}
                                                                className={styles.itemName}
                                                            >
                                                                {item.name}
                                                            </Link>
                                                            {item.category && (
                                                                <p className={styles.itemCategory}>{item.category}</p>
                                                            )}
                                                            {item.description && (
                                                                <p className={styles.itemDescription}>
                                                                    {item.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            className={styles.removeButton}
                                                            title="Remove item"
                                                        >
                                                            <Icon icon="mdi:close" />
                                                        </button>
                                                    </div>

                                                    {/* Quantity and Price */}
                                                    <div className={styles.itemFooter}>
                                                        <div className={styles.quantityControls}>
                                                            <button 
                                                                onClick={() => handleQuantityUpdate(item.id, quantity - 1)}
                                                                disabled={isUpdating === item.id || quantity <= 1}
                                                                className={styles.quantityButton}
                                                                title="Decrease quantity"
                                                            >
                                                                <Icon icon="mdi:minus" width={16} height={16} />
                                                            </button>
                                                            <div className={styles.quantityDisplay}>
                                                                {isUpdating === item.id ? (
                                                                    <Icon icon="mdi:loading" className={styles.loadingSpinner} />
                                                                ) : (
                                                                    quantity
                                                                )}
                                                            </div>
                                                            <button 
                                                                onClick={() => handleQuantityUpdate(item.id, quantity + 1)}
                                                                disabled={isUpdating === item.id}
                                                                className={styles.quantityButton}
                                                                title="Increase quantity"
                                                            >
                                                                <Icon icon="mdi:add" width={16} height={16} />
                                                            </button>
                                                        </div>

                                                        <div className={styles.priceInfo}>
                                                            <div className={styles.totalPrice}>
                                                                {formatPrice(item.price * quantity)}
                                                            </div>
                                                            <div className={styles.unitPrice}>
                                                                {formatPrice(item.price)} each
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <div className={styles.orderSummary}>
                                <div className={styles.summaryContent}>
                                    <h2 className={styles.summaryTitle}>Order Summary</h2>
                                    
                                    <div className={styles.summaryDetails}>
                                        <div className={styles.summaryRow}>
                                            <span className={styles.summaryLabel}>Subtotal ({cartItemCount} items)</span>
                                            <span className={styles.summaryValue}>{formatPrice(calculateSubtotal())}</span>
                                        </div>
                                        <div className={styles.summaryRow}>
                                            <span className={styles.summaryLabel}>Shipping</span>
                                            <span className={styles.summaryValue}>
                                                {getShippingCost() === 0 ? (
                                                    <span className={styles.freeShipping}>Free</span>
                                                ) : (
                                                    formatPrice(getShippingCost())
                                                )}
                                            </span>
                                        </div>
                                        {getShippingCost() > 0 && (
                                            <div className={styles.shippingNote}>
                                                Free shipping on orders over {formatPrice(500)}
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.summaryTotal}>
                                        <div className={styles.totalRow}>
                                            <span className={styles.totalLabel}>Total</span>
                                            <span className={styles.totalAmount}>
                                                {formatPrice(calculateTotal())}
                                            </span>
                                        </div>
                                    </div>

                                    <button className={styles.checkoutButton}>
                                        <Icon icon="mdi:credit-card" />
                                        Proceed to Checkout
                                    </button>

                                    <Link 
                                        href="/items" 
                                        className={styles.continueButton}
                                    >
                                        <Icon icon="mdi:shopping" />
                                        Continue Shopping
                                    </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}