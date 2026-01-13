import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Save, Ruler, Weight, User, Activity, Target, Calculator } from 'lucide-react';
import { PhysicalStats } from '../types';

interface PhysicalStatsCardProps {
  stats: PhysicalStats;
  onUpdate: (newStats: PhysicalStats) => void;
}

export const PhysicalStatsCard: React.FC<PhysicalStatsCardProps> = ({ stats, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PhysicalStats>(stats);

  const bmi = (stats.weight / ((stats.height / 100) ** 2)).toFixed(1);
  let bmiCategory = '';
  let bmiColor = '';
  const bmiNum = parseFloat(bmi);

  if (bmiNum < 18.5) { bmiCategory = 'Underweight'; bmiColor = 'text-blue-500'; }
  else if (bmiNum < 25) { bmiCategory = 'Normal'; bmiColor = 'text-green-500'; }
  else if (bmiNum < 30) { bmiCategory = 'Overweight'; bmiColor = 'text-yellow-500'; }
  else { bmiCategory = 'Obese'; bmiColor = 'text-red-500'; }

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleChange = (field: keyof PhysicalStats, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-5 mb-6 overflow-hidden relative">
       <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <Activity className="text-brand-red" size={20} /> My Physical Profile
          </h3>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`p-2 rounded-full transition-colors ${isEditing ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
             {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
          </button>
       </div>

       <AnimatePresence mode="wait">
         {!isEditing ? (
           <motion.div 
             key="view"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="grid grid-cols-2 gap-4"
           >
              {/* BMI Card */}
              <div className="col-span-2 bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-200 mb-2">
                 <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Your BMI</span>
                    <span className="text-3xl font-black text-gray-900">{bmi}</span>
                    <span className={`text-xs font-bold ${bmiColor}`}>{bmiCategory}</span>
                 </div>
                 <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center relative">
                    <Calculator size={24} className="text-gray-400" />
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                       <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className={bmiColor} strokeDasharray={`${Math.min(bmiNum * 3, 175)} 175`} strokeLinecap="round" />
                    </svg>
                 </div>
              </div>

              <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm flex flex-col items-center justify-center gap-1">
                 <Weight size={20} className="text-blue-500 mb-1" />
                 <span className="text-xs text-gray-400 font-bold">WEIGHT</span>
                 <span className="text-lg font-bold text-gray-800">{stats.weight} kg</span>
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm flex flex-col items-center justify-center gap-1">
                 <Ruler size={20} className="text-purple-500 mb-1" />
                 <span className="text-xs text-gray-400 font-bold">HEIGHT</span>
                 <span className="text-lg font-bold text-gray-800">{stats.height} cm</span>
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm flex flex-col items-center justify-center gap-1">
                 <Target size={20} className="text-red-500 mb-1" />
                 <span className="text-xs text-gray-400 font-bold">GOAL</span>
                 <span className="text-sm font-bold text-gray-800 text-center leading-tight">{stats.goal}</span>
              </div>
               <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm flex flex-col items-center justify-center gap-1">
                 <User size={20} className="text-green-500 mb-1" />
                 <span className="text-xs text-gray-400 font-bold">PROFILE</span>
                 <span className="text-sm font-bold text-gray-800">{stats.age} yrs / {stats.gender.charAt(0)}</span>
              </div>
           </motion.div>
         ) : (
            <motion.div 
             key="edit"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="space-y-4"
           >
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Weight (kg)</label>
                    <input 
                      type="number" 
                      value={formData.weight}
                      onChange={(e) => handleChange('weight', Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-bold focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Height (cm)</label>
                    <input 
                      type="number" 
                      value={formData.height}
                      onChange={(e) => handleChange('height', Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-bold focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Age</label>
                    <input 
                      type="number" 
                      value={formData.age}
                      onChange={(e) => handleChange('age', Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-bold focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Gender</label>
                    <select 
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-bold focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
                    >
                       <option>Male</option>
                       <option>Female</option>
                       <option>Other</option>
                    </select>
                 </div>
              </div>

              <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Current Goal</label>
                  <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-200">
                     {['Lose Weight', 'Maintain', 'Build Muscle'].map((g) => (
                        <button 
                           key={g}
                           onClick={() => handleChange('goal', g)}
                           className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-all ${formData.goal === g ? 'bg-white shadow-sm text-brand-red border border-gray-100' : 'text-gray-400'}`}
                        >
                           {g}
                        </button>
                     ))}
                  </div>
              </div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};