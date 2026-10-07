"use client";
import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { services } from '../../services';
import { ID } from '../../domain/models';

interface ProductRatingDisplayProps {
  productId: ID;
  compact?: boolean;
}

export const ProductRatingDisplay: React.FC<ProductRatingDisplayProps> = ({ productId, compact = false }) => {
  const [average, setAverage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchRating = async () => {
      try {
        const summary = await services.reviews.getRatingSummary(productId);
        if (isMounted) {
          setAverage(summary.average);
          setCount(summary.count);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRating();
    return () => { isMounted = false; };
  }, [productId]);

  if (loading) return <div className="animate-pulse h-5 w-24 bg-gray-200 rounded"></div>;

  if (count === 0) {
    return (
      <div className={`text-gray-400 ${compact ? 'text-xs' : 'text-sm'}`}>
        {compact ? 'No verified ratings' : 'No verified ratings yet'}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-1 sm:gap-1.5 ${compact ? 'text-[10px] sm:text-xs' : 'text-sm'} font-medium text-gray-700`}>
      <div className="flex text-primary" aria-label={`Rated ${average.toFixed(1)} out of 5`} role="img">
        {[0, 1, 2, 3, 4].map((starIndex) => {
          const fillPercentage = Math.max(0, Math.min(100, (average - starIndex) * 100));
          const size = compact ? 14 : 16;
          return (
            <div key={starIndex} className="relative" style={{ width: size, height: size }}>
              <Star 
                size={size} 
                fill="none" 
                className="text-gray-300 absolute top-0 left-0"
                aria-hidden="true"
              />
              {fillPercentage > 0 && (
                <div 
                  className="absolute top-0 left-0 overflow-hidden h-full"
                  style={{ width: `${fillPercentage}%` }}
                  aria-hidden="true"
                >
                  <Star 
                    size={size} 
                    fill="currentColor" 
                    className="text-primary absolute top-0 left-0"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className="ml-1 font-bold">{average.toFixed(1)}</span>
      <span className="text-gray-500 font-normal">
        {compact ? `(${count})` : `(${count} verified rating${count !== 1 ? 's' : ''})`}
      </span>
    </div>
  );
};
