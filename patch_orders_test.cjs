const fs = require('fs');
let code = fs.readFileSync('src/views/admin/Orders.test.tsx', 'utf8');

const newTest = `
  it('renders order history timeline safely without Invalid Date', async () => {
    // Setup order with different legacy/firestore history entries
    const historyOrder = {
      ...mockOrders[0],
      status: 'Order Confirmed',
      history: [
        {
          status: 'Awaiting Confirmation',
          comment: 'legacy string format',
          timestamp: '2026-10-06T10:00:00.000Z'
        },
        'Admin updated status', // Simulate the backend bug string
        {
          newStatus: 'Order Confirmed',
          note: 'canonical format',
          timestamp: { _seconds: 1791280800, _nanoseconds: 0 }, // Firestore timestamp ~ Oct 6 2026 10:00:00 UTC
          actorName: 'Admin'
        }
      ]
    };
    (services.api.getOrders as any).mockResolvedValue([historyOrder]);

    render(<Orders />);

    // Wait for the modal or the order list to render, let's open the order details
    await waitFor(() => {
      expect(screen.getByText(historyOrder.reference)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('View'));

    // Verify Admin Timeline does not have Invalid Date
    await waitFor(() => {
      expect(screen.queryByText('Invalid Date')).toBeNull();
      // Should show the legacy status mapped correctly
      expect(screen.getByText('Awaiting Confirmation')).toBeInTheDocument();
      // Should show the canonical status mapped correctly
      expect(screen.getAllByText('Order Confirmed').length).toBeGreaterThan(0);
      // Should show the string bug fallback
      expect(screen.getByText('Status Updated')).toBeInTheDocument();
      expect(screen.getByText('Admin updated status')).toBeInTheDocument();
    });
  });
`;

code = code.replace(/describe\('Admin Orders', \(\) => \{/, "describe('Admin Orders', () => {\n" + newTest);
fs.writeFileSync('src/views/admin/Orders.test.tsx', code);
