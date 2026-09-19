
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function Cart() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const navigate = useNavigate();
  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-2xl">
        <h1 className="text-3xl font-bold mb-4 text-secondary">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-primary-dark transition-colors inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-secondary">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          <div className="bg-surface rounded-lg shadow-sm border border-gray-100 p-6">
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id} className="py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.productName}</h3>
                    {item.variantName && <p className="text-sm text-gray-500">{item.variantName}</p>}
                    <div className="text-primary font-bold mt-2">₦{item.price.toLocaleString()}</div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-2 hover:bg-gray-50 text-gray-600"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-50 text-gray-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="w-24 text-right font-bold text-lg">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-surface rounded-lg shadow-sm border border-gray-100 p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-secondary">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-sm">Calculated at checkout</span>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mb-8">
              <div className="flex justify-between items-center text-lg font-bold text-secondary">
                <span>Estimated Total</span>
                <span className="text-primary">₦{subtotal.toLocaleString()}</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-secondary text-white px-6 py-4 rounded-md font-bold hover:bg-secondary-light transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
