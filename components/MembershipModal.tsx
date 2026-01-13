
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Zap, Truck, Sparkles } from 'lucide-react';
import { MembershipTier } from '../types';

interface MembershipModalProps {
  isVisible: boolean;
  currentTier: MembershipTier;
  onClose: () => void;
  onUpgrade: (tier: MembershipTier) => void;
  isTutorialMode?: boolean;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({ isVisible, currentTier, onClose, onUpgrade, isTutorialMode = false }) => {
  const platinumRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && isTutorialMode && platinumRef.current) {
        // Delay slightly to ensure modal render
        setTimeout(() => {
            platinumRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
    }
  }, [isVisible, isTutorialMode]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl my-auto"
      >
        {!isTutorialMode && (
            <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/5 p-2 rounded-full hover:bg-black/10 transition-colors"
            >
            <X size={24} className="text-gray-600" />
            </button>
        )}

        <div className="p-8 pb-4 text-center">
            {isTutorialMode ? (
                <>
                 <h2 className="text-3xl font-black text-brand-red uppercase tracking-tight animate-pulse">Wait! Free Upgrade</h2>
                 <p className="text-gray-500 mt-2">Start your journey with a <b>7-Day Free Platinum Trial</b>.</p>
                </>
            ) : (
                <>
                 <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Unlock Elite Status</h2>
                 <p className="text-gray-500 mt-2">Level up faster and save more with Pro Membership.</p>
                </>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8 bg-gray-50 overflow-x-auto">
            {/* FREE TIER */}
            <div className={`relative p-6 rounded-2xl border-2 flex flex-col h-full bg-white transition-all ${currentTier === 'FREE' ? 'border-gray-900 ring-1 ring-gray-900 shadow-lg scale-[1.02]' : 'border-gray-200'}`}>
                {currentTier === 'FREE' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Current Plan</div>
                )}
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Starter</h3>
                    <p className="text-sm text-gray-500">For casual eaters.</p>
                </div>
                <div className="text-3xl font-black text-gray-900 mb-6">Free</div>
                <ul className="space-y-3 mb-8 flex-1">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={16} className="text-green-600" strokeWidth={3} /> Standard XP Rates (1x)
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={16} className="text-green-600" strokeWidth={3} /> Daily Spin
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-400 line-through decoration-gray-400">
                        <X size={16} /> Free Delivery
                    </li>
                </ul>
                <button disabled className="w-full py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-400 border border-gray-200">
                    Active
                </button>
            </div>

            {/* GOLD TIER - THE DECOY */}
            <div className={`relative p-6 rounded-2xl border-2 flex flex-col h-full bg-gradient-to-b from-amber-50 to-white overflow-hidden transition-all ${currentTier === 'GOLD' ? 'border-amber-500 ring-4 ring-amber-500/20 shadow-xl scale-[1.02]' : 'border-amber-200'}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
                {currentTier === 'GOLD' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Current Plan</div>
                )}
                <div className="mb-4 relative z-10">
                    <div className="flex justify-between items-start">
                         <div>
                            <h3 className="text-xl font-bold text-amber-950 flex items-center gap-2">
                                Gold <Crown size={18} className="text-amber-500 fill-amber-500" />
                            </h3>
                            <p className="text-sm text-amber-700 font-medium">For the grinders.</p>
                         </div>
                    </div>
                </div>
                {/* DECOY PRICE: Expensive enough to make Platinum look good */}
                <div className="text-3xl font-black text-amber-900 mb-6 flex items-baseline gap-1">
                    ₹299 <span className="text-base font-bold text-amber-700">/mo</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1 relative z-10">
                    <li className="flex items-center gap-2 text-sm text-amber-900 font-bold">
                        <Zap size={16} className="text-amber-600 fill-amber-600" /> 1.5x XP Boost
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                        <Check size={16} className="text-green-600" strokeWidth={3} /> Priority Support
                    </li>
                     <li className="flex items-center gap-2 text-sm text-gray-700">
                        <Check size={16} className="text-green-600" strokeWidth={3} /> Gold Profile Badge
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-400 line-through decoration-gray-400">
                        <X size={16} /> Free Delivery
                    </li>
                </ul>
                
                {currentTier === 'GOLD' ? (
                     <button disabled className="w-full py-3 rounded-xl font-bold text-sm bg-amber-100 text-amber-700 border border-amber-200">
                        Active Plan
                     </button>
                ) : (
                    <button 
                        onClick={() => onUpgrade('GOLD')}
                        className="w-full py-3 rounded-xl font-bold text-sm bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-lg shadow-amber-200 transition-transform active:scale-95"
                    >
                        Join Gold
                    </button>
                )}
            </div>

            {/* PLATINUM TIER - THE HERO */}
            <div ref={platinumRef} className={`relative p-6 rounded-2xl border-2 flex flex-col h-full bg-slate-900 text-white overflow-hidden transition-all ${currentTier === 'PLATINUM' ? 'border-slate-500 ring-4 ring-slate-500/30 shadow-2xl scale-[1.02]' : 'border-slate-700'}`}>
                {currentTier === 'PLATINUM' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Current Plan</div>
                )}
                 <div className="absolute -right-10 -top-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />
                 <div className="absolute -left-10 bottom-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
                 
                 {/* VALUE BADGE */}
                 <div className="absolute top-4 right-4 bg-gradient-to-r from-brand-red to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-lg animate-pulse">
                    BEST VALUE
                 </div>
                
                <div className="mb-4 relative z-10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        Platinum <Sparkles size={18} className="text-indigo-400 fill-indigo-400" />
                    </h3>
                    <p className="text-sm text-slate-400">The ultimate experience.</p>
                </div>
                {/* HERO PRICE: Small gap from Gold */}
                <div className="text-3xl font-black text-white mb-6 flex items-baseline gap-1">
                    ₹399 <span className="text-base font-bold text-slate-400">/mo</span>
                </div>
                <div className="text-[10px] text-green-400 font-bold mb-4 bg-green-400/10 inline-block px-2 py-1 rounded">
                   Only ₹100 more than Gold!
                </div>
                <ul className="space-y-3 mb-8 flex-1 relative z-10">
                    <li className="flex items-center gap-2 text-sm text-white font-bold">
                        <Zap size={16} className="text-brand-red fill-brand-red" /> 2x XP Multiplier
                    </li>
                     <li className="flex items-center gap-2 text-sm text-white font-bold">
                        <Truck size={16} className="text-blue-400 fill-blue-400" /> Free Delivery (Save ₹40/order)
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                        <Check size={16} className="text-green-400" strokeWidth={3} /> Exclusive Events
                    </li>
                     <li className="flex items-center gap-2 text-sm text-slate-300">
                        <Check size={16} className="text-green-400" strokeWidth={3} /> Dark Platinum Theme
                    </li>
                </ul>

                {currentTier === 'PLATINUM' ? (
                     <button disabled className="w-full py-3 rounded-xl font-bold text-sm bg-slate-800 text-slate-400 border border-slate-700">
                        Active Plan
                     </button>
                ) : (
                    <button 
                        onClick={() => onUpgrade('PLATINUM')}
                        className={`w-full py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-transform active:scale-95 ${isTutorialMode ? 'bg-brand-red text-white hover:bg-red-600 animate-pulse' : 'bg-white hover:bg-slate-100 text-slate-900'}`}
                    >
                        {isTutorialMode ? 'START 7-DAY FREE TRIAL' : 'Join Platinum'}
                    </button>
                )}
            </div>
        </div>
      </motion.div>
    </div>
  );
};
