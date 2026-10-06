
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Trash2, ShoppingBag, ImageOff } from 'lucide-react';
import { QuantityControl } from '../../components/ui/QuantityControl';
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
                  <div className="flex gap-3 sm:gap-6">
                    {/* Product Image */}
                    <Link
                      href={`/product/${item.productSlug || item.productId}`}
                      className="flex-shrink-0 block rounded-md group"
                    >
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-md overflow-hidden bg-gray-50 border border-gray-100">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ImageOff size={24} />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Info & Controls */}
                    <div className="flex flex-col flex-1 min-w-0 justify-between">
                      
                      {/* Top row: Info + Price */}
                      <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-1 sm:gap-4 mb-3 sm:mb-4">
                        
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm sm:text-lg text-secondary line-clamp-2 sm:line-clamp-none">{item.productName}</h3>
                          {item.variantName && <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{item.variantName}</p>}
                          
                          {item.quantity > 1 && (
                            <div className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">₦{item.price.toLocaleString()} each</div>
                          )}
                        </div>
                        
                        {/* Price Block (Desktop: right-aligned, Mobile: left-aligned under title) */}
                        <div className="flex flex-col items-start sm:items-end flex-shrink-0 mt-1 sm:mt-0">
                          <div className="font-bold text-sm sm:text-lg text-secondary">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </div>
                          {item.previousPrice && item.previousPrice > item.price && (
                            <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                              <span className="text-xs sm:text-sm text-gray-400 line-through">
                                ₦{(item.previousPrice * item.quantity).toLocaleString()}
                              </span>
                              <span className="text-[10px] sm:text-xs font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                                -{Math.round(((item.previousPrice - item.price) / item.previousPrice) * 100)}%
                              </span>
                            </div>
                          )}
                        </div>
                        
                      </div>

                      {/* Bottom action row: Remove + Quantity */}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 sm:border-0 sm:pt-0">
                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                          title="Remove item"
                          aria-label={`Remove ${item.productName} from cart`}
                        >
                          <Trash2 size={16} />
                          <span>Remove</span>
                        </button>

                        {/* Quantity controls */}
                        <QuantityControl cartItemId={item.id} quantity={item.quantity} productName={item.productName} minQuantity={1} variant="cart" />
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
              className="w-full bg-primary text-secondary px-6 py-4 rounded-md font-bold hover:bg-primary-dark transition-all duration-250 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
            >
              Proceed to Checkout
            </button>

            <Link
              href="/shop"
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
