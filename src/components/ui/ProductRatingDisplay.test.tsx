// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import "@testing-library/jest-dom";
import { render, screen, waitFor } from '@testing-library/react';
import { ProductRatingDisplay } from './ProductRatingDisplay';
import { services } from '../../services';

vi.mock('../../services', () => ({
  services: {
    reviews: {
      getRatingSummary: vi.fn()
    }
  }
}));

describe('ProductRatingDisplay Fractional Stars', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRating = async (average: number, count: number) => {
    (services.reviews.getRatingSummary as any).mockResolvedValue({ average, count });
    render(<ProductRatingDisplay productId="test-prod" />);
    if (count > 0) {
      await waitFor(() => {
        expect(screen.getByText(average.toFixed(1))).toBeInTheDocument();
      });
    } else {
      await waitFor(() => {
        expect(screen.getByText('No verified ratings yet')).toBeInTheDocument();
      });
    }
  };

  it('renders 0.0 correctly with no verified ratings message if count is 0', async () => {
    await renderWithRating(0.0, 0);
    expect(screen.queryByRole('img')).toBeNull(); // because count is 0
  });

  it('renders 1.0 -> first star 100%', async () => {
    await renderWithRating(1.0, 1);
    // Find the overlays. The component renders 5 base stars and some number of overlay divs.
    // The overlay divs have style width matching the percentage.
    // Wait, testing DOM style inline width directly is a bit fragile with React Testing Library,
    // but we can check the DOM elements directly using container.
    // Let's use getByLabelText to find the wrapper.
    const wrapper = screen.getByLabelText('Rated 1.0 out of 5');
    expect(wrapper).toBeInTheDocument();
    
    // We expect exactly 1 overlay div with width > 0. (Actually our code only renders the overlay if > 0)
    // The overlays have className "absolute top-0 left-0 overflow-hidden h-full".
    const overlays = wrapper.querySelectorAll('.overflow-hidden');
    expect(overlays.length).toBe(1);
    expect(overlays[0]).toHaveStyle('width: 100%');
  });

  it('renders 1.2 -> first 100%, second 20%', async () => {
    await renderWithRating(1.2, 2);
    const wrapper = screen.getByLabelText('Rated 1.2 out of 5');
    const overlays = wrapper.querySelectorAll('.overflow-hidden');
    expect(overlays.length).toBe(2);
    expect(overlays[0]).toHaveStyle('width: 100%');
    // Math could yield 19.999999999999996% due to floating point. Let's round or just check if it contains 20%.
    // Our formula: (1.2 - 1) * 100 = 19.999999999999996
    const width2 = (overlays[1] as HTMLElement).style.width;
    expect(parseFloat(width2)).toBeCloseTo(20, 1);
  });

  it('renders 2.75 -> 2 full, third 75%', async () => {
    await renderWithRating(2.75, 3);
    const wrapper = screen.getByLabelText('Rated 2.8 out of 5'); // .toFixed(1) rounds 2.75 to 2.8 for the aria label and display text
    const overlays = wrapper.querySelectorAll('.overflow-hidden');
    expect(overlays.length).toBe(3);
    expect(overlays[0]).toHaveStyle('width: 100%');
    expect(overlays[1]).toHaveStyle('width: 100%');
    const width3 = (overlays[2] as HTMLElement).style.width;
    expect(parseFloat(width3)).toBeCloseTo(75, 1);
  });

  it('renders 4.1 -> fifth star 10%', async () => {
    await renderWithRating(4.1, 4);
    const wrapper = screen.getByLabelText('Rated 4.1 out of 5');
    const overlays = wrapper.querySelectorAll('.overflow-hidden');
    expect(overlays.length).toBe(5);
    expect(overlays[0]).toHaveStyle('width: 100%');
    expect(overlays[1]).toHaveStyle('width: 100%');
    expect(overlays[2]).toHaveStyle('width: 100%');
    expect(overlays[3]).toHaveStyle('width: 100%');
    const width5 = (overlays[4] as HTMLElement).style.width;
    expect(parseFloat(width5)).toBeCloseTo(10, 1);
  });

  it('renders 4.5 -> fifth star 50%', async () => {
    await renderWithRating(4.5, 5);
    const wrapper = screen.getByLabelText('Rated 4.5 out of 5');
    const overlays = wrapper.querySelectorAll('.overflow-hidden');
    expect(overlays.length).toBe(5);
    expect(overlays[4]).toHaveStyle('width: 50%');
  });

  it('renders 4.9 -> fifth star 90%', async () => {
    await renderWithRating(4.9, 6);
    const wrapper = screen.getByLabelText('Rated 4.9 out of 5');
    const overlays = wrapper.querySelectorAll('.overflow-hidden');
    expect(overlays.length).toBe(5);
    const width5 = (overlays[4] as HTMLElement).style.width;
    expect(parseFloat(width5)).toBeCloseTo(90, 1);
  });

  it('renders 5.0 -> all five 100%', async () => {
    await renderWithRating(5.0, 7);
    const wrapper = screen.getByLabelText('Rated 5.0 out of 5');
    const overlays = wrapper.querySelectorAll('.overflow-hidden');
    expect(overlays.length).toBe(5);
    for (let i = 0; i < 5; i++) {
      expect(overlays[i]).toHaveStyle('width: 100%');
    }
  });

  it('no value exceeds 100%', async () => {
    // Math might be weird or an average of 5.5 somehow passed
    await renderWithRating(5.5, 1);
    const wrapper = screen.getByLabelText('Rated 5.5 out of 5');
    const overlays = wrapper.querySelectorAll('.overflow-hidden');
    for (let i = 0; i < 5; i++) {
      expect(overlays[i]).toHaveStyle('width: 100%'); // because of clamp
    }
  });
});
