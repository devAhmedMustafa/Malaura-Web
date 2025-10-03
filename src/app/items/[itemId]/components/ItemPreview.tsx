'use client';

import { useState, useEffect } from 'react';
import ItemService from "../../services/ItemService";
import Item from "../../models/Item";

interface ItemPreviewProps {
    itemId: string;
}

export default function ItemPreview({ itemId }: ItemPreviewProps) {
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                        <i className="fas fa-exclamation-triangle"></i>
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
                            <i className="fas fa-refresh mr-2"></i>
                            Try Again
                        </button>
                        <button 
                            className="btn btn-outline btn-sm sm:btn-md w-full sm:w-auto"
                            onClick={() => window.history.back()}
                        >
                            <i className="fas fa-arrow-left mr-2"></i>
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
                        <i className="fas fa-search"></i>
                    </div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-dark mb-2 sm:mb-3">Item Not Found</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                        The item you're looking for doesn't exist or may have been removed.
                    </p>
                    <button 
                        className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
                        onClick={() => window.history.back()}
                    >
                        <i className="fas fa-arrow-left mr-2"></i>
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

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                            <button 
                                className={`btn ${item.isAvailable ? 'btn-primary' : 'btn-disabled'} flex-1`}
                                disabled={!item.isAvailable}
                            >
                                <i className="fas fa-shopping-cart mr-2"></i>
                                {item.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <button className="btn btn-outline">
                                <i className="fas fa-heart mr-2"></i>
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}