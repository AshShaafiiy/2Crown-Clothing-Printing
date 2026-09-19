import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { services } from '../../services';
import { BusinessSettings } from '../../domain/models';

export default function Footer() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    services.settings.getBusinessSettings().then(setSettings).catch(console.error);
  }, []);

  const handleCustomWorkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      document.getElementById('custom-work')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#custom-work');
    }
  };

  return (
    <footer className="bg-secondary text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <Link to="/" className="text-2xl font-bold text-primary mb-4 block">
            2Crown
          </Link>
          <p className="text-sm text-gray-400 mb-6">
            Your premium destination for high-quality clothing, professional printing, and bespoke customized items in Nigeria.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/shop" className="hover:text-primary transition-colors">Shop</Link></li>
            <li><button onClick={handleCustomWorkClick} className="hover:text-primary transition-colors bg-transparent border-none p-0 text-left cursor-pointer">Custom Work</button></li>
            <li><Link to="/track-order" className="hover:text-primary transition-colors">Track Order</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/track-order" className="hover:text-primary transition-colors">Track Your Order</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-primary" />
              <span>{settings?.contactPhone || '09061747646'}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-primary" />
              <span>{settings?.contactEmail || 'info@2crown.com'}</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={18} className="text-primary" />
              <span>{settings?.address || 'Lagos, Nigeria'}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} 2Crown Clothing & Printing. All rights reserved.</p>
      </div>
    </footer>
  );
}
