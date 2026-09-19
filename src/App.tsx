import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/public/Home';
import Shop from './pages/public/Shop';
import ProductDetails from './pages/public/ProductDetails';
import Cart from './pages/public/Cart';
import Checkout from './pages/public/Checkout';
import OrderConfirmation from './pages/public/OrderConfirmation';
import TrackOrder from './pages/public/TrackOrder';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import Products from './pages/admin/Products';
import Customers from './pages/admin/Customers';
import Categories from './pages/admin/Categories';
import Settings from './pages/admin/Settings';
import Gallery from './pages/admin/Gallery';
import ScrollToTop from './components/layout/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:slug" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation/:reference" element={<OrderConfirmation />} />
          <Route path="track-order" element={<TrackOrder />} />
          {/* Other public routes */}
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="categories" element={<Categories />} />
          <Route path="settings" element={<Settings />} />
          <Route path="gallery" element={<Gallery />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
