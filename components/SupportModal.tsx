import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, HelpCircle, ChevronRight, Phone, Mail } from 'lucide-react';

interface SupportModalProps {
  isVisible: boolean;
  onClose: () => void;
  onStartChat: () => void;
}

const FAQS = [
  { q: "Where is my order?", a: "You can track your order in real-time from the Profile tab under 'Orders'." },
  { q: "How do I earn XP?", a: "Earn XP by ordering healthy food, completing daily quests, and maintaining streaks." },
  { q: "My payment failed", a: "Any deducted amount will be refunded within 3-5 business days." },
  { q: "Food quality issue", a: "We take this seriously. Please chat with us immediately for a resolution." },
];

export const SupportModal: React.FC<SupportModalProps> = ({ isVisible, onClose, onStartChat }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center pointer-events-none">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 pointer-events-auto shadow-2xl relative max-h-[80vh] overflow-y-auto"
          >
            {/* Handle Bar for mobile feel */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" />

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Help Center</h2>
                <p className="text-sm text-gray-500">We're here to help you.</p>
              </div>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 mb-8">
               <button 
                 onClick={onStartChat}
                 className="flex flex-col items-center justify-center gap-2 bg-brand-red text-white p-4 rounded-xl shadow-lg shadow-red-200 hover:scale-[1.02] transition-transform"
               >
                  <MessageCircle size={28} />
                  <span className="font-bold text-sm">Live Chat</span>
               </button>
               <button className="flex flex-col items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <Phone size={28} className="text-gray-400" />
                  <span className="font-bold text-sm">Call Us</span>
               </button>
            </div>

            {/* Recent Order Context */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
               <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase">Recent Order</h3>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">DELIVERED</span>
               </div>
               <div className="flex gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                     <span className="text-lg">🍲</span>
                  </div>
                  <div>
                     <p className="text-sm font-bold text-gray-800">Muscle Butter Chicken</p>
                     <p className="text-xs text-gray-500">Today, 1:24 PM</p>
                  </div>
               </div>
               <button className="w-full mt-3 text-xs font-bold text-brand-red border border-brand-red/20 py-2 rounded-lg bg-white hover:bg-red-50">
                  Report Issue with this Order
               </button>
            </div>

            {/* FAQs */}
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
               <HelpCircle size={18} className="text-gray-400" /> Common Questions
            </h3>
            <div className="space-y-2">
               {FAQS.map((faq, i) => (
                 <div key={i} className="group border border-gray-100 rounded-xl p-4 hover:border-gray-300 transition-colors cursor-pointer bg-white">
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-semibold text-gray-700">{faq.q}</span>
                       <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                    </div>
                 </div>
               ))}
            </div>

            <div className="mt-8 text-center">
               <p className="text-xs text-gray-400">
                  Still need help? Email us at <a href="#" className="text-brand-blue underline">support@bettafuel.com</a>
               </p>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};