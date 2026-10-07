const fs = require('fs');
let code = fs.readFileSync('src/views/public/Home.test.tsx', 'utf8');

const newTests = `
  it('renders loading state when initialData is not provided', () => {
    const { container } = render(<Home />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders zero-product empty state only when products are loaded and empty', () => {
    render(<Home initialData={{ categories: [], products: [], promotions: [] }} />);
    expect(screen.getByText('Our featured products will appear here soon.')).toBeInTheDocument();
    expect(screen.queryByText('Featured Product')).not.toBeInTheDocument();
  });
`;

code = code.replace(`});\n`, `});\n${newTests}\n`);
fs.writeFileSync('src/views/public/Home.test.tsx', code);
