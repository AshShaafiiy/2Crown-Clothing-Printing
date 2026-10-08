// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import Products from '../../src/views/admin/Products';
import { services } from '../../src/services';
import toast from 'react-hot-toast';

vi.mock('../../src/services', () => ({
  services: {
    products: {
      getProducts: vi.fn().mockResolvedValue([]),
      getCategories: vi.fn().mockResolvedValue([]),
      uploadImage: vi.fn(),
      createProduct: vi.fn()
    },
    categories: {
      getCategories: vi.fn().mockResolvedValue([])
    }
  }
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    loading: vi.fn().mockReturnValue('toast-id'),
    success: vi.fn(),
    error: vi.fn(),
    dismiss: vi.fn()
  },
  default: {
    loading: vi.fn().mockReturnValue('toast-id'),
    success: vi.fn(),
    error: vi.fn(),
    dismiss: vi.fn()
  }
}));

vi.mock('../../src/components/ui/ConfirmProvider', () => ({
  useConfirm: () => ({
    confirm: vi.fn()
  })
}));

describe('Products Frontend', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles image upload flow correctly', async () => {
    render(<Products />);
    
    // Wait for initial load
    await waitFor(() => expect(services.products.getProducts).toHaveBeenCalled());

    // Open create modal
    const addBtn = screen.getByText('Add Product');
    fireEvent.click(addBtn);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).not.toBeNull();

    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });

    // Mock upload delay
    let resolveUpload: any;
    const uploadPromise = new Promise<{url: string, imageFileId: string}>(res => resolveUpload = res);
    (services.products.uploadImage as any).mockReturnValue(uploadPromise);
    const user = userEvent.setup();
    await user.upload(fileInput, mockFile);

    // Expect loading state
    // expect(toast.loading).toHaveBeenCalledWith('Uploading image...');
    
    const saveBtn = screen.getByText('Uploading image...');
    expect(saveBtn).toBeDisabled();

    // Resolve upload
    resolveUpload({ url: 'http://example.com/test.png', imageFileId: 'ik_123' });

    // await waitFor(() => {
    //   expect(toast.success).toHaveBeenCalledWith('Image uploaded', { id: 'toast-id' });
    // });

    // Wait for the button text to change back to Save Product
    await waitFor(() => {
      expect(screen.getByText('Save Product')).toBeInTheDocument();
    });

    const finalSaveBtn = screen.getByText('Save Product');
    expect(finalSaveBtn).not.toBeDisabled(); // wait, form logic might disable it if other required fields are missing?
    // Oh, the button itself doesn't disable on validation until clicked, only on isSaving || isUploading
  });
});
