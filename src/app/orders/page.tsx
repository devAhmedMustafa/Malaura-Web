'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useAuth } from '../auth/AuthContext';
import OrderService from './services/orderService';
import { Order } from './models/Order.dto';
import styles from './Orders.module.css';

export default function OrdersPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/auth?from=/orders');
        }
    }, [isAuthenticated, router]);

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            
            try {
                setLoading(true);
                setError(null);
                const ordersData = await OrderService.getCustomerOrders();
                setOrders(ordersData);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to load your orders');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

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
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return { icon: 'mdi:clock-outline', color: 'var(--color-warning)' };
            case 'preparing':
                return { icon: 'mdi:chef-hat', color: 'var(--color-info)' };
            case 'ready':
                return { icon: 'mdi:check-circle', color: 'var(--color-success)' };
            case 'delivered':
                return { icon: 'mdi:package-variant', color: 'var(--color-success)' };
            case 'cancelled':
                return { icon: 'mdi:close-circle', color: 'var(--color-error)' };
            default:
                return { icon: 'mdi:help-circle', color: 'var(--color-gray-500)' };
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

    const filteredOrders = orders.filter(order => {
        if (selectedFilter === 'all') return true;
        return order.orderStatus.toLowerCase() === selectedFilter;
    });

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.maxWidth}>
                    <div className={styles.loadingContainer}>
                        <div className={styles.loadingSpinner}></div>
                        <p>Loading your orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.maxWidth}>
                    <div className={styles.errorContainer}>
                        <Icon icon="mdi:alert-circle" className={styles.errorIcon} />
                        <h2>Something went wrong</h2>
                        <p>{error}</p>
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
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.maxWidth}>
                {/* Header */}
                <div className={styles.header}>
                    <button 
                        onClick={() => router.back()}
                        className={styles.backButton}
                    >
                        <Icon icon="mdi:arrow-left" />
                        Back
                    </button>
                    <div>
                        <h1 className={styles.title}>My Orders</h1>
                        <p className={styles.subtitle}>Track your order history and status</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className={styles.filterTabs}>
                    {[
                        { key: 'all', label: 'All Orders', count: orders.length },
                        { key: 'pending', label: 'Pending', count: orders.filter(o => o.orderStatus.toLowerCase() === 'pending').length },
                        { key: 'completed', label: 'Completed', count: orders.filter(o => ['ready', 'delivered'].includes(o.orderStatus.toLowerCase())).length },
                        { key: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.orderStatus.toLowerCase() === 'cancelled').length },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setSelectedFilter(tab.key as any)}
                            className={`${styles.filterTab} ${selectedFilter === tab.key ? styles.active : ''}`}
                        >
                            {tab.label}
                            {tab.count > 0 && <span className={styles.count}>{tab.count}</span>}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Icon icon="mdi:receipt-text-outline" className={styles.emptyIcon} />
                        <h3>No orders found</h3>
                        <p>
                            {selectedFilter === 'all' 
                                ? "You haven't placed any orders yet. Start shopping to see your orders here."
                                : `No ${selectedFilter} orders found.`
                            }
                        </p>
                        <button 
                            onClick={() => router.push('/items')}
                            className={styles.shopButton}
                        >
                            <Icon icon="mdi:storefront" />
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className={styles.ordersList}>
                        {filteredOrders.map(order => {
                            const statusInfo = getStatusIcon(order.orderStatus);
                            return (
                                <div 
                                    key={order.orderId} 
                                    className={styles.orderCard}
                                    onClick={() => router.push(`/orders/${order.orderId}`)}
                                >
                                    {/* Order Header */}
                                    <div className={styles.orderHeader}>
                                        <div className={styles.orderInfo}>
                                            <h3 className={styles.orderId}>Order #{order.orderId.split('-')[0]}</h3>
                                            <p className={styles.orderDate}>{formatDate(order.orderDate)}</p>
                                        </div>
                                        <div className={styles.orderStatus}>
                                            <Icon 
                                                icon={statusInfo.icon} 
                                                style={{ color: statusInfo.color }}
                                            />
                                            <span style={{ color: statusInfo.color }}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className={styles.itemsPreview}>
                                        {order.orderItems && order.orderItems.length > 0 ? (
                                            <>
                                                <div className={styles.itemsList}>
                                                    {order.orderItems.slice(0, 2).map((orderItem, index) => (
                                                        <div key={index} className={styles.itemPreview}>
                                                            <span className={styles.itemName}>
                                                                {orderItem.item?.name || `Item ${orderItem.itemId}`}
                                                            </span>
                                                            <span className={styles.itemQuantity}>
                                                                x{orderItem.quantity}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                                {order.orderItems.length > 2 && (
                                                    <p className={styles.moreItems}>
                                                        +{order.orderItems.length - 2} more items
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <p className={styles.noItems}>Items information not available</p>
                                        )}
                                    </div>

                                    {/* Order Footer */}
                                    <div className={styles.orderFooter}>
                                        <div className={styles.paymentInfo}>
                                            <Icon icon={getPaymentMethodIcon(order.paymentMethod)} />
                                            <span>{order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}</span>
                                            <span className={`${styles.paymentStatus} ${order.isPaid ? styles.paid : styles.unpaid}`}>
                                                {order.isPaid ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </div>
                                        <div className={styles.totalAmount}>
                                            <strong>{formatPrice(order.totalAmount)}</strong>
                                        </div>
                                    </div>

                                    {/* Delivery Address */}
                                    {order.deliveryDetails && (
                                        <div className={styles.deliveryInfo}>
                                            <Icon icon="mdi:map-marker" />
                                            <span>{order.deliveryDetails.address}</span>
                                        </div>
                                    )}

                                    {/* Action Arrow */}
                                    <div className={styles.actionArrow}>
                                        <Icon icon="mdi:chevron-right" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}