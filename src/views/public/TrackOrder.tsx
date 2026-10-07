"use client";
import { useState } from 'react';

import { Search } from 'lucide-react';
import { normalizeOrderHistoryDate } from '../../utils/orderHistory';
import { services } from '../../services';
import { PublicOrder, OrderStatus } from '../../domain/models';
import { getStatusLabel, getStatusDescription, getCustomerFacingStatus } from '../../utils/orderTransitions';

export default function TrackOrder() {
  const [reference, setReference] = useState('');
  const [phone, setPhone] = useState('');
  const isLegacy = /^2C-\d{5,6}$/i.test(reference.trim());
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    
    try {
      const data = await services.orders.getOrderByReference(reference, isLegacy ? phone : "");
      if (data) {
        setOrder(data);
      } else {
        setError('Order not found.');
      }
    } catch (err) {
      setError((err as { status?: number }).status === 429 ? 'Too many tracking requests. Please try again later.' : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-secondary">Track Your Order</h1>
      
      <div className="bg-surface rounded-lg shadow-sm border border-gray-100 p-8 mb-8">
        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label htmlFor="tracking-reference" className="block text-sm font-medium text-gray-700 mb-1">Order Reference</label>
            <input 
              id="tracking-reference"
              type="text" 
              required 
              placeholder="2C-123456"
              value={reference} 
              onChange={e => setReference(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus-visible:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="tracking-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input id="tracking-phone" type="tel" required maxLength={32} value={phone} onChange={e => setPhone(e.target.value)} placeholder="Number used for the order" className="w-full border border-gray-300 rounded-md px-4 py-2" />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3 rounded-md font-bold hover:bg-secondary-light transition-colors"
          >
            <Search size={20} />
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>
        {error && <div className="mt-4 text-red-500 text-sm text-center">{error}</div>}
      </div>

      {order && (
        <div className="bg-surface rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Order Details</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {getStatusLabel(order.status)}
            </span>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 py-3 border-b border-gray-100">
              <div className="text-gray-500">Order Reference</div>
              <div className="font-medium">{order.reference}</div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 py-3 border-b border-gray-100">
              <div className="text-gray-500">Date Placed</div>
              <div className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 py-3 border-b border-gray-100">
              <div className="text-gray-500">Delivery Method</div>
              <div className="font-medium capitalize">{order.deliveryMethod === 'pickup' ? 'Store Pickup' : 'Local Delivery'}</div>
            </div>
            <div className="py-3 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 mb-2">
                <div className="text-gray-500">Order Items</div>
              </div>
              <ul className="space-y-2">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-start text-gray-800">
                    <div>
                      <span className="font-medium">{item.quantity}x {item.productName}</span>
                      {item.variantName && <span className="text-gray-500 ml-1">({item.variantName})</span>}
                    </div>
                    <span className="font-medium ml-4">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 py-3 border-b border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>₦{order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₦{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Fee</span>
                <span>
                  {order.deliveryMethod === 'pickup' ? '₦0' : order.deliveryFee != null ? `₦${order.deliveryFee.toLocaleString()}` : 'To be confirmed'}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>
                  {order.deliveryMethod === 'pickup' || order.deliveryFee != null
                    ? `₦${order.total.toLocaleString()}`
                    : `₦${(order.subtotal - order.discount).toLocaleString()} + delivery`}
                </span>
              </div>
            </div>
          </div>
          
                    <div className="mt-8">
            <h3 className="font-bold mb-4">Status Timeline</h3>
            <div className="relative pl-6 border-l-2 border-primary space-y-6">

              {(() => {
                const isLocalDelivery = order.deliveryMethod !== 'pickup';
                let timelineStatuses: OrderStatus[] = isLocalDelivery
                  ? ['Awaiting Confirmation', 'Confirmed', 'Processing', 'Ready for Delivery', 'Out for Delivery', 'Delivered']
                  : ['Awaiting Confirmation', 'Confirmed', 'Processing', 'Ready for Pickup', 'Picked Up'];

                const effectiveCurrentStatus = getCustomerFacingStatus(order.status);

                if (order.status === 'Cancelled') {
                  timelineStatuses = ['Awaiting Confirmation', 'Cancelled'];
                }

                const currentIndex = timelineStatuses.indexOf(effectiveCurrentStatus as any);

                return timelineStatuses.map((status, index) => {
                  const isCompleted = index < currentIndex;
                  const isCurrent = index === currentIndex;
                  const isFuture = index > currentIndex;

                  // Find timestamp from history if available
                  let timestamp = '';
                  if (order.history) {
                    const entry = order.history.find(h => {
                      const entryStatus = h.newStatus || (h as any).status;
                      if (!entryStatus) return false;
                      return getCustomerFacingStatus(entryStatus) === status;
                    });
                    if (entry) {
                      const normalized = normalizeOrderHistoryDate(entry.timestamp);
                      if (normalized) timestamp = new Date(normalized).toLocaleString();
                    }
                  }
                  if (index === 0 && !timestamp) {
                    const normCreatedAt = normalizeOrderHistoryDate(order.createdAt);
                    if (normCreatedAt) timestamp = new Date(normCreatedAt).toLocaleString();
                  }

                  return (
                    <div key={status} className="relative">
                      <div className={`absolute -left-[31px] top-1 w-4 h-4 ${isCurrent ? 'bg-primary' : isCompleted ? 'bg-primary' : 'bg-gray-300'} rounded-full border-4 border-white`}></div>
                      <div className={`font-medium ${isCurrent ? 'text-primary' : isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                        {getStatusLabel(status, true)}
                      </div>
                      {timestamp ? <div className="text-xs text-gray-500">{timestamp}</div> : ((isCompleted || isCurrent) ? <div className="text-xs text-gray-400 italic">Date unavailable</div> : null)}
                      {isCurrent && <div className="text-sm text-gray-600 mt-1">{getStatusDescription(status, true)}</div>}
                    </div>
                  );
                });
              })()}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
