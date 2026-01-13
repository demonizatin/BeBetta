import React from 'react';
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { ViewState } from '../types';
import { motion } from 'framer-motion';

interface BottomNavProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  cartCount: number;
  highlightTab?: ViewState;
  notifications?: {
      PROFILE: boolean;
      STORE: boolean;
  };
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView, cartCount, highlightTab, notifications }) => {
  const tabs: { id: ViewState; icon: React.ReactNode; label: string }[] = [
    { id: 'MENU', icon: <Home size={20} />, label: 'Food' },
    { id: 'STORE', icon: <ShoppingBag size={20} />, label: 'Rewards' },
    { id: 'CART', icon: <ShoppingCart size={20} />, label: 'Cart' },
    { id: 'PROFILE', icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe transition-all duration-300 ${highlightTab ? 'z-[120]' : 'z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]'}`}>
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = currentView === tab.id;
          const isHighlighted = highlightTab === tab.id;
          const hasNotification = notifications && notifications[tab.id as keyof typeof notifications];
          
          return (
            <button
              key={tab.id}
              onClick={() => onChangeView(tab.id)}
              className={`relative flex flex-col items-center justify-center w-full h-full transition-all ${isHighlighted ? 'scale-110 bg-brand-red/5' : ''}`}
            >
              <div className={`transition-colors duration-200 ${isActive ? 'text-brand-red' : 'text-gray-400'}`}>
                {tab.icon}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                {tab.label}
              </span>
              
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute top-0 w-8 h-1 bg-brand-red rounded-b-full shadow-sm"
                />
              )}

              {/* Notification Badge */}
              {hasNotification && !isActive && (
                 <div className="absolute top-2 right-6 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
              )}

              {tab.id === 'CART' && cartCount > 0 && (
                <div className="absolute top-2 right-6 bg-brand-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};