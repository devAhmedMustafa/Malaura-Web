import Image from "next/image";
import Item from "../models/Item";
import Link from "next/link";

interface ItemCardProps {
    item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EGP',
        }).format(price);
    };

    return (
        <Link href={`/items/${item.id}`} passHref>
        <div className="product-card group cursor-pointer">
            {/* Product Image */}
            <div className="product-card-image">
                {!item.isAvailable && (
                    <div className="product-badge bg-gray-500">
                        Out of Stock
                    </div>
                )}
                {item.priority <= 3 && item.isAvailable && (
                    <div className="product-badge">
                        Featured
                    </div>
                )}
                <div className="relative w-full h-full bg-gray-100 flex items-center justify-center">
                    {item.imageUrl ? (
                        <Image
                            src={item.imageUrl}
                            alt={item.name}
                            priority={true}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="text-gray-400 text-4xl">
                            <i className="fas fa-image"></i>
                        </div>
                    )}
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button 
                        className="btn btn-primary btn-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                        disabled={!item.isAvailable}
                    >
                        <i className="fas fa-shopping-cart mr-2"></i>
                        {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
                    </button>
                </div>
            </div>

            {/* Product Details */}
            <div className="product-card-body">
                {/* Category */}
                {item.category && (
                    <div className="mb-2">
                        <span className="badge badge-secondary text-xs">
                            {item.category}
                            {item.subCategory && ` • ${item.subCategory}`}
                        </span>
                    </div>
                )}

                {/* Product Name */}
                <h3 className="product-name text-dark group-hover:text-primary transition-colors duration-200">
                    {item.name}
                </h3>

                {/* Description */}
                {item.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                        {item.description}
                    </p>
                )}

                {/* Price */}
                <div className="flex items-center justify-between">
                    <span className={`product-price ${!item.isAvailable ? 'text-gray-400' : ''}`}>
                        {formatPrice(item.price)}
                    </span>
                    
                    {/* Availability Status */}
                    <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                            item.isAvailable ? 'bg-success' : 'bg-error'
                        }`}></div>
                        <span className={`text-xs font-medium ${
                            item.isAvailable ? 'text-success' : 'text-error'
                        }`}>
                            {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        </Link>
    );
}