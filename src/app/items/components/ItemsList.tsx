import ItemService from "../services/ItemService";
import ItemCard from "./ItemCard";
import Item from "../models/Item";

export default async function ItemsList() {
    try {
        const items: Item[] = await ItemService.getItems();
        console.log('Items fetched:', items);

        if (!items || items.length === 0) {
            return (
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center">
                        <div className="text-6xl text-gray-300 mb-4">
                            <i className="fas fa-box-open"></i>
                        </div>
                        <h2 className="text-2xl font-semibold text-dark mb-2">No Items Found</h2>
                        <p className="text-gray-600 mb-6">
                            We couldn't find any items at the moment. Please check back later.
                        </p>
                        <button className="btn btn-primary">
                            <i className="fas fa-refresh mr-2"></i>
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        // Sort items: available first, then by priority
        const sortedItems = [...items].sort((a, b) => {
            if (a.isAvailable !== b.isAvailable) {
                return b.isAvailable ? 1 : -1; // Available items first
            }
            return a.priority - b.priority; // Lower priority number = higher priority
        });

        // Separate featured and regular items
        const featuredItems = sortedItems.filter(item => item.priority <= 3 && item.isAvailable);
        const regularItems = sortedItems.filter(item => item.priority > 3 || !item.isAvailable);

        return (
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">
                        Our <span className="text-primary">Products</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                        Discover our carefully curated collection of premium items, 
                        crafted with quality and designed for your lifestyle.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-success mr-2"></div>
                            <span>In Stock</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-error mr-2"></div>
                            <span>Out of Stock</span>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="bg-gray-100 rounded-lg p-4 mb-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{items.length}</div>
                                <div className="text-sm text-gray-600">Total Items</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-success">
                                    {items.filter(item => item.isAvailable).length}
                                </div>
                                <div className="text-sm text-gray-600">Available</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary-alt">{featuredItems.length}</div>
                                <div className="text-sm text-gray-600">Featured</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button className="btn btn-outline btn-sm">
                                <i className="fas fa-filter mr-2"></i>
                                Filter
                            </button>
                            <button className="btn btn-outline btn-sm">
                                <i className="fas fa-sort mr-2"></i>
                                Sort
                            </button>
                        </div>
                    </div>
                </div>

                {/* Featured Items Section */}
                {featuredItems.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="section-title text-left mb-0">
                                <span className="text-primary-alt">★</span> Featured Products
                            </h2>
                            <a href="#" className="section-all">View All Featured</a>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {featuredItems.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Regular Items Section */}
                {regularItems.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="section-title text-left mb-0">All Products</h2>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>Showing {regularItems.length} items</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {regularItems.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Load More Button */}
                <div className="text-center mt-12">
                    <button className="btn btn-outline btn-lg">
                        <i className="fas fa-plus mr-2"></i>
                        Load More Products
                    </button>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error fetching items:', error);
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <div className="text-6xl text-error mb-4">
                        <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-dark mb-2">
                        Oops! Something went wrong
                    </h2>
                    <p className="text-gray-600 mb-6">
                        We couldn't load the items right now. Please try again in a moment.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <button 
                            className="btn btn-primary"
                            onClick={() => window.location.reload()}
                        >
                            <i className="fas fa-refresh mr-2"></i>
                            Try Again
                        </button>
                        <button className="btn btn-outline">
                            <i className="fas fa-home mr-2"></i>
                            Go Home
                        </button>
                    </div>
                    
                    {/* Error Details (for development) */}
                    <details className="mt-6 text-left">
                        <summary className="text-sm text-gray-500 cursor-pointer hover:text-primary">
                            Technical Details
                        </summary>
                        <div className="mt-2 p-4 bg-gray-100 rounded text-sm text-gray-700 font-mono">
                            {error instanceof Error ? error.message : 'Unknown error occurred'}
                        </div>
                    </details>
                </div>
            </div>
        );
    }
}