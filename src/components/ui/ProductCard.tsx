"use client";
import React from 'react';
import Link from 'next/link';

import { Product } from '../../domain/models';
import { computeProductBadges } from '../../domain/badges';
import { ImageFallback } from './ImageFallback';
import { useCartStore } from '../../store/cartStore';
import { Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProductRatingDisplay } from './ProductRatingDisplay';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find(i => i.productId === product.id);
  const requiresCustomization = (product.customizationFields?.length ?? 0) > 0 || (product.variants?.length ?? 0) > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: `cart-item-${Date.now()}`,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    toast.success(`Added ${product.name} to cart!`);
  };

  return (
    <div className="flex flex-col bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm h-full group product-card-premium">
      {/* Product Image */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] bg-gray-50 overflow-hidden">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl}
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <ImageFallback text="Product image coming soon" className="absolute inset-0 w-full h-full" />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {computeProductBadges(product).map((badge, idx) => {
            // Apply different styles based on badge type
            let badgeClass = "bg-red-100 text-red-800"; // default for discount
            if (badge.type === 'status' && badge.label === 'NEW') {
               badgeClass = "bg-blue-500 text-white";
            } else if (badge.label === 'FEATURED') {
               badgeClass = "bg-secondary text-white";
            }

            return (
              <span key={idx} className={`${badgeClass} text-xs font-bold px-2 py-1 rounded shadow-sm`}>
                {badge.label}
              </span>
            );
          })}
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex flex-col flex-grow p-4">
        <Link href={`/product/${product.slug}`} className="block flex-grow">
          <h3 className="text-sm font-semibold text-secondary mb-1 line-clamp-2 leading-tight hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="mb-1">
            <ProductRatingDisplay productId={product.id} compact={true} />
          </div>
          <p className="text-xs text-gray-500 mb-3 truncate">
            {'Standard'}
          </p>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-bold text-secondary">₦{product.price.toLocaleString()}</span>
            {product.previousPrice && (
              <span className="text-sm text-gray-400 line-through">₦{product.previousPrice.toLocaleString()}</span>
            )}
          </div>
        </Link>
        {cartItem ? (
          <div className="flex items-center justify-between bg-gray-100 rounded-md w-full mt-auto border border-gray-200">
            <button 
              type="button"
              onClick={(e) => { e.preventDefault(); cartItem.quantity === 1 ? removeItem(cartItem.id) : updateQuantity(cartItem.id, cartItem.quantity - 1); }}
              className="p-3 text-secondary hover:bg-gray-200 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="font-bold text-secondary text-sm select-none">{cartItem.quantity}</span>
            <button 
              type="button"
              onClick={(e) => { e.preventDefault(); updateQuantity(cartItem.id, cartItem.quantity + 1); }}
              className="p-3 text-secondary hover:bg-gray-200 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
        ) : requiresCustomization ? (
          <Link 
            href={`/product/${product.slug}`}
            className="w-full text-center py-2.5 bg-secondary text-white font-bold text-sm rounded hover:bg-primary hover:text-secondary transition-colors mt-auto block"
          >
            Customize & Buy
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full text-center py-2.5 bg-secondary text-white font-bold text-sm rounded hover:bg-primary hover:text-secondary transition-colors mt-auto block"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};
