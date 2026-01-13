import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Phone } from 'lucide-react';

interface ContactModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (email: string, phone: string) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isVisible, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email || !phone) {
      setError('Please fill in all fields to claim your reward.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    if (phone.length < 10) {
       setError('Please enter a valid phone number.');
       return;
    }
    onSubmit(email, phone);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Claim Reward</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Enter your details so we can send the reward voucher to your inbox and phone.
        </p>

        <div className="space-y-4 mb-6">
           <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-800 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                />
              </div>
           </div>

           <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-800 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                />
              </div>
           </div>
           
           {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full bg-brand-red text-white font-bold py-3.5 rounded-xl hover:bg-brand-redDark transition-colors shadow-lg shadow-red-500/20"
        >
          Confirm & Claim
        </button>
      </motion.div>
    </div>
  );
};