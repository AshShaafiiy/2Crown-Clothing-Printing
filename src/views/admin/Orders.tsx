"use client";
import React, { useState, useEffect } from 'react';
import { services } from '../../services';
import { Order } from '../../domain/models';
import { AdminSearch } from '../../components/admin/AdminSearch';
import { useConfirm } from '../../components/ui/ConfirmProvider';
import { getValidNextStatuses, getStatusLabel } from '../../utils/orderTransitions';
import { normalizeOrderHistoryDate } from '../../utils/orderHistory';
import toast from 'react-hot-toast';


function safeFormatDate(dateStr?: string, options?: any) {
  if (!dateStr) return 'Date unavailable';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Date unavailable';
  return options ? d.toLocaleString(undefined, options) : d.toLocaleString();
}

function safeFormatDateShort(dateStr?: string) {
  if (!dateStr) return 'Date unavailable';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Date unavailable';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { confirm } = useConfirm();

  useEffect(() => {
    services.orders.getOrders().then(data => {
      // Sort newest first
      const sorted = [...data].sort((a, b) => (new Date(b.createdAt).getTime() || 0) - (new Date(a.createdAt).getTime() || 0));
      setOrders(sorted);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setError(err.message || "An error occurred");
      setLoading(false);
    });
  }, []);


  const filteredOrders = orders.filter(o => {
    const term = searchQuery.toLowerCase();
    return (
      o.reference.toLowerCase().includes(term) ||
      o.customerName.toLowerCase().includes(term) ||
      o.customerPhone.toLowerCase().includes(term) ||
      (o.customerEmail && o.customerEmail.toLowerCase().includes(term))
    );
  });

  const handleStatusChange = async (order: Order, newStatus: string) => {
    if (newStatus === 'Confirmed' && order.deliveryMethod !== 'pickup' && order.deliveryFee == null) {
      toast.error('Enter the delivery fee before confirming this order.', { duration: 4000 });
      setEditingFeeId(order.id);
      setTimeout(() => {
        const input = document.getElementById('delivery-fee-input');
        if (input) input.focus();
      }, 100);
      return;
    }

    const isConfirmed = await confirm({
      title: newStatus === 'Confirmed' ? 'Confirm Order' : 'Update Order Status',
      message: newStatus === 'Confirmed' 
        ? (order.deliveryMethod === 'pickup' ? 'Confirm this order for Store Pickup?' : `Confirm this order with a delivery fee of ₦${order.deliveryFee?.toLocaleString()}?`)
        : `Are you sure you want to change the status to ${newStatus}?`,
      confirmLabel: newStatus === 'Confirmed' ? 'Confirm Order' : 'Update Status',
      isDestructive: newStatus === 'Cancelled'
    });

    if (!isConfirmed) return;

    try {
      const updated = await services.orders.updateOrderStatus(order.id, newStatus as any);
      setOrders(prev => prev.map(o => o.id === order.id ? updated : o));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update order status');
    }
  };

  const [editingFeeId, setEditingFeeId] = useState<string | null>(null);
  const [tempFee, setTempFee] = useState<string>('');

  const handleSaveDeliveryFee = async (order: Order) => {
    const fee = parseInt(tempFee, 10);
    if (isNaN(fee) || fee < 0) {
      toast.error('Please enter a valid non-negative delivery fee');
      return;
    }
    try {
      const updated = await services.orders.updateOrderDeliveryFee(order.id, fee);
      setOrders(prev => prev.map(o => o.id === order.id ? updated : o));
      setEditingFeeId(null);
      toast.success('Delivery fee saved successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update delivery fee');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
    if (expandedOrderId !== id) {
      setEditingFeeId(null);
    }
  };

  return (

    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track customer orders.</p>
        </div>
        <div className="flex flex-col w-full lg:w-auto flex-shrink">
          <div className="w-full sm:w-[300px] md:w-[360px] lg:w-[400px]">
            <AdminSearch
            placeholder="Search by order reference, customer name or phone..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
          <table className="min-w-full">

            <thead className="bg-gray-50 border-b whitespace-nowrap">
              <tr>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Order</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Customer</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Items</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Amount</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Delivery</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Date</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500 whitespace-nowrap">No orders found.</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500 whitespace-nowrap">No orders found matching your search.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);
                  const isStorePickup = order.deliveryMethod === 'pickup';
                  const deliveryText = isStorePickup ? 'Store Pickup' : 'Local Delivery';

                  let statusColor = 'bg-gray-100 text-gray-800';
                  if (order.status === 'Awaiting Confirmation') statusColor = 'bg-orange-100 text-orange-800';
                  else if (['Confirmed', 'Processing', 'Ready for Delivery', 'Ready for Pickup', 'Out for Delivery'].includes(order.status)) statusColor = 'bg-blue-100 text-blue-800';
                  else if (['Delivered', 'Picked Up'].includes(order.status)) statusColor = 'bg-green-100 text-green-800';
                  else if (order.status === 'Cancelled') statusColor = 'bg-red-100 text-red-800';

                  return (
                  <React.Fragment key={order.id}>
                    <tr onClick={() => toggleExpand(order.id)} className="cursor-pointer hover:bg-gray-50/50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{order.reference}</td>
                      <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerPhone}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {isStorePickup || order.deliveryFee != null ? `₦${order.total.toLocaleString()}` : `₦${order.subtotal.toLocaleString()}`}
                        {!isStorePickup && order.deliveryFee == null && <span className="text-xs text-gray-500 font-normal ml-1">+ delivery</span>}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {deliveryText}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {safeFormatDateShort(order.createdAt)}
                      </td>
                    </tr>
                    {expandedOrderId === order.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={7} className="px-6 py-6 border-b whitespace-nowrap">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
                            <div className="bg-white p-4 rounded border shadow-sm">
                              <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">Customer Details</h4>
                              <div className="grid grid-cols-3 gap-2 mb-2">
                                <span className="text-gray-500">Name:</span> <span className="col-span-2 font-medium">{order.customerName}</span>
                                <span className="text-gray-500">Phone:</span> <span className="col-span-2 font-medium">{order.customerPhone}</span>
                                {order.customerEmail && <><span className="text-gray-500">Email:</span> <span className="col-span-2">{order.customerEmail}</span></>}
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded border shadow-sm">
                              <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">Delivery Details</h4>
                              <div className="grid grid-cols-3 gap-2 mb-2">
                                <span className="text-gray-500">Method:</span> <span className="col-span-2 font-medium">{deliveryText}</span>
                                {order.deliveryAddress && <><span className="text-gray-500">Address:</span> <span className="col-span-2">{order.deliveryAddress}</span></>}
                                <span className="text-gray-500">Created:</span> <span className="col-span-2">{safeFormatDate(order.createdAt)}</span>
                              </div>
                            </div>
                            
                            <div className="lg:col-span-2 bg-white p-4 rounded border shadow-sm mt-2">
                              <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">Order Items</h4>
                              <ul className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <li key={idx} className="flex justify-between items-start">
                                    <div>
                                      <span className="font-medium">{item.quantity}x {item.productName}</span>
                                      {item.variantName && <span className="text-gray-500 ml-1">({item.variantName})</span>}
                                      {item.customization && Object.keys(item.customization).length > 0 && (
                                        <div className="mt-1 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                          {Object.entries(item.customization).map(([k, v]) => (
                                            <div key={k}><span className="font-semibold text-gray-700">{k.charAt(0).toUpperCase() + k.slice(1)}:</span> {v}</div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    <span className="font-medium whitespace-nowrap ml-4">₦{(item.price * item.quantity).toLocaleString()}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-4 pt-3 border-t flex justify-end">
                                <div className="text-right w-64 ml-auto">
                                  <div className="flex justify-between mb-1">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium text-gray-900">₦{order.subtotal.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-600">Delivery Fee:</span>
                                    {isStorePickup ? (
                                      <span className="font-medium text-gray-900">₦0</span>
                                    ) : order.deliveryFee != null ? (
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">₦{order.deliveryFee.toLocaleString()}</span>
                                      </div>
                                    ) : (
                                      <span className="font-medium text-gray-900 text-sm">To be confirmed</span>
                                    )}
                                  </div>
                                  {(!isStorePickup && editingFeeId === order.id) ? (
                                      <div className="flex items-center justify-end gap-2 my-2 bg-gray-50 p-2 rounded border border-gray-200">
                                        <span className="text-gray-500 font-medium">₦</span>
                                        <input
                                          id="delivery-fee-input"
                                          type="number"
                                          min="0"
                                          value={tempFee}
                                          onChange={e => setTempFee(e.target.value)}
                                          className="border border-gray-300 rounded px-2 py-1 w-24 text-right text-sm"
                                        />
                                        <button onClick={() => handleSaveDeliveryFee(order)} className="bg-black text-white text-xs px-3 py-1.5 rounded hover:bg-gray-800 transition">Save</button>
                                        <button onClick={() => setEditingFeeId(null)} className="text-gray-500 text-xs px-2 py-1.5 hover:bg-gray-100 rounded">Cancel</button>
                                      </div>
                                  ) : (!isStorePickup) && (
                                      <div className="flex justify-end mt-1 mb-2">
                                        <button onClick={() => { setEditingFeeId(order.id); setTempFee(order.deliveryFee != null ? order.deliveryFee.toString() : ''); }} className="text-xs text-blue-600 font-medium hover:underline">
                                          {order.deliveryFee == null ? 'Add Delivery Fee' : 'Edit Delivery Fee'}
                                        </button>
                                      </div>
                                  )}
                                  <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                                    <span className="font-bold text-gray-800">Total:</span>
                                    <span className="font-bold text-gray-900">
                                      {isStorePickup || order.deliveryFee != null
                                        ? `₦${order.total.toLocaleString()}`
                                        : `₦${order.subtotal.toLocaleString()} + delivery`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="lg:col-span-2 bg-white p-4 rounded border shadow-sm mt-2">
                              <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">Order History & Actions</h4>

                              <div className="mb-4">
                                <h5 className="font-semibold text-gray-700 mb-2">Timeline</h5>
                                {(!order.history || order.history.length === 0) ? (
                                  <p className="text-sm text-gray-500">No activity logged.</p>
                                ) : (
                                  <div className="space-y-3 pl-2">
                                    {order.history.map((entry, i) => {
                                      const normalizedISO = normalizeOrderHistoryDate(entry.timestamp);
                                      const displayDate = normalizedISO 
                                        ? new Date(normalizedISO).toLocaleString(undefined, {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})
                                        : 'Date unavailable';
                                      
                                      // Handle legacy format ({ status, comment }) and canonical format ({ newStatus, note })
                                      // Some legacy formats had string payload instead of object (from the backend bug), handle that too if it's somehow a string
                                      let statusLabel = 'Unknown Status';
                                      let note = '';
                                      let actor = 'System';
                                      
                                      if (typeof entry === 'string') {
                                        // Catch the backend bug where 'Admin updated status' was pushed as a string
                                        statusLabel = 'Status Updated';
                                        note = entry;
                                      } else {
                                        statusLabel = entry.newStatus || (entry as any).status || 'Unknown Status';
                                        note = entry.note || (entry as any).comment || '';
                                        actor = entry.actorName || 'System';
                                      }

                                      return (
                                        <div key={i} className="flex text-sm border-l-2 border-gray-200 pl-4 py-1 relative">
                                          <div className="absolute w-2 h-2 bg-gray-400 rounded-full -left-[5px] top-2"></div>
                                          <div className="w-32 text-gray-500 shrink-0 text-xs mt-0.5">
                                            {displayDate}
                                          </div>
                                          <div className="flex-1">
                                            <div className="font-medium text-gray-800">{statusLabel}</div>
                                            <div className="text-xs text-gray-500">{actor}</div>
                                            {note && <div className="text-xs text-gray-500 mt-1 italic">{note}</div>}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>

                              <div className="mt-4 pt-3 border-t">
                                <h5 className="font-semibold text-gray-700 mb-3">Available Actions</h5>
                                <div className="flex flex-wrap gap-2">
                                  {(() => {
                                    const validNext = getValidNextStatuses(order.status, order.deliveryMethod);
                                    if (validNext.length === 0) {
                                      return <p className="text-sm text-gray-500 italic">This order has reached its final status.</p>;
                                    }
                                    return validNext.map(status => (
                                      <button
                                        key={status}
                                        onClick={() => handleStatusChange(order, status)}
                                        className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                                          status === 'Cancelled'
                                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                            : status === 'Delivered' || status === 'Picked Up'
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-black text-white hover:bg-gray-800'
                                        }`}
                                      >
                                        {status === 'Confirmed' ? 'Confirm Order' : 'Mark as ' + status}
                                      </button>
                                    ));
                                  })()}
                                </div>
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
