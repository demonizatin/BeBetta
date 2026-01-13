
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Check, Gift, Sparkles, Info, Clock, AlertTriangle, ListChecks } from 'lucide-react';
import { Ladder, UserStats } from '../types';
import { InfoModal } from './InfoModal';

interface GamificationLaddersProps {
  ladders: Ladder[];
  stats: UserStats;
  onClaim: (ladderId: string, stepId: string) => void;
  onClaimAll?: (ladderId: string) => void;
  isHighlighted?: boolean;
}

export const GamificationLadders: React.FC<GamificationLaddersProps> = ({ ladders, stats, onClaim, onClaimAll, isHighlighted = false }) => {
  const [activeLadderId, setActiveLadderId] = useState(ladders[0].id);
  const [showInfo, setShowInfo] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeLadder = ladders.find(l => l.id === activeLadderId) || ladders[0];
  const currentValue = stats[activeLadder.metric];

  // Logic to determine if this ladder has a reset timer
  const hasTimer = activeLadderId === 'l_protein' || activeLadderId === 'l_fibre';

  // Calculate Unclaimed Rewards for ACTIVE ladder (Milestones only)
  const unclaimedSteps = activeLadder.steps.filter(s => s.isMilestone && currentValue >= s.threshold && !s.isClaimed);
  const unclaimedCount = unclaimedSteps.length;

  useEffect(() => {
    // Fake season end date (12 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 12);
    
    const timer = setInterval(() => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      // Find index of first UNCLAIMED MILESTONE reward if exists
      let targetIndex = activeLadder.steps.findIndex(s => s.isMilestone && currentValue >= s.threshold && !s.isClaimed);
      
      if (targetIndex === -1) {
         // No unclaimed rewards, scroll to current progress
         const firstActiveIndex = activeLadder.steps.findIndex(s => currentValue < s.threshold);
         targetIndex = firstActiveIndex !== -1 ? Math.max(0, firstActiveIndex - 1) : activeLadder.steps.length - 1;
      } else {
         // If there are unclaimed rewards, try to show the one before it to give context
         targetIndex = Math.max(0, targetIndex - 1);
      }
      
      const stepElement = scrollContainerRef.current.children[0].children[targetIndex] as HTMLElement;
      
      if (stepElement) {
        setTimeout(() => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({
                top: stepElement.offsetTop - 150,
                behavior: 'smooth'
                });
            }
        }, 300);
      }
    }
  }, [activeLadderId, currentValue, activeLadder.steps]);

  const formatThreshold = (value: number, unit: string) => {
    if (unit === 'Day') return `Day ${value}`;
    if (value >= 1000 && unit === 'g') return `${(value / 1000).toFixed(1)}kg`;
    return `${value}${unit}`;
  };

  return (
    <>
      <div className={`bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col h-[600px] shadow-lg relative transition-all duration-300 ${isHighlighted ? 'z-[130] ring-4 ring-brand-red/30' : ''}`}>
        {/* Ladder Selector */}
        <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100 bg-gray-50 flex-shrink-0 z-10">
          {ladders.map((ladder) => {
            const isActive = activeLadderId === ladder.id;
            // Check if this specific ladder has unclaimed rewards (Milestones only)
            const ladderUnclaimedCount = ladder.steps.filter(s => s.isMilestone && stats[ladder.metric] >= s.threshold && !s.isClaimed).length;

            return (
              <button
                key={ladder.id}
                onClick={() => setActiveLadderId(ladder.id)}
                className={`
                  flex-1 min-w-[100px] py-4 px-4 flex flex-col items-center justify-center gap-1.5 transition-colors relative
                  ${isActive ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
                `}
              >
                <div className="relative">
                    <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100 grayscale opacity-60'}`}>{ladder.icon}</span>
                    {ladderUnclaimedCount > 0 && (
                        <div className="absolute -top-1 -right-2 w-4 h-4 bg-brand-red text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                            {ladderUnclaimedCount}
                        </div>
                    )}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                  {ladder.title.split(' ')[0]}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="activeLadder"
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: ladder.color }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Header Info */}
        <div className="p-5 bg-white border-b border-gray-100 flex-shrink-0 relative overflow-hidden">
          {hasTimer && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-0 right-0 bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl flex items-center gap-1.5 z-20 shadow-sm"
              >
                  <Clock size={12} className="text-brand-red animate-pulse" />
                  Season Ends in <span className="font-mono text-brand-yellow min-w-[90px] text-center">{timeLeft}</span>
              </motion.div>
          )}
          
          <div className="flex items-start justify-between relative z-10 mt-2">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">
                  {activeLadder.title}
                </h3>
                <button 
                  onClick={() => setShowInfo(true)}
                  className="text-gray-300 hover:text-gray-500 transition-colors"
                >
                  <Info size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-500 max-w-[220px] leading-relaxed font-medium">{activeLadder.description}</p>
            </div>
            <div className="bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 text-center min-w-[80px]">
              <span className="text-[9px] text-gray-400 uppercase block font-bold mb-1 tracking-wider">Current</span>
              <span className="text-2xl font-black leading-none" style={{ color: activeLadder.color }}>
                {activeLadder.unit === 'Day' ? currentValue : `${currentValue}${activeLadder.unit}`}
              </span>
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto relative p-6 bg-white scroll-smooth"
        >
          <div className="relative pl-4 space-y-6 pb-24">
            {/* Progress Line */}
            <div className="absolute top-0 bottom-0 left-[27px] w-0.5 bg-gray-100 rounded-full" />

            {activeLadder.steps.map((step, index) => {
              const isUnlocked = currentValue >= step.threshold;
              const isNext = !isUnlocked && (index === 0 || currentValue >= activeLadder.steps[index - 1].threshold);
              const isLocked = !isUnlocked && !isNext;
              const isMilestone = step.isMilestone; 

              if (!isMilestone) {
                return (
                  <motion.div 
                    key={step.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`relative flex items-center gap-6 py-1 ${isLocked ? 'opacity-30' : 'opacity-100'}`}
                  >
                    {isUnlocked && (
                       <div 
                         className="absolute left-[27px] -top-8 bottom-0 w-0.5 z-0"
                         style={{ backgroundColor: activeLadder.color }}
                       />
                    )}

                    <div 
                      className={`
                        w-1.5 h-1.5 rounded-full z-10 ml-[24px]
                        ${isUnlocked ? 'bg-white ring-2 ring-offset-2' : 'bg-gray-300'}
                      `}
                      style={{ ringColor: isUnlocked ? activeLadder.color : undefined }}
                    />
                    <span className="text-xs font-mono font-medium text-gray-400">
                      {formatThreshold(step.threshold, activeLadder.unit)}
                    </span>
                  </motion.div>
                );
              }

              return (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }} 
                  className={`relative flex items-center gap-4 ${isLocked ? 'opacity-40 grayscale' : 'opacity-100'}`}
                >
                  {isUnlocked && (
                       <div 
                         className="absolute left-[27px] -top-8 bottom-0 w-0.5 z-0"
                         style={{ backgroundColor: activeLadder.color }}
                       />
                  )}

                  <div 
                    className={`
                      w-14 h-14 rounded-full border-4 z-10 flex items-center justify-center shadow-lg transition-all flex-shrink-0 bg-white
                      ${isUnlocked 
                        ? 'shadow-md scale-105' 
                        : 'border-gray-100'
                      }
                    `}
                    style={{ borderColor: isUnlocked ? activeLadder.color : '#f1f5f9' }}
                  >
                    {step.isClaimed ? (
                      <Check size={24} style={{ color: activeLadder.color }} strokeWidth={4} />
                    ) : isUnlocked ? (
                      <Gift size={24} className="animate-bounce" style={{ color: activeLadder.color }} />
                    ) : (
                      <span className="text-sm font-bold text-gray-300 text-center leading-none">
                         {step.threshold >= 1000 && activeLadder.unit === 'g' 
                           ? `${(step.threshold/1000).toFixed(1)}k` 
                           : step.threshold}
                         <br/>
                         <span className="text-[9px]">{activeLadder.unit}</span>
                      </span>
                    )}
                  </div>

                  <div 
                    className={`
                      flex-1 p-4 rounded-2xl border relative overflow-hidden transition-all
                      ${isUnlocked && !step.isClaimed
                        ? 'bg-gradient-to-r from-gray-50 to-white border-gray-200 shadow-md transform scale-[1.02]' 
                        : 'bg-white border-gray-100'
                      }
                    `}
                  >
                    <div className="flex justify-between items-center relative z-10">
                       <div>
                         <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                           Milestone
                         </div>
                         <div className="text-sm font-black text-gray-800 flex items-center gap-2">
                           {step.rewardDescription}
                         </div>
                       </div>
                       
                       <div className="ml-2">
                          {step.isClaimed ? (
                             <div className="px-3 py-1 rounded-full bg-gray-100 text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                               Claimed
                             </div>
                          ) : isUnlocked ? (
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onClaim(activeLadder.id, step.id)}
                              className="text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg flex items-center gap-1 hover:brightness-110 transition-all"
                              style={{ backgroundColor: activeLadder.color }}
                            >
                               <span>CLAIM</span>
                               <Sparkles size={12} fill="currentColor" />
                            </motion.button>
                          ) : (
                            <div className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-gray-50">
                               <Lock size={12} className="text-gray-300" />
                            </div>
                          )}
                       </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CLAIM ALL FLOATING ACTION BUTTON */}
        <AnimatePresence>
            {unclaimedCount > 1 && onClaimAll && (
                <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30"
                >
                    <button 
                        onClick={() => onClaimAll(activeLadderId)}
                        className="bg-gray-900 text-white pl-5 pr-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border-2 border-white/20"
                    >
                        <ListChecks size={20} className="text-brand-yellow" />
                        <span>Claim All ({unclaimedCount})</span>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      <InfoModal 
        isVisible={showInfo} 
        onClose={() => setShowInfo(false)}
        title={activeLadder.infoTitle}
        description={activeLadder.infoDescription}
      />
    </>
  );
};
