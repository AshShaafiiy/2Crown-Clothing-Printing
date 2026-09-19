import { Order } from '../domain/models';

export function generateWhatsAppOrderMessage(order: Order): string {
  let message = `*NEW ORDER: ${order.reference}*\n\n`;
  message += `*Customer Details:*\n`;
  message += `Name: ${order.customerName}\n`;
  message += `Phone: ${order.customerPhone}\n`;
  if (order.customerEmail) message += `Email: ${order.customerEmail}\n`;
  
  message += `\n*Order Items:*\n`;
  order.items.forEach(item => {
    message += `- ${item.quantity}x ${item.productName}`;
    if (item.variantName) message += ` (${item.variantName})`;
    message += ` (₦${item.price.toLocaleString()})\n`;
    if (item.customization && Object.keys(item.customization).length > 0) {
      const custText = Object.entries(item.customization).map(([k, v]) => `${k}: ${v}`).join(', ');
      message += `  Customization: ${custText}\n`;
    }
  });

  message += `\n*Order Summary:*\n`;
  message += `Subtotal: ₦${order.subtotal.toLocaleString()}\n`;
  if (order.discount > 0) message += `Discount: ₦${order.discount.toLocaleString()}\n`;

  if (order.deliveryMethod === 'pickup') {
    message += `Delivery Fee: ₦0 (Store Pickup)\n`;
    message += `Estimated Total: ₦${(order.subtotal - order.discount).toLocaleString()}\n`;
  } else {
    message += `Delivery Fee: To be confirmed\n`;
    message += `Estimated Total: ₦${(order.subtotal - order.discount).toLocaleString()} + delivery\n`;
  }
  
  message += `\n*Delivery Details:*\n`;
  message += `Method: ${order.deliveryMethod === 'pickup' ? 'Store Pickup' : 'Local Delivery'}\n`;
  if (order.deliveryAddress) message += `Address: ${order.deliveryAddress}\n`;
  
  message += `\n_Please confirm the final price and delivery arrangements._`;
  
  return encodeURIComponent(message);
}

export function getWhatsAppLink(whatsappNumber: string, encodedMessage: string): string {
  // Ensure the number is just digits (international format without + or spaces)
  let cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  
  // If it starts with 0 (e.g. 09061747646), convert to 234
  if (cleanNumber.startsWith('0') && cleanNumber.length === 11) {
    cleanNumber = '234' + cleanNumber.substring(1);
  }
  
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}
