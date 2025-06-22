
import { Provider } from 'react-redux';
import { store } from '@/store';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Layout from '@/components/Layout';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Clients from '@/pages/Clients';
import Users from '@/pages/Users';
import Tasks from '@/pages/Tasks';
import NotFound from '@/pages/NotFound';
import { useKeycloak } from '@react-keycloak/web';
import { Loader2 } from 'lucide-react';
import AuthProvider from './components/auth/AuthProvider';
import AppLoginPage from './components/auth/AppLoginPage';

const queryClient = new QueryClient();

const AppContent = () => {
  const { keycloak, initialized } = useKeycloak();

  // Show loading while Keycloak is initializing
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }


  // If not authenticated, show login button or redirect to Keycloak
  if (!keycloak.authenticated) {
    return <AppLoginPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/clients" element={<Clients />} /> */}
        {/* <Route path="/invoices" element={<div>Invoices - Coming Soon</div>} />
        <Route path="/payment-links" element={<div>Payment Links - Coming Soon</div>} /> */}
        <Route path="/users" element={<Users />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/settings" element={<div>Settings - Coming Soon</div>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Provider store={store}>
            <AppContent />
          </Provider>
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
