import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { 
  Gamepad2, 
  User, 
  Wallet, 
  ShieldAlert, 
  ShoppingBag, 
  ChevronDown, 
  LogOut, 
  Lock
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { data: profile } = useUserProfile();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0b0b0f]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-gradient-to-tr from-indigo-500 to-violet-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <span className="font-extrabold text-lg tracking-wider font-mono">C1</span>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
              Carry<span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">1st</span>
            </span>
            <div className="text-[10px] text-gray-500 font-mono tracking-widest leading-none">TOP-UP HUB</div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link 
            to="/" 
            className={`transition-colors ${isActive('/') ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}
          >
            Home
          </Link>
          <Link 
            to="/shop" 
            className={`flex items-center gap-1.5 transition-colors ${isActive('/shop') || location.pathname.startsWith('/shop/') ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}
          >
            <ShoppingBag className="w-4 h-4" />
            Shop & Top-Up
          </Link>
          {user && (
            <Link 
              to="/dashboard" 
              className={`transition-colors ${isActive('/dashboard') ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}
            >
              My Dashboard
            </Link>
          )}
          {user?.isAdmin && (
            <Link 
              to="/admin" 
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-300 text-xs hover:bg-violet-500/20 transition-colors`}
            >
              <Lock className="w-3 h-3" />
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Action Controls & User Account */}
        <div className="flex items-center gap-4">


          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-white/5 border border-white/10 p-0 text-gray-300 hover:text-white hover:bg-white/10">
                  <User className="h-5 w-5" />
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-56 bg-[#12121a] border-white/5 text-gray-300 shadow-2xl">
                <div className="flex items-center justify-start gap-2 p-3">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-white/5" />

                <DropdownMenuItem 
                  className="focus:bg-white/5 focus:text-white cursor-pointer"
                  render={<Link to="/dashboard" className="w-full flex items-center gap-2" />}
                >
                  <User className="w-4 h-4" />
                  My Profile & Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="focus:bg-white/5 focus:text-white cursor-pointer"
                  render={<Link to="/shop" className="w-full flex items-center gap-2" />}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Browse Shop
                </DropdownMenuItem>
                {user.isAdmin && (
                  <DropdownMenuItem 
                    className="focus:bg-white/5 focus:text-white text-violet-300 focus:text-violet-200 cursor-pointer"
                    render={<Link to="/admin" className="w-full flex items-center gap-2" />}
                  >
                    <Lock className="w-4 h-4" />
                    Admin Control
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem onClick={logout} className="focus:bg-rose-500/10 focus:text-rose-400 text-rose-400 cursor-pointer">
                  <div className="w-full flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2.5">
              <Button variant="ghost" className="text-gray-400 hover:text-white text-sm" render={<Link to="/auth/login" />} nativeButton={false}>
                Login
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/25 px-5" render={<Link to="/auth/signup" />} nativeButton={false}>
                Join Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
