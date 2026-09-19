import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCartStore();
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleCustomWorkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (location.pathname === '/') {
      document.getElementById('custom-work')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#custom-work');
    }
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-secondary text-primary font-medium w-full z-50 fixed top-0 left-0 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" onClick={closeMenu} className="text-2xl font-bold tracking-wider">2CROWN</Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="hover:text-primary-light transition duration-300">Home</Link>
              <Link to="/shop" className="hover:text-primary-light transition duration-300">Shop</Link>
              <button onClick={handleCustomWorkClick} className="hover:text-primary-light transition duration-300 font-medium bg-transparent">Custom Work</button>
              <Link to="/track-order" className="hover:text-primary-light transition duration-300">Track Order</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative hover:text-primary-light transition duration-300">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-secondary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
          <div className="-mr-2 flex items-center gap-4 md:hidden">
            <Link to="/cart" className="relative hover:text-primary-light transition duration-300">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-secondary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} type="button" className="inline-flex items-center justify-center p-2 rounded-md hover:text-primary-light focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#0A0A0A] px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-800">
          <Link to="/" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary-light hover:bg-gray-800">Home</Link>
          <Link to="/shop" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary-light hover:bg-gray-800">Shop</Link>
          <button onClick={handleCustomWorkClick} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:text-primary-light hover:bg-gray-800">Custom Work</button>
          <Link to="/track-order" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary-light hover:bg-gray-800">Track Order</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
