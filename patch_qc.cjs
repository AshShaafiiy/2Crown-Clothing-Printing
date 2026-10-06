const fs = require('fs');
const path = 'src/components/ui/QuantityControl.tsx';
let content = `import React from 'react';
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
    ? 'p-2 bg-gray-200 text-gray-400 rounded cursor-not-allowed flex justify-center items-center'
    : 'p-2 bg-primary text-secondary hover:bg-primary-dark rounded shadow-sm transition-colors flex justify-center items-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50';
    
  const plusClass = 'p-2 bg-primary text-secondary hover:bg-primary-dark rounded shadow-sm transition-colors flex justify-center items-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50';

  const containerWidthClass = variant === 'card' ? 'w-full' : 'w-32';
  const spanWidthClass = variant === 'card' ? 'flex-1' : 'w-10';

  return (
    <div className={\`flex flex-col sm:flex-row items-start sm:items-center gap-3 \${showAddedText || variant === 'card' ? 'w-full' : ''}\`}>
      <div className={\`flex items-center bg-gray-100 rounded-md border border-gray-200 shadow-sm \${containerWidthClass} p-1 overflow-hidden\`} onClick={e => e.stopPropagation()}>
        <button 
          type="button"
          onClick={handleDecrease}
          disabled={isMinusDisabled}
          aria-disabled={isMinusDisabled}
          className={minusClass}
          aria-label={\`Decrease quantity of \${productName}\`}
        >
          <Minus size={16} strokeWidth={3} />
        </button>
        <span className={\`\${spanWidthClass} text-center text-sm font-bold text-gray-800 select-none\`}>
          {quantity}
        </span>
        <button 
          type="button"
          onClick={handleIncrease}
          className={plusClass}
          aria-label={\`Increase quantity of \${productName}\`}
        >
          <Plus size={16} strokeWidth={3} />
        </button>
      </div>
      {showAddedText && (
        <span className="text-sm text-gray-500 font-medium">
          ({quantity} item{quantity !== 1 ? 's' : ''} added)
        </span>
      )}
    </div>
  );
};
`;

fs.writeFileSync(path, content);
console.log("Updated QuantityControl");
