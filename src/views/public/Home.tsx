"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ArrowRight, Star, CheckCircle2, ShoppingBag, ImageIcon, MessageSquare, Shirt } from 'lucide-react';
import { services } from '../../services';
import { Category, Product, Promotion, } from '../../domain/models';
import { useSettingsStore } from '../../store/settingsStore';
import { getWhatsAppLink } from '../../utils/whatsapp';
import { ImageFallback } from '../../components/ui/ImageFallback';
import { ProductCard } from '../../components/ui/ProductCard';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Scroll reveal refs for major sections
  const featuredSection = useScrollReveal<HTMLDivElement>();
  const whyChooseSection = useScrollReveal<HTMLDivElement>();
  const customWorkSection = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [cats, prods, promos, items] = await Promise.all([
          services.categories.getCategories(),
          services.products.getFeaturedProducts(),
          services.promotions.getActivePromotions(),
          Promise.resolve([])
        ]);
        setCategories(cats.slice(0, 4));
        setFeaturedProducts(prods.slice(0, 4));
        setPromotions(promos.slice(0, 1));
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
    if (window.location.hash === '#custom-work') {
      setTimeout(() => {
        document.getElementById('custom-work')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  
  const openWhatsApp = (e: React.MouseEvent, text: string) => {
    e.preventDefault();
    const settings = useSettingsStore.getState().settings;
    const phone = settings?.whatsappNumber || '2349061747646';
    const link = getWhatsAppLink(phone, encodeURIComponent(text));
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const openWhatsAppHero = (e: React.MouseEvent) => {
    openWhatsApp(e, "Hello 2Crown Clothing & Printing, I'd like to make an inquiry.");
  };

  const openWhatsAppCustom = (e: React.MouseEvent) => {
    openWhatsApp(e, "Hello 2Crown Clothing & Printing, I'm interested in your custom work. I'd like to discuss what I need. Please let me know what information, pictures, designs, or other materials you need from me.");
  };

  return (
    <div className="w-full">
      {/* 1. Hero Section - Ensures min 100vh when combined with 4rem (64px) Navbar */}
      <section className="relative bg-secondary text-white min-h-[calc(100vh-4rem)] flex flex-col justify-center py-20 overflow-hidden">
        <div className="absolute inset-0 bg-secondary"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-gray-900 to-black"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-hero-enter">
              Custom Apparel, <span className="text-primary">Printing</span> & Branding
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 animate-hero-enter-delayed">
              Quality printing and branding for your business, team, or personal style. Clothing and printing under one roof.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-hero-enter-delayed-2">
              <button onClick={openWhatsAppHero} className="bg-primary hover:bg-primary-dark text-secondary font-bold py-3 px-8 rounded-md flex items-center justify-center shadow-lg btn-premium-gold">
                Chat on WhatsApp
                <ArrowRight className="ml-2" size={20} />
              </button>
              <Link href="/shop" className="bg-white text-secondary font-bold py-3 px-8 rounded-md text-center shadow-lg border border-gray-200 btn-premium-white">
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
            <Link href="/shop" className="mt-4 sm:mt-0 bg-secondary text-primary hover:bg-secondary-light font-bold py-2 px-6 rounded-md transition duration-300">
              Shop Sale
            </Link>
          </div>
        </section>
      )}

      {/* Removed Shop by Category per user request */}

      {/* 4. Featured Products */}
      <section className="py-20 bg-surface border-t border-b border-gray-100">
        <div
          ref={featuredSection.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-fade-up ${featuredSection.isVisible ? 'revealed' : ''}`}
        >
          <div className="flex flex-row justify-between items-center mb-8 gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-3xl font-bold text-secondary mb-2 truncate">Featured Products</h2>
              <div className="h-1 w-16 sm:w-20 bg-primary"></div>
            </div>
            <Link href="/shop" className="text-primary font-semibold hover:text-primary-dark inline-flex items-center transition-colors text-sm sm:text-base shrink-0">
              View All <ArrowRight className="ml-1" size={18} />
            </Link>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 stagger-children`}>
              {featuredProducts.map(product => (
                <div key={product.id} className={`reveal-fade-up ${featuredSection.isVisible ? 'revealed' : ''}`}>
                  <ProductCard product={product} />
                </div>
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
        <div
          ref={whyChooseSection.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-fade-up ${whyChooseSection.isVisible ? 'revealed' : ''}`}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary mb-4">Why Choose 2Crown?</h2>
            <div className="h-1 w-20 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 stagger-children">
            <div className={`flex flex-col items-center text-center p-8 rounded-lg bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 reveal-fade-up ${whyChooseSection.isVisible ? 'revealed' : ''}`}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                <Shirt size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Custom Solutions</h3>
              <p className="text-gray-600">We offer personalized clothing and branding tailored to your exact specifications and brand guidelines.</p>
            </div>
            
            <div className={`flex flex-col items-center text-center p-8 rounded-lg bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 reveal-fade-up ${whyChooseSection.isVisible ? 'revealed' : ''}`}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Attention to Detail</h3>
              <p className="text-gray-600">Every print and stitch is handled carefully to ensure your final product looks sharp and professional.</p>
            </div>
            
            <div className={`flex flex-col items-center text-center p-8 rounded-lg bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 reveal-fade-up ${whyChooseSection.isVisible ? 'revealed' : ''}`}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Flexible Support</h3>
              <p className="text-gray-600">Discuss your orders directly with us on WhatsApp for quick updates, transparent pricing, and direct communication.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Removed Testimonials per user request */}

      {/* 8. WhatsApp CTA Section */}
      <section id="custom-work" className="py-24 bg-secondary relative overflow-hidden scroll-mt-16">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary opacity-5 transform skew-x-12 translate-x-20"></div>
        <div
          ref={customWorkSection.ref}
          className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 reveal-fade-up ${customWorkSection.isVisible ? 'revealed' : ''}`}
        >
          <MessageSquare size={48} className="mx-auto text-primary mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Need Something Custom?</h2>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Tell us what you need and chat with us directly on WhatsApp. You can send your designs, pictures, logos and other reference materials there.
          </p>
          <button 
            onClick={openWhatsAppCustom}
            className="inline-block bg-primary hover:bg-primary-dark text-secondary font-bold text-lg py-4 px-10 rounded-md shadow-lg shadow-primary/20 btn-premium-gold"
          >
            Chat on WhatsApp
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
