import React, { useState, useEffect } from 'react';
import { services } from '../../services';
import { Order } from '../../domain/models';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    services.orders.getOrders().then(data => {
      // Sort newest first
      const sorted = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(sorted);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setError(err.message || "An error occurred");
      setLoading(false);
    });
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr onClick={() => toggleExpand(order.id)} className="cursor-pointer hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.reference}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₦{order.total.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                    {expandedOrderId === order.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={5} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <h4 className="font-bold text-gray-700 mb-2">Customer Details</h4>
                              <p><strong>Name:</strong> {order.customerName}</p>
                              <p><strong>Phone:</strong> {order.customerPhone}</p>
                              {order.customerEmail && <p><strong>Email:</strong> {order.customerEmail}</p>}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-700 mb-2">Delivery Details</h4>
                              <p><strong>Method:</strong> {order.deliveryMethod}</p>
                              {order.deliveryAddress && <p><strong>Address:</strong> {order.deliveryAddress}</p>}
                              <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                            
                            <div className="md:col-span-2 mt-4">
                              <h4 className="font-bold text-gray-700 mb-2">Order Items</h4>
                              <ul className="list-disc pl-5">
                                {order.items.map((item, idx) => (
                                  <li key={idx} className="mb-2">
                                    <strong>{item.quantity}x {item.productName}</strong> {item.variantName ? `(${item.variantName})` : ''} 
                                    - ₦{item.price.toLocaleString()}
                                    {item.customization && Object.keys(item.customization).length > 0 && (
                                      <div className="ml-4 mt-1 p-2 bg-white border border-gray-200 rounded">
                                        {Object.entries(item.customization).map(([k, v]) => (
                                          <div key={k}><strong>{k.charAt(0).toUpperCase() + k.slice(1)}:</strong> {v}</div>
                                        ))}
                                      </div>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
