import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../../hooks/useOrders';
import { useUserProfile, useUpdateUserProfile, useFundWallet } from '../../hooks/useUserProfile';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  User, 
  Wallet, 
  History, 
  Settings, 
  CreditCard, 
  Check, 
  Edit, 
  Calendar, 
  Clock, 
  FileText, 
  Eye, 
  KeyRound, 
  Plus, 
  TrendingUp, 
  Loader2, 
  Copy,
  Info
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { SpotifyIcon } from './SpotifyIcon';

export const DashboardView: React.FC = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const { data: orders, isLoading: isOrdersLoading } = useOrders();

  const updateProfileMutation = useUpdateUserProfile();
  const fundWalletMutation = useFundWallet();

  // Profile forms state
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Wallet funding state
  const [fundAmount, setFundAmount] = useState('5000');
  const [isFundingLoading, setIsFundingLoading] = useState(false);
  const [fundSuccessMsg, setFundSuccessMsg] = useState('');

  // Selected order details modal
  const [selectedVoucherPin, setSelectedVoucherPin] = useState<string | null>(null);
  const [selectedVoucherTitle, setSelectedVoucherTitle] = useState('');

  // Initialize form default fields when profile is fetched
  React.useEffect(() => {
    if (profile) {
      setProfileName(profile.name);
      setProfileEmail(profile.email);
      setProfilePhone(profile.phone);
    }
  }, [profile]);

  if (isProfileLoading || isOrdersLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
        <p className="text-gray-400 text-sm font-mono">Assembling user dashboard feeds...</p>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    try {
      await updateProfileMutation.mutateAsync({
        name: profileName,
        email: profileEmail,
        phone: profilePhone,
      });
      setProfileSuccessMsg('Profile settings updated successfully!');
      setIsProfileEditing(false);
      setTimeout(() => setProfileSuccessMsg(''), 3000);
    } catch {
      // ignore
    }
  };

  const handleFundWallet = async (amountVal: number) => {
    if (amountVal <= 0) return;
    setIsFundingLoading(true);
    setFundSuccessMsg('');
    await new Promise((r) => setTimeout(r, 1000));
    try {
      await fundWalletMutation.mutateAsync(amountVal);
      setFundSuccessMsg(`Successfully credited ₦${amountVal.toLocaleString()} into your wallet balance!`);
      setIsFundingLoading(false);
      setTimeout(() => setFundSuccessMsg(''), 4000);
    } catch {
      setIsFundingLoading(false);
    }
  };

  const revealOrderPin = (order: any) => {
    // Generate a beautiful recall pin format
    let pinStr = '';
    if (order.productId.toLowerCase().includes('data') || order.productId.toLowerCase().includes('airtime')) {
      pinStr = `DIRECT TRANSFER EXECUTION: SME Data bundles were pushed to recipient line ${order.deliveryInfo} - STATUS: CREDITED SUCCEEDED.`;
    } else if (order.productId.toLowerCase().includes('bill')) {
      if (order.productId === 'electricity-bill') {
        pinStr = `PREPAID RECHARGE CODE PIN: ${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      } else {
        pinStr = `CABLE TV AUTHORIZATION REFERENCE CODE: DSTV-API-REF-${Math.floor(1000000 + Math.random() * 9000000)}. Decoder re-connected automatically.`;
      }
    } else {
      pinStr = `REDEEM DIGITS: C1-${Math.floor(1000 + Math.random()*9000)}-${Math.floor(1000 + Math.random()*9000)}-${Math.floor(1000 + Math.random()*9000)}`;
    }
    
    setSelectedVoucherTitle(`${order.productName} (${order.variantValue})`);
    setSelectedVoucherPin(pinStr);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 max-w-6xl">
      {/* Dashboard Headline */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Welcome back, {profile?.name || 'Customer'}
        </h1>
        <p className="text-gray-400 text-sm">
          Track transaction invoices, manage profile preferences and instantly re-fund sandbox wallets.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
          <Card className="bg-[#101018] border-white/5 rounded-2xl">
            <CardHeader className="p-5 border-b border-white/5">
              <CardTitle className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" /> Purchase & Refill Logs
              </CardTitle>
              <CardDescription className="text-xs text-gray-500">
                A historical index of all electronic vouchers issued and direct data credits dispatched.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              {!orders || orders.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="p-3.5 bg-white/5 rounded-full text-gray-500 w-max mx-auto">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h4 className="text-white font-bold text-sm">No transactions registered</h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    Any gaming credits, SME bundles or renewal files you purchase will showcase here for active tracking.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/5 bg-[#12121c]/50 font-mono text-gray-500 text-[10px] tracking-wider uppercase">
                        <th className="p-4 font-normal">Reference & Date</th>
                        <th className="p-4 font-normal">Product Spec</th>
                        <th className="p-4 font-normal text-right">Denomination Price</th>
                        <th className="p-4 font-normal text-center">Dispatch Status</th>
                        <th className="p-4 font-normal text-center">Fulfillment Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map((order, idx) => {
                        const IconComponent = order.productImage === 'Spotify'
                          ? SpotifyIcon
                          : ((Icons as any)[order.productImage] || Icons.Gamepad2);
                        
                        return (
                          <tr key={order.id || idx} className="hover:bg-white/[0.01] transition-colors">
                            {/* Ref details */}
                            <td className="p-4 space-y-1">
                              <span className="font-mono font-bold text-white uppercase text-xs block">{order.id}</span>
                              <span className="text-[10px] text-gray-500 font-normal">
                                {new Date(order.createdAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </td>

                            {/* Product Name */}
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#181822] text-indigo-400 rounded-lg border border-white/5 shrink-0">
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                  <span className="font-semibold text-white leading-none block">{order.productName}</span>
                                  <span className="text-[10px] text-indigo-300 font-mono leading-none bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/5 inline-block">
                                    {order.variantValue}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Price */}
                            <td className="p-4 text-right font-mono font-bold text-white text-xs">
                              ₦{order.priceNaira.toLocaleString()}
                            </td>

                            {/* Status */}
                            <td className="p-4 text-center">
                              <Badge 
                                className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase border shrink-0 ${
                                  order.status === 'completed'
                                    ? 'bg-teal-500/10 border-teal-500/20 text-teal-400'
                                    : order.status === 'processing'
                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse'
                                    : order.status === 'failed'
                                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                    : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                                }`}
                              >
                                {order.status}
                              </Badge>
                            </td>

                            {/* Actions (View PIN) */}
                            <td className="p-4 text-center">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => revealOrderPin(order)}
                                className="h-7 text-[10px] font-sans font-medium text-emerald-400 hover:text-white hover:bg-[#181a20]"
                              >
                                <Eye className="w-3.5 h-3.5 mr-1 shrink-0" /> Retrieve PIN
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
      </div>

      {/* PopUp modal to show retrieved pin code */}
      {selectedVoucherPin && (
        <div className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e0e15] border border-white/10 p-6 rounded-2xl max-w-[400px] w-full text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-emerald-500/15 p-3 rounded-full text-emerald-400 w-max mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-white text-base">Fulfillment PIN Code</h3>
              <p className="text-xs text-gray-400">{selectedVoucherTitle}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-white/5 select-all font-mono text-xs text-white text-center font-semibold tracking-wider break-all leading-relaxed">
              {selectedVoucherPin}
            </div>

            <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1">
              <Info className="w-3.5 h-3.5 text-indigo-400" /> Vouchers are verified on sandboxed servers.
            </p>

            <Button 
              onClick={() => setSelectedVoucherPin(null)} 
              className="w-full bg-[#181822] border border-white/5 text-white hover:bg-[#202030]"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
