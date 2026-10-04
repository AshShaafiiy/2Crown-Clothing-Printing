
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Trash2, Plus, Minus, ShoppingBag, ImageOff } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function Cart() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const router = useRouter();
  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-2xl">
        <ShoppingBag className="mx-auto text-gray-300 mb-6" size={56} />
        <h1 className="text-3xl font-bold mb-4 text-secondary">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/shop" className="bg-primary text-secondary px-8 py-3 rounded-md font-bold hover:bg-primary-dark transition-colors inline-block btn-premium-gold">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-secondary">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-surface rounded-lg shadow-sm border border-gray-100">
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id} className="p-4 sm:p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link
                      to={`/product/${item.productSlug || item.productId}`}
                      className="flex-shrink-0 block transform transition-transform duration-300 hover:scale-105 hover:opacity-90 hover:shadow-md rounded-lg"
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ImageOff size={24} />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Info & Controls */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg text-secondary truncate">{item.productName}</h3>
                          {item.variantName && <p className="text-sm text-gray-500 mt-0.5">{item.variantName}</p>}
                          <div className="text-sm text-gray-500 mt-1">₦{item.price.toLocaleString()} each</div>
                        </div>
                        {/* Line total - desktop */}
                        <div className="hidden sm:block text-right flex-shrink-0">
                          <div className="font-bold text-lg text-secondary">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Bottom row: quantity + delete + mobile total */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3">
                          {/* Quantity controls */}
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="p-1.5 sm:p-2 qty-btn text-gray-600 rounded-l-md"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 sm:w-10 text-center text-sm font-medium select-none">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 sm:p-2 qty-btn text-gray-600 rounded-r-md"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Delete */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="Remove item"
                            aria-label={`Remove ${item.productName}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Line total - mobile */}
                        <div className="sm:hidden font-bold text-base text-secondary">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-surface rounded-lg shadow-sm border border-gray-100 p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-6 text-secondary">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span className="font-medium text-secondary">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-sm text-gray-500">Calculated at checkout</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-secondary">Estimated Total</span>
                <span className="text-lg font-bold text-primary">₦{subtotal.toLocaleString()}</span>
              </div>
            </div>
            
            <button 
              onClick={() => router.push('/checkout')}
              className="w-full bg-secondary text-white px-6 py-4 rounded-md font-bold hover:bg-secondary-light transition-all duration-250 hover:shadow-lg"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/shop"
              className="block text-center text-sm text-gray-500 hover:text-primary transition-colors mt-4 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
