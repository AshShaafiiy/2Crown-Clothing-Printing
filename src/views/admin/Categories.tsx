"use client";
import { useConfirm } from '../../components/ui/ConfirmProvider';
import { toast } from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { services } from '../../services';
import { Category, Product } from '../../domain/models';
import { AdminSearch } from '../../components/admin/AdminSearch';

const Categories: React.FC = () => {
  const { confirm } = useConfirm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const defaultFormState = { id: '', name: '', slug: '', description: '', active: true, order: 0 };
  const [formData, setFormData] = useState(defaultFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        services.categories.getCategories(),
        services.products.getProducts()
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormData({ ...defaultFormState, order: categories.length + 1 });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setModalMode('edit');
    setFormData({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      active: category.active,
      order: category.order
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setFormError(null);
    if (!formData.name.trim()) return setFormError('Name is required');

    setIsSaving(true);
    try {
      const payload: any = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: formData.description,
        order: Number(formData.order),
        active: formData.active
      };

      if (modalMode === 'create') {
        await services.categories.createCategory(payload);
      } else {
        await services.categories.updateCategory(formData.id, payload);
      }

      setIsModalOpen(false);
      fetchData();
      toast.success(modalMode === 'create' ? 'Category created successfully.' : 'Category updated successfully.');
    } catch (err: any) {
      setFormError(err.message || 'Validation error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const productCount = products.filter(p => p.categoryId === id).length;

    if (productCount > 0) {
      toast.error(`Cannot delete "${name}" because it has ${productCount} products assigned. Reassign them first.`);
      return;
    }

    const message = `Are you sure you want to delete the "${name}" category?`;
    const isConfirmed = await confirm({
      title: 'Delete Category',
      message: message,
      confirmLabel: 'Delete Category',
      isDestructive: true
    });
    if (isConfirmed) {
      try {
        await services.categories.deleteCategory(id);
        fetchData();
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete category');
      }
    }
  };

  return (

    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Manage product categories.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-shrink">
          <div className="flex-1 w-full sm:w-[300px] md:w-[360px] lg:w-[400px]">
            <AdminSearch
            placeholder="Search categories by name..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
          </div>
          <button onClick={handleOpenCreate} className="bg-primary text-secondary px-4 py-2 rounded shadow hover:bg-primary/90 font-medium whitespace-nowrap">
            Add Category
          </button>
        </div>
      </div>


      {loading ? (
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-500 bg-red-50 p-4 rounded">{error}</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
          <table className="min-w-full">

            <thead className="bg-gray-50 border-b border-gray-200 whitespace-nowrap">
              <tr>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Category</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Products</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Created</th>
                <th className="whitespace-nowrap px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500 whitespace-nowrap">No categories found.</td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500 whitespace-nowrap">No categories found matching your search.</td>
                </tr>
              ) : (
                filteredCategories.map((category) => {
                  const count = products.filter(p => p.categoryId === category.id).length;
                  return (
                    <tr key={category.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{category.name}</div>
                        <div className="text-xs text-gray-500">{category.slug}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="bg-gray-100 text-gray-800 py-1 px-2.5 rounded-full text-xs font-bold">{count} {count === 1 ? 'item' : 'items'}</span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded ${category.active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {category.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.createdAt ? new Date(category.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleOpenEdit(category)} className="text-gray-500 hover:text-blue-600 mr-4 transition-colors">Edit</button>
                        <button onClick={() => handleDelete(category.id, category.name)} className="text-gray-500 hover:text-red-600 transition-colors">Delete</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              {modalMode === 'create' ? 'Add Category' : 'Edit Category'}
            </h2>

            {formError && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{formError}</p>}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Name *</label>
                <input type="text" className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                <textarea className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary outline-none" rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Display Order</label>
                <input type="number" min="0" className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary outline-none" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} />
              </div>

              <label className="flex items-center cursor-pointer mt-4">
                <input type="checkbox" className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} />
                <span className="ml-2 text-sm text-gray-700">Active (visible to customers)</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-primary text-secondary rounded hover:bg-primary/90 font-medium flex items-center"
              >
                {isSaving ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;