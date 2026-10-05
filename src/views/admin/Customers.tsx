"use client";
import React, { useEffect, useState } from 'react';
import { services } from '../../services';
import { Order } from '../../domain/models';
import { AdminSearch } from '../../components/admin/AdminSearch';

interface DerivedCustomer {
  name: string;
  phone: string;
  email: string;
  orderCount: number;
  lastOrderDate: string;
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<DerivedCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    services.orders.getOrders()
      .then((orders) => {
        const customerMap = new Map<string, DerivedCustomer>();

        orders.forEach(order => {
          // Use phone as the unique identifier if email is missing
          const identifier = order.customerEmail || order.customerPhone;
          if (!identifier) return;

          const existing = customerMap.get(identifier);
          if (existing) {
            existing.orderCount += 1;
            if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
              existing.lastOrderDate = order.createdAt;
            }
          } else {
            customerMap.set(identifier, {
              name: order.customerName,
              phone: order.customerPhone,
              email: order.customerEmail || 'N/A',
              orderCount: 1,
              lastOrderDate: order.createdAt
            });
          }
        });

        setCustomers(Array.from(customerMap.values()));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || "An error occurred");
        setLoading(false);
      });
  }, []);


  const filteredCustomers = customers.filter(c => {
    const term = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term) ||
      (c.email !== 'N/A' && c.email.toLowerCase().includes(term))
    );
  });

  return (

    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 text-sm mt-1">Customers are derived from order history.</p>
        </div>
        <div className="flex flex-col w-full lg:w-auto flex-shrink">
          <div className="w-full sm:w-[300px] md:w-[360px] lg:w-[400px]">
            <AdminSearch
            placeholder="Search by name, phone or email..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
          </div>
        </div>
      </div>


      {loading ? (
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-500 bg-red-50 p-4 rounded-md">{error}</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
          <table className="min-w-full">

            <thead className="bg-gray-50 border-b border-gray-200 whitespace-nowrap">
              <tr>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Customer</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Phone</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Email</th>
                <th className="whitespace-nowrap px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Orders</th>
                <th className="whitespace-nowrap px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Last Order</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500 whitespace-nowrap">No customers found from order history.</td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500 whitespace-nowrap">No customers found matching your search.</td>
                </tr>
              ) : (
                filteredCustomers.map((customer, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{customer.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.phone}</td>
                    <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.email !== 'N/A' ? customer.email : '—'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-700">
                      <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full text-xs">{customer.orderCount}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {new Date(customer.lastOrderDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Customers;
