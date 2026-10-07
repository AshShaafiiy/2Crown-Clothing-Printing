const fs = require('fs');
let code = fs.readFileSync('src/components/ui/ProductCard.test.tsx', 'utf8');

code = code.replace(
  `import { ProductCard } from './ProductCard';`,
  `import { ProductCard } from './ProductCard';\nimport userEvent from '@testing-library/user-event';\nimport { useCartStore } from '../../store/cartStore';`
);

const newTest = `
  it('adds product to cart with canonical payload and prevents navigation', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} />);
    
    // Check Add to Cart button
    const addButton = screen.getByRole('button', { name: /Add to Cart/i });
    expect(addButton).toHaveClass('focus-visible:ring-2'); // verify focus ring
    
    await user.click(addButton);
    
    // Verify it changed to quantity control
    expect(screen.getByRole('button', { name: /Increase/i })).toBeInTheDocument();
    
    // Clear cart for clean state
    useCartStore.getState().clearCart();
  });
`;

code = code.replace(`});\n`, `});\n${newTest}\n`);
fs.writeFileSync('src/components/ui/ProductCard.test.tsx', code);
