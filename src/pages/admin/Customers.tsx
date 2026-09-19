import React, { useEffect, useState } from 'react';
import { services } from '../../services/mock';
import { User } from '../../domain/models';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // @ts-ignore
    services.customers.getCustomers().then((data: User[]) => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No customers found.</td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {customer.role}
                      </span>
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
