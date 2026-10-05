// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll } from 'vitest';
import "@testing-library/jest-dom";
import { render, screen, waitFor } from '@testing-library/react';
import { Home } from './Home';

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

vi.mock('next/navigation', () => ({
  usePathname: () => '/'
}));

describe('Home Component', () => {
  it('renders successfully with valid catalogue data without crashing', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Featured Product')).toBeInTheDocument();
    });
    
    expect(screen.getByText('33% OFF')).toBeInTheDocument();
  });
});
