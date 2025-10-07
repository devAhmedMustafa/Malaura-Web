'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useCart } from '../cart/Cart.context';
import { useAuth } from '../auth/AuthContext';
import ItemService from '../items/services/ItemService';
import PlaceOrderService from './services/placeOrderService';
import { PlaceOrderRequest } from './models/PlaceOrder.dtos';
import Item from '../items/models/Item';
import GoogleMap from './components/GoogleMap';
import styles from './Checkout.module.css';
import { STORE_ID } from '../data/IDs';

interface CartItem {
    item: Item;
    quantity: number;
}

interface CustomerInfo {
    name: string;
    phone: string;
    address: string;
    latitude: number;
    longitude: number;
}

interface FormErrors {
    name?: string;
    phone?: string;
    address?: string;
    location?: string;
}

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, clearCart, cartItemCount } = useCart();
    const { user, isAuthenticated, token } = useAuth();
    
    const [cartItemsWithDetails, setCartItemsWithDetails] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Form state
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        name: '',
        phone: '',
        address: '',
        latitude: 0,
        longitude: 0
    });
    
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online'>('cash');
    const orderType = 2;
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    // Load cart item details
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
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setError('Failed to load cart items');
            } finally {
                setLoading(false);
            }
        };

        fetchCartItemDetails();
    }, [cartItems]);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/auth?from=/checkout');
        }
    }, [isAuthenticated, router]);

    // Redirect if cart is empty
    useEffect(() => {
        if (!loading && cartItemsWithDetails.length === 0) {
            router.push('/cart');
        }
    }, [loading, cartItemsWithDetails.length, router]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EGP',
        }).format(price);
    };

    const calculateSubtotal = () => {
        return cartItemsWithDetails.reduce((total, cartItem) => {
            return total + (cartItem.item.price * cartItem.quantity);
        }, 0);
    };

    const calculateDeliveryFee = () => {
        return 50; // 50 EGP delivery fee for all orders
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateDeliveryFee();
    };

    const validateForm = (): boolean => {
        const errors: FormErrors = {};
        
        if (!customerInfo.name.trim()) {
            errors.name = 'Name is required';
        }
        
        if (!customerInfo.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^(\+20|0)?1[0125]\d{8}$/.test(customerInfo.phone.replace(/\s/g, ''))) {
            errors.phone = 'Please enter a valid Egyptian phone number';
        }
        
        if (!customerInfo.address.trim()) {
            errors.address = 'Delivery address is required';
        }
        
        if (customerInfo.latitude === 0 || customerInfo.longitude === 0) {
            errors.location = 'Please select your location on the map';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        if (!user || !token) {
            setError('Please log in to place an order');
            return;
        }
        
        setSubmitting(true);
        setError(null);
        
        try {
            const orderData = new PlaceOrderRequest({
                storeId: STORE_ID,
                customerId: user.id,
                customerName: customerInfo.name,
                customerPhone: customerInfo.phone,
                latitude: customerInfo.latitude,
                longitude: customerInfo.longitude,
                items: cartItems,
                paymentMethod: paymentMethod,
                address: customerInfo.address
            });
            
            orderData.orderType = orderType;
            
            const response = await PlaceOrderService.placeOrder(orderData, token);
            
            // Clear cart after successful order
            clearCart();
            
            // Redirect to success page or order tracking
            if (response.redirectUrl) {
                window.location.href = response.redirectUrl;
            } else {
                router.push(`/orders/${response.orderId}`);
            }
            
        } catch (error) {
            console.error('Error placing order:', error);
            setError(error instanceof Error ? error.message : 'Failed to place order');
        } finally {
            setSubmitting(false);
        }
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setFormErrors(prev => ({ ...prev, location: 'Geolocation is not supported by this browser' }));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCustomerInfo(prev => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }));
                setFormErrors(prev => ({ ...prev, location: undefined }));
            },
            (error) => {
                console.error('Error getting location:', error);
                setFormErrors(prev => ({ ...prev, location: 'Unable to get your location' }));
            }
        );
    };

    const handleLocationSelect = (location: { address: string; latitude: number; longitude: number }) => {
        setCustomerInfo(prev => ({
            ...prev,
            address: location.address,
            latitude: location.latitude,
            longitude: location.longitude
        }));
        // Clear any previous location or address errors
        setFormErrors(prev => ({
            ...prev,
            location: undefined,
            address: undefined
        }));
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Loading checkout...</p>
                </div>
            </div>
        );
    }

    if (error && cartItemsWithDetails.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.errorContainer}>
                    <Icon icon="mdi:alert-circle" className={styles.errorIcon} />
                    <h2>Something went wrong</h2>
                    <p>{error}</p>
                    <button onClick={() => router.push('/cart')} className={styles.errorButton}>
                        <Icon icon="mdi:arrow-left" />
                        Back to Cart
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.maxWidth}>
                {/* Header */}
                <div className={styles.header}>
                    <button 
                        onClick={() => router.push('/cart')}
                        className={styles.backButton}
                    >
                        <Icon icon="mdi:arrow-left" />
                        Back to Cart
                    </button>
                    <h1 className={styles.title}>Checkout</h1>
                    <div className={styles.stepIndicator}>
                        <span>Step 2 of 2</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={styles.checkoutForm}>
                    <div className={styles.gridLayout}>
                        {/* Left Column - Forms */}
                        <div className={styles.formsContainer}>
                            {/* Customer Information */}
                            <section className={styles.section}>
                                <h2 className={styles.sectionTitle}>
                                    <Icon icon="mdi:account" />
                                    Customer Information
                                </h2>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Full Name *</label>
                                        <input
                                            type="text"
                                            value={customerInfo.name}
                                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                                            className={`${styles.input} ${formErrors.name ? styles.inputError : ''}`}
                                            placeholder="Enter your full name"
                                        />
                                        {formErrors.name && <span className={styles.error}>{formErrors.name}</span>}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={customerInfo.phone}
                                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                                            className={`${styles.input} ${formErrors.phone ? styles.inputError : ''}`}
                                            placeholder="01xxxxxxxxx"
                                        />
                                        {formErrors.phone && <span className={styles.error}>{formErrors.phone}</span>}
                                    </div>
                                </div>
                            </section>

                            {/* Delivery Address */}
                            <section className={styles.section}>
                                <h2 className={styles.sectionTitle}>
                                    <Icon icon="mdi:map-marker" />
                                    Delivery Address
                                </h2>
                                
                                {/* Google Maps Component */}
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Select Delivery Location *</label>
                                    <GoogleMap
                                        onLocationSelect={handleLocationSelect}
                                        initialLocation={
                                            customerInfo.latitude !== 0 && customerInfo.longitude !== 0
                                                ? { latitude: customerInfo.latitude, longitude: customerInfo.longitude }
                                                : undefined
                                        }
                                        className={styles.mapContainer}
                                    />
                                    {formErrors.location && <span className={styles.error}>{formErrors.location}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Address Details *</label>
                                    <textarea
                                        value={customerInfo.address}
                                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                                        className={`${styles.textarea} ${formErrors.address ? styles.inputError : ''}`}
                                        placeholder="Address will be filled automatically when you select a location on the map, or enter it manually"
                                        rows={3}
                                    />
                                    {formErrors.address && <span className={styles.error}>{formErrors.address}</span>}
                                </div>
                            </section>

                            {/* Payment Method */}
                            <section className={styles.section}>
                                <h2 className={styles.sectionTitle}>
                                    <Icon icon="mdi:credit-card" />
                                    Payment Method
                                </h2>
                                <div className={styles.paymentOptions}>
                                    <label className={`${styles.paymentOption} ${paymentMethod === 'cash' ? styles.selected : ''}`}>
                                        <input
                                            type="radio"
                                            value="cash"
                                            checked={paymentMethod === 'cash'}
                                            onChange={(e) => setPaymentMethod('cash')}
                                        />
                                        <div className={styles.optionContent}>
                                            <Icon icon="mdi:cash" />
                                            <div>
                                                <strong>Cash on Delivery</strong>
                                                <p>Pay when you receive your order</p>
                                            </div>
                                        </div>
                                    </label>
                                    <label className={`${styles.paymentOption} ${paymentMethod === 'online' ? styles.selected : ''}`}>
                                        <input
                                            type="radio"
                                            value="online"
                                            checked={paymentMethod === 'online'}
                                            onChange={(e) => setPaymentMethod('online')}
                                        />
                                        <div className={styles.optionContent}>
                                            <Icon icon="mdi:credit-card-outline" />
                                            <div>
                                                <strong>Online Payment</strong>
                                                <p>Pay now with card or mobile wallet</p>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </section>

                        </div>

                        {/* Right Column - Order Summary */}
                        <div className={styles.summaryContainer}>
                            <div className={styles.orderSummary}>
                                <h2 className={styles.summaryTitle}>Order Summary</h2>
                                
                                {/* Order Items */}
                                <div className={styles.orderItems}>
                                    {cartItemsWithDetails.map(({ item, quantity }) => (
                                        <div key={item.id} className={styles.orderItem}>
                                            <div className={styles.itemImage}>
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt={item.name} />
                                                ) : (
                                                    <Icon icon="mdi:image" />
                                                )}
                                            </div>
                                            <div className={styles.itemDetails}>
                                                <h3>{item.name}</h3>
                                                <p>Qty: {quantity}</p>
                                            </div>
                                            <div className={styles.itemPrice}>
                                                {formatPrice(item.price * quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Totals */}
                                <div className={styles.orderTotals}>
                                    <div className={styles.totalRow}>
                                        <span>Subtotal ({cartItemCount} items)</span>
                                        <span>{formatPrice(calculateSubtotal())}</span>
                                    </div>
                                    <div className={styles.totalRow}>
                                        <span>Delivery Fee</span>
                                        <span>{formatPrice(calculateDeliveryFee())}</span>
                                    </div>
                                    <div className={`${styles.totalRow} ${styles.finalTotal}`}>
                                        <span>Total</span>
                                        <span>{formatPrice(calculateTotal())}</span>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={styles.placeOrderButton}
                                >
                                    {submitting ? (
                                        <>
                                            <Icon icon="mdi:loading" className={styles.loadingIcon} />
                                            Placing Order...
                                        </>
                                    ) : (
                                        <>
                                            <Icon icon="mdi:check-circle" />
                                            Place Order
                                        </>
                                    )}
                                </button>

                                {error && (
                                    <div className={styles.orderError}>
                                        <Icon icon="mdi:alert-circle" />
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}