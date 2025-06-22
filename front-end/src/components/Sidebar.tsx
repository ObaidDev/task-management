
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import { logout } from '@/store/slices/authSlice';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Link as LinkIcon, 
  Settings, 
  LogOut,
  CreditCard,
  CheckSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { logout } = useAuth() ;

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    // { href: '/clients', label: 'Clients', icon: Users },
    // { href: '/invoices', label: 'Invoices', icon: FileText },
    // { href: '/payment-links', label: 'Payment Links', icon: LinkIcon },
    { href: '/users', label: 'Users', icon: Users },
    { href: '/tasks', label: 'Tasks', icon: CheckSquare },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    // const 
    // dispatch(logout());
    logout() ;
  };

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
              <img 
                src="/logo.svg" 
                alt="BillFlow Logo" 
                className="w-16 h-16"
              />
          <span className="text-xl font-bold text-gray-900">BillFlow</span>
        </div>
      </div>
      
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full transition-colors"
        >
          <LogOut className="w-5 h-5"/>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
