"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { items } = useCartStore();
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleCustomWorkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (pathname === '/') {
      document.getElementById('custom-work')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/#custom-work');
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (pathname === path) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-secondary text-primary font-medium w-full z-50 fixed top-0 left-0 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" onClick={(e) => handleNavClick(e, '/')} className="flex items-center hover:opacity-90 transition-opacity duration-200">
              <img src="/2Crown-logo.jpeg" alt="2Crown Clothing & Printing" className="h-12 w-auto rounded-sm object-contain" />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" onClick={(e) => handleNavClick(e, '/')} className="hover:text-primary-light transition-colors duration-200">Home</Link>
              <Link href="/shop" onClick={(e) => handleNavClick(e, '/shop')} className="hover:text-primary-light transition-colors duration-200">Shop</Link>
              <button onClick={handleCustomWorkClick} className="hover:text-primary-light transition-colors duration-200 font-medium bg-transparent">Custom Work</button>
              <Link href="/track-order" onClick={(e) => handleNavClick(e, '/track-order')} className="hover:text-primary-light transition-colors duration-200">Track Order</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" onClick={(e) => handleNavClick(e, '/cart')} className="relative hover:text-primary-light transition duration-300">
              <ShoppingCart size={24} className="hover:scale-110 transition-transform duration-200" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-secondary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
          <div className="-mr-2 flex items-center gap-4 md:hidden">
            <Link href="/cart" onClick={(e) => handleNavClick(e, '/cart')} className="relative hover:text-primary-light transition duration-300">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-secondary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} type="button" className="inline-flex items-center justify-center p-2 rounded-md hover:text-primary-light focus:outline-none transition-colors duration-200">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#0A0A0A] px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-800">
          <Link href="/" onClick={(e) => handleNavClick(e, '/')} className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary-light hover:bg-gray-800 transition-colors duration-200">Home</Link>
          <Link href="/shop" onClick={(e) => handleNavClick(e, '/shop')} className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary-light hover:bg-gray-800 transition-colors duration-200">Shop</Link>
          <button onClick={handleCustomWorkClick} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:text-primary-light hover:bg-gray-800 transition-colors duration-200">Custom Work</button>
          <Link href="/track-order" onClick={(e) => handleNavClick(e, '/track-order')} className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary-light hover:bg-gray-800 transition-colors duration-200">Track Order</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
