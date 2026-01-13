import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Coins, Zap, Crown } from 'lucide-react';

interface ScratchCardModalProps {
  isVisible: boolean;
  onClose: () => void;
  onClaim: () => void;
  reward: { type: 'XP' | 'COINS'; amount: number };
  potentialAmount: number;
  isPlatinum: boolean;
  onUpgrade: () => void;
}

export const ScratchCardModal: React.FC<ScratchCardModalProps> = ({ 
  isVisible, 
  onClose, 
  onClaim, 
  reward, 
  potentialAmount,
  isPlatinum,
  onUpgrade 
}) => {
  const [isScratched, setIsScratched] = useState(false);

  React.useEffect(() => {
    if (!isVisible) {
      setIsScratched(false);
    }
  }, [isVisible]);

  const handleScratch = () => {
    if (isScratched) return;
    setIsScratched(true);
    setTimeout(() => {
        onClaim();
    }, 1500);
  };

  if (!isVisible) return null;

  const missedAmount = potentialAmount - reward.amount;
  const showMissed = !isPlatinum && missedAmount > 0;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative w-full max-w-xs aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-30 bg-black/10 p-2 rounded-full hover:bg-black/20 transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>

        <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-4">Scratch & Win</h3>
            
            <div className="mb-2 scale-110">
                {reward.type === 'XP' ? (
                    <Zap size={64} className="text-yellow-400 drop-shadow-lg mx-auto" fill="currentColor" />
                ) : (
                    <Coins size={64} className="text-yellow-500 drop-shadow-lg mx-auto" />
                )}
            </div>
            
            <h2 className="text-6xl font-black text-gray-900 mb-1 tracking-tighter">+{reward.amount}</h2>
            <p className="font-bold text-gray-500 mb-8">{reward.type}</p>

            {isPlatinum ? (
                 <div className="bg-slate-900 rounded-xl p-3 w-full border border-slate-800 shadow-lg">
                    <div className="flex items-center justify-center gap-2 text-yellow-400 mb-1">
                        <Crown size={16} fill="currentColor" />
                        <span className="text-xs font-bold uppercase tracking-wide">Platinum Tier</span>
                    </div>
                    <div className="text-[10px] text-slate-300">
                        Maximum 2x multiplier applied. You're earning the max rewards!
                    </div>
                </div>
            ) : showMissed ? (
                <div className="bg-red-50 rounded-xl p-3 w-full border border-red-100">
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                        Platinum users got <span className="font-bold text-gray-900">{potentialAmount} {reward.type}</span>
                    </div>
                    <div className="text-xs font-black text-brand-red mb-3">
                        You missed +{missedAmount} {reward.type}
                    </div>
                    <button 
                        onClick={onUpgrade}
                        className="w-full bg-gray-900 text-white text-[10px] font-bold py-2.5 rounded-lg flex items-center justify-center gap-1 hover:bg-gray-800 transition-colors shadow-md"
                    >
                        UPGRADE & CLAIM MAX
                    </button>
                </div>
            ) : (
                <div className="text-xs text-gray-400 mt-4">Reward added to your wallet</div>
            )}
        </div>

        <AnimatePresence>
          {!isScratched && (
             <motion.div 
               initial={{ opacity: 1 }}
               exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
               transition={{ duration: 0.5 }}
               onClick={handleScratch}
               className="absolute inset-0 z-20 cursor-pointer group"
             >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red via-red-500 to-orange-500" />
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                   <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm shadow-inner">
                       <Sparkles size={32} className="animate-pulse text-white" />
                   </div>
                   <h2 className="text-2xl font-black uppercase tracking-wider drop-shadow-md">Mystery Card</h2>
                   <p className="text-xs font-semibold opacity-90 mt-2 bg-black/20 px-4 py-1.5 rounded-full">Tap to Reveal</p>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};