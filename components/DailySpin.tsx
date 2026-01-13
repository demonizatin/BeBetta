
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Star, Zap, Coins, Info, Check } from 'lucide-react';
import { MembershipTier } from '../types';

interface DailySpinProps {
  onClaim: (reward: string, amount: number, type: 'COINS' | 'XP') => void;
  onClose: () => void;
  userTier: MembershipTier;
}

// Improved high-contrast colors
const SEGMENTS = [
  { id: 1, label: '50 Coins', value: 50, type: 'COINS', color: '#fbbf24', textColor: '#451a03' }, // Amber-400
  { id: 2, label: '100 XP', value: 100, type: 'XP', color: '#4ade80', textColor: '#064e3b' }, // Green-400
  { id: 3, label: '20 Coins', value: 20, type: 'COINS', color: '#fcd34d', textColor: '#451a03' }, // Amber-300
  { id: 4, label: 'JACKPOT', value: 500, type: 'COINS', color: '#a855f7', textColor: '#ffffff' }, // Purple-500
  { id: 5, label: '50 XP', value: 50, type: 'XP', color: '#86efac', textColor: '#064e3b' }, // Green-300
  { id: 6, label: '10 Coins', value: 10, type: 'COINS', color: '#fbbf24', textColor: '#451a03' }, // Amber-400
];

