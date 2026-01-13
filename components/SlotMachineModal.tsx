
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coins, Zap, Trophy, RefreshCw, Info } from 'lucide-react';
import { InfoModal } from './InfoModal';

interface SlotMachineModalProps {
  isVisible: boolean;
  onClose: () => void;
  userCoins: number;
  onSpin: (cost: number, winAmount: number) => void;
  isTutorial?: boolean;
}

const SYMBOLS = ['🍒', '🍋', '💎', '7️⃣', '🔔', '🍇'];
const SPIN_COST = 100;

export const SlotMachineModal: React.FC<SlotMachineModalProps> = ({ 
  isVisible, 
  onClose, 
  userCoins, 
  onSpin,
  isTutorial = false 
}) => {
  const [reels, setReels] = useState([0, 1, 2]); // Index of symbols
  const [isSpinning, setIsSpinning] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [message, setMessage] = useState('Spin to Win!');
  const [showInfo, setShowInfo] = useState(false);
  const [showWinPopup, setShowWinPopup] = useState(false);

  // Refs for animation intervals
  const intervals = useRef<number[]>([]);

  useEffect(() => {
    if (isVisible) {
      setWinAmount(0);
      setShowWinPopup(false);
      setMessage(isTutorial ? 'Tutorial: Free Spin!' : 'Spin to Win!');
    }
  }, [isVisible, isTutorial]);

  const handleSpin = () => {
    if (isSpinning) return;
    if (!isTutorial && userCoins < SPIN_COST) {
      setMessage('Not enough coins!');
      return;
    }

    setIsSpinning(true);
    setWinAmount(0);
    setMessage('Spinning...');
    setShowWinPopup(false);
    
    // Start spinning animation
    const newIntervals: number[] = [];
    [0, 1, 2].forEach((reelIndex) => {
      const interval = window.setInterval(() => {
        setReels(prev => {
          const newReels = [...prev];
          newReels[reelIndex] = Math.floor(Math.random() * SYMBOLS.length);
          return newReels;
        });
      }, 100);
      newIntervals.push(interval);
    });
    intervals.current = newIntervals;

    // Determine Result
    setTimeout(() => {
        stopReels();
    }, 2000);
  };

  const stopReels = () => {
    // Clear intervals
    intervals.current.forEach(window.clearInterval);
    intervals.current = [];

    let finalReels: number[] = [];

    if (isTutorial) {
        // Force Win 7-7-7
        const sevenIndex = SYMBOLS.indexOf('7️⃣');
        finalReels = [sevenIndex, sevenIndex, sevenIndex];
    } else {
        // Random Result
        finalReels = [
            Math.floor(Math.random() * SYMBOLS.length),
            Math.floor(Math.random() * SYMBOLS.length),
            Math.floor(Math.random() * SYMBOLS.length)
        ];
    }

    setReels(finalReels);
    
    // Calculate Win
    let win = 0;
    const [a, b, c] = finalReels;
    
    if (a === b && b === c) {
        // Jackpot
        if (SYMBOLS[a] === '7️⃣') win = 1000;
        else if (SYMBOLS[a] === '💎') win = 500;
        else win = 300;
    } else if (a === b || b === c || a === c) {
        // Pair
        win = 50;
    }

    setWinAmount(win);
    setIsSpinning(false);
    
    const cost = isTutorial ? 0 : SPIN_COST;
    onSpin(cost, win);

    if (win > 0) {
        setMessage(`WINNER! +${win} FC`);
        setShowWinPopup(true);

        // If tutorial, auto-close after seeing the win
        if (isTutorial) {
            setTimeout(() => {
                onClose();
            }, 3000);
        }
    } else {
        setMessage('Better luck next time!');
    }
  };

  const infoContent = (
    <div className="space-y-4">
        <p>Spin the reels to match symbols and multiply your wealth. Each spin costs <strong>100 FC</strong>.</p>
        
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-600">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Payout Table</h4>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                    <span className="text-2xl">7️⃣ 7️⃣ 7️⃣</span>
                    <span className="text-yellow-400 font-bold">1000 FC</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                    <span className="text-2xl">💎 💎 💎</span>
                    <span className="text-yellow-400 font-bold">500 FC</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                    <span className="text-slate-400">3 of a Kind</span>
                    <span className="text-yellow-400 font-bold">300 FC</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">Any Pair</span>
                    <span className="text-yellow-400 font-bold">50 FC</span>
                </div>
            </div>
        </div>
        
        <p className="text-xs text-slate-500 italic">
            *Odds are adjusted dynamically based on daily luck.
        </p>
    </div>
  );

  if (!isVisible) return null;

  return (
    <>
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-slate-900 border-4 border-yellow-500 rounded-3xl p-6 w-full max-w-sm relative shadow-[0_0_50px_rgba(234,179,8,0.4)]"
      >
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white text-slate-900 p-2 rounded-full hover:bg-gray-200 transition-colors border-2 border-slate-900 z-20"
        >
          <X size={20} />
        </button>

        <button 
          onClick={() => setShowInfo(true)}
          className="absolute -top-3 left-4 bg-slate-800 text-yellow-400 p-2 rounded-full hover:bg-slate-700 transition-colors border-2 border-slate-600 z-20"
        >
          <Info size={16} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
           <h2 className="text-3xl font-black text-yellow-400 uppercase tracking-widest drop-shadow-md flex items-center justify-center gap-2">
              <Zap className="text-yellow-400" fill="currentColor" /> Slots
           </h2>
           <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mt-1">
              <Coins size={14} className="text-yellow-500" /> 
              <span>Balance: <span className="text-white font-bold">{userCoins}</span></span>
           </div>
        </div>

        {/* Slot Machine Display */}
        <div className="bg-black p-4 rounded-xl border-4 border-slate-700 mb-6 relative overflow-hidden">
            {/* Glass Glare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-10" />
            
            <div className="flex justify-between gap-2">
                {reels.map((symbolIndex, i) => (
                    <div key={i} className="flex-1 bg-white h-24 rounded-lg flex items-center justify-center text-5xl shadow-inner border border-gray-300 relative overflow-hidden">
                        <motion.div
                           key={isSpinning ? `spin-${Date.now()}` : 'static'}
                           animate={isSpinning ? { y: [0, -50, 0] } : {}}
                           transition={isSpinning ? { repeat: Infinity, duration: 0.1 } : {}}
                        >
                            {SYMBOLS[symbolIndex]}
                        </motion.div>
                        {/* Shadow Gradient inside reel */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
                    </div>
                ))}
            </div>

            {/* Payline */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-red-500/50 z-0" />
            
            {/* BIG WIN OVERLAY */}
            <AnimatePresence>
                {showWinPopup && (
                    <motion.div 
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-[2px]"
                    >
                         <div className="text-center">
                             <div className="text-6xl animate-bounce">💰</div>
                             <div className="text-3xl font-black text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] stroke-black">
                                 +{winAmount}
                             </div>
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Message Display */}
        <div className={`text-center mb-6 h-8 font-bold ${winAmount > 0 ? 'text-green-400 animate-pulse' : 'text-slate-300'}`}>
            {message}
        </div>

        {/* Controls */}
        <div className="flex gap-4">
             <div className="flex-1 bg-slate-800 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-700">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Cost</span>
                <span className="text-white font-bold flex items-center gap-1">
                    {isTutorial ? 'FREE' : SPIN_COST} <Coins size={12} className="text-yellow-500" />
                </span>
             </div>
             
             <button
               onClick={handleSpin}
               disabled={isSpinning || (!isTutorial && userCoins < SPIN_COST)}
               className={`flex-[2] py-4 rounded-xl font-black text-xl uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2
                 ${isSpinning 
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                    : 'bg-gradient-to-b from-yellow-400 to-yellow-600 text-yellow-950 border-b-4 border-yellow-800 hover:brightness-110'
                 }
               `}
             >
               {isSpinning ? <RefreshCw className="animate-spin" /> : 'SPIN'}
             </button>
        </div>

      </motion.div>
    </div>
    
    <InfoModal 
        isVisible={showInfo}
        onClose={() => setShowInfo(false)}
        title="How to Play"
        description={infoContent}
    />
    </>
  );
};
