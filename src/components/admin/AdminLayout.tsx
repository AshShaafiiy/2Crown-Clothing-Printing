"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import { useState } from 'react';
import {
  Menu, X,
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Package,
  Tags,
  Image as ImageIcon,
  Shield
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  if (user?.role === 'root_super_admin' || user?.role === 'super_admin') {
    menuItems.splice(5, 0, { name: 'Administrators', path: '/admin/administrators', icon: Shield });
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-secondary text-white flex flex-col transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center">
          <Link href="/admin" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
            <img src="/2Crown-logo.jpeg" alt="2Crown Logo" className="h-10 w-auto rounded-sm object-contain" />
            <span className="text-xl font-bold text-primary tracking-wide">Admin</span>
          </Link>
          <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path ||
                             (item.path !== '/admin' && pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-secondary font-medium'
                    : 'text-gray-300 hover:bg-secondary-light hover:text-white'
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-secondary-light">
          {user && (
            <Link href="/admin/profile" onClick={() => setSidebarOpen(false)} className="block px-4 py-3 mb-2 rounded-md hover:bg-secondary-light transition-colors">
              <p className="text-sm font-medium text-gray-200 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
              <p className="text-xs text-primary mt-1 capitalize">{user.role.replace(/_/g, ' ')}</p>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-300 hover:bg-secondary-light hover:text-white rounded-md transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-4 md:px-8">
          <button
            className="md:hidden text-gray-600 hover:text-gray-900 mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 truncate">
            {menuItems.find(item => item.path === pathname)?.name || (pathname === '/admin/profile' ? 'Profile' : 'Dashboard')}
          </h1>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
