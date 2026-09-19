import { describe, it, expect } from 'vitest';
import { generateWhatsAppOrderMessage, getWhatsAppLink } from './whatsapp';
import { Order } from '../domain/models';

describe('whatsapp utility', () => {
  it('should generate a valid WhatsApp link', () => {
    const link = getWhatsAppLink('09061747646', 'Test Message');
    expect(link).toBe('https://wa.me/2349061747646?text=Test Message');
  });

  it('should clean non-numeric characters from the WhatsApp number', () => {
    const link = getWhatsAppLink('+234 906 174 7646', 'Hello');
    expect(link).toBe('https://wa.me/2349061747646?text=Hello');
  });

  it('should format a normal order message correctly', () => {
    const mockOrder: Order = {
      id: '1',
      reference: '2C-12345',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '08012345678',
      items: [
        {
          id: 'item1',
          productId: 'p1',
          productName: 'Custom Hoodie',
          quantity: 2,
          price: 15000,
          variantName: 'Black - L',
          customization: { Text: 'Team Alpha' }
        }
      ],
      subtotal: 30000,
      discount: 0,
      total: 30000,
      deliveryMethod: 'local',
      deliveryAddress: 'Ikeja, Lagos',
      status: 'WhatsApp Pending',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const encoded = generateWhatsAppOrderMessage(mockOrder);
    const decoded = decodeURIComponent(encoded);

    expect(decoded).toContain('*NEW ORDER: 2C-12345*');
    expect(decoded).toContain('Name: John Doe');
    expect(decoded).toContain('Phone: 08012345678');
    expect(decoded).toContain('Email: john@example.com');
    expect(decoded).toContain('- 2x Custom Hoodie (Black - L) (₦15,000)');
    expect(decoded).toContain('Customization: Text: Team Alpha');
    expect(decoded).toContain('Subtotal: ₦30,000');
    expect(decoded).toContain('Delivery Fee: To be confirmed');
    expect(decoded).toContain('Estimated Total: ₦30,000 + delivery');
    expect(decoded).toContain('Method: Local Delivery');
    expect(decoded).toContain('Address: Ikeja, Lagos');
    expect(decoded).toContain('Please confirm the final price and delivery arrangements.');
  });

  it('should exclude delivery address if method is pickup', () => {
    const mockOrder: Order = {
      id: '2',
      reference: '2C-99999',
      customerName: 'Bob',
      customerPhone: '1234',
      items: [],
      subtotal: 1000,
      discount: 0,
      total: 1000,
      deliveryMethod: 'pickup',
      status: 'WhatsApp Pending',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    const encoded = generateWhatsAppOrderMessage(mockOrder);
    const decoded = decodeURIComponent(encoded);
    
    expect(decoded).toContain('Delivery Fee: ₦0 (Store Pickup)');
    expect(decoded).toContain('Method: Store Pickup');
    expect(decoded).not.toContain('Address:');
  });

});
