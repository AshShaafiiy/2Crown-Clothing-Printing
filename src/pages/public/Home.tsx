import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle2, ShoppingBag, ImageIcon, MessageSquare, Shirt } from 'lucide-react';
import { services } from '../../services';
import { Category, Product, Promotion, GalleryItem } from '../../domain/models';
import { ImageFallback } from '../../components/ui/ImageFallback';
import { ProductCard } from '../../components/ui/ProductCard';

export const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [cats, prods, promos, items] = await Promise.all([
          services.categories.getCategories(),
          services.products.getFeaturedProducts(),
          services.promotions.getActivePromotions(),
          services.gallery.getGalleryItems()
        ]);
        setCategories(cats.slice(0, 4));
        setFeaturedProducts(prods.slice(0, 4));
        setPromotions(promos.slice(0, 1));
        setGallery(items.slice(0, 6));
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // Handle smooth scrolling for "Custom Work" anchor navigation from other pages
  useEffect(() => {
    if (location.hash === '#custom-work') {
      setTimeout(() => {
        document.getElementById('custom-work')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  const openWhatsAppCustom = async (e: React.MouseEvent) => {
    e.preventDefault();
    const waWindow = window.open('about:blank', '_blank');
    try {
      const settings = await services.settings.getBusinessSettings();
      const { getWhatsAppLink } = await import('../../utils/whatsapp');
      const msg = "Hello 2Crown Clothing & Printing, I’m interested in your custom work. I’d like to discuss what I need. Please let me know what information, pictures, designs, or other materials you need from me.";
      if (waWindow) waWindow.location.href = getWhatsAppLink(settings.whatsappNumber, msg);
    } catch (err) {
      if (waWindow) waWindow.close();
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      {/* 1. Hero Section - Ensures min 100vh when combined with 4rem (64px) Navbar */}
      <section className="relative bg-secondary text-white min-h-[calc(100vh-4rem)] flex flex-col justify-center py-20 overflow-hidden">
        <div className="absolute inset-0 bg-secondary"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-gray-900 to-black"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Custom Apparel, <span className="text-primary">Printing</span> & Branding
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Quality printing and branding for your business, team, or personal style. Clothing and printing under one roof.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={openWhatsAppCustom}
                className="bg-primary hover:bg-primary-dark text-secondary font-bold py-3 px-8 rounded-md transition duration-300 flex items-center justify-center shadow-lg"
              >
                Chat on WhatsApp
                <ArrowRight className="ml-2" size={20} />
              </button>
              <Link to="/shop" className="bg-white text-secondary hover:bg-gray-100 font-bold py-3 px-8 rounded-md transition duration-300 text-center shadow-lg border border-gray-200">
                Browse Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Promotions / Flash Sale */}
      {promotions.length > 0 && (
        <section className="bg-primary text-secondary py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">{promotions[0].title}</h2>
              {promotions[0].description && <p className="text-sm font-medium opacity-80">{promotions[0].description}</p>}
            </div>
            <Link to="/shop" className="mt-4 sm:mt-0 bg-secondary text-primary hover:bg-secondary-light font-bold py-2 px-6 rounded-md transition duration-300">
              Shop Sale
            </Link>
          </div>
        </section>
      )}

      {/* Removed Shop by Category per user request */}

      {/* 4. Featured Products */}
      <section className="py-20 bg-surface border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-12 text-center sm:text-left gap-4">
            <div>
              <h2 className="text-3xl font-bold text-secondary mb-2">Featured Products</h2>
              <div className="h-1 w-20 bg-primary mx-auto sm:mx-0"></div>
            </div>
            <Link to="/shop" className="text-primary font-semibold hover:text-primary-dark inline-flex items-center">
              View All <ArrowRight className="ml-1" size={18} />
            </Link>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`}>
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
             <div className="text-center py-12 bg-white rounded-lg border border-gray-100 max-w-2xl mx-auto">
              <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">Our featured products will appear here soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. Why Choose 2Crown */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary mb-4">Why Choose 2Crown?</h2>
            <div className="h-1 w-20 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center p-8 rounded-lg bg-white border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                <Shirt size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Custom Solutions</h3>
              <p className="text-gray-600">We offer personalized clothing and branding tailored to your exact specifications and brand guidelines.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 rounded-lg bg-white border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Attention to Detail</h3>
              <p className="text-gray-600">Every print and stitch is handled carefully to ensure your final product looks sharp and professional.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 rounded-lg bg-white border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Flexible Support</h3>
              <p className="text-gray-600">Discuss your orders directly with us on WhatsApp for quick updates, transparent pricing, and direct communication.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Our Work / Gallery */}
      <section className="py-20 bg-background border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-2">Our Work</h2>
            <div className="h-1 w-20 bg-primary mx-auto"></div>
          </div>
          
          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map(item => (
                <div key={item.id} className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer bg-gray-100 border border-gray-200">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                    <div>
                      <h4 className="text-white font-bold text-lg">{item.title}</h4>
                      {item.description && <p className="text-gray-300 text-sm mt-2">{item.description}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface rounded-lg border border-gray-100 max-w-2xl mx-auto">
              <ImageIcon className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-lg font-bold text-gray-700 mb-2">Gallery Coming Soon</h3>
              <p className="text-gray-500">We are currently updating our portfolio with recent projects.</p>
            </div>
          )}
        </div>
      </section>

      {/* Removed Testimonials per user request */}

      {/* 8. WhatsApp CTA Section */}
      <section id="custom-work" className="py-24 bg-secondary relative overflow-hidden scroll-mt-16">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary opacity-5 transform skew-x-12 translate-x-20"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <MessageSquare size={48} className="mx-auto text-primary mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Need Something Custom?</h2>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Tell us what you need and chat with us directly on WhatsApp. You can send your designs, pictures, logos and other reference materials there.
          </p>
          <button 
            onClick={openWhatsAppCustom}
            className="inline-block bg-primary hover:bg-primary-dark text-secondary font-bold text-lg py-4 px-10 rounded-md transition duration-300 shadow-lg shadow-primary/20"
          >
            Chat on WhatsApp
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
