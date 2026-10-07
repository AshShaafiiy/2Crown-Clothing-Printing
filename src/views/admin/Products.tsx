"use client";
import { useConfirm } from '../../components/ui/ConfirmProvider';
import { toast } from 'react-hot-toast';
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, ImageOff } from 'lucide-react';
import { services } from '../../services';
import { Product, Category } from '../../domain/models';
import { AdminSearch } from '../../components/admin/AdminSearch';

const Products: React.FC = () => {
  const { confirm } = useConfirm();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const initialFormState = {
    id: '',
    name: '',
    description: '',
    categoryId: '',
    price: 0,
    previousPrice: 0,

    imageUrl: '',
    active: true,
    featured: false
  };

  const [formData, setFormData] = useState(initialFormState);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const fetchData = async () => {
    try {
      const [prods, cats] = await Promise.all([
        services.products.getProducts(),
        services.categories.getCategories()
      ]);
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    nameInputRef.current?.focus();
    return () => opener?.focus();
  }, [isModalOpen]);

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && !isSaving) {
      event.preventDefault();
      setIsModalOpen(false);
    }
    if (event.key !== 'Tab') return;
    const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled])') ?? [])
      .filter(element => element.getClientRects().length > 0);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const filteredProducts = products.filter(p => {
    const term = searchQuery.toLowerCase();
    const cat = categories.find(c => c.id === p.categoryId);
    const catName = cat ? cat.name.toLowerCase() : '';
    return p.name.toLowerCase().includes(term) || catName.includes(term);
  });

  const openAddModal = () => {
    setModalMode('create');
    setFormData(initialFormState);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setModalMode('edit');
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description || '',
      categoryId: product.categoryId,
      price: product.price,
      previousPrice: product.previousPrice || 0,

      imageUrl: product.imageUrl || '',
      active: product.active,
      featured: product.featured || false
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      confirmLabel: 'Delete Product',
      isDestructive: true
    });
    if (isConfirmed) {
      try {
        await services.products.deleteProduct(id);
        fetchData();
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete product');
      }
    }
  };

  const handleSave = async () => {
    setFormError(null);

    // Customized frontend validation
    if (!formData.name.trim()) return setFormError('Product name is required.');
    if (!formData.categoryId) return setFormError('Please select a category.');
    if (formData.price <= 0) return setFormError('Selling price must be greater than ₦0.');
        if (!formData.imageUrl) return setFormError('Please provide a product image.');

    setIsSaving(true);
    try {
      // Auto-generate slug from name if not present
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      const payload: Partial<Product> = {
        name: formData.name,
        slug: slug,
        description: formData.description,
        categoryId: formData.categoryId,
        price: formData.price,
        previousPrice: formData.previousPrice > 0 ? formData.previousPrice : undefined,

        imageUrl: formData.imageUrl,
        active: formData.active,
        featured: formData.featured
      };

      if (modalMode === 'create') {
        await services.products.createProduct(payload as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
      } else {
        await services.products.updateProduct(formData.id, payload);
      }

      setIsModalOpen(false);
      fetchData();
      toast.success(modalMode === 'create' ? 'Product created successfully.' : 'Product updated successfully.');
    } catch (err: any) {
      // Handle Zod backend field errors if possible
      let errMsg = err.message || 'Validation error';
      if (err.data && Array.isArray(err.data.errors)) {
        const firstErr = err.data.errors[0];
        if (firstErr && firstErr.path) {
          errMsg = `Invalid field (${firstErr.path.join('.')}): ${firstErr.message}`;
        }
      }
      setFormError(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your catalog.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-shrink">
          <div className="flex-1 w-full sm:w-[300px] md:w-[360px] lg:w-[400px]">
            <AdminSearch
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
          </div>
          <button
            onClick={openAddModal}
            className="bg-primary text-secondary px-4 py-2 rounded shadow hover:bg-primary/90 flex items-center justify-center font-medium transition-colors flex-shrink-0 whitespace-nowrap"
          >
            <Plus size={18} className="mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200 whitespace-nowrap">
              <tr>
                <th className="whitespace-nowrap px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Product</th>
                <th className="whitespace-nowrap px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Category</th>
                <th className="whitespace-nowrap px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Price</th>
                                <th className="whitespace-nowrap px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="whitespace-nowrap px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500 whitespace-nowrap">No products found.</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500 whitespace-nowrap">No products found matching your search.</td></tr>
              ) : (
                filteredProducts.map(product => {
                  const cat = categories.find(c => c.id === product.categoryId);

                  return (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center', 'text-gray-400');
                                  e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="15" y1="9" x2="15.01" y2="9"></line><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="m3 15 2.29-2.29a2 2 0 0 1 2.83 0L13 17"></path><path d="m10 14 1.29-1.29a2 2 0 0 1 2.83 0L19 17"></path></svg>');
                                }}
                              />
                            ) : (
                              <ImageOff size={20} className="text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{product.name}</p>
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {product.featured && <span className="text-[10px] bg-secondary text-white px-1.5 py-0.5 rounded font-medium">Featured</span>}
                              {product.price < (product.previousPrice || 0) && <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-medium">{Math.round(((product.previousPrice! - product.price) / product.previousPrice!) * 100)}% OFF</span>}
                                                                                        </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-600 whitespace-nowrap">{cat?.name || 'Unknown'}</td>
                      <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">₦{product.price.toLocaleString()}</span>
                        {product.previousPrice && product.previousPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through ml-2">₦{product.previousPrice.toLocaleString()}</span>
                        )}
                      </td>
                                            <td className="whitespace-nowrap px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {product.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => openEditModal(product)} className="text-gray-500 hover:text-blue-600 transition-colors">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="text-gray-500 hover:text-red-600 transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="product-dialog-title" onKeyDown={handleDialogKeyDown} className="bg-white rounded-xl w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 flex-shrink-0">
              <h2 id="product-dialog-title" className="text-xl font-bold text-gray-800">
                {modalMode === 'create' ? 'ADD PRODUCT' : 'EDIT PRODUCT'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 relative">
              <div className="p-4 sm:p-6 space-y-6">
                {formError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                    {formError}
                  </div>
                )}

                {/* Basic Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                      <input ref={nameInputRef} id="product-name" type="text" className="w-full border border-gray-300 rounded-md p-2 focus-visible:ring-primary focus:border-primary outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                      <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                      <textarea id="product-description" className="w-full border border-gray-300 rounded-md p-2 focus-visible:ring-primary focus:border-primary outline-none h-24 resize-y" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>
                    <div>
                      <label htmlFor="product-category" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select id="product-category" className="w-full border border-gray-300 rounded-md p-2 focus-visible:ring-primary focus:border-primary outline-none" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Pricing</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₦</span>
                        <input id="product-price" type="number" className="w-full border border-gray-300 rounded-md p-2 pl-8 focus-visible:ring-primary focus:border-primary outline-none" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="product-previous-price" className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₦</span>
                        <input id="product-previous-price" type="number" className="w-full border border-gray-300 rounded-md p-2 pl-8 focus-visible:ring-primary focus:border-primary outline-none" value={formData.previousPrice} onChange={e => setFormData({...formData, previousPrice: parseFloat(e.target.value) || 0})} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Image */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Product Image *</h3>
                  <div className="relative w-full sm:w-48 aspect-square border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors group">
                    {formData.imageUrl ? (
                      <>
                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, imageUrl: ''})}
                            className="bg-white rounded-full p-2 shadow hover:bg-red-50 text-red-500 transition-colors"
                            aria-label="Remove Image"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <input
                          type="file"
                          aria-label="Product image"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () => setFormData({...formData, imageUrl: reader.result as string});
                            reader.readAsDataURL(file);
                          }}
                          className="w-full h-full opacity-0 absolute inset-0 cursor-pointer z-10"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-500">
                          <div className="p-3 bg-white rounded-full shadow-sm mb-2">
                            <Plus size={24} className="text-primary" />
                          </div>
                          <span className="text-sm font-medium text-gray-600">Click to upload</span>
                          <span className="text-xs text-gray-400 mt-1">Single image only</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Promotions & Status */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Promotions & Status</h3>
                  <div className="flex flex-col space-y-4">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-primary border-gray-300 rounded focus-visible:ring-primary" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} />
                      <span className="ml-3 text-sm text-gray-700 font-medium">Active (Visible to customers)</span>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-primary border-gray-300 rounded focus-visible:ring-primary" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} />
                      <span className="ml-3 text-sm text-gray-700 font-medium">Featured Product (Shows on homepage)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-4 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:space-x-3 sm:gap-0 flex-shrink-0 z-10">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-medium transition-colors text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-2 bg-primary text-secondary rounded hover:bg-primary/90 font-medium flex items-center justify-center transition-colors shadow-sm"
              >
                {isSaving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
