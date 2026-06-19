import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../../hooks/useProduct';
import { useCreateOrder } from '../../hooks/useCreateOrder';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Info, 
  HelpCircle, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  Terminal, 
  Sparkles,
  Zap,
  MessageCircle as DialogIcon
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { SpotifyIcon } from './SpotifyIcon';
import { PaystackModal } from './PaystackModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';

export const ProductDetailView: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile } = useUserProfile();

  const { data: product, isLoading, error } = useProduct(productId || '');
  const createOrderMutation = useCreateOrder();

  // Selected state
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [deliveryInfo, setDeliveryInfo] = useState('');
  const [email, setEmail] = useState('');
  
  // Validation state
  const [validationError, setValidationError] = useState('');

  // Modals state
  const [isPaystackOpen, setIsPaystackOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [generatedPin, setGeneratedPin] = useState('');
  const [latestOrderMethod, setLatestOrderMethod] = useState('');

  // Set default variant and user info
  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-4">
        <Icons.Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
        <p className="text-gray-400 text-sm font-mono">Retrieving item specifications...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md space-y-4">
        <Icons.AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Product Spec Not Found</h2>
        <p className="text-gray-400 text-sm">
          The requested top-up catalogue could not be located in our indices. It may have been disabled.
        </p>
        <Button className="bg-indigo-600 hover:bg-indigo-500 rounded-xl" render={
          <Link to="/shop" />
        } nativeButton={false}>
          Return to Store
        </Button>
      </div>
    );
  }

  const IconComponent = product.image === 'Spotify'
    ? SpotifyIcon
    : ((Icons as any)[product.image] || Icons.Gamepad2);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!selectedVariant) {
      setValidationError('Please select a voucher/data option pack first.');
      return;
    }
    if (!deliveryInfo.trim()) {
      setValidationError(`Please fill out the ${product.deliveryLabel} fields required for credit routing.`);
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError('Please input a valid email address so we can forward invoice and receipt logs.');
      return;
    }

    // Trigger sandboxed checkout modal
    setIsPaystackOpen(true);
  };

  const handlePaymentSuccess = async (paymentMethod: string) => {
    setIsPaystackOpen(false);
    setLatestOrderMethod(paymentMethod);

    // Pin generation formula based on type
    let pin = '';
    if (product.category === 'Gaming' || product.category === 'Streaming') {
      const parts = Array.from({ length: 4 }, () => Math.floor(1000 + Math.random() * 9000).toString());
      pin = `PIN: ${parts.join('-')}`;
    } else if (product.category === 'Bills') {
      if (product.id === 'electricity-bill') {
        const p1 = Array.from({ length: 5 }, () => Math.floor(1000 + Math.random() * 9000).toString());
        pin = `METER TOKEN PIN: ${p1.join('-')}`;
      } else {
        pin = `DSTV-REF: ${Math.floor(10000000 + Math.random() * 90000000)}`;
      }
    } else {
      pin = `DIRECT PROVISION: SME Carrier Bundle ref #${Math.floor(100000 + Math.random() * 900000)} initiated!`;
    }
    setGeneratedPin(pin);

    // Save order through query mutation
    try {
      await createOrderMutation.mutateAsync({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        variantId: selectedVariant.id,
        variantValue: selectedVariant.value,
        priceNaira: selectedVariant.priceNaira,
        deliveryInfo: deliveryInfo.trim(),
        email: email.trim(),
        paymentMethod: paymentMethod === 'Wallet' ? 'Wallet' : 'Paystack',
      });

      // Clear input fields (except email)
      setDeliveryInfo('');

      // Open final receipt details modal
      setIsReceiptOpen(true);
    } catch (err: any) {
      console.error(err);
      setValidationError('Could not register order status. Please contact network support.');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 max-w-5xl">
      {/* Back Button Link */}
      <Link 
        to="/shop" 
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group mb-2"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to digital store catalogue
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Product Specifications */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#101018]/50 border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="flex items-start gap-4 flex-col sm:flex-row justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-500/10 p-4 rounded-2xl text-indigo-400 border border-indigo-500/10">
                  <IconComponent className="w-8 h-8" />
                </div>
                <div>
                  <Badge className="bg-indigo-600/10 border-indigo-500/20 text-indigo-400 text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full mb-1 inline-block">
                    {product.category}
                  </Badge>
                  <h1 className="text-2xl font-black text-white tracking-tight">
                    {product.name}
                  </h1>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="flex items-center gap-1 text-[11px] font-mono text-teal-400 bg-teal-500/5 px-2.5 py-1 rounded-full border border-teal-500/10 mt-2 sm:mt-0 leading-none">
                <ShieldCheck className="w-3.5 h-3.5 shrinking-0" /> Authorized Carrier
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-white text-sm">Service Description & Redemption Rules</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>


          </div>
        </div>

        {/* Right Column: Checkout Config Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-[#101018] border-white/5 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="p-5 border-b border-white/5">
              <CardTitle className="text-md font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Top-Up Parameters
              </CardTitle>
            </CardHeader>

            <form onSubmit={handleCheckoutSubmit}>
              <CardContent className="p-5 space-y-5">
                {validationError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex gap-2">
                    <Icons.AlertCircle className="w-4.5 h-4.5 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* 1. Pick variant item list */}
                <div className="space-y-2.5">
                  <label className="text-xs font-semibold text-gray-300 block">Select Denomination Packed Option</label>
                  <div className="grid grid-cols-3 gap-2">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            setValidationError('');
                            setSelectedVariant(v);
                          }}
                          className={`p-2 sm:p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                            isSelected 
                              ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-md shadow-indigo-600/5' 
                              : 'bg-[#0a0a0f] border-white/5 hover:border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          <span className={`text-[10px] sm:text-xs font-bold leading-tight ${isSelected ? 'text-indigo-400' : 'text-gray-300'}`}>{v.name}</span>
                          <span className="text-xs sm:text-sm font-extrabold font-mono text-white">₦{v.priceNaira.toLocaleString()}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Destination Coordinates input field (Player ID / Mobile) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 block flex items-center justify-between">
                    <span>{product.deliveryLabel}</span>
                    <span className="text-[10px] text-gray-500 uppercase font-mono font-normal">REQUIRED</span>
                  </label>
                  <div className="relative">
                    {product.image.includes('Phone') || product.image.includes('Rss') || product.image.includes('Wifi') ? (
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    ) : product.image.includes('Mail') || product.image.includes('Music') || product.image.includes('Pen') || product.image.includes('Spotify') ? (
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    ) : (
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    )}
                    <Input
                      type="text"
                      required
                      placeholder={product.deliveryPlaceholder}
                      value={deliveryInfo}
                      onChange={(e) => {
                        setValidationError('');
                        setDeliveryInfo(e.target.value);
                      }}
                      className="pl-10 h-11 bg-[#0a0a0f] border-white/5 text-gray-200 placeholder:text-gray-600 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* 3. Customer notification email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 block">Notification Email</label>
                  <Input
                    type="email"
                    required
                    placeholder="Enter email to get receipt"
                    value={email}
                    onChange={(e) => {
                      setValidationError('');
                      setEmail(e.target.value);
                    }}
                    className="h-11 bg-[#0a0a0f] border-white/5 text-gray-200 placeholder:text-gray-600 rounded-xl text-sm"
                  />
                  <p className="text-[10px] text-gray-500 leading-none">Your credentials and delivery logs will forward here.</p>
                </div>

                {/* 4. Order Summary Display block */}
                {selectedVariant && (
                  <div className="p-4 rounded-xl border border-white/5 bg-[#0a0a0f] space-y-2.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Service:</span>
                      <span className="text-white font-medium truncate max-w-[200px]">{product.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Denomination Value:</span>
                      <span className="text-indigo-400 font-bold">{selectedVariant.value || selectedVariant.name}</span>
                    </div>
                    {deliveryInfo && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Destination target:</span>
                        <span className="text-teal-400 font-medium truncate max-w-[150px]">{deliveryInfo}</span>
                      </div>
                    )}
                    <div className="border-t border-white/5 my-1.5 pt-1.5 flex justify-between text-sm">
                      <span className="text-gray-400 font-sans font-semibold">Total Payable</span>
                      <span className="text-white font-extrabold font-mono">₦{selectedVariant.priceNaira.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-5 pt-0 bg-[#12121a]/30">
                <Button 
                  type="submit" 
                  disabled={createOrderMutation.isPending}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-6 shadow-lg shadow-indigo-600/15 group-hover:shadow-indigo-600/30 cursor-pointer flex justify-center items-center gap-2"
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <Icons.Loader2 className="w-4 h-4 animate-spin-slow text-white" />
                      Proposing Invoice...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-indigo-200 animate-pulse" />
                      Secure Instant Top-Up
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>

      {/* Paystack secure sandbox portal iFrame simulator modal */}
      {selectedVariant && (
        <PaystackModal
          isOpen={isPaystackOpen}
          onClose={() => setIsPaystackOpen(false)}
          productName={product.name}
          variantValue={selectedVariant.value}
          priceNaira={selectedVariant.priceNaira}
          deliveryInfo={deliveryInfo}
          userEmail={email}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Receipt popup of generated purchase success */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="max-w-[440px] w-full p-6 bg-[#0c0c12] border-white/10 text-gray-200 rounded-2xl text-center space-y-6">
          <div className="bg-indigo-500/10 p-3 rounded-2xl w-14 h-14 flex items-center justify-center text-indigo-400 border border-indigo-500/20 mx-auto">
            <Zap className="w-7 h-7" />
          </div>

          <DialogHeader className="p-0 text-center space-y-1">
            <DialogTitle className="text-xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
              Reload Complete!
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400">
              Your instant transaction logs are approved and executed.
            </DialogDescription>
          </DialogHeader>

          {/* Details segment */}
          <div className="space-y-3.5 mt-2 text-left">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-xs font-mono space-y-2">
              <div className="flex justify-between border-b border-white/5 pb-2 mb-2">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="text-white font-bold text-indigo-400">
                  {createOrderMutation.data?.id || 'TXN-GENERATED'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Service:</span>
                <span className="text-white">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Voucher Value:</span>
                <span className="text-white">{selectedVariant?.value}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Price Paid:</span>
                <span className="text-white">₦{selectedVariant?.priceNaira.toLocaleString()} ({latestOrderMethod})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Deliver To:</span>
                <span className="text-teal-400 font-bold">{deliveryInfo || 'Target Account'}</span>
              </div>
            </div>

            {/* Simulated Printed Voucher / Pin */}
            {generatedPin && (
              <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl space-y-2 text-center relative group overflow-hidden">
                <div className="absolute inset-0 bg-indigo-500/[0.03] pointer-events-none" />
                <div className="text-[10px] text-indigo-300 font-semibold font-mono tracking-wider uppercase">Fulfillment Voucher Output</div>
                <div className="text-sm font-mono font-bold text-white bg-slate-950/70 p-3.5 rounded-lg border border-indigo-500/10 cursor-all-scroll select-all tracking-wide break-all">
                  {generatedPin}
                </div>
                <p className="text-[10px] text-gray-500 leading-none">Double-click or press to copy credentials. Also dispatched to {email}.</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsReceiptOpen(false)} 
              className="flex-1 border-white/5 hover:bg-white/5 text-gray-400 hover:text-white rounded-xl py-6 text-xs h-11"
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                setIsReceiptOpen(false);
                navigate('/dashboard');
              }}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-6 text-xs h-11 shadow-lg shadow-indigo-600/15"
            >
              Order Status History
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
