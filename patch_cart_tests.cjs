const fs = require('fs');
let code = fs.readFileSync('src/views/public/Cart.test.tsx', 'utf8');

const newTest = `
  it('displays discounted price correctly for qty 1', () => {
    useCartStore.getState().addItem({
      id: 'cart-2',
      productId: 'prod-2',
      productName: 'Discounted Item',
      price: 3000,
      previousPrice: 5000,
      quantity: 1,
    });
    render(<Cart />);
    // Discount percentage
    expect(screen.getByText('-40%')).toBeInTheDocument();
    // Line total (3000)
    const lineTotals = screen.getAllByText('₦3,000');
    expect(lineTotals.length).toBeGreaterThan(0);
    // Original line total (5000)
    expect(screen.getByText('₦5,000')).toBeInTheDocument();
  });

  it('displays discounted price correctly for qty 3', () => {
    useCartStore.getState().addItem({
      id: 'cart-3',
      productId: 'prod-3',
      productName: 'Bulk Discounted Item',
      price: 3000,
      previousPrice: 5000,
      quantity: 3,
    });
    render(<Cart />);
    expect(screen.getByText('-40%')).toBeInTheDocument();
    expect(screen.getByText('₦9,000')).toBeInTheDocument(); // 3000 * 3
    expect(screen.getByText('₦15,000')).toBeInTheDocument(); // 5000 * 3
  });
`;

code = code.replace(/describe\('Cart Component', \(\) => \{/, "describe('Cart Component', () => {\n" + newTest);
fs.writeFileSync('src/views/public/Cart.test.tsx', code);
