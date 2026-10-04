import { useState, useEffect } from 'react';

import { services } from '../../services';
import { Order, OrderStatus } from '../../domain/models';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalSales: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await services.dashboard.getStats();
        const orders = await services.orders.getOrders();
        
        setStats(statsData);
        
        // Get 5 most recent
        setRecentOrders(orders.slice(-5).reverse());
      } catch (err: any) {
        console.error('Dashboard fetch error:', err);
        setError(err.message || 'An error occurred');
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-50 p-4 text-red-500 rounded">{error}</div>}
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Pending Action</h3>
          <p className="text-3xl font-bold mt-2 text-yellow-600">{stats.pendingOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">₦{stats.totalSales.toLocaleString()}</p>
        </div>
      </div>
      
      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-max">
            <thead className="bg-gray-50 text-gray-500 text-sm whitespace-nowrap">
              <tr>
                <th className="whitespace-nowrap px-6 py-4 font-medium whitespace-nowrap">Reference</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium whitespace-nowrap">Customer</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium whitespace-nowrap">Date</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium whitespace-nowrap">Amount</th>
                <th className="whitespace-nowrap px-6 py-4 font-medium whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 whitespace-nowrap">
                    No orders found.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 font-medium whitespace-nowrap">{order.reference}</td>
                    <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap">{order.customerName}</td>
                    <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium whitespace-nowrap">₦{order.total.toLocaleString()}</td>
                    <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap">
                      {(() => {
                        let statusColor = 'bg-gray-100 text-gray-800';
                        if (order.status === 'Awaiting Confirmation') statusColor = 'bg-orange-100 text-orange-800';
                        else if (['Confirmed', 'Processing', 'Ready for Delivery', 'Ready for Pickup', 'Out for Delivery'].includes(order.status)) statusColor = 'bg-blue-100 text-blue-800';
                        else if (['Delivered', 'Picked Up'].includes(order.status)) statusColor = 'bg-green-100 text-green-800';
                        else if (order.status === 'Cancelled') statusColor = 'bg-red-100 text-red-800';
                        return (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
                            {order.status}
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
