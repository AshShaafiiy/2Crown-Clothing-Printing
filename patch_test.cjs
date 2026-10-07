const fs = require('fs');
const path = 'src/views/admin/Orders.test.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  "await waitFor(() => expect(screen.getByText('Date unavailable')).toBeInTheDocument());",
  "await waitFor(() => expect(screen.getAllByText('Date unavailable')[0]).toBeInTheDocument());"
);

fs.writeFileSync(path, code);
