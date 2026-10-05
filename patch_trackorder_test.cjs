const fs = require('fs');
const file = 'src/views/public/TrackOrder.test.tsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  /const submit=\(value=reference\)=>\s*\{fireEvent\.change\(screen\.getByLabelText\('Order Reference'\),\{target:\{value\}\}\);\s*fireEvent\.click\(screen\.getByRole\('button',\{name:'Track Order'\}\)\);\s*\};/,
  `const submit=(value=reference, phone='09000000000')=>{fireEvent.change(screen.getByLabelText('Order Reference'),{target:{value}});fireEvent.change(screen.getByLabelText('Phone Number'),{target:{value:phone}});fireEvent.click(screen.getByRole('button',{name:'Track Order'}));};`
);

data = data.replace(
  /it\('renders safe DTO and manual delivery without phone for secure references',async\(\)=>\{lookup\.mockResolvedValue\(order\);render\(<TrackOrder\/>\);submit\(\);expect\(await screen\.findByText\('Order Details'\)\)\.toBeTruthy\(\);expect\(screen\.getByText\('1x Shirt'\)\)\.toBeTruthy\(\);expect\(screen\.getByText\('To be confirmed'\)\)\.toBeTruthy\(\);expect\(screen\.queryByLabelText\('Phone Number'\)\)\.toBeNull\(\);expect\(lookup\)\.toHaveBeenCalledWith\(reference,undefined\);\};\);/,
  `it('renders safe DTO and manual delivery for references',async()=>{lookup.mockResolvedValue(order);render(<TrackOrder/>);submit();expect(await screen.findByText('Order Details')).toBeTruthy();expect(screen.getByText('1x Shirt')).toBeTruthy();expect(screen.getByText('To be confirmed')).toBeTruthy();expect(lookup).toHaveBeenCalledWith(reference,'09000000000');});`
);

data = data.replace(
  /it\('legacy references require phone and send it through service argument',async\(\)=>\{[\s\S]*?\};\);/,
  ""
);

fs.writeFileSync(file, data);
