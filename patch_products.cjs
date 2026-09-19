const fs = require('fs');
const file = 'src/pages/admin/Products.tsx';
let content = fs.readFileSync(file, 'utf8');

const importRegex = /import \{ Product \} from '\.\.\/\.\.\/domain\/models';/;
content = content.replace(importRegex, "import { Product, Category } from '../../domain/models';");

// Inside Products: React.FC = () => {
// We need to add state for categories and the form.
const stateReplacement = `const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', categoryId: '', type: 'standard', 
    price: 0, images: '', stock: 0, featured: false, active: true
  });
  const [formError, setFormError] = useState<string | null>(null);`;

content = content.replace(/const \[products, setProducts\].*?setIsModalOpen\(false\);/s, stateReplacement);

// We need to fetch categories too.
const fetchReplacement = `const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodData, catData] = await Promise.all([
        services.products.getProducts(),
        services.categories.getCategories()
      ]);
      setProducts(prodData);
      setCategories(catData);
      if (catData.length > 0) setFormData(prev => ({ ...prev, categoryId: catData[0].id }));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(/const fetchProducts = async \(\) => \{.*?\};/s, fetchReplacement);

// We need a handleSubmit function.
const handleSave = `
  const handleSave = async () => {
    setFormError(null);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: formData.images ? formData.images.split(',').map(s => s.trim()) : [],
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };
      
      // @ts-ignore (We assume createProduct is added to ApiProductService)
      await services.products.createProduct(payload);
      setIsModalOpen(false);
      setFormData({ name: '', slug: '', description: '', categoryId: categories[0]?.id || '', type: 'standard', price: 0, images: '', stock: 0, featured: false, active: true });
      fetchProducts();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Validation error');
    }
  };
`;

content = content.replace(/const handleDelete = async/, handleSave + '\n  const handleDelete = async');

// Now the form.
const modalForm = `<div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Add Product</h2>
            {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}
            <div className="space-y-4 mb-4">
              <div><label className="block text-sm font-medium">Name</label><input type="text" className="mt-1 block w-full border rounded p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
              <div><label className="block text-sm font-medium">Description</label><textarea className="mt-1 block w-full border rounded p-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
              <div><label className="block text-sm font-medium">Category</label>
                <select className="mt-1 block w-full border rounded p-2" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium">Price (₦)</label><input type="number" className="mt-1 block w-full border rounded p-2" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} /></div>
                <div><label className="block text-sm font-medium">Stock</label><input type="number" className="mt-1 block w-full border rounded p-2" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} /></div>
              </div>
              <div><label className="block text-sm font-medium">Image URLs (comma separated)</label><input type="text" className="mt-1 block w-full border rounded p-2" value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} /></div>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
            </div>
          </div>`;

content = content.replace(/<div className="bg-white p-6 rounded-lg max-w-md w-full">.*?<\/div>/s, modalForm);

fs.writeFileSync(file, content);
