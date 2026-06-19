import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOrders, updateOrderStatus, fetchProducts, createProduct, updateProduct, deleteProduct } from '../../lib/api';
import { Product, Order, CategoryType, ProductVariant } from '../../lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  Gamepad2, 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  ShieldCheck, 
  PenTool, 
  Tv, 
  Wifi, 
  Loader2, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { SpotifyIcon } from './SpotifyIcon';

export const AdminView: React.FC = () => {
  const queryClient = useQueryClient();

  // Queries
  const { data: orders, isLoading: isOrdersLoading } = useQuery<Order[], Error>({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  const { data: products, isLoading: isProductsLoading } = useQuery<Product[], Error>({
    queryKey: ['products', 'all'],
    queryFn: () => fetchProducts('all'),
  });

  // Mutations
  const updateOrderMutation = useMutation<Order, Error, { id: string; status: Order['status'] }>({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const addProductMutation = useMutation<Product, Error, Product>({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const editProductMutation = useMutation<Product, Error, { id: string; updated: Partial<Product> }>({
    mutationFn: ({ id, updated }) => updateProduct(id, updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteProductMutation = useMutation<boolean, Error, string>({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // UI state managers
  const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'products' | 'users'>('stats');

  // Product Creator/Editor Form details
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null); // Null = creating new
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<CategoryType>('Gaming');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('Gamepad2');
  const [prodDeliveryLabel, setProdDeliveryLabel] = useState('Player ID');
  const [prodDeliveryPlaceholder, setProdDeliveryPlaceholder] = useState('eg. 74819401');
  const [prodVariants, setProdVariants] = useState<ProductVariant[]>([
    { id: 'v1', name: '200 Standard', value: '200 Units', priceNaira: 1500 }
  ]);

  // Handle Order status switches
  const handleStatusTransition = async (orderId: string, nextStatus: Order['status']) => {
    try {
      await updateOrderMutation.mutateAsync({ id: orderId, status: nextStatus });
    } catch (err) {
      console.error(err);
    }
  };

  // Helper dynamic statistics
  const totalRevenue = orders
    ? orders
        .filter((o) => o.status === 'completed')
        .reduce((sum, o) => sum + o.priceNaira, 0)
    : 0;

  const pendingOrdersCount = orders
    ? orders.filter((o) => o.status === 'pending' || o.status === 'processing').length
    : 0;

  // Mock initial users with dynamic spends matched against real orders in local storage
  const mockUsersList = [
    { name: '0xchronosfi Customer', email: '0xchronosfi@gmail.com', phone: '08123456789', role: 'Superadmin' },
    { name: 'Gamer Boy Nigeria', email: 'gamerboy@gmail.com', phone: '08031234567', role: 'Customer' },
    { name: 'Kelechi Chidinma', email: 'kelech@outlook.com', phone: '07038104829', role: 'Customer' }
  ].map(user => {
    // Dynamic total spend
    const spend = orders 
      ? orders.filter(o => o.email === user.email && o.status === 'completed').reduce((sum, o) => sum + o.priceNaira, 0)
      : 0;
    return { ...user, totalSpendNaira: spend };
  });

  // Product variant list additions helper
  const handleAddVariantRow = () => {
    const tempId = `v-${Date.now()}`;
    setProdVariants([
      ...prodVariants,
      { id: tempId, name: 'New Unit Option', value: 'Amount Units', priceNaira: 1000 }
    ]);
  };

  const handleRemoveVariantRow = (vid: string) => {
    setProdVariants(prodVariants.filter(v => v.id !== vid));
  };

  const handleVariantChange = (vid: string, field: keyof ProductVariant, val: any) => {
    setProdVariants(
      prodVariants.map(v => (v.id === vid ? { ...v, [field]: val } : v))
    );
  };

  // Submit Product Save action (both creation and edits)
  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedProduct: Product = {
      id: editingProductId || prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: prodName,
      slug: prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: prodCategory,
      description: prodDescription,
      image: prodImage,
      deliveryLabel: prodDeliveryLabel,
      deliveryPlaceholder: prodDeliveryPlaceholder,
      variants: prodVariants.map((v, i) => ({
        ...v,
        id: editingProductId ? v.id : `${editingProductId || prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`
      }))
    };

    try {
      if (editingProductId) {
        await editProductMutation.mutateAsync({ id: editingProductId, updated: formattedProduct });
      } else {
        await addProductMutation.mutateAsync(formattedProduct);
      }

      setIsProductModalOpen(false);
      resetProductForm();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProdName(prod.name);
    setProdCategory(prod.category);
    setProdDescription(prod.description);
    setProdImage(prod.image);
    setProdDeliveryLabel(prod.deliveryLabel);
    setProdDeliveryPlaceholder(prod.deliveryPlaceholder);
    setProdVariants(prod.variants);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (pid: string) => {
    if (confirm('Are you sure you want to retire this top-up provider catalog item?')) {
      await deleteProductMutation.mutateAsync(pid);
    }
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProdName('');
    setProdCategory('Gaming');
    setProdDescription('');
    setProdImage('Gamepad2');
    setProdDeliveryLabel('Player UID');
    setProdDeliveryPlaceholder('eg. xxxxxxxx');
    setProdVariants([{ id: 'v1', name: '100 Point Box', value: '100 pts', priceNaira: 1000 }]);
  };

  if (isOrdersLoading || isProductsLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
        <p className="text-gray-400 text-sm font-mono">Initializing Carry1st administration controls...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 max-w-6xl">
      {/* Admin Title Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Carry1st Staff Console
          </h1>
          <p className="text-gray-400 text-sm">
            Control center to manipulate catalog listings, override invoice statuses and verify user accounts.
          </p>
        </div>
        <div className="flex bg-[#12121a] border border-white/5 p-1 rounded-xl gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer ${activeTab === 'stats' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Metrics
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer ${activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Invoices ({orders?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer ${activeTab === 'products' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Catalog ({products?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Users
          </button>
        </div>
      </div>

      {/* VIEW 1: OVERVIEW METRICS */}
      {activeTab === 'stats' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Stat 1: Total Revenue */}
            <Card className="bg-[#101018] border-white/5 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-[-20px] right-[-20px] w-20 h-20 bg-green-500/5 rounded-full blur-[30px]" />
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-500 font-mono uppercase font-normal">Accumulated Revenue</span>
                <div className="p-2 bg-green-500/10 text-green-400 rounded-lg">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <div className="text-2xl font-black font-mono text-white leading-none">
                  ₦{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <p className="text-[10px] text-gray-500">Exhaustive sum of all 'completed' transactions.</p>
              </div>
            </Card>

            {/* Stat 2: Total Orders */}
            <Card className="bg-[#101018] border-white/5 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-[-20px] right-[-20px] w-20 h-20 bg-indigo-500/5 rounded-full blur-[30px]" />
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-500 font-mono uppercase font-normal">All Issued Invoices</span>
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <div className="text-2xl font-black font-mono text-white leading-none">
                  {orders?.length || 0}
                </div>
                <p className="text-[10px] text-gray-500">Gross volume processed on client ledger.</p>
              </div>
            </Card>

            {/* Stat 3: Pending Queues */}
            <Card className="bg-[#101018] border-white/5 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-[-20px] right-[-20px] w-20 h-20 bg-amber-500/5 rounded-full blur-[30px]" />
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-500 font-mono uppercase font-normal">Queued Actions</span>
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                  <Clock className="w-4 h-4 animate-spin-slow" />
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <div className="text-2xl font-black font-mono text-white leading-none">
                  {pendingOrdersCount}
                </div>
                <p className="text-[10px] text-gray-500">Currently awaiting direct carrier dispatch.</p>
              </div>
            </Card>

            {/* Stat 4: Active accounts */}
            <Card className="bg-[#101018] border-white/5 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-[-20px] right-[-20px] w-20 h-20 bg-violet-500/5 rounded-full blur-[30px]" />
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-500 font-mono uppercase font-normal">Accounts Tracked</span>
                <div className="p-2 bg-violet-500/10 text-violet-400 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <div className="text-2xl font-black font-mono text-white leading-none">
                  {mockUsersList.length}
                </div>
                <p className="text-[10px] text-gray-500">Identified registered players in session cache.</p>
              </div>
            </Card>
          </div>

          {/* Quick Stats Footnote Info banner & shortcuts */}
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-xs text-center md:text-left leading-relaxed">
              💡 <span className="text-white font-medium">Platform Synchronization:</span> All variables above are powered actively in real-time. Creating mock product orders updates the stats immediately.
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={() => setActiveTab('orders')} 
                variant="outline" 
                size="sm" 
                className="border-white/5 text-gray-300 hover:bg-white/5 rounded-lg text-[11px] h-8"
              >
                Inspect Queue
              </Button>
              <Button 
                onClick={() => {
                  resetProductForm();
                  setIsProductModalOpen(true);
                }}
                size="sm" 
                className="bg-[#181825] hover:bg-[#202035] border border-white/5 text-white rounded-lg text-[11px] h-8 shadow-md"
              >
                Add Game Bundle
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ORDERS MANAGEMENT INVOICES */}
      {activeTab === 'orders' && (
        <Card className="bg-[#101018] border-white/5 rounded-2xl overflow-hidden animate-in fade-in duration-200">
          <CardHeader className="p-5 border-b border-white/5">
            <CardTitle className="text-sm font-bold text-white tracking-tight">Active Transactions Ledgers</CardTitle>
            <CardDescription className="text-xs text-gray-500">Overrule and dispatch client invoice statuses directly below.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {!orders || orders.length === 0 ? (
              <div className="py-12 text-center text-gray-500">No invoices generated yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="text-xs">
                  <TableHeader className="bg-[#12121c]/50 border-b border-white/5">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="p-4 text-gray-500 font-mono uppercase text-[10px] font-normal">ID & Recipient</TableHead>
                      <TableHead className="p-4 text-gray-500 font-mono uppercase text-[10px] font-normal">Customer Mail</TableHead>
                      <TableHead className="p-4 text-gray-500 font-mono uppercase text-[10px] font-normal">Item Description</TableHead>
                      <TableHead className="p-4 text-gray-500 font-mono uppercase text-[10px] font-normal text-right">Price</TableHead>
                      <TableHead className="p-4 text-gray-500 font-mono uppercase text-[10px] font-normal text-center">Dispatch Status</TableHead>
                      <TableHead className="p-4 text-gray-500 font-mono uppercase text-[10px] font-normal text-right">Queue Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-white/5">
                    {orders.map((order) => {
                      return (
                        <TableRow key={order.id} className="hover:bg-white/[0.01] border-white/5">
                          <TableCell className="p-4 space-y-1">
                            <span className="font-mono font-bold text-white block uppercase">{order.id}</span>
                            <span className="text-[10px] text-gray-500 block font-mono">{order.deliveryInfo}</span>
                          </TableCell>
                          <TableCell className="p-4 text-gray-300 font-mono truncate max-w-[140px]">
                            {order.email}
                          </TableCell>
                          <TableCell className="p-4">
                            <div className="space-y-0.5">
                              <span className="font-bold text-white block">{order.productName}</span>
                              <span className="text-[10px] text-indigo-400 font-mono bg-indigo-500/10 border border-indigo-500/5 px-2 py-0.5 rounded inline-block">
                                {order.variantValue}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="p-4 text-right font-mono font-bold text-white">
                            ₦{order.priceNaira.toLocaleString()}
                          </TableCell>
                          <TableCell className="p-4 text-center">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase border ${
                              order.status === 'completed'
                                ? 'bg-teal-500/10 border-teal-500/20 text-teal-400'
                                : order.status === 'processing'
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                : order.status === 'failed'
                                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
                            }`}>
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell className="p-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger render={
                                <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              } />
                              <DropdownMenuContent align="end" className="bg-[#12121a] border-white/10 text-gray-300 w-36">
                                <DropdownMenuItem 
                                  onClick={() => handleStatusTransition(order.id, 'completed')}
                                  className="focus:bg-white/5 focus:text-teal-400 cursor-pointer"
                                >
                                  Mark Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleStatusTransition(order.id, 'processing')}
                                  className="focus:bg-white/5 focus:text-amber-400 cursor-pointer"
                                >
                                  Mark Processing
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleStatusTransition(order.id, 'pending')}
                                  className="focus:bg-white/5 focus:text-indigo-400 cursor-pointer"
                                >
                                  Mark Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleStatusTransition(order.id, 'failed')}
                                  className="focus:bg-white/5 focus:text-rose-400 cursor-pointer text-rose-400"
                                >
                                  Mark Failed
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* VIEW 3: PRODUCT CATALOG ARCHITECTURE */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in duration-200 text-xs">
          <div className="flex justify-between items-center bg-[#101018]/50 p-4 border border-white/5 rounded-2xl">
            <span className="text-gray-400">Total list: {products?.length || 0} top-up gateways configured.</span>
            <Button 
              onClick={() => {
                resetProductForm();
                setIsProductModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs px-4"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Configure Product Gateway
            </Button>
          </div>

          <Card className="bg-[#101018] border-white/5 rounded-2xl overflow-hidden">
            <Table>
              <TableHeader className="bg-[#12121c]/50 border-b border-white/5">
                <TableRow className="hover:bg-transparent">
                  <TableHeading className="p-4 text-gray-500 font-mono text-[10px] uppercase font-normal">Logo & Title</TableHeading>
                  <TableHeading className="p-4 text-[#777] font-mono text-[10px] uppercase font-normal">Catalog Category</TableHeading>
                  <TableHeading className="p-4 text-gray-500 font-mono text-[10px] uppercase font-normal">Denominations Available</TableHeading>
                  <TableHeading className="p-4 text-gray-500 font-mono text-[10px] uppercase font-normal text-right">Target Input Key</TableHeading>
                  <TableHeading className="p-4 text-gray-500 font-mono text-[10px] uppercase font-normal text-right">Catalog Alteration Actions</TableHeading>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-white/5">
                {products?.map((prod) => {
                  const Icon = prod.image === 'Spotify'
                    ? SpotifyIcon
                    : ((Icons as any)[prod.image] || Icons.Gamepad2);

                  return (
                    <TableRow key={prod.id} className="hover:bg-white/[0.01] border-white/5 text-gray-300">
                      <TableCell className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#181822] p-2 rounded-lg text-indigo-400 border border-white/5 shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white block">{prod.name}</span>
                            <span className="text-[10px] text-gray-500 block font-mono">{prod.id}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <Badge className="bg-white/5 text-gray-300 border border-white/5 rounded-full text-[10px] font-normal py-0.5 px-2">
                          {prod.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="flex flex-wrap gap-1 leading-relaxed max-w-[280px]">
                          {prod.variants.slice(0, 3).map((v) => (
                            <span key={v.id} className="text-[10px] bg-indigo-950/20 text-indigo-300 border border-indigo-500/10 rounded px-1.5 py-0.5 font-mono">
                              {v.value} (₦{v.priceNaira})
                            </span>
                          ))}
                          {prod.variants.length > 3 && (
                            <span className="text-[10px] text-gray-500 font-mono py-0.5 px-1">
                              +{prod.variants.length - 3} more
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="p-4 text-right font-mono text-gray-400 font-medium">
                        {prod.deliveryLabel}
                      </TableCell>
                      <TableCell className="p-4 text-right space-x-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => openEditProduct(prod)}
                          className="h-7 w-7 p-0 text-indigo-400 hover:text-white"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="h-7 w-7 p-0 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* VIEW 4: ACTIVE USERS DIRECTORY */}
      {activeTab === 'users' && (
        <Card className="bg-[#101018] border-white/5 rounded-2xl overflow-hidden animate-in fade-in duration-200">
          <CardHeader className="p-5 border-b border-white/5">
            <CardTitle className="text-sm font-bold text-white tracking-tight">Active Registered Accounts</CardTitle>
            <CardDescription className="text-xs text-gray-500">Contact variables, privileges and compiled purchase spends.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="text-xs">
              <TableHeader className="bg-[#12121c]/50 border-b border-white/5">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="p-4 text-gray-500 font-mono uppercase text-[10px] font-normal">Email & Contacts</TableHead>
                  <TableHead className="p-4 text-gray-500 font-mono uppercase text-[10px] font-normal">Customer Name</TableHead>
                  <TableHead className="p-4 text-gray-500 font-mono uppercase text-[10px] font-normal text-center">Account Role</TableHead>
                  <TableHead className="p-4 text-gray-500 font-mono uppercase text-[10px] font-normal text-right">Aggregate Top-Up Spends</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-white/5">
                {mockUsersList.map((usr, i) => {
                  return (
                    <TableRow key={i} className="hover:bg-white/[0.01] border-white/5">
                      <TableCell className="p-4 space-y-1">
                        <span className="font-bold text-white block">{usr.email}</span>
                        <span className="text-[10px] text-gray-500 block font-mono">{usr.phone}</span>
                      </TableCell>
                      <TableCell className="p-4 font-semibold text-gray-300">
                        {usr.name}
                      </TableCell>
                      <TableCell className="p-4 text-center">
                        <Badge className={`text-[10px] font-mono rounded-full font-normal py-0.5 px-2 uppercase ${
                          usr.role === 'Superadmin' 
                            ? 'bg-violet-600/10 border border-violet-500/25 text-violet-300' 
                            : 'bg-white/5 border border-white/5 text-gray-400'
                        }`}>
                          {usr.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-4 text-right font-mono font-black text-emerald-400">
                        ₦{usr.totalSpendNaira.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* MODAL / DIALOG DIARY: ADD / EDIT PRODUCT */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-[550px] w-full bg-[#0a0a0f] border-white/15 text-gray-200 p-0 overflow-hidden rounded-2xl max-h-[90vh] flex flex-col justify-between">
          <DialogHeader className="p-6 border-b border-white/5 pb-4">
            <DialogTitle className="text-lg font-black text-white tracking-tight">
              {editingProductId ? 'Configure Gateway Indexing' : 'Configure New Catalog Item'}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Complete the variables required to register the digital top-up stream.
            </DialogDescription>
          </DialogHeader>

          {/* Form Content body container */}
          <form onSubmit={saveProduct} className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-mono uppercase">Gateway Title Name</label>
                <Input 
                  required 
                  value={prodName} 
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="eg: Valorant Points"
                  className="bg-[#101018] border-white/5 text-xs text-white h-9"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-mono uppercase">Category</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value as CategoryType)}
                  className="w-full h-9 px-3 bg-[#101018] border border-white/5 rounded-xl text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Gaming">Gaming</option>
                  <option value="Streaming">Streaming</option>
                  <option value="Data & Airtime">Data & Airtime</option>
                  <option value="Bills">Bills</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-mono uppercase">Icon Reference (Lucide Component key)</label>
              <select
                value={prodImage}
                onChange={(e) => setProdImage(e.target.value)}
                className="w-full h-9 px-3 bg-[#101018] border border-white/5 rounded-xl text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="Gamepad2">Gamepad (Gamepad2)</option>
                <option value="Gem">Ruby/Diamond (Gem)</option>
                <option value="Swords">Swords (Swords)</option>
                <option value="Music">Spotify/Music (Music)</option>
                <option value="Youtube">Youtube logo (Youtube)</option>
                <option value="PenTool">Canva/Design (PenTool)</option>
                <option value="Phone">Airtel/Phone (Phone)</option>
                <option value="Rss">MTN/SME (Rss)</option>
                <option value="Wifi">Glo/Net (Wifi)</option>
                <option value="Tv">DSTV/Cable (Tv)</option>
                <option value="Zap">Utility / Electricity (Zap)</option>
                <option value="GraduationCap">WAEC Scratch-Card (GraduationCap)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-mono uppercase">Strategic Descriptive Terms</label>
              <textarea
                required
                value={prodDescription}
                onChange={(e) => setProdDescription(e.target.value)}
                placeholder="Pick description terms for redemption..."
                className="w-full min-h-16 p-3 bg-[#101018] border border-white/5 rounded-xl text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-mono uppercase">Delivery ID Label</label>
                <Input 
                  required 
                  value={prodDeliveryLabel} 
                  onChange={(e) => setProdDeliveryLabel(e.target.value)}
                  placeholder="eg: Smartcard Number"
                  className="bg-[#101018] border-white/5 text-xs text-white h-9"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-mono uppercase">Delivery Placeholder</label>
                <Input 
                  required 
                  value={prodDeliveryPlaceholder} 
                  onChange={(e) => setProdDeliveryPlaceholder(e.target.value)}
                  placeholder="eg: eg. 042291048293"
                  className="bg-[#101018] border-white/5 text-xs text-white h-9"
                />
              </div>
            </div>

            {/* VARIANTS OPTIONS EDITOR */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-indigo-300">Option Variants & Naira Rates</label>
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={handleAddVariantRow}
                  className="h-7 text-[10px] bg-white/5 border border-white/5 text-indigo-400 hover:text-white rounded-lg px-2"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add denomination variant option
                </Button>
              </div>

              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {prodVariants.map((v, idx) => (
                  <div key={v.id} className="flex gap-2 items-center bg-[#101018]/50 p-2 border border-white/5 rounded-xl">
                    <Input 
                      required 
                      value={v.name} 
                      onChange={(e) => handleVariantChange(v.id, 'name', e.target.value)}
                      placeholder="Title (e.g: 200 CP)"
                      className="bg-[#0a0a0f] border-white/5 text-[11px] h-8 flex-1"
                    />
                    <Input 
                      required 
                      value={v.value} 
                      onChange={(e) => handleVariantChange(v.id, 'value', e.target.value)}
                      placeholder="Redeem (e.g: 200 CP)"
                      className="bg-[#0a0a0f] border-white/5 text-[11px] h-8 flex-1"
                    />
                    <div className="flex items-center bg-[#0a0a0f] border border-white/5 px-2 h-8 rounded-lg text-gray-500 shrink-0 font-mono text-xs">
                      <span>₦</span>
                      <input 
                        type="number" 
                        required 
                        value={v.priceNaira} 
                        onChange={(e) => handleVariantChange(v.id, 'priceNaira', Number(e.target.value))}
                        className="bg-transparent border-0 text-white w-14 font-bold text-center focus:outline-none"
                      />
                    </div>
                    {prodVariants.length > 1 && (
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleRemoveVariantRow(v.id)}
                        className="h-8 w-8 p-0 text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="p-6 border-t border-white/5 pt-4 bg-[#12121a]/30 flex gap-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsProductModalOpen(false)}
                className="w-1/3 hover:bg-white/5 text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/10 cursor-pointer"
              >
                Save digital gateway
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Simple helper components to make it compiles cleanly
function TableHeading({ children, className, ...props }: React.ComponentPropsWithoutRef<'th'>) {
  return (
    <th className={`${className || ''}`} {...props}>
      {children}
    </th>
  );
}
export default AdminView;
