const fs = require('fs');

const path = 'src/components/ui/ProductCard.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('useCartStore')) {
  // Add imports
  content = content.replace(
    "import { ImageFallback } from './ImageFallback';",
    "import { ImageFallback } from './ImageFallback';\nimport { useCartStore } from '../../store/cartStore';\nimport { Minus, Plus } from 'lucide-react';\nimport toast from 'react-hot-toast';"
  );
  
  // Add hook inside ProductCard
  content = content.replace(
    "export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {",
    `export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find(i => i.productId === product.id);
  const requiresCustomization = (product.customizationFields?.length ?? 0) > 0 || (product.variants?.length ?? 0) > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: \`cart-item-\${Date.now()}\`,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    toast.success(\`Added \${product.name} to cart!\`);
  };
`
  );

  // Replace button at the bottom
  const oldButtonRegex = /<Link[\s\S]*?\{\(product\.customizationFields\?\.length\) \? 'Customize & Buy' : 'View Product'\}[\s\S]*?<\/Link>/;
  const newButton = `{cartItem ? (
          <div className="flex items-center justify-between bg-gray-100 rounded-md w-full mt-auto border border-gray-200">
            <button 
              type="button"
              onClick={(e) => { e.preventDefault(); cartItem.quantity === 1 ? removeItem(cartItem.id) : updateQuantity(cartItem.id, cartItem.quantity - 1); }}
              className="p-3 text-secondary hover:bg-gray-200 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="font-bold text-secondary text-sm select-none">{cartItem.quantity}</span>
            <button 
              type="button"
              onClick={(e) => { e.preventDefault(); updateQuantity(cartItem.id, cartItem.quantity + 1); }}
              className="p-3 text-secondary hover:bg-gray-200 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
        ) : requiresCustomization ? (
          <Link 
            href={\`/product/\${product.slug}\`}
            className="w-full text-center py-2.5 bg-secondary text-white font-bold text-sm rounded hover:bg-primary hover:text-secondary transition-colors mt-auto block"
          >
            Customize & Buy
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full text-center py-2.5 bg-secondary text-white font-bold text-sm rounded hover:bg-primary hover:text-secondary transition-colors mt-auto block"
          >
            Add to Cart
          </button>
        )}`;
        
  content = content.replace(oldButtonRegex, newButton);
  fs.writeFileSync(path, content);
}
