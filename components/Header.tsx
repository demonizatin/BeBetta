import React from 'react';
import { Flame, Shield, Coins, Crown } from 'lucide-react';
import { MembershipTier } from '../types';

interface HeaderProps {
  streak: number;
  coins: number;
  tier: MembershipTier;
  onStreakClick?: () => void;
  onProfileClick?: () => void;
  isHighlighted?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ streak, coins, tier, onStreakClick, onProfileClick, isHighlighted = false }) => {
  const getTheme = () => {
    switch (tier) {
      case 'PLATINUM':
        return 'bg-gray-900 text-white border-gray-800';
      case 'GOLD':
        return 'bg-gradient-to-r from-yellow-50 to-white border-yellow-200';
      default:
        return 'bg-white/95 border-gray-100';
    }
  };

  const themeClass = getTheme();
  const isPlatinum = tier === 'PLATINUM';

  return (
    <header className={`flex items-center justify-between py-4 px-4 sticky top-0 transition-all duration-300 ${themeClass} ${isHighlighted ? 'z-[120] relative shadow-2xl ring-4 ring-brand-red/30 rounded-b-2xl' : 'z-50 backdrop-blur-sm border-b shadow-sm'}`}>
      <div className="flex items-center gap-3" onClick={onProfileClick}>
        <div className="relative cursor-pointer">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full p-[2px] ${tier === 'PLATINUM' ? 'bg-gradient-to-tr from-gray-400 to-white' : tier === 'GOLD' ? 'bg-gradient-to-tr from-yellow-400 to-yellow-600' : 'bg-gradient-to-tr from-brand-red to-orange-500'}`}>
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" 
              alt="Avatar" 
              className="w-full h-full rounded-full object-cover border-2 border-white"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
            {tier === 'FREE' ? (
                <div className="bg-brand-red text-white text-[8px] font-bold px-1.5 rounded-full">PRO</div>
            ) : tier === 'GOLD' ? (
                <div className="bg-yellow-500 text-white text-[8px] font-bold px-1.5 rounded-full flex items-center gap-0.5"><Crown size={8} fill="currentColor"/> GOLD</div>
            ) : (
                <div className="bg-gray-800 text-white text-[8px] font-bold px-1.5 rounded-full flex items-center gap-0.5"><Crown size={8} fill="currentColor"/> PLAT</div>
            )}
          </div>
        </div>
        <div className="flex flex-col cursor-pointer">
          <h1 className={`text-sm md:text-base font-bold ${isPlatinum ? 'text-white' : 'text-gray-900'}`}>CyberAthlete_99</h1>
          <div className={`flex items-center gap-1 text-[10px] ${isPlatinum ? 'text-gray-400' : 'text-gray-500'}`}>
             <Shield size={10} className={isPlatinum ? 'text-gray-300' : 'text-brand-blue'} /> Season 4
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm border ${isPlatinum ? 'bg-gray-800 border-gray-700' : 'bg-yellow-50 border-yellow-200'}`}>
            <Coins size={14} className="text-yellow-500" />
            <span className={`font-bold text-xs ${isPlatinum ? 'text-white' : 'text-gray-900'}`}>{coins} FC</span>
        </div>
        <button 
          onClick={onStreakClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-sm border ${isPlatinum ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-orange-50 border-orange-200 hover:bg-orange-100'}`}
        >
          <Flame size={14} className="text-orange-500 animate-pulse-fast" />
          <span className={`font-bold text-xs ${isPlatinum ? 'text-white' : 'text-gray-900'}`}>{streak}</span>
        </button>
      </div>
    </header>
  );
};