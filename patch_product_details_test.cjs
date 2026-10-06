const fs = require('fs');
const path = 'src/views/public/ProductDetails.test.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('1 item added')) {
  // We need to inject these assertions
  const addBlock = `
    // Check initial Add to Cart icon
    expect(screen.getByText('Add to Cart').closest('button')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Add to Cart'));
    
    // Check singular text
    expect(screen.getByText('(1 item added)')).toBeInTheDocument();
    
    // Increase quantity
    const plusBtn = screen.getByLabelText(/Increase quantity/i);
    fireEvent.click(plusBtn);
    
    // Check plural text
    expect(screen.getByText('(2 items added)')).toBeInTheDocument();
`;
  content = content.replace("fireEvent.click(screen.getByText('Add to Cart'));", addBlock);
  fs.writeFileSync(path, content);
  console.log("Patched ProductDetails.test.tsx");
}
