
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Coins, ShoppingBag } from 'lucide-react';

interface LevelUpOverlayProps {
  isVisible: boolean;
  newLevel: number;
  onClose: () => void;
  onClaimStoreReward?: () => void;
  hasClaimableRewards?: boolean;
}

export const LevelUpOverlay: React.FC<LevelUpOverlayProps> = ({ isVisible, newLevel, onClose, onClaimStoreReward, hasClaimableRewards }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-gamer-card border-2 border-gamer-purple p-6 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.5)] text-center w-full max-w-sm relative"
          >
             <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
            
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <div className="bg-gamer-purple/20 p-5 rounded-full ring-4 ring-gamer-purple ring-opacity-50">
                <Trophy size={48} className="text-gamer-purple" />
              </div>
            </motion.div>
            
            <h2 className="text-3xl font-black text-white mb-1 italic uppercase tracking-wider">
              Level Up!
            </h2>
            <p className="text-slate-400 mb-6 text-sm">
              Welcome to <span className="text-gamer-purple font-bold">Level {newLevel}</span>
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="bg-slate-900/50 p-3 rounded-lg flex items-center justify-between border border-slate-700">
                <span className="text-sm text-slate-400">Max XP Cap</span>
                <span className="text-gamer-green font-bold">+500</span>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg flex items-center justify-between border border-slate-700">
                <div className="flex items-center gap-2">
                   <Coins size={16} className="text-yellow-400" />
                   <span className="text-sm text-slate-400">Bonus Coins</span>
                </div>
                <span className="text-yellow-400 font-bold">+100 FC</span>
              </div>
            </div>

            {hasClaimableRewards && (
                <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg mb-6 flex items-center gap-3">
                    <ShoppingBag size={20} className="text-green-400" />
                    <div className="text-left">
                        <p className="text-xs font-bold text-green-400 uppercase">Rewards Available</p>
                        <p className="text-[10px] text-slate-300">You have enough coins to claim items!</p>
                    </div>
                </div>
            )}

            <button
              onClick={() => {
                  if (hasClaimableRewards && onClaimStoreReward) {
                      onClaimStoreReward();
                  } else {
                      onClose();
                  }
              }}
              className="w-full bg-gradient-to-r from-gamer-purple to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 uppercase tracking-wide shadow-lg"
            >
              {hasClaimableRewards ? 'Go to Store' : 'Continue'}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
