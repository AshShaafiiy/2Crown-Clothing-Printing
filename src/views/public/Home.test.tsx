// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll } from 'vitest';
import "@testing-library/jest-dom";
import { render, screen, waitFor } from '@testing-library/react';
import { Home } from './Home';
import { Product } from '../../domain/models';

beforeAll(() => {
  Object.defineProperty(global, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  class MockIntersectionObserver {
    observe = () => null;
    unobserve = () => null;
    disconnect = () => null;
  }
  global.IntersectionObserver = MockIntersectionObserver as any;
});

vi.mock('../../services', () => ({
  services: {
    categories: {
      getCategories: vi.fn().mockResolvedValue([{ id: 'cat-1', name: 'Cat 1' }])
    },
    products: {
      getFeaturedProducts: vi.fn().mockResolvedValue([
        {
          id: 'test-product',
          name: 'Featured Product',
          slug: 'featured-product',
          description: '',
          categoryId: 'cat-1',
          price: 1000,
          previousPrice: 1500,
          imageUrl: 'data:image/png;base64,xxx',
          featured: true,
          active: true,
        }
      ])
    },
    promotions: {
      getActivePromotions: vi.fn().mockResolvedValue([])
    },
    reviews: {
      getRatingSummary: vi.fn().mockResolvedValue({ average: 4.5, count: 10 })
    }
  }
}));

vi.mock('../../components/ui/ProductRatingDisplay', () => ({
  ProductRatingDisplay: () => <div data-testid="rating-display" />
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/'
}));

const createMockProduct = (id: string, name: string): Product => ({
  id,
  name,
  slug: `slug-${id}`,
  description: `Description for ${name}`,
  categoryId: 'cat-1',
  price: 1000,
  previousPrice: 1500,
  imageUrl: 'https://example.com/image.jpg',
  featured: true,
  active: true,
});

describe('Home Component', () => {
  it('renders loading state when initialData is not provided', async () => {
    const { container } = render(<Home />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Featured Product')).toBeInTheDocument();
    });
  });

  it('renders zero-product empty state only when products are loaded and empty', () => {
    render(<Home initialData={{ categories: [], products: [], promotions: [] }} />);
    expect(screen.getByText('Our featured products will appear here soon.')).toBeInTheDocument();
    expect(screen.queryByText('Featured Product')).not.toBeInTheDocument();
  });

  it('renders successfully with valid catalogue data without crashing', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Featured Product')).toBeInTheDocument();
    });

    expect(screen.getByText('33% OFF')).toBeInTheDocument();
  });

  describe('Featured Products Responsive Count', () => {
    it('shows all 4 on mobile and desktop when exactly 4 Featured Products exist', () => {
      const products = [
        createMockProduct('1', 'Product 1'),
        createMockProduct('2', 'Product 2'),
        createMockProduct('3', 'Product 3'),
        createMockProduct('4', 'Product 4'),
      ];

      const { container } = render(<Home initialData={{ categories: [], products, promotions: [] }} />);

      const grid = container.querySelector('.stagger-children');
      expect(grid).toBeInTheDocument();

      const itemWrappers = Array.from(grid!.children);
      expect(itemWrappers).toHaveLength(4);

      // In a 4-product scenario, none should be hidden on mobile
      itemWrappers.forEach((wrapper) => {
        expect(wrapper.className).not.toContain('hidden');
      });

      // All 4 are visible on both mobile and desktop
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Product 3')).toBeInTheDocument();
      expect(screen.getByText('Product 4')).toBeInTheDocument();
    });

    it('shows 4 on mobile and 5 on desktop when 5 Featured Products exist', () => {
      const products = [
        createMockProduct('1', 'Product 1'),
        createMockProduct('2', 'Product 2'),
        createMockProduct('3', 'Product 3'),
        createMockProduct('4', 'Product 4'),
        createMockProduct('5', 'Product 5'),
      ];

      const { container } = render(<Home initialData={{ categories: [], products, promotions: [] }} />);

      const grid = container.querySelector('.stagger-children');
      expect(grid).toBeInTheDocument();

      const itemWrappers = Array.from(grid!.children);
      expect(itemWrappers).toHaveLength(5);

      // The first 4 must NOT have 'hidden' (visible on mobile and desktop)
      for (let i = 0; i < 4; i++) {
        expect(itemWrappers[i].className).not.toContain('hidden');
      }

      // The 5th item (index 4) must have 'hidden xl:block' (hidden on mobile, visible on desktop)
      expect(itemWrappers[4].className).toContain('hidden');
      expect(itemWrappers[4].className).toContain('xl:block');

      // Ordering is preserved
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Product 3')).toBeInTheDocument();
      expect(screen.getByText('Product 4')).toBeInTheDocument();
      expect(screen.getByText('Product 5')).toBeInTheDocument();
    });

    it('caps at 5 items (4 on mobile, 5 on desktop) when 6+ Featured Products exist', () => {
      const products = [
        createMockProduct('1', 'Product 1'),
        createMockProduct('2', 'Product 2'),
        createMockProduct('3', 'Product 3'),
        createMockProduct('4', 'Product 4'),
        createMockProduct('5', 'Product 5'),
        createMockProduct('6', 'Product 6'),
        createMockProduct('7', 'Product 7'),
      ];

      const { container } = render(<Home initialData={{ categories: [], products, promotions: [] }} />);

      const grid = container.querySelector('.stagger-children');
      expect(grid).toBeInTheDocument();

      const itemWrappers = Array.from(grid!.children);
      // Sliced to max 5 items
      expect(itemWrappers).toHaveLength(5);

      // First 4 visible on mobile
      for (let i = 0; i < 4; i++) {
        expect(itemWrappers[i].className).not.toContain('hidden');
      }

      // 5th item hidden on mobile, visible on desktop
      expect(itemWrappers[4].className).toContain('hidden');
      expect(itemWrappers[4].className).toContain('xl:block');

      // Products 6 and 7 are not rendered in featured section
      expect(screen.queryByText('Product 6')).not.toBeInTheDocument();
      expect(screen.queryByText('Product 7')).not.toBeInTheDocument();
    });

    it('preserves product ordering exactly', () => {
      const products = [
        createMockProduct('a', 'Alpha Shirt'),
        createMockProduct('b', 'Beta Hoodie'),
        createMockProduct('c', 'Gamma Cap'),
        createMockProduct('d', 'Delta Polo'),
        createMockProduct('e', 'Epsilon Jacket'),
      ];

      const { container } = render(<Home initialData={{ categories: [], products, promotions: [] }} />);

      const headings = screen.getAllByRole('heading', { level: 3 });
      // Headings inside the featured grid match the order
      const productTitles = headings
        .map(h => h.textContent)
        .filter(text => products.some(p => p.name === text));

      expect(productTitles).toEqual([
        'Alpha Shirt',
        'Beta Hoodie',
        'Gamma Cap',
        'Delta Polo',
        'Epsilon Jacket',
      ]);
    });

    it('preserves View All link pointing to /shop', () => {
      const products = [
        createMockProduct('1', 'Product 1'),
      ];

      render(<Home initialData={{ categories: [], products, promotions: [] }} />);

      const viewAllLink = screen.getByRole('link', { name: /View All/i });
      expect(viewAllLink).toBeInTheDocument();
      expect(viewAllLink).toHaveAttribute('href', '/shop');
    });
  });
});
