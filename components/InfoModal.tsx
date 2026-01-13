
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';

interface InfoModalProps {
  isVisible: boolean;
  title: string;
  description: React.ReactNode;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isVisible, title, description, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[170] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl w-full max-w-sm relative z-10"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
               <Info size={24} />
            </div>

            <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
            
            <div className="text-slate-400 text-sm leading-relaxed">
              {description}
            </div>
            
            <button
              onClick={onClose}
              className="mt-6 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Got it
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
