"use client";
import React from 'react';
import Link from 'next/link';

import { Product } from '../../domain/models';
import { computeProductBadges } from '../../domain/badges';
import { ImageFallback } from './ImageFallback';
import { ProductRatingDisplay } from './ProductRatingDisplay';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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
            let badgeClass = "bg-primary text-secondary";
            if (badge.type === 'status' && badge.label === 'NEW') {
               badgeClass = "bg-blue-500 text-white";
            } else if (badge.label === 'FEATURED') {
               badgeClass = "bg-secondary text-white";
            }

            return (
              <span key={idx} className={`${badgeClass} text-[10px] sm:text-xs font-bold px-2 py-1 rounded shadow-sm`}>
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
        <Link 
          to={`/product/${product.slug}`}
          className="w-full text-center py-2.5 bg-secondary text-white font-bold text-sm rounded hover:bg-primary hover:text-secondary transition-colors mt-auto"
        >
          {(product.customizationFields?.length) ? 'Customize & Buy' : 'View Product'}
        </Link>
      </div>
    </div>
  );
};
