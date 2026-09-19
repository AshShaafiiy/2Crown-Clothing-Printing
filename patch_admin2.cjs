const fs = require('fs');

const fixAsync = (path) => {
  let content = fs.readFileSync(path, 'utf-8');
  content = content.replace(
    /const fetchProducts = async \(\) => \{\n\s*setLoading\(true\);\n\s*const data = await services.products.getProducts\(\);\n\s*setProducts\(data\);\n\s*setLoading\(false\);\n\s*\};/,
    `const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await services.products.getProducts();
      setProducts(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };`
  );
  fs.writeFileSync(path, content, 'utf-8');
};

fixAsync('src/pages/admin/Products.tsx');

let catContent = fs.readFileSync('src/pages/admin/Categories.tsx', 'utf-8');
catContent = catContent.replace(
  /const fetchCategories = async \(\) => \{\n\s*setLoading\(true\);\n\s*const data = await services.categories.getCategories\(\);\n\s*setCategories\(data\);\n\s*setLoading\(false\);\n\s*\};/,
  `const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await services.categories.getCategories();
      setCategories(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };`
);
fs.writeFileSync('src/pages/admin/Categories.tsx', catContent, 'utf-8');

let dashContent = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf-8');
dashContent = dashContent.replace(
  /const fetchData = async \(\) => \{([\s\S]*?)\};\n\s*fetchData\(\);/,
  `const fetchData = async () => {
      try {
        const orders = await services.orders.getOrders();
        const products = await services.products.getProducts();
        
        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === 'WhatsApp Pending' || o.status === 'Awaiting Confirmation').length,
          totalProducts: products.length,
          estimatedSales: orders.reduce((sum, order) => sum + order.total, 0)
        });
        
        // Get 5 most recent
        setRecentOrders(orders.slice(-5).reverse());
      } catch (err: any) {
        console.error('Dashboard fetch error:', err);
      }
    };
    fetchData();`
);
fs.writeFileSync('src/pages/admin/Dashboard.tsx', dashContent, 'utf-8');

let galContent = fs.readFileSync('src/pages/admin/Gallery.tsx', 'utf-8');
galContent = galContent.replace(
  /const fetchItems = async \(\) => \{\n\s*setLoading\(true\);\n\s*const data = await services.gallery.getGalleryItems\(\);\n\s*setItems\(data\);\n\s*setLoading\(false\);\n\s*\};/,
  `const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await services.gallery.getGalleryItems();
      setItems(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };`
);
fs.writeFileSync('src/pages/admin/Gallery.tsx', galContent, 'utf-8');

