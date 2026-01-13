
import React, { useState, useEffect } from 'react';
import { UserState, PhysicalStats } from '../types';
import { Shield, Activity, Calendar, Award, BarChart2, Crown, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GamificationLadders } from './GamificationLadders';
import { PhysicalStatsCard } from './PhysicalStatsCard';
import { Leaderboard } from './Leaderboard';

interface ProfileProps {
  user: UserState;
  defaultTab?: 'DASHBOARD' | 'TROPHY_ROAD' | 'LEADERBOARD';
  onClaimReward: (ladderId: string, stepId: string) => void;
  onClaimAll?: (ladderId: string) => void;
  onUpdateStats: (newStats: PhysicalStats) => void;
  onOpenMembership: () => void;
  onCheer?: (amount: number) => void;
  isHighlighted?: boolean;
  id?: string;
}

export const Profile: React.FC<ProfileProps> = ({ user, defaultTab = 'DASHBOARD', onClaimReward, onClaimAll, onUpdateStats, onOpenMembership, onCheer, isHighlighted = false, id }) => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'TROPHY_ROAD' | 'LEADERBOARD'>('DASHBOARD');

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  // Calculate unclaimed MILESTONES only
  const totalUnclaimedMilestones = user.ladders.reduce((acc, ladder) => {
    return acc + ladder.steps.filter(s => s.isMilestone && user.stats[ladder.metric] >= s.threshold && !s.isClaimed).length;
  }, 0);

  return (
    <div id={id} className="px-4 pb-24 pt-4 relative">
      <div className="flex flex-col items-center mb-6">
        <div className={`w-24 h-24 rounded-full p-[3px] mb-4 relative ${user.membershipTier === 'PLATINUM' ? 'bg-gradient-to-tr from-gray-300 to-white' : user.membershipTier === 'GOLD' ? 'bg-gradient-to-tr from-yellow-400 to-yellow-600' : 'bg-gradient-to-tr from-brand-red to-orange-500'}`}>
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" 
              alt="Avatar" 
              className="w-full h-full rounded-full object-cover border-4 border-white"
            />
            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full border border-gray-100 shadow-md">
               <Shield size={20} className={user.membershipTier === 'PLATINUM' ? 'text-gray-800' : 'text-brand-red'} />
            </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            CyberAthlete_99
            {user.membershipTier !== 'FREE' && (
                <Crown size={20} className={user.membershipTier === 'GOLD' ? 'text-yellow-500' : 'text-gray-700'} fill="currentColor" />
            )}
        </h2>
        <p className="text-gray-500 text-sm">Level {user.level} • {user.membershipTier} Member</p>

        <button 
            onClick={onOpenMembership}
            className="mt-4 px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-full shadow-lg active:scale-95 transition-transform"
        >
            Manage Membership
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-1 bg-gray-100 rounded-xl mb-6 overflow-x-auto">
         <button
           onClick={() => setActiveTab('DASHBOARD')}
           className={`flex-1 min-w-[80px] py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'DASHBOARD' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
         >
           <BarChart2 size={16} /> Stats
         </button>
         <button
           onClick={() => setActiveTab('TROPHY_ROAD')}
           className={`relative flex-1 min-w-[100px] py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'TROPHY_ROAD' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
         >
           <Award size={16} /> Trophy Road
           {totalUnclaimedMilestones > 0 && (
               <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full ring-1 ring-white" />
           )}
         </button>
         <button
           onClick={() => setActiveTab('LEADERBOARD')}
           className={`flex-1 min-w-[100px] py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'LEADERBOARD' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
         >
           <Trophy size={16} /> Leaderboard
         </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'DASHBOARD' ? (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* New Physical Stats Card */}
            <PhysicalStatsCard stats={user.physicalStats} onUpdate={onUpdateStats} />

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
                 <Activity className="text-brand-green mb-2" />
                 <span className="text-2xl font-black text-gray-900">{user.stats.totalProtein}g</span>
                 <span className="text-xs text-gray-500 uppercase tracking-wide">Protein Life</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
                 <Calendar className="text-orange-500 mb-2" />
                 <span className="text-2xl font-black text-gray-900">{user.stats.streak} Days</span>
                 <span className="text-xs text-gray-500 uppercase tracking-wide">Current Streak</span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-4">Season Badges</h3>
            <div className="grid grid-cols-3 gap-4">
               {[
                 { name: 'Early Bird', icon: '🌅', color: 'bg-yellow-50 text-yellow-600' },
                 { name: 'Keto King', icon: '🥑', color: 'bg-green-50 text-green-600' },
                 { name: 'Supporter', icon: '🤝', color: 'bg-blue-50 text-blue-600' },
               ].map((badge, i) => (
                 <motion.div 
                   key={i}
                   whileHover={{ scale: 1.05 }}
                   className={`aspect-square rounded-2xl ${badge.color} flex flex-col items-center justify-center gap-2 border border-black/5 cursor-pointer`}
                 >
                   <span className="text-3xl">{badge.icon}</span>
                   <span className="text-[10px] font-bold uppercase">{badge.name}</span>
                 </motion.div>
               ))}
            </div>

            <div className="mt-8 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
               <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-800">Next Rank: Elite</span>
                  <span className="text-xs text-brand-red font-mono">1200 / 5000 XP</span>
               </div>
               <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[24%] bg-brand-red" />
               </div>
               <p className="text-xs text-gray-500 mt-2">Unlock "Elite" to get 5% cashback on all orders.</p>
            </div>
          </motion.div>
        ) : activeTab === 'TROPHY_ROAD' ? (
          <motion.div
            key="trophy_road"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={isHighlighted ? 'z-[130] relative' : ''}
          >
            <GamificationLadders 
                ladders={user.ladders} 
                stats={user.stats} 
                onClaim={onClaimReward} 
                onClaimAll={onClaimAll}
                isHighlighted={isHighlighted}
            />
          </motion.div>
        ) : (
            <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={isHighlighted ? 'z-[130] relative' : ''}
            >
                <Leaderboard onCheer={onCheer || (() => {})} isHighlighted={isHighlighted} />
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
