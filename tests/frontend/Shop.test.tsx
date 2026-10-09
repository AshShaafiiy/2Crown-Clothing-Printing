// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import Shop from '../../src/views/public/Shop';
import { services } from '../../src/services';

vi.mock('../../src/services', () => ({
  services: {
    products: {
      getProducts: vi.fn(),
    },
    categories: {
      getCategories: vi.fn().mockResolvedValue([]),
    },
    ratings: {
      getRatingSummary: vi.fn().mockResolvedValue({ average: 0, count: 0 }),
    },
  },
}));

const mockProducts = [
  { id: '1', name: 'Product A', price: 100, categoryId: 'c1', createdAt: '2026-10-09T10:00:00.000Z', active: true },
  { id: '2', name: 'Product B', price: 200, categoryId: 'c1', createdAt: '2026-10-07T10:00:00.000Z', active: true },
  { id: '3', name: 'Product C', price: 150, categoryId: 'c1', createdAt: '2026-10-08T10:00:00.000Z', active: true },
  { id: '4', name: 'Product D', price: 50, categoryId: 'c1', createdAt: '', active: true }, // missing
  { id: '5', name: 'Product E', price: 300, categoryId: 'c1', createdAt: '2026-10-09T10:00:00.000Z', active: true }, // same date as A
];

describe('Shop Sort', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (services.products.getProducts as any).mockResolvedValue(mockProducts);
  });

  it('sorts Newest Arrivals by createdAt descending and falls back to name', async () => {
    render(<Shop />);
    const sortSelect = await screen.findByLabelText(/Sort by/i);
    fireEvent.change(sortSelect, { target: { value: 'newest' } });
    
    const items = await screen.findAllByRole('heading', { level: 3 });
    const names = items.map(el => el.textContent).filter(n => n?.startsWith('Product'));
    
    expect(names).toEqual(['Product A', 'Product E', 'Product C', 'Product B', 'Product D']);
  });

  it('sorts Price Low to High', async () => {
    render(<Shop />);
    const sortSelect = await screen.findByLabelText(/Sort by/i);
    fireEvent.change(sortSelect, { target: { value: 'price-asc' } });
    
    const items = await screen.findAllByRole('heading', { level: 3 });
    const names = items.map(el => el.textContent).filter(n => n?.startsWith('Product'));
    expect(names).toEqual(['Product D', 'Product A', 'Product C', 'Product B', 'Product E']);
  });

  it('sorts Price High to Low', async () => {
    render(<Shop />);
    const sortSelect = await screen.findByLabelText(/Sort by/i);
    fireEvent.change(sortSelect, { target: { value: 'price-desc' } });
    
    const items = await screen.findAllByRole('heading', { level: 3 });
    const names = items.map(el => el.textContent).filter(n => n?.startsWith('Product'));
    expect(names).toEqual(['Product E', 'Product B', 'Product C', 'Product A', 'Product D']);
  });
});
