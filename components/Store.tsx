
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Lock, CheckCircle, Search, SlidersHorizontal, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';
import { StoreItem, UserState } from '../types';

interface StoreProps {
  items: StoreItem[];
  user: UserState;
  onPurchase: (item: StoreItem) => void;
  isHighlighted?: boolean;
}

type SortOption = 'RELEVANT' | 'PRICE_LOW' | 'PRICE_HIGH';
type FilterOption = 'ALL' | 'DIGITAL' | 'PHYSICAL';

export const Store: React.FC<StoreProps> = ({ items, user, onPurchase, isHighlighted = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('RELEVANT');
  const [filterOption, setFilterOption] = useState<FilterOption>('ALL');
  const [visibleCount, setVisibleCount] = useState(20);

  const processedItems = useMemo(() => {
    let result = [...items];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i => 
        i.name.toLowerCase().includes(q) || 
        i.description.toLowerCase().includes(q)
      );
    }
    if (filterOption !== 'ALL') {
      result = result.filter(i => i.type === filterOption);
    }
    if (sortOption === 'PRICE_LOW') {
      result.sort((a, b) => a.cost - b.cost);
    } else if (sortOption === 'PRICE_HIGH') {
      result.sort((a, b) => b.cost - a.cost);
    }
    return result;
  }, [items, searchQuery, sortOption, filterOption]);

  const visibleItems = processedItems.slice(0, visibleCount);

  return (
    <div className={`px-4 pb-24 pt-4 transition-all duration-300 ${isHighlighted ? 'relative z-[130]' : ''}`}>
      
      {/* Balance Card */}
      <div className={`bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 mb-6 text-center relative overflow-hidden shadow-xl ${isHighlighted ? 'ring-4 ring-brand-green/40 scale-105 transition-transform' : ''}`}>
        <div className="relative z-10">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Your Balance</p>
          <h2 className="text-4xl font-black text-white drop-shadow-sm">{user.coins} <span className="text-2xl text-brand-yellow">FC</span></h2>
          <p className="text-xs text-gray-400 mt-2">Earn more FC by ordering food!</p>
        </div>
      </div>

      {/* Controls */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 border-b border-gray-100 mb-4">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search rewards..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 border border-transparent rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
          />
        </div>

        <div className="flex items-center justify-between gap-2">
           <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {['ALL', 'DIGITAL', 'PHYSICAL'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterOption(f as FilterOption)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border transition-all ${
                    filterOption === f 
                    ? 'bg-brand-red text-white border-brand-red' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {f}
                </button>
              ))}
           </div>

           <div className="relative group">
              <button className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 shadow-sm">
                <SlidersHorizontal size={14} /> 
                {sortOption === 'RELEVANT' ? 'Sort' : sortOption === 'PRICE_LOW' ? 'Low-High' : 'High-Low'}
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden hidden group-hover:block group-focus-within:block z-50">
                 <button onClick={() => setSortOption('RELEVANT')} className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-gray-700">Relevant</button>
                 <button onClick={() => setSortOption('PRICE_LOW')} className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-gray-700 flex items-center justify-between">Price <ArrowDownWideNarrow size={12}/></button>
                 <button onClick={() => setSortOption('PRICE_HIGH')} className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-gray-700 flex items-center justify-between">Price <ArrowUpNarrowWide size={12}/></button>
              </div>
           </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
         <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
           <ShoppingBag size={18} className="text-brand-red" /> Marketplace
         </h3>
         <span className="text-xs text-gray-500 font-mono">{processedItems.length} Items</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence>
        {visibleItems.map((item, index) => {
          const canAfford = user.coins >= item.cost;
          const isOwned = user.inventory.includes(item.id);
          // Highlight first affordable item in tutorial mode
          const isTutorialTarget = isHighlighted && canAfford && !isOwned && index === 0;
          
          return (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                  opacity: 1, 
                  scale: isTutorialTarget ? 1.05 : 1,
                  boxShadow: isTutorialTarget ? "0 0 20px rgba(34, 197, 94, 0.4)" : "none",
                  borderColor: isTutorialTarget ? "#22c55e" : "#e5e7eb"
              }}
              layout
              className={`bg-white border rounded-xl p-3 flex flex-col relative shadow-sm hover:shadow-md transition-all ${isTutorialTarget ? 'z-[140] ring-4 ring-green-500/20' : 'border-gray-200'}`}
            >
              <div className="absolute top-2 left-2 z-10">
                 {item.type === 'DIGITAL' 
                   ? <span className="bg-blue-50 text-blue-600 text-[9px] px-1.5 py-0.5 rounded font-bold border border-blue-100">DIGITAL</span> 
                   : <span className="bg-orange-50 text-orange-600 text-[9px] px-1.5 py-0.5 rounded font-bold border border-orange-100">PHYSICAL</span>
                 }
              </div>

              <div className="aspect-square bg-gray-50 rounded-lg mb-3 overflow-hidden p-2 flex items-center justify-center">
                <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
              </div>
              
              <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1 line-clamp-2 min-h-[2.5em]">{item.name}</h4>
              <p className="text-[10px] text-gray-500 mb-3 flex-1 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between mt-auto">
                 <span className={`font-bold font-mono text-sm ${canAfford ? 'text-gray-900' : 'text-gray-400'}`}>
                   {item.cost} FC
                 </span>
                 
                 {isOwned ? (
                    <span className="text-brand-green text-xs font-bold flex items-center gap-1">
                      <CheckCircle size={14} /> Owned
                    </span>
                 ) : (
                   <button
                    disabled={!canAfford}
                    onClick={() => onPurchase(item)}
                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                      ${canAfford 
                        ? 'bg-brand-red text-white hover:bg-brand-redDark shadow-md shadow-red-200' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                      ${isTutorialTarget ? 'animate-pulse bg-green-600 hover:bg-green-700 shadow-green-300' : ''}
                    `}
                   >
                     {canAfford ? 'GET' : <Lock size={12} />}
                   </button>
                 )}
              </div>
            </motion.div>
          );
        })}
        </AnimatePresence>
      </div>

      {visibleCount < processedItems.length && (
         <button 
           onClick={() => setVisibleCount(prev => prev + 20)}
           className="w-full mt-8 bg-white hover:bg-gray-50 text-gray-600 py-3 rounded-xl font-bold text-sm transition-colors border border-gray-200 shadow-sm"
         >
           Load More Rewards
         </button>
      )}
    </div>
  );
};
