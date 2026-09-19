import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { services } from '../../services';

import { getWhatsAppLink, generateWhatsAppOrderMessage } from '../../utils/whatsapp';

export default function Checkout() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const subtotal = getSubtotal();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    deliveryMethod: 'local' as 'pickup' | 'local' | 'nationwide',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Open window synchronously to bypass popup blockers
    const waWindow = window.open('about:blank', '_blank');
    
    try {
      const order = await services.orders.createOrder({
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        items,
        subtotal,
        discount: 0,
        total: subtotal,
        status: 'WhatsApp Pending',
        deliveryMethod: formData.deliveryMethod,
        deliveryAddress: formData.deliveryMethod !== 'pickup' ? formData.address : undefined,
      });
      
      const settings = await services.settings.getBusinessSettings();
      const msg = generateWhatsAppOrderMessage(order);
      const waLink = getWhatsAppLink(settings.whatsappNumber, msg);
      
      clearCart();
      
      if (waWindow) {
        waWindow.location.href = waLink;
      }
      
      navigate(`/order-confirmation/${order.reference}`);
    } catch (error) {
      if (waWindow) {
        waWindow.close();
      }
      console.error(error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-secondary">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="bg-surface rounded-lg shadow-sm border border-gray-100 p-6 space-y-6">
            <h2 className="text-xl font-bold mb-4">Customer Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  value={formData.name} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  value={formData.phone} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Optional)</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                placeholder="For order updates"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <h2 className="text-xl font-bold mt-8 mb-4">Delivery Method</h2>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="deliveryMethod" 
                  value="pickup" 
                  checked={formData.deliveryMethod === 'pickup'}
                  onChange={handleChange}
                  className="text-primary focus:ring-primary"
                />
                <div>
                  <div className="font-medium">Store Pickup</div>
                  <div className="text-sm text-gray-500">Free - Pick up from our store</div>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="deliveryMethod" 
                  value="local" 
                  checked={formData.deliveryMethod === 'local'}
                  onChange={handleChange}
                  className="text-primary focus:ring-primary"
                />
                <div>
                  <div className="font-medium">Local Delivery</div>
                  <div className="text-sm text-gray-500">Fee calculated via WhatsApp</div>
                </div>
              </label>
            </div>

            {formData.deliveryMethod !== 'pickup' && (
              <div className="mt-4 transition-all duration-300">
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                <textarea 
                  name="address" 
                  required 
                  value={formData.address} 
                  onChange={handleChange}
                  rows={3} 
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary"
                />
              </div>
            )}
            
            <div className="pt-6">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary text-white px-6 py-4 rounded-md font-bold hover:bg-primary-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? 'Processing...' : 'Place Order via WhatsApp'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm border-b border-gray-100 pb-2 last:border-0">
                  <div className="flex-1 pr-4">
                    <span className="font-medium">{item.quantity}x</span> {item.productName}
                    {item.variantName && <div className="text-xs text-gray-500">{item.variantName}</div>}
                    {item.customization && (
                       <div className="text-xs text-gray-500 italic mt-1">Customized</div>
                    )}
                  </div>
                  <div className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium">{formData.deliveryMethod === 'pickup' ? 'Free' : 'TBD'}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between text-lg font-bold text-secondary">
                <span>Estimated Total</span>
                <span className="text-primary">
                  {formData.deliveryMethod === 'pickup' 
                    ? `₦${subtotal.toLocaleString()}` 
                    : `₦${subtotal.toLocaleString()} + delivery`}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2 bg-yellow-50 p-2 rounded">
                Final amount including delivery will be confirmed by our team on WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
