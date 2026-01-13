
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Circle, Clock } from 'lucide-react';
import { Quest } from '../types';

interface QuestListProps {
  quests: Quest[];
  isHighlighted?: boolean;
  id?: string;
}

export const QuestList: React.FC<QuestListProps> = ({ quests, isHighlighted = false, id }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Calculate time until next midnight
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id={id} className={`mb-8 transition-all duration-300 ${isHighlighted ? 'z-[130] relative bg-white p-2 -m-2 rounded-2xl shadow-2xl ring-4 ring-brand-red/30' : 'relative z-10'}`}>
      <div className="flex items-center justify-between mb-4 px-2 pt-2">
        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
          Today's Bounties
        </h2>
        <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
          <Clock size={12} /> {timeLeft}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quests.map((quest) => (
          <motion.div
            key={quest.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: quest.isCompleted ? 0.6 : 1, 
              y: 0,
              scale: quest.isCompleted ? 0.98 : 1
            }}
            className={`
              relative overflow-hidden rounded-xl p-4 border transition-colors shadow-sm
              ${quest.isCompleted 
                ? 'bg-gray-50 border-green-200' 
                : 'bg-white border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl select-none pointer-events-none grayscale">
              {quest.icon}
            </div>

            <div className="flex items-start justify-between relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{quest.icon}</span>
                  <h3 className={`font-bold text-sm ${quest.isCompleted ? 'text-green-600 line-through' : 'text-gray-800'}`}>
                    {quest.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 mt-2">
                   <span className={`text-xs font-bold px-2 py-0.5 rounded ${quest.isCompleted ? 'bg-gray-200 text-gray-500' : 'bg-brand-red/10 text-brand-red border border-brand-red/20'}`}>
                    +{quest.xpReward} XP
                  </span>
                </div>
              </div>
              
              <div className="ml-3 mt-1">
                {quest.isCompleted ? (
                  <div className="bg-green-100 p-1.5 rounded-full text-green-600">
                    <Check size={18} strokeWidth={3} />
                  </div>
                ) : (
                  <div className="text-gray-300">
                    <Circle size={24} />
                  </div>
                )}
              </div>
            </div>
            
            {!quest.isCompleted && (
               <div className="absolute bottom-0 left-0 h-1 bg-brand-red w-1/3 rounded-r-full" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
