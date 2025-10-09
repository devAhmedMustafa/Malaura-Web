'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useAuth } from '../../auth/AuthContext';
import OrderService from '../services/orderService';
import { Order } from '../models/Order.dto';
import styles from './OrderDetails.module.css';

export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { isAuthenticated } = useAuth();
    const orderId = params.orderId as string;
    
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/auth?from=/orders');
        }
    }, [isAuthenticated, router]);

    // Fetch order details
    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) return;
            
            try {
                setLoading(true);
                setError(null);
                const orderData = await OrderService.getDetailedOrder(orderId);
                setOrder(orderData);
            } catch (error) {
                console.error('Error fetching order details:', error);
                setError('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EGP',
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusInfo = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return { 
                    icon: 'mdi:clock-outline', 
                    color: 'var(--color-warning)', 
                    message: 'Your order is being processed'
                };
            case 'preparing':
                return { 
                    icon: 'mdi:chef-hat', 
                    color: 'var(--color-info)', 
                    message: 'Your order is being prepared'
                };
            case 'ready':
                return { 
                    icon: 'mdi:check-circle', 
                    color: 'var(--color-success)', 
                    message: 'Your order is ready for pickup/delivery'
                };
            case 'delivered':
                return { 
                    icon: 'mdi:package-variant', 
                    color: 'var(--color-success)', 
                    message: 'Your order has been delivered'
                };
            case 'cancelled':
                return { 
                    icon: 'mdi:close-circle', 
                    color: 'var(--color-error)', 
                    message: 'This order has been cancelled'
                };
            default:
                return { 
                    icon: 'mdi:help-circle', 
                    color: 'var(--color-gray-500)', 
                    message: 'Order status unknown'
                };
        }
    };

    const getPaymentMethodIcon = (method: string) => {
        switch (method.toLowerCase()) {
            case 'cash':
                return 'mdi:cash';
            case 'card':
                return 'mdi:credit-card';
            case 'online':
                return 'mdi:credit-card-outline';
            default:
                return 'mdi:currency-usd';
        }
    };

    function handleCancelOrder() {
        if (!order) return;
        if (confirm('Are you sure you want to cancel this order?')) {
            OrderService.cancelOrder(order.orderId)
                .then(() => {
                    alert('Order cancelled successfully');
                    router.push('/orders');
                })
                .catch((error) => {
                    alert('Failed to cancel order');
                    console.error(error);
                });
        }
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.maxWidth}>
                    <div className={styles.loadingContainer}>
                        <div className={styles.loadingSpinner}></div>
                        <p>Loading order details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className={styles.container}>
                <div className={styles.maxWidth}>
                    <div className={styles.errorContainer}>
                        <Icon icon="mdi:alert-circle" className={styles.errorIcon} />
                        <h2>Order Not Found</h2>
                        <p>{error || 'The order you are looking for could not be found.'}</p>
                        <div className={styles.actionButtons}>
                            <button 
                                onClick={() => router.push('/orders')}
                                className={styles.backToOrdersButton}
                            >
                                <Icon icon="mdi:arrow-left" />
                                Back to Orders
                            </button>
                            <button 
                                onClick={() => window.location.reload()}
                                className={styles.retryButton}
                            >
                                <Icon icon="mdi:refresh" />
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo(order.orderStatus);
    const subtotal = order.orderItems?.reduce((sum, item) => 
        sum + ((item.item?.price || 0) * item.quantity), 0) || 0;
    const deliveryFee = order.totalAmount - subtotal;

    return (
        <div className={styles.container}>
            <div className={styles.maxWidth}>
                {/* Header */}
                <div className={styles.header}>
                    <button 
                        onClick={() => router.push('/orders')}
                        className={styles.backButton}
                    >
                        <Icon icon="mdi:arrow-left" />
                        Back to Orders
                    </button>
                    <div>
                        <h1 className={styles.title} hidden>Order #{order.orderId}</h1>
                        <p className={styles.orderDate}>{formatDate(order.orderDate)}</p>
                    </div>
                </div>

                <div className={styles.contentGrid}>
                    {/* Order Status */}
                    <div className={styles.statusCard}>
                        <div className={styles.statusHeader}>
                            <Icon 
                                icon={statusInfo.icon} 
                                className={styles.statusIcon}
                                style={{ color: statusInfo.color }}
                            />
                            <div>
                                <h2 className={styles.statusTitle}>Order Status</h2>
                                <p 
                                    className={styles.statusText}
                                    style={{ color: statusInfo.color }}
                                >
                                    {order.orderStatus}
                                </p>
                            </div>
                        </div>
                        <p className={styles.statusMessage}>{statusInfo.message}</p>
                    </div>

                    {/* Customer Information */}
                    <div className={styles.infoCard}>
                        <h3 className={styles.cardTitle}>
                            <Icon icon="mdi:account" />
                            Customer Information
                        </h3>
                        <div className={styles.infoList}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Name:</span>
                                <span className={styles.infoValue}>{order.customerName}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Phone:</span>
                                <span className={styles.infoValue}>{order.customerPhone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Information */}
                    {order.deliveryDetails && (
                        <div className={styles.infoCard}>
                            <h3 className={styles.cardTitle}>
                                <Icon icon="mdi:map-marker" />
                                Delivery Information
                            </h3>
                            <div className={styles.deliveryAddress}>
                                <p>{order.deliveryDetails.address}</p>
                                <div className={styles.coordinates}>
                                    <Icon icon="mdi:crosshairs-gps" />
                                    <span>
                                        {order.deliveryDetails.latitude.toFixed(6)}, 
                                        {order.deliveryDetails.longitude.toFixed(6)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Order Items */}
                    <div className={styles.itemsCard}>
                        <h3 className={styles.cardTitle}>
                            <Icon icon="mdi:receipt-text" />
                            Order Items
                        </h3>
                        {order.orderItems && order.orderItems.length > 0 ? (
                            <div className={styles.itemsList}>
                                {order.orderItems.map((orderItem, index) => (
                                    <div key={index} className={styles.orderItem}>
                                        <div className={styles.itemInfo}>
                                            <h4 className={styles.itemName}>
                                                {orderItem.item?.name || `Item ${orderItem.itemId}`}
                                            </h4>
                                            {orderItem.item?.description && (
                                                <p className={styles.itemDescription}>
                                                    {orderItem.item.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className={styles.itemQuantity}>
                                            <span>x{orderItem.quantity}</span>
                                        </div>

                                        <div className={styles.itemPrice}>
                                            {orderItem.item?.price ? (
                                                <>
                                                    <span className={styles.unitPrice}>
                                                        {formatPrice(orderItem.item.price)}
                                                    </span>
                                                    <span className={styles.totalPrice}>
                                                        {formatPrice(orderItem.item.price * orderItem.quantity)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className={styles.priceUnavailable}>
                                                    Price not available
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={styles.noItems}>No items information available</p>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className={styles.summaryCard}>
                        <h3 className={styles.cardTitle}>
                            <Icon icon="mdi:calculator" />
                            Order Summary
                        </h3>
                        <div className={styles.summaryList}>
                            <div className={styles.summaryItem}>
                                <span>Subtotal:</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            {deliveryFee > 0 && (
                                <div className={styles.summaryItem}>
                                    <span>Delivery Fee:</span>
                                    <span>{formatPrice(deliveryFee)}</span>
                                </div>
                            )}
                            <div className={`${styles.summaryItem} ${styles.totalItem}`}>
                                <span>Total:</span>
                                <span>{formatPrice(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className={styles.paymentCard}>
                        <h3 className={styles.cardTitle}>
                            <Icon icon="mdi:credit-card" />
                            Payment Information
                        </h3>
                        <div className={styles.paymentInfo}>
                            <div className={styles.paymentMethod}>
                                <Icon icon={getPaymentMethodIcon(order.paymentMethod)} />
                                <span>
                                    {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}
                                </span>
                            </div>
                            <div className={`${styles.paymentStatus} ${order.isPaid ? styles.paid : styles.unpaid}`}>
                                <Icon icon={order.isPaid ? 'mdi:check-circle' : 'mdi:clock-outline'} />
                                <span>{order.isPaid ? 'Paid' : 'Payment Pending'}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button onClick={handleCancelOrder} style={{
                            width: '100%',
                            color: 'var(--color-white)',
                            fontWeight: 'bold',
                            display: order.orderStatus.toLowerCase() === 'pending' ? 'inline-block' : 'none',
                            backgroundColor: '#aa0000',
                            borderRadius: '8px',
                            padding: '12px',
                            border: 'none',
                        }} >Cancel Order</button>
                    </div>

                </div>
            </div>
        </div>
    );
}