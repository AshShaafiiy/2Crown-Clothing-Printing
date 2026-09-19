import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { services } from '../../services';
import { useCartStore } from '../../store/cartStore';
import { Product, ProductVariant, CustomizationField } from '../../domain/models';
import { ImageFallback } from '../../components/ui/ImageFallback';
import { ProductRatingDisplay } from '../../components/ui/ProductRatingDisplay';
import { ProductRatingInput } from '../../components/ui/ProductRatingInput';
import toast from 'react-hot-toast';
import { Minus, Plus } from 'lucide-react';

const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshRating, setRefreshRating] = useState<number>(0);
  const { addItem } = useCartStore();

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [customization, setCustomization] = useState<Record<string, any>>({});
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await services.products.getProductBySlug(slug);
        setProduct(data);
        if (data) {
          if (data.variants && data.variants.length > 0) {
            setSelectedVariantId(data.variants[0].id);
          }
          if (data.images && data.images.length > 0) {
            setSelectedImage(data.images[0]);
          }
          // Init customization
          const initCust: Record<string, any> = {};
          data.customizationFields?.forEach(f => {
            initCust[f.name] = '';
          });
          setCustomization(initCust);
        }
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleCustomizationChange = (name: string, value: any) => {
    setCustomization(prev => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Validate required customizations
    if (product.customizationFields) {
      for (const field of product.customizationFields) {
        if (field.type === 'file') continue;
        if (field.required && !customization[field.name]) {
          toast.error(`Please provide a value for ${field.label}`);
          return;
        }
      }
    }

    const selectedVariant = product.variants?.find(v => v.id === selectedVariantId);
    const finalPrice = selectedVariant ? selectedVariant.price : product.price;
    const variantName = selectedVariant ? selectedVariant.name : undefined;

    // Filter out empty customizations
    const finalCustomization = Object.fromEntries(
      Object.entries(customization).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    );

    addItem({
      id: `cart-item-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      price: finalPrice,
      quantity,
      variantId: selectedVariantId || undefined,
      variantName,
      customization: Object.keys(finalCustomization).length > 0 ? finalCustomization : undefined,
    });
    
    toast.success(`Added ${quantity}x ${product.name} to cart!`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 bg-gray-200 h-96 rounded-lg"></div>
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-8 bg-gray-200 w-3/4 rounded"></div>
            <div className="h-6 bg-gray-200 w-1/4 rounded"></div>
            <div className="h-24 bg-gray-200 w-full rounded"></div>
            <div className="h-10 bg-gray-200 w-1/2 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return <div className="p-8 text-center text-red-500">{error || 'Product not found'}</div>;
  }

  const selectedVariant = product.variants?.find(v => v.id === selectedVariantId);
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Images */}
        <div className="w-full md:w-1/2">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg shadow-md mb-4 bg-gray-100">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageFallback text={product.name} className="w-full h-full min-h-[400px]" />
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${selectedImage === img ? 'border-primary' : 'border-transparent'}`}
                >
                  <img src={img} alt={`${product.name} ${idx+1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-extrabold tracking-tight text-secondary sm:text-4xl mb-2">
            {product.name}
          </h1>
          <div className="mb-6">
            <ProductRatingDisplay key={refreshRating} productId={product.id} />
          </div>
          <div className="flex items-center mb-6">
            <p className="text-2xl font-bold text-primary">₦{currentPrice.toLocaleString()}</p>
            {product.previousPrice && (
              <p className="ml-4 text-lg text-gray-500 line-through">₦{product.previousPrice.toLocaleString()}</p>
            )}
          </div>
          
          <div className="text-base text-gray-700 mb-8 pb-8 border-b border-gray-200">
            <p>{product.description || 'No description available for this product.'}</p>
          </div>
          
          <div className="space-y-6">
            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Options *</label>
                <select
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary"
                >
                  {product.variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} - ₦{v.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Customization Fields */}
            {product.customizationFields?.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label} {field.type !== 'file' && field.required && '*'}
                </label>
                
                {field.type === 'file' && (
                  <div className="bg-primary/5 border border-primary/20 rounded-md px-4 py-3 text-sm text-gray-700">
                    <strong>Note:</strong> File uploads (designs, logos, reference images) are handled directly on WhatsApp after you submit your request.
                  </div>
                )}
                
                {(field.type === 'text' || field.type === 'number' || field.type === 'color') && (
                  <input
                    type={field.type === 'number' ? 'number' : field.type === 'color' ? 'color' : 'text'}
                    required={field.required}
                    value={customization[field.name] || ''}
                    onChange={(e) => handleCustomizationChange(field.name, e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary"
                  />
                )}

                {field.type === 'longtext' && (
                  <textarea
                    required={field.required}
                    rows={3}
                    value={customization[field.name] || ''}
                    onChange={(e) => handleCustomizationChange(field.name, e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary"
                  />
                )}

                {(field.type === 'dropdown' || field.type === 'size') && field.options && (
                  <select
                    required={field.required}
                    value={customization[field.name] || ''}
                    onChange={(e) => handleCustomizationChange(field.name, e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center w-32 border border-gray-300 rounded-md">
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <input 
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center p-2 focus:outline-none appearance-none"
                />
                <button 
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            <div className="pt-6">
              <button
                onClick={handleAddToCart}
                disabled={!product.active || (selectedVariant ? selectedVariant.stock === 0 : product.stock === 0)}
                className="w-full bg-primary hover:bg-primary-dark text-secondary font-bold py-4 px-8 rounded-md shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-8"
              >
                {!product.active || (selectedVariant ? selectedVariant.stock === 0 : product.stock === 0) 
                  ? 'Out of Stock' 
                  : 'Add to Cart'
                }
              </button>
            </div>

            <div className="border-t border-gray-200 pt-8 mt-4">
              <ProductRatingInput productId={product.id} onRatingSubmitted={() => {
                // To force a re-render of the display, we can use a key or just rely on state if they share context.
                // For this UI, the Display component handles its own fetch, so we'll just trigger a hard refresh or use a refresh key.
                setRefreshRating(prev => prev + 1);
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
