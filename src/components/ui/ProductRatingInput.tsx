import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { services } from '../../services';
import { ID } from '../../domain/models';
import toast from 'react-hot-toast';

interface ProductRatingInputProps {
  productId: ID;
  onRatingSubmitted: () => void;
}

export const ProductRatingInput: React.FC<ProductRatingInputProps> = ({ productId, onRatingSubmitted }) => {
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRate = async (rating: number) => {
    setIsSubmitting(true);
    try {
      // In a real app, we would get the actual customer ID from the auth context
      await services.reviews.addReview({
        productId,
        customerId: `anon-${Date.now()}`,
        customerName: 'Anonymous',
        rating,
      });
      toast.success('Thank you for rating this product!');
      onRatingSubmitted(); // Trigger a refetch of the summary
    } catch (err) {
      toast.error('Failed to submit rating. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg">
      <h3 className="font-bold text-secondary mb-3">Rate this product</h3>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={isSubmitting}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="focus:outline-none transition-transform hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Star 
              size={28} 
              fill={star <= hoveredStar ? "currentColor" : "none"} 
              className={star <= hoveredStar ? "text-primary" : "text-gray-300"}
            />
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">Click a star to submit your rating.</p>
    </div>
  );
};
