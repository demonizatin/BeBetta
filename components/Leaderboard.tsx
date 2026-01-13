
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, MapPin, Globe, Flame, Crown, Clock } from 'lucide-react';
import { LeaderboardUser } from '../types';
import { GLOBAL_LEADERBOARD, REGIONAL_LEADERBOARD } from '../constants';

interface LeaderboardProps {
    onCheer: (amount: number) => void;
    isHighlighted?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onCheer, isHighlighted = false }) => {
    const [view, setView] = useState<'GLOBAL' | 'REGIONAL'>('REGIONAL');
    const [cheeredUsers, setCheeredUsers] = useState<string[]>([]);
    const [timeLeft, setTimeLeft] = useState('');

    const data = view === 'GLOBAL' ? GLOBAL_LEADERBOARD : REGIONAL_LEADERBOARD;

    useEffect(() => {
        const updateTimer = () => {
          const now = new Date();
          const target = new Date();
          target.setDate(target.getDate() + 5); // 5 days remaining
          const diff = target.getTime() - now.getTime();
          
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        };
    
        updateTimer();
        const interval = setInterval(updateTimer, 60000); // Update every minute
        return () => clearInterval(interval);
      }, []);

    const handleCheer = (userId: string) => {
        if (cheeredUsers.includes(userId)) return;
        setCheeredUsers([...cheeredUsers, userId]);
        onCheer(1); // Give 1 XP
    };

    return (
        <div className={`transition-all duration-300 ${isHighlighted ? 'z-[130] relative bg-white rounded-2xl ring-4 ring-brand-red/30' : ''}`}>
            
            {/* Header Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-xl mb-4">
                <button
                    onClick={() => setView('REGIONAL')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${view === 'REGIONAL' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                >
                    <MapPin size={14} /> Hitech City
                </button>
                <button
                    onClick={() => setView('GLOBAL')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${view === 'GLOBAL' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                >
                    <Globe size={14} /> Global Elite
                </button>
            </div>

            {/* Top Reward Card */}
            <div className={`mb-6 p-4 rounded-xl text-white relative overflow-hidden ${view === 'GLOBAL' ? 'bg-gradient-to-r from-purple-900 to-indigo-900' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Trophy size={80} />
                </div>
                
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black uppercase italic">
                        {view === 'GLOBAL' ? 'Season 4 Champions' : 'Local Legends'}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] font-bold bg-black/20 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                        <Clock size={10} className="animate-pulse" /> {timeLeft}
                    </div>
                </div>

                <p className="text-xs opacity-90 mb-3 font-medium">Top 3 Players win:</p>
                <div className="flex gap-2">
                    {view === 'GLOBAL' ? (
                        <>
                            <span className="bg-white/20 px-2 py-1 rounded text-[10px] font-bold">🎮 PS5 Slim</span>
                            <span className="bg-white/20 px-2 py-1 rounded text-[10px] font-bold">💪 1yr Gym</span>
                        </>
                    ) : (
                        <>
                            <span className="bg-white/20 px-2 py-1 rounded text-[10px] font-bold">🍔 5 Free Meals</span>
                            <span className="bg-white/20 px-2 py-1 rounded text-[10px] font-bold">💰 2000 FC</span>
                        </>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="space-y-3 pb-8">
                {data.map((user, index) => {
                    const isTop3 = index < 3;
                    const isMe = user.id === 'u_me'; // Hardcoded check for demo
                    
                    return (
                        <motion.div 
                            key={user.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center p-3 rounded-xl border ${isMe ? 'bg-brand-red/5 border-brand-red/30' : 'bg-white border-gray-100'} shadow-sm`}
                        >
                            {/* Rank */}
                            <div className="w-8 flex-shrink-0 font-black text-gray-400 text-sm text-center">
                                {isTop3 ? (
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-slate-400' : 'bg-orange-400'}`}>
                                        {user.rank}
                                    </div>
                                ) : (
                                    <span>#{user.rank}</span>
                                )}
                            </div>

                            {/* Avatar */}
                            <div className="relative mr-3">
                                <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt={user.name} />
                                {user.tier === 'PLATINUM' && (
                                    <div className="absolute -bottom-1 -right-1 bg-slate-800 text-white rounded-full p-0.5 border border-white">
                                        <Crown size={8} />
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                                <div className="flex items-center gap-1">
                                    <span className={`text-sm font-bold ${isMe ? 'text-brand-red' : 'text-gray-900'}`}>{user.name}</span>
                                    {isMe && <span className="bg-brand-red text-white text-[8px] px-1 rounded font-bold">YOU</span>}
                                </div>
                                <div className="text-[10px] text-gray-500 font-medium flex items-center gap-2">
                                    <span>{user.xp.toLocaleString()} XP</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-0.5 text-orange-500">
                                        <Flame size={10} fill="currentColor" /> {user.streak}
                                    </span>
                                </div>
                            </div>

                            {/* Action */}
                            {!isMe && (
                                <button 
                                    onClick={() => handleCheer(user.id)}
                                    disabled={cheeredUsers.includes(user.id)}
                                    className={`
                                        flex flex-col items-center justify-center p-2 rounded-lg transition-all active:scale-95
                                        ${cheeredUsers.includes(user.id) ? 'bg-gray-100 text-gray-400' : 'bg-orange-50 text-orange-500 hover:bg-orange-100'}
                                    `}
                                >
                                    <Flame size={16} fill={cheeredUsers.includes(user.id) ? "none" : "currentColor"} />
                                    <span className="text-[9px] font-bold mt-0.5">
                                        {cheeredUsers.includes(user.id) ? 'Sent' : 'Cheer'}
                                    </span>
                                </button>
                            )}
                        </motion.div>
                    )
                })}
            </div>
            
            <div className="text-center text-[10px] text-gray-400 pb-4">
                Cheer players to earn +1 XP (Max 5/day)
            </div>
        </div>
    );
};
