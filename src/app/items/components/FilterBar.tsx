'use client';

import { useState, useEffect, useMemo } from 'react';
import Item from '../models/Item';

interface FilterBarProps {
    items: Item[];
    onFilterChange: (filteredItems: Item[]) => void;
    onSearchChange: (searchTerm: string) => void;
}

type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular' | 'name-az' | 'name-za';

export default function FilterBar({ items, onFilterChange, onSearchChange }: FilterBarProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Extract unique categories from items
    const categories = useMemo(() => {
        const categorySet = new Set<string>();
        items.forEach(item => {
            if (item.category) {
                categorySet.add(item.category);
            }
        });
        return Array.from(categorySet).sort();
    }, [items]);

    // Calculate price range from items
    const actualPriceRange = useMemo(() => {
        if (items.length === 0) return { min: 0, max: 1000 };
        
        const prices = items.map(item => item.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }, [items]);

    // Initialize price range when items change
    useEffect(() => {
        setPriceRange(actualPriceRange);
    }, [actualPriceRange]);

    // Filter and sort items
    const filteredAndSortedItems = useMemo(() => {
        let filtered = items.filter(item => {
            // Search filter
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = !searchTerm || 
                item.name.toLowerCase().includes(searchLower) ||
                item.description.toLowerCase().includes(searchLower) ||
                (item.category && item.category.toLowerCase().includes(searchLower));

            // Category filter
            const matchesCategory = selectedCategories.length === 0 || 
                (item.category && selectedCategories.includes(item.category));

            // Price filter
            const matchesPrice = item.price >= priceRange.min && item.price <= priceRange.max;

            // Availability filter
            const matchesAvailability = !showOnlyAvailable || item.isAvailable;

            return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
        });

        // Sort items
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'popular':
                    return a.priority - b.priority; // Lower priority number = higher priority
                case 'name-az':
                    return a.name.localeCompare(b.name);
                case 'name-za':
                    return b.name.localeCompare(a.name);
                case 'newest':
                default:
                    return b.id.localeCompare(a.id); // Sort by ID descending (newest first)
            }
        });

        return filtered;
    }, [items, searchTerm, selectedCategories, priceRange, sortBy, showOnlyAvailable]);

    // Update parent component when filters change
    useEffect(() => {
        onFilterChange(filteredAndSortedItems);
        onSearchChange(searchTerm);
    }, [filteredAndSortedItems, searchTerm, onFilterChange, onSearchChange]);

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories(prev => 
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedCategories([]);
        setPriceRange(actualPriceRange);
        setSortBy('newest');
        setShowOnlyAvailable(false);
    };

    const hasActiveFilters = searchTerm || selectedCategories.length > 0 || 
        priceRange.min !== actualPriceRange.min || priceRange.max !== actualPriceRange.max ||
        showOnlyAvailable || sortBy !== 'newest';

    return (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
            <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
                {/* Main Filter Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    {/* Search Input */}
                    <div className="flex-1 w-full sm:min-w-[250px] md:min-w-[300px]">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <div className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base">
                                <i className="fas fa-search"></i>
                            </div>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm sm:text-base"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Controls Row */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none min-w-0">
                            <label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap hidden sm:block">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="newest">Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="popular">Most Popular</option>
                                <option value="name-az">Name: A-Z</option>
                                <option value="name-za">Name: Z-A</option>
                            </select>
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`btn btn-sm sm:btn-md ${showFilters ? 'btn-primary' : 'btn-outline'} relative whitespace-nowrap`}
                        >
                            <i className="fas fa-filter mr-1 sm:mr-2 text-xs sm:text-sm"></i>
                            <span className="text-xs sm:text-sm">Filters</span>
                            {hasActiveFilters && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-primary rounded-full"></span>
                            )}
                        </button>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="btn btn-ghost btn-sm sm:btn-md text-error whitespace-nowrap"
                            >
                                <i className="fas fa-times mr-1 sm:mr-2 text-xs sm:text-sm"></i>
                                <span className="text-xs sm:text-sm">Clear</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Results Summary */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-gray-600">
                    <div className="flex flex-wrap items-center gap-1">
                        <span>Showing</span>
                        <span className="font-medium text-primary">{filteredAndSortedItems.length}</span>
                        <span>of</span>
                        <span className="font-medium">{items.length}</span>
                        <span>products</span>
                        {searchTerm && (
                            <span className="ml-1 sm:ml-2">
                                for "<span className="font-medium text-primary break-words">{searchTerm}</span>"
                            </span>
                        )}
                    </div>
                    {hasActiveFilters && (
                        <div className="flex items-center gap-1 sm:gap-2">
                            <i className="fas fa-info-circle text-primary text-xs sm:text-sm"></i>
                            <span className="text-xs sm:text-sm">Filters applied</span>
                        </div>
                    )}
                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 md:p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {/* Categories */}
                            <div className="order-1">
                                <h3 className="font-semibold text-dark mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                                    <i className="fas fa-tags mr-1.5 sm:mr-2 text-primary text-xs sm:text-sm"></i>
                                    Categories
                                </h3>
                                <div className="space-y-1 sm:space-y-2 max-h-40 sm:max-h-48 overflow-y-auto">
                                    {categories.map(category => {
                                        const itemCount = items.filter(item => item.category === category).length;
                                        return (
                                            <label key={category} className="flex items-center justify-between cursor-pointer hover:bg-white rounded p-1.5 sm:p-2 transition-colors">
                                                <div className="flex items-center min-w-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCategories.includes(category)}
                                                        onChange={() => handleCategoryToggle(category)}
                                                        className="mr-2 sm:mr-3 rounded border-gray-300 text-primary focus:ring-primary flex-shrink-0"
                                                    />
                                                    <span className="text-gray-700 text-xs sm:text-sm truncate">{category}</span>
                                                </div>
                                                <span className="text-xs text-gray-500 bg-gray-200 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0 ml-2">
                                                    {itemCount}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="order-2">
                                <h3 className="font-semibold text-dark mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                                    <i className="fas fa-dollar-sign mr-1.5 sm:mr-2 text-primary text-xs sm:text-sm"></i>
                                    Price Range
                                </h3>
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
                                        <span>EGP {priceRange.min.toLocaleString('en-US')}</span>
                                        <span>EGP {priceRange.max.toLocaleString('en-US')}</span>
                                    </div>
                                    <div className="space-y-2 sm:space-y-3">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Min Price</label>
                                            <input
                                                type="range"
                                                min={actualPriceRange.min}
                                                max={actualPriceRange.max}
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider touch-manipulation"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Max Price</label>
                                            <input
                                                type="range"
                                                min={actualPriceRange.min}
                                                max={actualPriceRange.max}
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider touch-manipulation"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) || 0 }))}
                                            className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) || actualPriceRange.max }))}
                                            className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Additional Filters */}
                            <div className="order-3 md:col-span-2 lg:col-span-1">
                                <h3 className="font-semibold text-dark mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                                    <i className="fas fa-sliders-h mr-1.5 sm:mr-2 text-primary text-xs sm:text-sm"></i>
                                    Options
                                </h3>
                                <div className="space-y-2 sm:space-y-3">
                                    <label className="flex items-start cursor-pointer hover:bg-white rounded p-1.5 sm:p-2 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={showOnlyAvailable}
                                            onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                                            className="mr-2 sm:mr-3 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary flex-shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <span className="text-gray-700 text-xs sm:text-sm block">In Stock Only</span>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {items.filter(item => item.isAvailable).length} available items
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Slider Styles */}
            <style jsx>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: var(--color-primary);
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .slider::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: var(--color-primary);
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                @media (min-width: 640px) {
                    .slider::-webkit-slider-thumb {
                        width: 20px;
                        height: 20px;
                    }
                    
                    .slider::-moz-range-thumb {
                        width: 20px;
                        height: 20px;
                    }
                }
            `}</style>
        </div>
    );
}