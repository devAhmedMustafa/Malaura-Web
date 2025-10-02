export default function ItemsLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Skeleton */}
            <div className="text-center mb-12">
                <div className="loading-skeleton h-12 w-64 mx-auto mb-4"></div>
                <div className="loading-skeleton h-6 w-96 mx-auto mb-6"></div>
                <div className="flex items-center justify-center gap-4">
                    <div className="loading-skeleton h-4 w-20"></div>
                    <div className="loading-skeleton h-4 w-24"></div>
                </div>
            </div>

            {/* Stats Bar Skeleton */}
            <div className="bg-gray-100 rounded-lg p-4 mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="loading-skeleton h-8 w-12 mb-1"></div>
                            <div className="loading-skeleton h-4 w-16"></div>
                        </div>
                        <div className="text-center">
                            <div className="loading-skeleton h-8 w-12 mb-1"></div>
                            <div className="loading-skeleton h-4 w-16"></div>
                        </div>
                        <div className="text-center">
                            <div className="loading-skeleton h-8 w-12 mb-1"></div>
                            <div className="loading-skeleton h-4 w-16"></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="loading-skeleton h-8 w-16"></div>
                        <div className="loading-skeleton h-8 w-16"></div>
                    </div>
                </div>
            </div>

            {/* Featured Section Skeleton */}
            <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <div className="loading-skeleton h-8 w-48"></div>
                    <div className="loading-skeleton h-4 w-24"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <ItemCardSkeleton key={index} />
                    ))}
                </div>
            </section>

            {/* Regular Items Section Skeleton */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="loading-skeleton h-8 w-32"></div>
                    <div className="loading-skeleton h-4 w-28"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <ItemCardSkeleton key={index + 4} />
                    ))}
                </div>
            </section>

            {/* Load More Button Skeleton */}
            <div className="text-center mt-12">
                <div className="loading-skeleton h-12 w-48 mx-auto"></div>
            </div>
        </div>
    );
}

function ItemCardSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-base overflow-hidden">
            {/* Image Skeleton */}
            <div className="loading-skeleton aspect-square w-full"></div>
            
            {/* Content Skeleton */}
            <div className="p-4">
                {/* Badge */}
                <div className="loading-skeleton h-5 w-16 mb-2"></div>
                
                {/* Title */}
                <div className="loading-skeleton h-6 w-full mb-2"></div>
                
                {/* Description */}
                <div className="loading-skeleton h-4 w-full mb-1"></div>
                <div className="loading-skeleton h-4 w-3/4 mb-3"></div>
                
                {/* Price and Status */}
                <div className="flex items-center justify-between">
                    <div className="loading-skeleton h-6 w-16"></div>
                    <div className="flex items-center">
                        <div className="loading-skeleton h-2 w-2 rounded-full mr-2"></div>
                        <div className="loading-skeleton h-4 w-12"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}