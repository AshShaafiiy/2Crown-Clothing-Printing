import { useState, useEffect } from 'react';

import { useParams, Link } from 'react-router-dom';
import { CheckCircle, MessageCircle, Copy } from 'lucide-react';
import { services } from '../../services';
import { Order } from '../../domain/models';
import { generateWhatsAppOrderMessage, getWhatsAppLink } from '../../utils/whatsapp';

export default function OrderConfirmation() {
  const { reference } = useParams<{ reference: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const [waLink, setWaLink] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (reference) {
        const data = await services.orders.getOrderByReference(reference);
        setOrder(data);
        if (data) {
          const settings = await services.settings.getBusinessSettings();
          const msg = generateWhatsAppOrderMessage(data);
          setWaLink(getWhatsAppLink(settings.whatsappNumber, msg));
        }
      }
      setLoading(false);
    };
    fetchOrder();
  }, [reference]);

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
        <p className="mb-8">We couldn't find an order with that reference.</p>
        <Link to="/" className="text-primary hover:underline">Return to Home</Link>
      </div>
    );
  }

  const message = generateWhatsAppOrderMessage(order);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(decodeURIComponent(message));
    alert('Message copied to clipboard!');
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="bg-surface rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-500 rounded-full mb-6">
          <CheckCircle size={32} />
        </div>
        
        <h1 className="text-3xl font-bold mb-2 text-secondary">Order Received!</h1>
        <p className="text-gray-600 mb-6">Your order reference is <span className="font-bold text-black">{order.reference}</span></p>
        
        <div className="bg-gray-50 p-6 rounded-md mb-8 text-left">
          <h2 className="font-bold mb-2">Next Steps:</h2>
          <p className="text-sm text-gray-700 mb-4">
            Step 2: Send your order details to our WhatsApp to confirm final pricing (including delivery) and complete your order.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-md font-bold hover:bg-[#128C7E] transition-colors"
            >
              <MessageCircle size={20} />
              Complete Order on WhatsApp
            </a>
            
            <button 
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-bold hover:bg-gray-300 transition-colors"
            >
              <Copy size={20} />
              Copy Message
            </button>
          </div>
        </div>
        
        <Link to="/track-order" className="text-primary font-medium hover:underline">
          Track this order
        </Link>
      </div>
    </div>
  );
}
