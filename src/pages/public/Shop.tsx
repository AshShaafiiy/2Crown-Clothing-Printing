import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { services } from '../../services/mock';
import { Product, Category } from '../../domain/models';
import { ProductCard } from '../../components/ui/ProductCard';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters and Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('newest');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          services.products.getProducts(),
          services.categories.getCategories()
        ]);
        setProducts(productsData.filter(p => p.active));
        setCategories(categoriesData.filter(c => c.active));
      } catch (err) {
        setError('Failed to load shop data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.categoryId === selectedCategory);
    }

    // Sorting
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        // Mock newest by reversing for now, assuming array order is chronological
        result.reverse();
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortOption]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="h-10 bg-gray-200 w-48 mb-8 rounded animate-pulse"></div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4 h-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-red-500 max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Oops!</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="mt-6 bg-secondary text-white px-6 py-2 rounded">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-secondary">Shop Collection</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/4 space-y-8">
          {/* Search */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-secondary">Search</h3>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-secondary">Categories</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="category" 
                  value="all" 
                  checked={selectedCategory === 'all'}
                  onChange={() => setSelectedCategory('all')}
                  className="text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-gray-700 group-hover:text-primary transition-colors">All Products</span>
              </label>
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center space-x-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="category" 
                    value={cat.id} 
                    checked={selectedCategory === cat.id}
                    onChange={() => setSelectedCategory(cat.id)}
                    className="text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="text-gray-700 group-hover:text-primary transition-colors">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {filteredAndSortedProducts.length} result{filteredAndSortedProducts.length !== 1 && 's'}
            </p>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-primary focus:border-primary"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {filteredAndSortedProducts.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-6 text-primary hover:underline font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
