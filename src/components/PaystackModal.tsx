import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { 
  CreditCard, 
  Wallet, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Lock, 
  Loader2, 
  Info,
  Sparkles
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';

interface PaystackModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  variantValue: string;
  priceNaira: number;
  deliveryInfo: string;
  userEmail: string;
  onSuccess: (paymentMethod: string) => void;
}

export const PaystackModal: React.FC<PaystackModalProps> = ({
  isOpen,
  onClose,
  productName,
  variantValue,
  priceNaira,
  deliveryInfo,
  userEmail,
  onSuccess
}) => {
  const { user } = useAuth();
  const { data: profile } = useUserProfile();
  const [step, setStep] = useState<'method' | 'card' | 'processing' | 'success'>('method');
  const [errorMsg, setErrorMsg] = useState('');

  // Card form states
  const [cardNumber, setCardNumber] = useState('4081 2295 9184 3958');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCVV, setCardCVV] = useState('382');

  const startPayment = async (method: 'Card' | 'Wallet') => {
    setErrorMsg('');
    if (method === 'Wallet') {
      if (!profile || profile.walletBalance < priceNaira) {
        setErrorMsg(`Insufficient wallet balance. You need ₦${(priceNaira - (profile?.walletBalance || 0)).toLocaleString()} more. Please choose card or fund your wallet first!`);
        return;
      }
      setStep('processing');
      await new Promise((r) => setTimeout(r, 1200));
      setStep('success');
    } else {
      setStep('card');
    }
  };

  const handleCardPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    await new Promise((r) => setTimeout(r, 1500));
    setStep('success');
  };

  const finalize = (method: string) => {
    onSuccess(method);
    setStep('method'); // reset
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[400px] w-full p-0 bg-[#0f0f15] border-white/10 text-gray-200 overflow-hidden rounded-2xl">
        {/* Header Ribbon mimicking Paystack green brand accent */}
        <div className="h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-600 w-full" />

        <div className="p-6 space-y-6">
          {step === 'method' && (
            <div className="space-y-5">
              <div className="space-y-1.5 text-center">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-mono text-xs uppercase tracking-widest font-semibold leading-none">
                  <Lock className="w-3.5 h-3.5" /> SECURED BY PAYSTACK
                </div>
                <DialogTitle className="text-xl font-bold text-white tracking-tight">
                  Choose Payment Option
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-400">
                  Paying <span className="font-semibold text-white font-mono">₦{priceNaira.toLocaleString()}</span> for {productName} ({variantValue})
                </DialogDescription>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-300 text-xs flex gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-2.5">
                {/* Pay with Card */}
                <button
                  onClick={() => startPayment('Card')}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-emerald-500/20 text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/10 p-2.5 rounded-lg text-emerald-400">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Credit / Debit Card</div>
                      <div className="text-xs text-gray-400">Pay with Visa, Mastercard, Verve</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>

                {/* Pay with Wallet */}
                <button
                  onClick={() => startPayment('Wallet')}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-indigo-500/20 text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/10 p-2.5 rounded-lg text-indigo-400">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Carry1st Wallet Balance</div>
                      <div className="text-xs text-gray-400 font-mono">
                        Available: ₦{profile?.walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              </div>


            </div>
          )}

          {step === 'card' && (
            <form onSubmit={handleCardPay} className="space-y-5">
              <div className="space-y-1.5 text-center">
                <DialogTitle className="text-lg font-bold text-white tracking-tight">
                  Enter Card Details
                </DialogTitle>
                <div className="text-xs text-emerald-400 font-mono tracking-widest leading-none">PAYSTACK SANDBOX CARD</div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-mono uppercase">Card Number</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full h-11 px-3.5 bg-white/5 border border-white/5 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-emerald-500 font-mono"
                    placeholder="xxxx xxxx xxxx xxxx"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-mono uppercase">Expiry Date</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full h-11 px-3.5 bg-white/5 border border-white/5 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-emerald-500 font-mono text-center"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-mono uppercase">CVV</label>
                    <input
                      type="password"
                      required
                      value={cardCVV}
                      onChange={(e) => setCardCVV(e.target.value)}
                      className="w-full h-11 px-3.5 bg-white/5 border border-white/5 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-emerald-500 font-mono text-center"
                      placeholder="***"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setStep('method')} 
                  className="w-1/3 hover:bg-white/5 text-gray-400 hover:text-white"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/10 rounded-xl py-6 hover:shadow-emerald-600/30"
                >
                  Pay ₦{priceNaira.toLocaleString()}
                </Button>
              </div>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
              <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
              <div className="space-y-1">
                <h3 className="font-bold text-white text-base">Authorizing Payment</h3>
                <p className="text-xs text-gray-400 max-w-xs">
                  Securing transaction gateway loops and confirming Sandbox balances. Please do not close this modal.
                </p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 flex flex-col items-center justify-center space-y-6 text-center">
              <div className="bg-emerald-500/15 p-4 rounded-full text-emerald-400 animate-bounce relative">
                <CheckCircle2 className="w-12 h-12" />
                <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-[8px] -z-10" />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-white text-lg tracking-tight">Payment Approved</h3>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  ₦{priceNaira.toLocaleString()} successfully processed. Your top-up is prepared and ready for fulfillment.
                </p>
              </div>

              <div className="w-full p-4 bg-white/5 rounded-xl border border-white/5 text-left text-xs font-mono space-y-1.5">
                <div>
                  <span className="text-gray-500">Destination:</span> <span className="text-white font-medium">{deliveryInfo}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-normal">Method:</span> <span className="text-white font-medium">Sandbox Verified</span>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span> <span className="text-white truncate max-w-[200px] inline-block align-bottom">{userEmail}</span>
                </div>
              </div>

              <Button 
                onClick={() => finalize('Paystack')} 
                className="w-full bg-[#181825] hover:bg-[#202035] border border-white/5 text-white shadow-xl py-6"
              >
                Reveal PIN & Voucher
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default PaystackModal;
