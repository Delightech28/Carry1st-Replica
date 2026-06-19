import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ShopView } from './components/ShopView';
import { ProductDetailView } from './components/ProductDetailView';
import { DashboardView } from './components/DashboardView';
import { AdminView } from './components/AdminView';
import { LoginView } from './components/LoginView';
import { SignupView } from './components/SignupView';
import { Lock, LogIn, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';

// Force dark mode programmatically on the root DOM for reliable dark-theme design
if (typeof window !== 'undefined') {
  document.documentElement.classList.add('dark');
}

// Reset window scroll position on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Protected Route for Users
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-gray-400 font-mono text-sm">
        Verifying user credentials session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
};

// Protected Route for Admins
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-gray-400 font-mono text-xs">
        Verifying security status clearance...
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md space-y-6">
        <div className="bg-rose-500/10 p-4 rounded-3xl w-14 h-14 flex items-center justify-center text-rose-400 border border-rose-500/20 mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Staff Credentials Required</h2>
          <p className="text-gray-400 text-xs leading-relaxed">
            Staff clearance is required to manipulate transaction logs or catalog indexes. You are parsed as a standard consumer.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 border-white/5 text-gray-400 hover:text-white rounded-xl text-xs h-10" render={<Link to="/" />} nativeButton={false}>
            Dismiss
          </Button>
          <Button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-10" render={<Link to="/auth/login?redirect=/admin" />} nativeButton={false}>
            Staff Sign-In
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-[#07070b] text-gray-100 selection:bg-indigo-500/30 selection:text-white antialiased">
            
            {/* Global Sticky Navigation header */}
            <Navbar />

            {/* Main view container block */}
            <main className="flex-grow flex flex-col">
              <Routes>
                {/* Public endpoints */}
                <Route path="/" element={<HomeView />} />
                <Route path="/shop" element={<ShopView />} />
                <Route path="/shop/:productId" element={<ProductDetailView />} />
                
                {/* Authorization endpoints */}
                <Route path="/auth/login" element={<LoginView />} />
                <Route path="/auth/signup" element={<SignupView />} />

                {/* Consumer protected endpoints */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardView />
                    </ProtectedRoute>
                  } 
                />

                {/* Administrator protected endpoints */}
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminView />
                    </AdminRoute>
                  } 
                />

                {/* Catch-all home redirection */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Static brandFooter */}
            <Footer />
            
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
