
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

export const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-secondary">
      <Navbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Layout;
