"use client";
import React, { useState, useEffect } from 'react';
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
  
  const [loadingElig, setLoadingElig] = useState(true);
  const [eligibility, setEligibility] = useState<{ eligible: boolean, reason: string, existingRating?: number } | null>(null);
  const [currentRating, setCurrentRating] = useState<number>(0);
  
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [reference, setReference] = useState('');
  const [phone, setPhone] = useState('');
  const [verifyError, setVerifyError] = useState('');

  const check = async () => {
    setLoadingElig(true);
    try {
      if (services.reviews.checkEligibility) {
        const res = await services.reviews.checkEligibility(productId);
        setEligibility(res);
        if (res.existingRating) {
          setCurrentRating(res.existingRating);
        }
      } else {
        setEligibility({ eligible: true, reason: 'eligible' });
      }
    } catch (err) {
      setEligibility({ eligible: false, reason: 'not_authenticated' });
    } finally {
      setLoadingElig(false);
    }
  };

  useEffect(() => {
    check();
  }, [productId]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setVerifyError('');
    try {
      const res = await services.reviews.verifyPurchase(productId, reference, phone);
      localStorage.setItem(`rating_token_${productId}`, res.token);
      setShowVerifyModal(false);
      check();
    } catch (err: any) {
      setVerifyError(err.message || "We couldn't verify this purchase.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRate = async (rating: number) => {
    setIsSubmitting(true);
    try {
      await services.reviews.addReview({
        productId,
        customerId: 'auth-user',
        customerName: 'Customer',
        rating,
      });
      toast.success(eligibility?.existingRating ? 'Rating updated successfully!' : 'Thank you for rating this product!');
      setCurrentRating(rating);
      setEligibility(prev => prev ? { ...prev, existingRating: rating, reason: 'already_rated' } : null);
      onRatingSubmitted();
    } catch (err: any) {
      toast.error('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingElig) {
    return <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg animate-pulse h-32"></div>;
  }
  
  if (!eligibility?.eligible) {
    let message = "Verify your purchase to rate this product.";
    if (eligibility?.reason === 'not_purchased') {
      message = "We couldn't verify this purchase.";
    } else if (eligibility?.reason === 'not_delivered') {
      message = "You can rate this product after delivery.";
    }
    
    return (
      <>
        <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg">
          <h3 className="font-bold text-secondary mb-2">Rate this product</h3>
          <p className="text-sm text-gray-500 mb-4">{message}</p>
          <button 
            onClick={() => setShowVerifyModal(true)}
            className="px-4 py-2 bg-primary text-secondary font-bold rounded shadow hover:bg-primary/90 transition-colors"
          >
            Verify Purchase
          </button>
        </div>

        {showVerifyModal && (
          <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white rounded-xl w-full max-w-md shadow-xl flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Verify Purchase</h2>
              </div>
              
              <div className="p-6 text-gray-600">
                <form id="verify-form" onSubmit={handleVerify} className="space-y-4">
                  {verifyError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{verifyError}</div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Reference</label>
                    <input 
                      type="text" 
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="e.g. 2C-123456"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus-visible:ring-primary focus:border-primary"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Number used for the order"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus-visible:ring-primary focus:border-primary"
                      required 
                    />
                  </div>
                </form>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-3 flex-col-reverse sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowVerifyModal(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-gray-700 font-medium hover:bg-gray-50 focus:outline-none transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="verify-form"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-4 py-2 bg-primary text-secondary rounded shadow-sm font-medium hover:bg-primary/90 focus:outline-none transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify Purchase'}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  const title = eligibility.reason === 'already_rated' ? 'Update your rating' : 'Rate this product';
  const displayStar = hoveredStar > 0 ? hoveredStar : currentRating;

  return (
    <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg">
      <h3 className="font-bold text-secondary mb-3">{title}</h3>
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
              fill={star <= displayStar ? "currentColor" : "none"} 
              className={star <= displayStar ? "text-primary" : "text-gray-300"}
            />
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {eligibility.reason === 'already_rated' ? 'Click a star to update your rating.' : 'Click a star to submit your rating.'}
      </p>
    </div>
  );
};