import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Search, SlidersHorizontal, Sliders, Gamepad2, Music, Wifi, Tv, Laptop, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';

export const ShopView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all products since we search and filter client-side beautifully
  const { data: products, isLoading, error } = useProducts();

  // Sync category state from URL if needed
  const handleCategoryChange = (val: string) => {
    if (val === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', val);
    }
    setSearchParams(searchParams);
  };

  // Filter products based on active category and search pattern
  const filteredProducts = products ? products.filter((product) => {
    const matchesCategory = 
      currentCategory === 'All' || 
      product.category.toLowerCase() === currentCategory.toLowerCase() ||
      (currentCategory.toLowerCase() === 'productivity' && product.id === 'canva-pro'); // Canva Pro fallback

    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  }) : [];

  const categories = [
    { name: 'All', icon: Sliders },
    { name: 'Gaming', icon: Gamepad2 },
    { name: 'Streaming', icon: Music },
    { name: 'Data & Airtime', icon: Wifi },
    { name: 'Bills', icon: Tv },
    { name: 'Productivity', icon: Laptop }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 max-w-6xl">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Browse Digital Goods & Top-Ups
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl">
          Choose a service category, pick your preferred gaming points or data SME denomination, and reload instantly.
        </p>
      </div>

      {/* Control Bar: Search & Category Layout */}
      <div className="flex flex-col gap-4 bg-[#101018]/40 p-4 border border-white/5 rounded-2xl">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4.5 h-4.5" />
            <Input 
              type="text" 
              placeholder="Search eg: 'CODM CP', 'MTN data', 'Spotify'..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-[#09090f] border-white/5 text-sm text-gray-200 placeholder:text-gray-500 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-xl"
            />
          </div>
        </div>

        {/* Tab filters */}
        <div className="w-full overflow-x-auto pb-1.5 md:pb-0 scrollbar-none">
          <Tabs value={currentCategory} onValueChange={handleCategoryChange} className="w-full">
            <TabsList className="bg-transparent border-0 flex space-x-2 gap-1 p-0 justify-start w-max">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = currentCategory.toLowerCase() === cat.name.toLowerCase();
                return (
                  <TabsTrigger 
                    key={cat.name} 
                    value={cat.name} 
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/15' 
                        : 'bg-[#0a0a0f] border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Grid Content / Loading State / Error State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="h-72 bg-[#101018]/50 rounded-2xl animate-pulse border border-white/5" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-[#101018]/40 border border-white/5 rounded-2xl gap-3">
          <AlertCircle className="w-10 h-10 text-rose-500" />
          <h3 className="text-white font-bold text-lg">Failed to retrieve catalog</h3>
          <p className="text-gray-400 text-sm">{error.message}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-[#101018]/40 border border-white/5 rounded-2xl gap-3">
          <div className="p-4 bg-white/5 rounded-2xl text-gray-400 mb-2">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-white font-bold text-lg">No products found</h3>
          <p className="text-gray-400 text-sm max-w-xs">
            We couldn't find anything matching "{searchQuery}" under {currentCategory}. Try checking spelling or change filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
