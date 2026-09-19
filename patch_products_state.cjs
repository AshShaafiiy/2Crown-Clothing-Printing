const fs = require('fs');
const file = 'src/pages/admin/Products.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/const \[products, setProducts\] = useState<Product\[\]>\(\[\]\);\s*const \[loading, setLoading\] = useState\(true\);\s*const \[error, setError\] = useState<string \| null>\(null\);\s*const \[isModalOpen, setIsModalOpen\] = useState\(false\);/, 
  `const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', categoryId: '', type: 'standard' as any, 
    price: 0, images: '', stock: 0, featured: false, active: true
  });
  const [formError, setFormError] = useState<string | null>(null);`
);

fs.writeFileSync(file, content);
