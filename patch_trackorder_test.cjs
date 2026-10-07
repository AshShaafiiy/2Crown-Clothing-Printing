const fs = require('fs');
let code = fs.readFileSync('src/views/public/TrackOrder.test.tsx', 'utf8');

const newTest = `
  it('displays accurate historical timestamps and no future timestamps', async () => {
    const historicalOrder = {
      ...mockOrder,
      status: 'Processing',
      history: [
        { newStatus: 'Awaiting Confirmation', timestamp: '2026-10-06T10:00:00.000Z', actorName: 'System' },
        { newStatus: 'Confirmed', timestamp: '2026-10-06T11:00:00.000Z', actorName: 'Admin' },
        { newStatus: 'Processing', timestamp: '2026-10-06T12:00:00.000Z', actorName: 'Admin' }
      ]
    };
    (services.api.trackOrder as any).mockResolvedValue(historicalOrder);

    render(<TrackOrder />);
    const submit = () => fireEvent.submit(screen.getByRole('button', { name: /Track/i }));
    submit();
    
    await screen.findByText('Order Details');
    
    // Check that historical timestamps are rendered
    expect(screen.getByText(new Date('2026-10-06T10:00:00.000Z').toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(new Date('2026-10-06T11:00:00.000Z').toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(new Date('2026-10-06T12:00:00.000Z').toLocaleString())).toBeInTheDocument();
  });
`;

code = code.replace(/describe\('public order tracking UI', \(\) => \{/, "describe('public order tracking UI', () => {\n" + newTest);
fs.writeFileSync('src/views/public/TrackOrder.test.tsx', code);
