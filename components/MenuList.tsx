import React, { useState, useMemo, useRef } from 'react';
import { Star, Filter, Search, Zap } from 'lucide-react';
import { MenuItem, QuestType } from '../types';

interface MenuListProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  onItemClick: (item: MenuItem) => void;
  highlightItemIndex?: number;
  id?: string;
}

export const MenuList: React.FC<MenuListProps> = ({ items, onAddToCart, onItemClick, highlightItemIndex = -1, id }) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'VEG' | 'NONVEG'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categoryRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  const categorizedItems = useMemo(() => {
    let filtered = items;
    
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }

    if (activeFilter === 'VEG') filtered = filtered.filter(i => i.isVeg);
    if (activeFilter === 'NONVEG') filtered = filtered.filter(i => !i.isVeg);

    const groups: {[key: string]: MenuItem[]} = {
      'Recommended': [],
      'Biryani': [],
      'Bowls': [],
      'Burgers': [],
      'Pizzas': [],
      'Indian': [],
      'Healthy': [],
    };

    filtered.forEach(item => {
      if (item.rating >= 4.5) groups['Recommended'].push(item);
      
      if (item.name.includes('Biryani')) groups['Biryani'].push(item);
      else if (item.name.includes('Bowl') || item.name.includes('Salad')) groups['Bowls'].push(item);
      else if (item.name.includes('Burger')) groups['Burgers'].push(item);
      else if (item.name.includes('Pizza')) groups['Pizzas'].push(item);
      else if (item.tags.includes(QuestType.INDIAN)) groups['Indian'].push(item);
      else if (item.tags.includes(QuestType.HEALTHY)) groups['Healthy'].push(item);
    });

    Object.keys(groups).forEach(key => {
        if (groups[key].length === 0) delete groups[key];
    });

    return groups;
  }, [items, activeFilter, searchQuery]);

  const categories = Object.keys(categorizedItems);

  const scrollToCategory = (cat: string) => {
    const element = categoryRefs.current[cat];
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 180;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Helper to check if global index matches
  let globalIndexCounter = 0;

  return (
    <div id={id} className="pb-24">
      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text"
                placeholder="Search for dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
        </div>
      </div>

      {/* Sticky Filters Header */}
      <div className="sticky top-16 z-30 bg-white py-3 border-b border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
         <div className="flex items-center gap-3 px-4 overflow-x-auto scrollbar-hide">
            <button className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-xs text-gray-600 whitespace-nowrap shadow-sm">
                <Filter size={12} /> Sort
            </button>
            
            <button 
              onClick={() => setActiveFilter(activeFilter === 'VEG' ? 'ALL' : 'VEG')}
              className={`flex items-center gap-1 border rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${activeFilter === 'VEG' ? 'bg-green-50 border-green-600 text-green-700' : 'bg-white border-gray-200 text-gray-500'}`}
            >
                Veg
            </button>

             <button 
              onClick={() => setActiveFilter(activeFilter === 'NONVEG' ? 'ALL' : 'NONVEG')}
              className={`flex items-center gap-1 border rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${activeFilter === 'NONVEG' ? 'bg-red-50 border-red-600 text-red-700' : 'bg-white border-gray-200 text-gray-500'}`}
            >
                Non-Veg
            </button>

            <div className="w-[1px] h-5 bg-gray-300 mx-1 flex-shrink-0" />

            {/* Category Anchors */}
            {categories.map(cat => (
               <button
                 key={cat}
                 onClick={() => scrollToCategory(cat)}
                 className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 rounded-lg whitespace-nowrap hover:bg-gray-100 border border-transparent"
               >
                 {cat}
               </button>
            ))}
         </div>
      </div>

      <div className="pt-2">
        {categories.map((cat) => (
          <div key={cat} ref={el => categoryRefs.current[cat] = el}>
            <h2 className="text-lg font-black text-gray-900 my-6 px-4 flex items-center gap-2">
               {cat} <span className="text-xs font-normal text-gray-400">({categorizedItems[cat].length})</span>
            </h2>
            
            <div className="">
              {categorizedItems[cat].map((item) => {
                const isHighlighted = globalIndexCounter === highlightItemIndex;
                globalIndexCounter++;

                return (
                  <div
                    key={item.id}
                    onClick={() => onItemClick(item)}
                    className={`flex justify-between p-4 bg-white border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-all duration-300 relative ${isHighlighted ? 'z-[80] shadow-2xl scale-[1.02] rounded-xl ring-4 ring-brand-red/30 my-2' : 'z-0'}`}
                  >
                    {/* LEFT: INFO */}
                    <div className="flex-1 pr-4">
                        {/* Veg/NonVeg Icon */}
                        <div className={`border ${item.isVeg ? 'border-green-600' : 'border-red-600'} w-4 h-4 p-[2px] flex items-center justify-center rounded-[3px] mb-2`}>
                            <div className={`w-full h-full rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                        </div>
                        
                        <h3 className="font-bold text-gray-800 text-base mb-1 leading-snug">{item.name}</h3>
                        
                        {/* Rating Badge */}
                        <div className="flex items-center gap-2 mb-2">
                            {item.rating > 0 && (
                              <div className="bg-brand-green/10 border border-brand-green/20 rounded-[4px] px-1.5 py-[1px] flex items-center gap-1">
                                  <div className="flex items-center gap-0.5">
                                      {[1,2,3,4,5].map(star => (
                                          <Star 
                                              key={star} 
                                              size={8} 
                                              fill={star <= Math.round(item.rating) ? "#24963f" : "#e2e8f0"} 
                                              className={star <= Math.round(item.rating) ? "text-brand-green" : "text-gray-200"}
                                              strokeWidth={0}
                                          />
                                      ))}
                                  </div>
                              </div>
                            )}
                            <span className="text-[10px] text-gray-500 font-medium">{item.votes} votes</span>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                           <span className="font-medium text-gray-900 text-sm">₹{item.price}</span>
                           {item.xpValue > 0 && (
                              <span className="text-[10px] font-bold text-brand-yellow flex items-center gap-0.5 bg-yellow-50 px-1 rounded">
                                  <Zap size={10} fill="currentColor" /> {item.xpValue} XP
                              </span>
                           )}
                        </div>

                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>

                    {/* RIGHT: IMAGE & ADD */}
                    <div className="relative w-32 h-32 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover rounded-xl shadow-sm"
                        />
                        <button 
                           onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
                           className={`absolute -bottom-3 left-1/2 -translate-x-1/2 font-bold px-8 py-2 rounded-lg shadow-md border border-gray-200 text-sm uppercase tracking-wide active:scale-95 transition-transform ${isHighlighted ? 'bg-brand-red text-white animate-pulse z-[90]' : 'bg-white text-brand-red'}`}
                        >
                           ADD
                        </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Divider between categories */}
            <div className="h-3 bg-gray-100 w-full border-t border-b border-gray-200" />
          </div>
        ))}

        {Object.keys(categorizedItems).length === 0 && (
           <div className="text-center py-20 text-gray-500">
              No items match your filters.
           </div>
        )}
      </div>
    </div>
  );
};