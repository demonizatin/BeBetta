import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Share2, Info, Leaf, Flame, Zap, Crown } from 'lucide-react';
import { MenuItem } from '../types';

interface ProductDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem) => void;
  onShare: (item: MenuItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ item, onClose, onAddToCart, onShare }) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-end justify-center pointer-events-none">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        />

        {/* Bottom Sheet Container */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white w-full max-w-lg rounded-t-3xl pointer-events-auto shadow-2xl relative h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto relative bg-white">
              {/* Header Image */}
              <div className="relative h-64 w-full shrink-0">
                 <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                 
                 <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-black/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/50 transition-colors z-20"
                 >
                    <X size={20} />
                 </button>

                 <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                       {item.isVeg ? (
                          <span className="bg-green-600 text-[10px] font-bold px-2 py-0.5 rounded text-white">VEG</span>
                       ) : (
                          <span className="bg-red-600 text-[10px] font-bold px-2 py-0.5 rounded text-white">NON-VEG</span>
                       )}
                       <span className="flex items-center gap-1 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded">
                          {item.rating.toFixed(1)} <Star size={10} fill="black" />
                       </span>
                    </div>
                    <h2 className="text-2xl font-black leading-tight">{item.name}</h2>
                 </div>
              </div>

              <div className="p-6">
                 {/* XP Boost Banner */}
                 <div className="flex items-center justify-between bg-brand-red/5 border border-brand-red/20 p-3 rounded-xl mb-6">
                    <div>
                        <div className="flex items-center gap-2 text-brand-red font-bold text-sm">
                            <Zap size={18} fill="currentColor" />
                            Earn {item.xpValue} XP
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                            Get <strong>{item.xpValue * 2} XP</strong> with <Crown size={10} className="text-slate-900" /> Platinum
                        </div>
                    </div>
                    <button 
                      onClick={() => onShare(item)}
                      className="text-xs bg-brand-red text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-red-600 transition-colors shadow-sm"
                    >
                       <Share2 size={12} /> Share (+10 XP)
                    </button>
                 </div>

                 <div className="mb-6">
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                 </div>

                 {/* Macros Chart */}
                 <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                       <Flame size={18} className="text-orange-500" /> Nutritional Info
                       <span className="text-xs font-normal text-gray-400 ml-auto">{item.calories} kcal</span>
                    </h3>
                    
                    <div className="space-y-4">
                       {/* Protein */}
                       <div>
                          <div className="flex justify-between text-xs mb-1 font-medium">
                             <span className="text-gray-600">Protein</span>
                             <span className="text-gray-900">{item.macros.protein}g</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${Math.min(item.macros.protein, 100)}%` }}
                               className="h-full bg-blue-500"
                             />
                          </div>
                       </div>
                       {/* Carbs */}
                       <div>
                          <div className="flex justify-between text-xs mb-1 font-medium">
                             <span className="text-gray-600">Carbs</span>
                             <span className="text-gray-900">{item.macros.carbs}g</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${Math.min(item.macros.carbs, 100)}%` }}
                               className="h-full bg-yellow-500"
                             />
                          </div>
                       </div>
                       {/* Fats */}
                       <div>
                          <div className="flex justify-between text-xs mb-1 font-medium">
                             <span className="text-gray-600">Fats</span>
                             <span className="text-gray-900">{item.macros.fats}g</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${Math.min(item.macros.fats, 100)}%` }}
                               className="h-full bg-red-500"
                             />
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Ingredients */}
                 <div className="mb-8">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                       <Leaf size={18} className="text-green-500" /> Ingredients
                    </h3>
                    <div className="flex flex-wrap gap-2">
                       {item.ingredients.map((ing, i) => (
                          <span key={i} className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full font-medium">
                             {ing}
                          </span>
                       ))}
                    </div>
                 </div>
              </div>
          </div>

          {/* Sticky Footer */}
          <div className="bg-white border-t border-gray-100 p-4 pb-safe flex items-center justify-between shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-20 shrink-0">
             <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-bold uppercase">Price</span>
                <span className="text-2xl font-black text-gray-900">₹{item.price}</span>
             </div>
             <button 
                onClick={() => { onAddToCart(item); onClose(); }}
                className="bg-brand-red text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
             >
                Add to Order
             </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};