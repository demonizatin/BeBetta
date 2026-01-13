
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TutorialStep } from '../types';
import { ArrowUp, ArrowDown, Check, XCircle, Zap, Users, ShoppingBag } from 'lucide-react';

interface TutorialOverlayProps {
  step: TutorialStep;
  onNext: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ step, onNext }) => {
  if (step === 'NONE' || step === 'SCRATCH_GUIDE' || step === 'SLOT_MACHINE_INTRO') return null;

  const isBlocking = step !== 'ORDER_GUIDE' && step !== 'CHECKOUT_GUIDE' && step !== 'TRIGGER_MEMBERSHIP' && step !== 'LADDER_INTRO' && step !== 'LEADERBOARD_INTRO' && step !== 'STORE_INTRO';

  return (
    <AnimatePresence>
      {/* LAYER 1: BACKDROP (Z-60) - Sits behind highlighted elements (Z-80 to Z-130) */}
      <motion.div 
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-[2px] cursor-pointer"
        onClick={() => {
           if (isBlocking) onNext();
        }} 
      />

      {/* LAYER 2: CONTENT (Z-140) - Sits ABOVE highlighted elements */}
      <div className="fixed inset-0 z-[140] pointer-events-none">
        
        {/* --- STEP 1: WELCOME (Center) --- */}
        {step === 'WELCOME' && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-auto"
          >
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm border-2 border-brand-red relative">
               <button 
                 onClick={() => onNext()} 
                 className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"
               >
                 <XCircle size={24} />
               </button>
               <div className="text-6xl mb-4">🎮 🥗</div>
               <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase italic tracking-tight">Enter the Game</h1>
               <p className="text-gray-600 mb-8 leading-relaxed">
                 Turn your lunch into <span className="text-brand-red font-bold">XP</span>. <br/>
                 Eat healthy. Level Up. Get Real Loot.
               </p>
               <button 
                 onClick={onNext}
                 className="w-full bg-brand-red text-white font-bold py-4 rounded-xl text-lg hover:bg-red-600 transition-colors shadow-xl shadow-red-200 animate-pulse"
               >
                 LET'S GO
               </button>
            </div>
          </motion.div>
        )}

        {/* --- STEP 2: HUD INTRO (Top) --- */}
        {step === 'HUD_INTRO' && (
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             className="absolute top-24 left-4 right-4 pointer-events-auto"
           >
             <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-200 relative">
                <div className="absolute -top-2 right-12 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-200" />
                <h3 className="font-bold text-gray-900 mb-1">Your HUD</h3>
                <p className="text-xs text-gray-600 mb-3">Track your <strong className="text-yellow-600">Coins</strong> and <strong className="text-orange-500">Streak</strong> here.</p>
                <div className="flex justify-end">
                   <button onClick={onNext} className="text-xs font-bold bg-gray-900 text-white px-4 py-2 rounded-lg">Next</button>
                </div>
             </div>
           </motion.div>
        )}

        {/* --- STEP 3: QUEST INTRO (Center/Top) --- */}
        {step === 'QUEST_INTRO' && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="absolute top-32 left-4 right-4 pointer-events-auto"
           >
             <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-200 relative">
                 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-[225deg] border-t border-l border-gray-200" />
                <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                   Daily Bounties <ArrowDown size={16} className="text-brand-red animate-bounce" />
                </h3>
                <p className="text-xs text-gray-600 mb-3">Complete these highlighted tasks to earn <strong className="text-brand-red">Bonus XP</strong>.</p>
                <div className="flex justify-end">
                   <button onClick={onNext} className="text-xs font-bold bg-gray-900 text-white px-4 py-2 rounded-lg">Next</button>
                </div>
             </div>
           </motion.div>
        )}

        {/* --- STEP 4: MENU XP INTRO (Center) --- */}
        {step === 'MENU_XP_INTRO' && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="absolute inset-0 flex items-center justify-center p-6 pointer-events-auto"
           >
             <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 max-w-xs text-center">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Food = Fuel ⚡️</h3>
                <p className="text-sm text-gray-600 mb-4">Every item has an <strong>XP Value</strong>. High Protein means Higher XP.</p>
                <button onClick={onNext} className="w-full font-bold bg-gray-900 text-white px-4 py-3 rounded-xl">Got it</button>
             </div>
           </motion.div>
        )}

        {/* --- STEP 6: ORDER GUIDE (Pointer) --- */}
        {step === 'ORDER_GUIDE' && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="absolute inset-0 pointer-events-none"
           >
              <div className="absolute top-[50%] right-8 pointer-events-none">
                 <div className="bg-brand-red text-white p-3 rounded-xl shadow-xl max-w-[150px] relative animate-bounce">
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-brand-red rotate-45" />
                    <p className="font-bold text-xs text-center">Tap ADD</p>
                 </div>
              </div>
           </motion.div>
        )}

        {/* --- STEP 7: CHECKOUT GUIDE (Top) --- */}
        {step === 'CHECKOUT_GUIDE' && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="absolute inset-0 pointer-events-none"
           >
             <div className="absolute top-24 left-1/2 -translate-x-1/2 pointer-events-auto w-full max-w-xs px-4">
                <div className="bg-brand-green text-white p-4 rounded-xl shadow-xl text-center relative mb-4 animate-bounce">
                   <p className="font-bold text-lg">Checkout Now</p>
                   <p className="text-xs opacity-90">Start your first Streak!</p>
                   <ArrowDown className="mx-auto mt-2" />
                </div>
             </div>
           </motion.div>
        )}

         {/* --- STEP 8: PROFILE INTRO (Center) --- */}
         {step === 'PROFILE_INTRO' && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="absolute inset-0 pointer-events-auto flex items-center justify-center p-6"
           >
              <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-gray-100">
                 <h3 className="text-xl font-bold text-gray-900 mb-2">The Trophy Road 🏆</h3>
                 <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Track your <strong>Daily Streak</strong> and <strong>Nutrient Ladders</strong> here. 
                    <br/><br/>
                    Hit milestones like "Day 7" or "300g Protein" to unlock vouchers and free food.
                 </p>
                 <button onClick={onNext} className="w-full bg-brand-red text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors">
                    Finish Tour
                 </button>
              </div>
           </motion.div>
        )}
        
        {/* --- SIMULATION READY (Center) --- */}
         {step === 'SIMULATION_READY' && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="absolute inset-0 pointer-events-auto flex items-center justify-center p-6 bg-black/80"
           >
              <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center">
                 <div className="text-5xl mb-4">⏳</div>
                 <h3 className="text-2xl font-black text-white mb-2 uppercase italic">15 Days Later...</h3>
                 <p className="text-slate-400 mb-6 text-sm">
                    Simulation complete. You've been ordering consistently for 2 weeks.
                 </p>
                 <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-800 p-3 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase">Streak</div>
                        <div className="text-xl font-bold text-white">15 Days</div>
                    </div>
                     <div className="bg-slate-800 p-3 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase">Level</div>
                        <div className="text-xl font-bold text-white">Lvl 5</div>
                    </div>
                 </div>
                 <button onClick={onNext} className="w-full bg-brand-yellow text-black py-3 rounded-xl font-bold uppercase tracking-wide hover:bg-yellow-400">
                    Explore Progress
                 </button>
              </div>
           </motion.div>
        )}

        {/* --- LADDER INTRO (Center/Top) --- */}
        {step === 'LADDER_INTRO' && (
            <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="absolute inset-0 pointer-events-none"
           >
             <div className="absolute top-[25%] left-1/2 -translate-x-1/2 pointer-events-auto w-full max-w-xs px-4">
                <div className="bg-brand-red text-white p-4 rounded-xl shadow-xl text-center relative mb-4 animate-bounce">
                   <p className="font-bold text-sm">Claim your Rewards!</p>
                   <p className="text-xs opacity-90">Tap highlighted items to claim.</p>
                   <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-brand-red rotate-45" />
                </div>
             </div>
             
             {/* Next Button to go to Leaderboard */}
             <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-auto">
                <button 
                  onClick={onNext}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-white/20 transition-colors flex items-center gap-2 shadow-lg"
                >
                   Next <ArrowDown size={16} className="rotate-[-90deg]" />
                </button>
             </div>
           </motion.div>
        )}

        {/* --- STORE INTRO --- */}
        {step === 'STORE_INTRO' && (
            <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="absolute inset-0 pointer-events-none"
           >
             <div className="absolute top-[20%] left-1/2 -translate-x-1/2 pointer-events-auto w-full max-w-xs px-4 z-[150]">
                <div className="bg-brand-green text-white p-4 rounded-xl shadow-xl text-center relative mb-4 animate-bounce">
                    <div className="flex justify-center mb-1"><ShoppingBag size={24} /></div>
                   <p className="font-bold text-sm">Spend your Coins!</p>
                   <p className="text-xs opacity-90">You have enough to buy your first reward.</p>
                   <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-brand-green rotate-45" />
                </div>
             </div>
           </motion.div>
        )}

        {/* --- LEADERBOARD INTRO --- */}
        {step === 'LEADERBOARD_INTRO' && (
            <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="absolute inset-0 pointer-events-none"
           >
             <div className="absolute top-[40%] left-1/2 -translate-x-1/2 pointer-events-auto w-full max-w-xs px-4 z-[150]">
                <div className="bg-purple-600 text-white p-5 rounded-2xl shadow-xl text-center relative mb-4">
                   <div className="flex justify-center mb-2"><Users size={32} /></div>
                   <h3 className="font-bold text-lg mb-1">Compete & Win</h3>
                   <p className="text-xs opacity-90 mb-4 leading-relaxed">
                       Rank up in the <strong>Hitech City</strong> leaderboard to win free meals every week. Cheer others to earn free XP!
                   </p>
                   <button 
                     onClick={onNext}
                     className="bg-white text-purple-600 w-full py-2 rounded-xl font-bold text-sm hover:bg-purple-50 transition-colors"
                   >
                       Finish Tutorial
                   </button>
                </div>
             </div>
           </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
