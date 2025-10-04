'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import ItemService from "../../services/ItemService";
import Item from "../../models/Item";
import { useCart } from "../../../cart/Cart.context";

interface ItemPreviewProps {
    itemId: string;
}

export default function ItemPreview({ itemId }: ItemPreviewProps) {
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [showAddedMessage, setShowAddedMessage] = useState(false);
    
    const { addToCart, getItemQuantity, updateItemQuantity, isInCart } = useCart();
    
    // Get current cart quantity for this item
    const cartQuantity = getItemQuantity(itemId);
    const itemInCart = isInCart(itemId);

    // Fetch item data on component mount
    useEffect(() => {
        const fetchItem = async () => {
            try {
                setLoading(true);
                setError(null);
                const fetchedItem = await ItemService.getItemById(itemId);
                
                if (fetchedItem) {
                    setItem(fetchedItem);
                } else {
                    setError('Item not found');
                }
            } catch (err) {
                console.error('Error fetching item:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch item');
            } finally {
                setLoading(false);
            }
        };

        if (itemId) {
            fetchItem();
        }
    }, [itemId]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EGP',
        }).format(price);
    };

    const handleAddToCart = async () => {
        if (!item || !item.isAvailable) return;
        
        try {
            setIsAddingToCart(true);
            addToCart(itemId, quantity);
            
            // Show success message
            setShowAddedMessage(true);
            setTimeout(() => setShowAddedMessage(false), 3000);
            
        } catch (error) {
            console.error('Failed to add item to cart:', error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleIncreaseCartQuantity = () => {
        updateItemQuantity(itemId, cartQuantity + 1);
        setShowAddedMessage(true);
        setTimeout(() => setShowAddedMessage(false), 2000);
    };

    const handleDecreaseCartQuantity = () => {
        if (cartQuantity > 1) {
            updateItemQuantity(itemId, cartQuantity - 1);
        } else {
            updateItemQuantity(itemId, 0); // This will remove the item
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                        {/* Image Skeleton */}
                        <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                        
                        {/* Content Skeleton */}
                        <div className="space-y-4 sm:space-y-6">
                            <div className="h-8 sm:h-10 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                            </div>
                            <div className="h-12 bg-gray-200 rounded animate-pulse w-32"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 sm:py-12">
                <div className="text-center max-w-md mx-auto">
                    <div className="text-4xl sm:text-5xl md:text-6xl text-error mb-3 sm:mb-4">
                        <Icon icon="mdi:alert-triangle" />
                    </div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-dark mb-2 sm:mb-3">
                        {error === 'Item not found' ? 'Item Not Found' : 'Something went wrong'}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                        {error === 'Item not found' 
                            ? "The item you're looking for doesn't exist or may have been removed."
                            : "We couldn't load the item details right now. Please try again in a moment."
                        }
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        <button 
                            className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
                            onClick={() => window.location.reload()}
                        >
                            <Icon icon="mdi:refresh" className="mr-2" />
                            Try Again
                        </button>
                        <button 
                            className="btn btn-outline btn-sm sm:btn-md w-full sm:w-auto"
                            onClick={() => window.history.back()}
                        >
                            <Icon icon="mdi:arrow-left" className="mr-2" />
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Item not found (shouldn't happen with proper error handling)
    if (!item) {
        return (
            <div className="container mx-auto px-4 py-8 sm:py-12">
                <div className="text-center max-w-md mx-auto">
                    <div className="text-4xl sm:text-5xl md:text-6xl text-gray-300 mb-3 sm:mb-4">
                        <Icon icon="mdi:magnify" />
                    </div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-dark mb-2 sm:mb-3">Item Not Found</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                        The item you're looking for doesn't exist or may have been removed.
                    </p>
                    <button 
                        className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
                        onClick={() => window.history.back()}
                    >
                        <Icon icon="mdi:arrow-left" className="mr-2" />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Main item display
    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
            <div className="max-w-6xl mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={() => window.history.back()}
                            className="hover:text-primary transition-colors"
                        >
                            Items
                        </button>
                        <span>/</span>
                        <span>{item.category}</span>
                        <span>/</span>
                        <span className="text-dark font-medium truncate">{item.name}</span>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                    {/* Product Image */}
                    <div className="relative">
                        <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] bg-gray-100 rounded-lg overflow-hidden">
                            {/* Status Badges */}
                            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex flex-col gap-2">
                                {!item.isAvailable && (
                                    <div className="bg-gray-500 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium">
                                        Out of Stock
                                    </div>
                                )}
                                {item.priority <= 3 && item.isAvailable && (
                                    <div className="bg-primary text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium">
                                        Featured
                                    </div>
                                )}
                            </div>

                            {/* Image */}
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    console.error('Image failed to load:', item.imageUrl);
                                    console.log('Image element:', e.currentTarget);
                                }}
                                onLoad={() => {
                                    console.log('Image loaded and displayed successfully:', item.imageUrl);
                                }}
                                style={{ display: 'block' }}
                            />
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Title and Category */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs sm:text-sm text-primary bg-primary bg-opacity-10 px-2 py-1 rounded text-white">
                                    {item.category}
                                </span>
                                {item.subCategory && (
                                    <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {item.subCategory}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark mb-2 sm:mb-3">
                                {item.name}
                            </h1>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                                {formatPrice(item.price)}
                            </span>
                            <span className="text-sm sm:text-base text-gray-500">EGP</span>
                        </div>

                        {/* Availability Status */}
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${item.isAvailable ? 'bg-success' : 'bg-error'}`}></div>
                            <span className={`text-sm sm:text-base font-medium ${item.isAvailable ? 'text-success' : 'text-error'}`}>
                                {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-dark mb-2 sm:mb-3">Description</h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                {item.description}
                            </p>
                        </div>

                        {/* Item Details */}
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-lg sm:text-xl font-semibold text-dark mb-2 sm:mb-3">Item Details</h3>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
                                
                                <div>
                                    <span className="text-gray-500">Category:</span>
                                    <div className="font-medium text-dark">{item.category}</div>
                                </div>

                            </div>
                        </div>

                        {/* Success Message */}
                        {showAddedMessage && (
                            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
                                <Icon icon="mdi:check-circle" className="text-green-600" />
                                <span className="text-sm font-medium">
                                    {itemInCart ? 'Cart updated successfully!' : `${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart successfully!`}
                                </span>
                            </div>
                        )}

                        {/* Dynamic Cart Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                            {item.isAvailable ? (
                                itemInCart ? (
                                    /* Item is in cart - show quantity controls */
                                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-gray-700">In Cart:</span>
                                            <span className="text-xs text-green-600 font-medium">✓ Added</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <button 
                                                className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
                                                onClick={handleDecreaseCartQuantity}
                                            >
                                                <Icon icon={cartQuantity === 1 ? "mdi:trash-can" : "mdi:minus"} className="text-sm" />
                                            </button>
                                            
                                            <div className="flex-1 text-center">
                                                <div className="text-2xl font-bold text-gray-900">{cartQuantity}</div>
                                                <div className="text-xs text-gray-500">in cart</div>
                                            </div>
                                            
                                            <button 
                                                className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-primary hover:border-primary hover:text-white transition-all duration-200"
                                                onClick={handleIncreaseCartQuantity}
                                            >
                                                <Icon icon="mdi:plus" className="text-sm" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Item not in cart - show add to cart with quantity selector */
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <label className="text-sm font-medium text-gray-700">Quantity:</label>
                                            <div className="flex items-center border border-gray-200 rounded-lg">
                                                <button 
                                                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    disabled={quantity <= 1}
                                                >
                                                    <Icon icon="mdi:minus" className="text-sm" />
                                                </button>
                                                <span className="px-4 py-2 text-center font-medium min-w-[60px]">
                                                    {quantity}
                                                </span>
                                                <button 
                                                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setQuantity(quantity + 1)}
                                                >
                                                    <Icon icon="mdi:plus" className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                        <button 
                                            className="btn btn-primary w-full"
                                            disabled={isAddingToCart}
                                            onClick={handleAddToCart}
                                        >
                                            {isAddingToCart ? (
                                                <>
                                                    <Icon icon="mdi:loading" className="mr-2 animate-spin" />
                                                    Adding...
                                                </>
                                            ) : (
                                                <>
                                                    <Icon icon="mdi:cart" className="mr-2" />
                                                    Add to Cart
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )
                            ) : (
                                /* Item out of stock */
                                <button className="btn btn-disabled flex-1" disabled>
                                    <Icon icon="mdi:close-circle" className="mr-2" />
                                    Out of Stock
                                </button>
                            )}
                            
                            <button className="btn btn-outline">
                                <Icon icon="mdi:heart-outline" className="mr-2" />
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}