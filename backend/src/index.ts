import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
