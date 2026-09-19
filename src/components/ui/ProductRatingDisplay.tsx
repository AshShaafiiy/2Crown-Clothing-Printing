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
        {compact ? 'No ratings yet' : 'Be the first to rate'}
      </div>
    );
  }

  // Round average to nearest integer for star display
  const roundedRating = Math.round(average);

  return (
    <div className={`flex items-center gap-1.5 ${compact ? 'text-xs' : 'text-sm'} font-medium text-gray-700`}>
      <div className="flex text-primary">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={compact ? 14 : 16} 
            fill={star <= roundedRating ? "currentColor" : "none"} 
            className={star <= roundedRating ? "text-primary" : "text-gray-300"}
          />
        ))}
      </div>
      <span className="ml-1 font-bold">{average.toFixed(1)}</span>
      <span className="text-gray-500 font-normal">
        {compact ? `(${count})` : `${count} rating${count !== 1 ? 's' : ''}`}
      </span>
    </div>
  );
};
