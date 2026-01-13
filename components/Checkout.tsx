
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CreditCard, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import { CartItem, PaymentMethod, UserState } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  user: UserState;
  onRemove: (id: string) => void;
  onCheckout: (method: PaymentMethod) => void;
  isHighlighted?: boolean;
}

export const Checkout: React.FC<CheckoutProps> = ({ cart, user, onRemove, onCheckout, isHighlighted = false }) => {
  const [step, setStep] = useState<'CART' | 'PAYMENT' | 'PROCESSING'>('CART');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');

  const itemTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = Math.round(itemTotal * 0.05);
  const deliveryFee = itemTotal > 500 || user.membershipTier !== 'FREE' ? 0 : 40;
  const grandTotal = itemTotal + gst + deliveryFee;

  const handlePay = () => {
    setStep('PROCESSING');
    setTimeout(() => {
      onCheckout(paymentMethod);
      // We don't need to reset step here, App.tsx will change view to MENU
    }, 2500); 
  };

  if (cart.length === 0 && step === 'CART') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 p-8 text-center">
        <div className="bg-gray-100 p-8 rounded-full mb-6">
          <CreditCard size={48} className="opacity-30 text-gray-500" />
        </div>
        <p className="font-bold text-xl text-gray-800 mb-2">Your Cart is Empty</p>
        <p className="text-sm text-gray-500 max-w-xs">Looks like you haven't added any fuel yet. Head to the menu to order.</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-24 pt-4">
      {step === 'PROCESSING' ? (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-[200] flex flex-col items-center justify-center">
           <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
             <Loader2 size={64} className="text-brand-red mb-6" />
           </motion.div>
           <h2 className="text-2xl font-black text-gray-900 animate-pulse mb-2">Processing Payment</h2>
           <p className="text-gray-500 font-medium">Connecting to secure gateway...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-6">
             {step === 'PAYMENT' && (
                 <button onClick={() => setStep('CART')} className="text-gray-500 hover:text-gray-900">
                     <ChevronRight className="rotate-180" />
                 </button>
             )}
             <h2 className="text-2xl font-black text-gray-900">
               {step === 'CART' ? 'Your Order' : 'Select Payment'}
             </h2>
          </div>

          <AnimatePresence mode="wait">
            {step === 'CART' ? (
              <motion.div 
                key="cart-list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                     <div className="flex items-center gap-4">
                        <div className="border border-gray-200 rounded-md p-0.5 self-start mt-1">
                           {item.isVeg ? <div className="w-2.5 h-2.5 bg-green-600 rounded-full" /> : <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />}
                        </div>
                        <div>
                           <p className="font-bold text-gray-900 text-sm mb-1">{item.name}</p>
                           <p className="text-xs font-bold text-gray-500">₹{item.price} <span className="text-gray-300 mx-1">x</span> {item.quantity}</p>
                        </div>
                     </div>
                     <div className="flex flex-col items-end gap-2">
                        <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                        <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500 p-1">
                            <Trash2 size={16} />
                        </button>
                     </div>
                  </div>
                ))}

                <div className="bg-white p-5 rounded-2xl space-y-3 mt-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bill Summary</h3>
                  <div className="flex justify-between text-sm text-gray-600 font-medium">
                    <span>Item Total</span>
                    <span>₹{itemTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 font-medium">
                    <span>GST (5%)</span>
                    <span>₹{gst}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 font-medium">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? <span className="text-brand-green font-bold">FREE</span> : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-gray-900 text-xl mt-2">
                    <span>To Pay</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>

                <div className={`sticky bottom-20 transition-all duration-300 ${isHighlighted ? 'z-[80] relative ring-4 ring-brand-green/30 rounded-xl bg-white' : 'z-10'}`}>
                  <button 
                    onClick={() => setStep('PAYMENT')}
                    className={`w-full text-white font-bold py-4 rounded-xl flex items-center justify-between px-6 transition-all shadow-xl active:scale-[0.98] ${isHighlighted ? 'bg-brand-green hover:bg-green-700 animate-pulse' : 'bg-gray-900 hover:bg-gray-800 shadow-gray-200'}`}
                  >
                    <span>Proceed to Pay</span>
                    <span className="flex items-center gap-2">₹{grandTotal} <ChevronRight size={20} /></span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="payment-options"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className={`space-y-3 ${isHighlighted ? 'relative z-[80] bg-white rounded-2xl p-1' : ''}`}>
                    {[
                    { id: 'UPI', label: 'UPI (GPay, PhonePe)', icon: '📱' },
                    { id: 'CARD', label: 'Credit/Debit Card', icon: '💳' },
                    { id: 'COD', label: 'Cash on Delivery', icon: '💵' },
                    ].map((method) => (
                    <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                        className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all ${
                        paymentMethod === method.id 
                        ? 'bg-red-50/50 border-brand-red ring-1 ring-brand-red' 
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-bold text-gray-900">{method.label}</span>
                        </div>
                        {paymentMethod === method.id && <CheckCircle className="text-brand-red" fill="currentColor" size={24} />}
                    </button>
                    ))}
                </div>

                <div className={`mt-8 sticky bottom-20 transition-all ${isHighlighted ? 'z-[80] relative ring-4 ring-brand-green/30 rounded-xl bg-white' : 'z-10'}`}>
                  <button 
                    onClick={handlePay}
                    className={`w-full text-white font-bold py-4 rounded-xl transition-all shadow-xl active:scale-[0.98] text-lg ${isHighlighted ? 'bg-brand-green animate-pulse hover:bg-green-700' : 'bg-brand-red hover:bg-brand-redDark shadow-red-200'}`}
                  >
                    PAY ₹{grandTotal}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};
