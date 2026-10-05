// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Home } from './Home';

// Mock the dependencies
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
    }
  }
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/'
}));

describe('Home Component', () => {
  it('renders successfully with valid catalogue data without crashing', async () => {
    render(<Home />);
    
    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText('Featured Product')).toBeInTheDocument();
    });
    
    // Ensure badges like 33% OFF are calculated properly
    expect(screen.getByText('33% OFF')).toBeInTheDocument();
  });
});
