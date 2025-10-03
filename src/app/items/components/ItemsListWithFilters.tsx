'use client';

import { useState, useEffect } from "react";
import ItemService from "../services/ItemService";
import ItemCard from "./ItemCard";
import FilterBar from "./FilterBar";
import ItemsLoading from "./ItemsLoading";
import Item from "../models/Item";

export default function ItemsList() {
    const [allItems, setAllItems] = useState<Item[]>([]);
    const [filteredItems, setFilteredItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch items on component mount
    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const items: Item[] = await ItemService.getItems();
                console.log('Items fetched:', items);
                setAllItems(items);
                setFilteredItems(items);
            } catch (err) {
                console.error('Error fetching items:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch items');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const handleFilterChange = (filtered: Item[]) => {
        setFilteredItems(filtered);
    };

    const handleSearchChange = (search: string) => {
        setSearchTerm(search);
    };

    // Loading state
    if (loading) {
        return <ItemsLoading />;
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
                        Oops! Something went wrong
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                        We couldn't load the items right now. Please try again in a moment.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        <button 
                            className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
                            onClick={() => window.location.reload()}
                        >
                            <i className="fas fa-refresh mr-2"></i>
                            Try Again
                        </button>
                        <button className="btn btn-outline btn-sm sm:btn-md w-full sm:w-auto">
                            <i className="fas fa-home mr-2"></i>
                            Go Home
                        </button>
                    </div>
                    
                    {/* Error Details (for development) */}
                    <details className="mt-4 sm:mt-6 text-left">
                        <summary className="text-xs sm:text-sm text-gray-500 cursor-pointer hover:text-primary text-center">
                            Technical Details
                        </summary>
                        <div className="mt-2 p-3 sm:p-4 bg-gray-100 rounded text-xs sm:text-sm text-gray-700 font-mono break-words">
                            {error}
                        </div>
                    </details>
                </div>
            </div>
        );
    }

    // Empty state
    if (!allItems || allItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 sm:py-12">
                <div className="text-center max-w-md mx-auto">
                    <div className="text-4xl sm:text-5xl md:text-6xl text-gray-300 mb-3 sm:mb-4">
                        <i className="fas fa-box-open"></i>
                    </div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-dark mb-2 sm:mb-3">No Items Found</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                        We couldn't find any items at the moment. Please check back later.
                    </p>
                    <button 
                        className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto" 
                        onClick={() => window.location.reload()}
                    >
                        <i className="fas fa-refresh mr-2"></i>
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }

    // Separate featured and regular items from filtered results
    const featuredItems = filteredItems.filter(item => item.priority <= 3 && item.isAvailable);
    const regularItems = filteredItems.filter(item => item.priority > 3 || !item.isAvailable);

    return (
        <div>
            {/* Filter Bar */}
            <FilterBar 
                items={allItems}
                onFilterChange={handleFilterChange}
                onSearchChange={handleSearchChange}
            />

            <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
                {/* Header Section */}
                <div className="text-center mb-8 md:mb-12 px-2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark mb-3 md:mb-4">
                        Our <span className="text-primary">Products</span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-4 md:mb-6 leading-relaxed">
                        {searchTerm ? (
                            <>Showing results for "<span className="font-medium text-primary">{searchTerm}</span>"</>
                        ) : (
                            "Discover our carefully curated collection of premium items, crafted with quality and designed for your lifestyle."
                        )}
                    </p>
                    <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-success mr-1.5 sm:mr-2"></div>
                            <span>In Stock</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-error mr-1.5 sm:mr-2"></div>
                            <span>Out of Stock</span>
                        </div>
                    </div>
                </div>

                {/* Results Stats */}
                <div className="bg-gray-100 rounded-lg p-3 sm:p-4 mb-6 md:mb-8 mx-2 sm:mx-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full sm:w-auto">
                            <div className="text-center">
                                <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary">{filteredItems.length}</div>
                                <div className="text-xs sm:text-sm text-gray-600 leading-tight">
                                    {searchTerm || filteredItems.length !== allItems.length ? 'Results' : 'Total Items'}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg sm:text-xl md:text-2xl font-bold text-success">
                                    {filteredItems.filter(item => item.isAvailable).length}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 leading-tight">Available</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary-alt">{featuredItems.length}</div>
                                <div className="text-xs sm:text-sm text-gray-600 leading-tight">Featured</div>
                            </div>
                        </div>
                        
                        {allItems.length !== filteredItems.length && (
                            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-right w-full sm:w-auto">
                                Showing {filteredItems.length} of {allItems.length} items
                            </div>
                        )}
                    </div>
                </div>

                {/* No Results */}
                {filteredItems.length === 0 && (
                    <div className="text-center py-8 sm:py-12 px-4">
                        <div className="text-4xl sm:text-5xl md:text-6xl text-gray-300 mb-3 sm:mb-4">
                            <i className="fas fa-search"></i>
                        </div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-dark mb-2 sm:mb-3">No Results Found</h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto leading-relaxed">
                            {searchTerm 
                                ? `No products match "${searchTerm}". Try adjusting your search or filters.`
                                : "No products match your current filters. Try adjusting your criteria."
                            }
                        </p>
                        <button 
                            className="btn btn-outline btn-sm sm:btn-md"
                            onClick={() => window.location.reload()}
                        >
                            <i className="fas fa-refresh mr-2"></i>
                            Reset Filters
                        </button>
                    </div>
                )}

                {/* Featured Items Section */}
                {featuredItems.length > 0 && (
                    <section className="mb-8 sm:mb-10 md:mb-12 px-2 sm:px-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-dark mb-0">
                                <span className="text-primary-alt text-base sm:text-lg md:text-xl">★</span> Featured Products
                            </h2>
                            <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {featuredItems.length} item{featuredItems.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {featuredItems.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Regular Items Section */}
                {regularItems.length > 0 && (
                    <section className="px-2 sm:px-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-dark mb-0">
                                {featuredItems.length > 0 ? 'All Products' : 'Products'}
                            </h2>
                            <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {regularItems.length} item{regularItems.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {regularItems.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}