export const DailySpin: React.FC<DailySpinProps> = ({ onClaim, onClose, userTier }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [reward, setReward] = useState<typeof SEGMENTS[0] | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);

  const handleSpin = () => {
    if (isSpinning || hasClaimed) return;
    
    setIsSpinning(true);
    
    // Random rotation logic
    const segmentAngle = 360 / SEGMENTS.length;
    const randomSegmentIndex = Math.floor(Math.random() * SEGMENTS.length);
    const targetReward = SEGMENTS[randomSegmentIndex];
    
    const randomOffset = 1800 + (360 - (randomSegmentIndex * segmentAngle)); 
    
    setRotation(randomOffset);

    setTimeout(() => {
      setReward(targetReward);
      setHasClaimed(true);
      setIsSpinning(false);
    }, 3000); // Animation duration
  };

  const handleCollect = () => {
    if (reward) {
      setIsCollecting(true);
      setTimeout(() => {
          onClaim(reward.label, reward.value, reward.type as any);
          onClose();
      }, 1000);
    }
  };

  // Dynamic Background based on Tier
  const getBgClass = () => {
      if (userTier === 'PLATINUM') return 'bg-slate-900 border-slate-700';
      if (userTier === 'GOLD') return 'bg-amber-50 border-amber-200';
      return 'bg-white border-gray-200';
  };

  const getTextColor = () => {
      if (userTier === 'PLATINUM') return 'text-white';
      if (userTier === 'GOLD') return 'text-amber-950';
      return 'text-slate-900';
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
       <motion.div 
         initial={{ scale: 0.8, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         className={`w-full max-w-sm border rounded-3xl p-6 relative shadow-2xl overflow-hidden ${getBgClass()}`}
       >
         {/* Navigation Buttons */}
         <button 
           onClick={onClose}
           className={`absolute top-4 left-4 z-20 p-2 rounded-full border transition-colors ${userTier === 'PLATINUM' ? 'bg-slate-800 border-slate-700 text-gray-400 hover:text-white' : 'bg-white border-gray-200 text-gray-400 hover:text-gray-900'}`}
         >
           <X size={14} />
         </button>

         <button 
           onClick={() => setShowInfo(!showInfo)}
           className={`absolute top-4 right-4 z-20 p-2 rounded-full border transition-colors ${userTier === 'PLATINUM' ? 'bg-slate-800 border-slate-700 text-gray-400 hover:text-white' : 'bg-white border-gray-200 text-gray-400 hover:text-gray-900'}`}
         >
           <Info size={14} />
         </button>

         <div className="text-center mb-6 relative z-10 mt-4">
           <h2 className={`text-2xl font-black uppercase italic tracking-wider ${getTextColor()}`}>
             Daily Drop
           </h2>
           <p className={`text-sm ${userTier === 'PLATINUM' ? 'text-slate-400' : 'text-slate-500'}`}>Spin to win free loot!</p>
         </div>

         {/* The Wheel Container */}
         <div className="relative w-64 h-64 mx-auto mb-8">
            {/* Pointer */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 drop-shadow-lg">
               <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-red-500" />
            </div>

            {/* Wheel */}
            <motion.div 
              className="w-full h-full rounded-full border-4 border-slate-800 relative overflow-hidden shadow-xl"
              style={{
                background: `conic-gradient(
                  ${SEGMENTS[0].color} 0deg 60deg,
                  ${SEGMENTS[1].color} 60deg 120deg,
                  ${SEGMENTS[2].color} 120deg 180deg,
                  ${SEGMENTS[3].color} 180deg 240deg,
                  ${SEGMENTS[4].color} 240deg 300deg,
                  ${SEGMENTS[5].color} 300deg 360deg
                )`
              }}
              animate={{ rotate: rotation }}
              transition={{ duration: 3, ease: [0.1, 0, 0.2, 1] }}
            >
              {SEGMENTS.map((seg, i) => {
                 const angle = (360 / SEGMENTS.length) * i;
                 return (
                   <div 
                    key={seg.id}
                    className="absolute top-0 left-1/2 w-0.5 h-1/2 origin-bottom flex justify-center pt-4"
                    style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
                   >
                     {/* Segment Content */}
                     <div className="text-[10px] font-bold flex flex-col items-center gap-1" style={{ color: seg.textColor }}>
                        {seg.type === 'COINS' ? <Coins size={16} fill="currentColor" /> : <Zap size={16} fill="currentColor" />}
                        <span className="px-1 rounded bg-black/10 backdrop-blur-[1px]">{seg.value}</span>
                     </div>
                   </div>
                 );
              })}
            </motion.div>
            
            {/* Center Cap */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 flex items-center justify-center z-10 shadow-lg ${userTier === 'PLATINUM' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
               <Gift size={24} className="text-brand-red animate-pulse" />
            </div>
         </div>

         {/* Actions */}
         <div className="relative z-10">
           {!hasClaimed ? (
             <button
               onClick={handleSpin}
               disabled={isSpinning}
               className={`
                 w-full py-4 rounded-xl font-bold text-lg tracking-wide uppercase transition-all shadow-lg
                 ${isSpinning 
                   ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                   : 'bg-brand-red hover:scale-105 hover:shadow-red-500/30 text-white'
                 }
               `}
             >
               {isSpinning ? 'Spinning...' : 'SPIN NOW'}
             </button>
           ) : isCollecting ? (
             <div className="w-full py-4 rounded-xl font-bold text-lg bg-green-500 text-white flex items-center justify-center gap-2">
                 <Check size={24} /> Collected!
             </div>
           ) : (
             <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
               <p className={`${userTier === 'PLATINUM' ? 'text-gray-400' : 'text-gray-500'} text-sm mb-2`}>You Won</p>
               <div className={`text-3xl font-black mb-4 flex items-center justify-center gap-2 ${userTier === 'PLATINUM' ? 'text-white' : 'text-gray-900'}`}>
                  {reward?.type === 'COINS' ? <Coins className="text-yellow-500" /> : <Zap className="text-green-500" />}
                  {reward?.label}
               </div>
               <button
                 onClick={handleCollect}
                 className="w-full py-3 rounded-xl font-bold bg-green-500 text-white hover:bg-green-600 transition-colors shadow-lg shadow-green-200"
               >
                 CLAIM REWARD
               </button>
             </div>
           )}
         </div>

         {/* Info Overlay */}
         <AnimatePresence>
            {showInfo && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center rounded-3xl"
                >
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Info size={20} className="text-brand-blue" /> Reward Info
                    </h3>
                    <div className="space-y-3 text-left w-full">
                        <div className="flex items-start gap-3 bg-white/10 p-3 rounded-xl border border-white/10">
                             <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400 shrink-0"><Coins size={18} /></div>
                             <div>
                                 <p className="font-bold text-white text-sm">Coins (FC)</p>
                                 <p className="text-[10px] text-gray-400 leading-tight mt-0.5">Currency used to redeem real items like Headphones and Vouchers in the Store.</p>
                             </div>
                        </div>
                        <div className="flex items-start gap-3 bg-white/10 p-3 rounded-xl border border-white/10">
                             <div className="p-2 bg-green-500/20 rounded-lg text-green-400 shrink-0"><Zap size={18} /></div>
                             <div>
                                 <p className="font-bold text-white text-sm">XP (Experience)</p>
                                 <p className="text-[10px] text-gray-400 leading-tight mt-0.5">Points that help you Level Up to unlock better cashback and badges.</p>
                             </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowInfo(false)}
                        className="mt-6 w-full py-3 bg-white text-black hover:bg-gray-100 rounded-xl font-bold text-sm transition-colors"
                    >
                        Got it
                    </button>
                </motion.div>
            )}
         </AnimatePresence>

       </motion.div>
    </div>
  );
};
