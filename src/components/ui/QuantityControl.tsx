import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

interface QuantityControlProps {
  cartItemId: string;
  quantity: number;
  productName: string;
  showAddedText?: boolean;
  variant?: 'card' | 'details' | 'cart';
  minQuantity?: number;
}

export const QuantityControl: React.FC<QuantityControlProps> = ({ 
  cartItemId, 
  quantity, 
  productName, 
  showAddedText = false,
  variant = 'details',
  minQuantity = 0
}) => {
  const { updateQuantity, removeItem } = useCartStore();

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (quantity <= minQuantity) {
      return; // Disabled action
    }
    
    if (quantity === 1 && minQuantity < 1) {
      removeItem(cartItemId);
    } else {
      updateQuantity(cartItemId, quantity - 1);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(cartItemId, quantity + 1);
  };

  const isMinusDisabled = quantity <= minQuantity;
  
  const minusClass = isMinusDisabled
    ? 'w-8 h-8 sm:w-9 sm:h-9 bg-gray-200 text-gray-400 rounded-md cursor-not-allowed flex justify-center items-center flex-shrink-0'
    : 'w-8 h-8 sm:w-9 sm:h-9 bg-primary text-secondary hover:bg-primary-dark rounded-md shadow-sm transition-colors flex justify-center items-center active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 flex-shrink-0';
    
  const plusClass = 'w-8 h-8 sm:w-9 sm:h-9 bg-primary text-secondary hover:bg-primary-dark rounded-md shadow-sm transition-colors flex justify-center items-center active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 flex-shrink-0';

  const innerContainerClass = variant === 'card' 
    ? 'flex items-center justify-between w-full' 
    : 'flex items-center gap-2';

  const spanClass = variant === 'card' 
    ? 'flex-1 text-center font-bold text-gray-800 select-none' 
    : 'min-w-[2rem] text-center font-bold text-gray-800 select-none';

  return (
    <div 
      className={`flex flex-row items-center gap-3 sm:gap-4 whitespace-nowrap ${variant === 'card' ? 'w-full' : ''}`}
      onClick={e => e.stopPropagation()}
    >
      <div className={innerContainerClass}>
        <button 
          type="button"
          onClick={handleDecrease}
          disabled={isMinusDisabled}
          aria-disabled={isMinusDisabled}
          className={minusClass}
          aria-label={`Decrease quantity of ${productName}`}
        >
          <Minus size={16} strokeWidth={3} />
        </button>
        
        <span className={spanClass}>
          {quantity}
        </span>
        
        <button 
          type="button"
          onClick={handleIncrease}
          className={plusClass}
          aria-label={`Increase quantity of ${productName}`}
        >
          <Plus size={16} strokeWidth={3} />
        </button>
      </div>
      
      {showAddedText && (
        <span className="text-sm text-gray-500 font-medium">
          {quantity} item{quantity !== 1 ? 's' : ''} added
        </span>
      )}
    </div>
  );
};
