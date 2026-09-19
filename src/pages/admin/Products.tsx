import { useState, useEffect } from 'react';

import { services } from '../../services/mock';
import { Product } from '../../domain/models';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await services.products.getProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await services.products.deleteProduct(id);
      fetchProducts();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
        >
          Add Product
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product: any) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={product.images[0]} alt={product.name} className="h-10 w-10 rounded object-cover" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Add Product</h2>
            <p className="text-gray-500 mb-4">Form placeholder...</p>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
