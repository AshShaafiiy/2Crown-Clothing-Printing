import { useState } from 'react';

import { Search } from 'lucide-react';
import { services } from '../../services';
import { Order } from '../../domain/models';

export default function TrackOrder() {
  const [reference, setReference] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    
    try {
      const data = await services.orders.getOrderByReference(reference);
      if (data && data.customerPhone === phone) {
        setOrder(data);
      } else {
        setError('Order not found or phone number does not match.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Reference</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. 2CROWN-123456"
              value={reference} 
              onChange={e => setReference(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              type="tel" 
              required 
              placeholder="Number used for the order"
              value={phone} 
              onChange={e => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary"
            />
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
              {order.status}
            </span>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100">
              <div className="text-gray-500">Date Placed</div>
              <div className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100">
              <div className="text-gray-500">Items</div>
              <div className="font-medium">{order.items.reduce((acc: any, item: any) => acc + item.quantity, 0)} items</div>
            </div>
            <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100">
              <div className="text-gray-500">Estimated Total</div>
              <div className="font-medium">₦{order.total.toLocaleString()}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 py-3">
              <div className="text-gray-500">Delivery Method</div>
              <div className="font-medium capitalize">{order.deliveryMethod}</div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="font-bold mb-4">Status Timeline</h3>
            <div className="relative pl-6 border-l-2 border-primary space-y-6">
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-primary rounded-full border-4 border-white"></div>
                <div className="font-medium">Order Placed</div>
                <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-primary rounded-full border-4 border-white"></div>
                <div className="font-medium text-primary">{order.status}</div>
                <div className="text-xs text-gray-500">Current Status</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
