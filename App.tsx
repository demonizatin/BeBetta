
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { Header } from './components/Header';
import { QuestList } from './components/QuestList';
import { MenuList } from './components/MenuList';
import { LevelUpOverlay } from './components/LevelUpOverlay';
import { Confetti } from './components/Confetti';
import { BottomNav } from './components/BottomNav';
import { Store } from './components/Store';
import { Checkout } from './components/Checkout';
import { Profile } from './components/Profile';
import { DailySpin } from './components/DailySpin';
import { ContactModal } from './components/ContactModal';
import { SupportModal } from './components/SupportModal'; 
import { ProductDetailModal } from './components/ProductDetailModal';
import { ScratchCardModal } from './components/ScratchCardModal';
import { SlotMachineModal } from './components/SlotMachineModal';
import { MembershipModal } from './components/MembershipModal';
import { TutorialOverlay } from './components/TutorialOverlay';
import { Toast } from './components/Toast';
import { INITIAL_USER_STATE, ZERO_USER_STATE, INITIAL_QUESTS, MENU_ITEMS, STORE_ITEMS } from './constants';
import { MenuItem, Quest, UserState, QuestType, ViewState, DeliveryMode, CartItem, PaymentMethod, StoreItem, PhysicalStats, MembershipTier, TutorialStep } from './types';
import { MapPin, Headphones, FastForward } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserState>(ZERO_USER_STATE);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [view, setView] = useState<ViewState>('MENU');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('DELIVERY');
  const [profileTab, setProfileTab] = useState<'DASHBOARD' | 'TROPHY_ROAD' | 'LEADERBOARD'>('DASHBOARD');
  
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDailySpin, setShowDailySpin] = useState(false);
  
  // Modals
  const [showContactModal, setShowContactModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [showSlotMachine, setShowSlotMachine] = useState(false);
  
  // Tutorial State
  const [tutorialStep, setTutorialStep] = useState<TutorialStep>('WELCOME');
  const [showSimulationButton, setShowSimulationButton] = useState(false);
  
  // Scratch Card Logic State (Kept for legacy or specific rewards, but Slot Machine is main post-checkout)
  const [scratchReward, setScratchReward] = useState<{type: 'XP' | 'COINS', amount: number}>({ type: 'XP', amount: 0 });
  const [scratchPotential, setScratchPotential] = useState(0);

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const [pendingContactReward, setPendingContactReward] = useState<{type: 'LADDER_ITEM' | 'STORE', data: any} | null>(null);

  // Notifications
  const unclaimedRewardsCount = user.ladders.reduce((acc, ladder) => {
    return acc + ladder.steps.filter(s => s.isMilestone && user.stats[ladder.metric] >= s.threshold && !s.isClaimed).length;
  }, 0);
  
  const canAffordStoreItem = STORE_ITEMS.some(item => user.coins >= item.cost);
  
  const notifications = {
      PROFILE: unclaimedRewardsCount > 0,
      STORE: canAffordStoreItem
  };

  // --- TUTORIAL & AUTO-SCROLL LOGIC ---
  useEffect(() => {
    // Helper to safely scroll to elements
    const safeScroll = (id: string, offset = 0) => {
        // Multiple timeouts to catch render updates
        [100, 300, 600].forEach(delay => {
             setTimeout(() => {
                const el = document.getElementById(id);
                if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY + offset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, delay);
        });
    };

    if (tutorialStep === 'HUD_INTRO') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tutorialStep === 'QUEST_INTRO') {
        safeScroll('quest-section', -140);
    } else if (tutorialStep === 'MENU_XP_INTRO') {
        setView('MENU'); // Force view
        safeScroll('menu-section', -120);
    } else if (tutorialStep === 'ORDER_GUIDE') {
        setView('MENU'); // Force view
        safeScroll('menu-section', -120);
    } else if (tutorialStep === 'CHECKOUT_GUIDE') {
        setView('CART'); // Force view
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 300);
    } else if (tutorialStep === 'STORE_INTRO') {
        setView('STORE');
    }
  }, [tutorialStep]);

  // Initial spin logic (FTUE)
  useEffect(() => {
    // Show spin for all new users (removed level > 1 check)
    if (!user.hasSpunDailyWheel && tutorialStep === 'NONE' && !showSimulationButton && tutorialStep !== 'WAITING_FOR_SPIN') {
      const timer = setTimeout(() => setShowDailySpin(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [user.hasSpunDailyWheel, tutorialStep, showSimulationButton]);

  // --- LEVEL UP MONITOR ---
  useEffect(() => {
    if (user.currentXP >= user.maxXP) {
       let cxp = user.currentXP;
       let mxp = user.maxXP;
       let lvl = user.level;
       let loops = 0;
       
       // Calculate cascading level ups
       while(cxp >= mxp && loops < 10) {
           cxp -= mxp;
           mxp = Math.floor(mxp * 1.2);
           lvl++;
           loops++;
       }

       if (loops > 0) {
           setUser(prev => ({
               ...prev,
               level: lvl,
               currentXP: cxp,
               maxXP: mxp,
               coins: prev.coins + (loops * 100) // 100 FC bonus per level
           }));
           setShowLevelUp(true);
           setShowConfetti(true);
           setTimeout(() => setShowConfetti(false), 3000);
       }
    }
  }, [user.currentXP, user.maxXP, user.level]);

  const handleNextTutorialStep = () => {
      switch(tutorialStep) {
          case 'WELCOME':
              setTutorialStep('HUD_INTRO');
              break;
          case 'HUD_INTRO':
              setTutorialStep('QUEST_INTRO');
              break;
          case 'QUEST_INTRO':
              setTutorialStep('MENU_XP_INTRO');
              break;
          case 'MENU_XP_INTRO':
              setTutorialStep('TRIGGER_MEMBERSHIP');
              setShowMembershipModal(true);
              break;
          case 'TRIGGER_MEMBERSHIP':
              break;
          case 'ORDER_GUIDE':
              break;
          case 'CHECKOUT_GUIDE':
              break;
          case 'SCRATCH_GUIDE':
              // Legacy step, skipping
              break;
          case 'SLOT_MACHINE_INTRO':
              // Handled by modal close
              break;
          case 'PROFILE_INTRO':
              setTutorialStep('NONE');
              triggerToast("You are free to explore!");
              setTimeout(() => setShowSimulationButton(true), 2000);
              break;
          case 'SIMULATION_READY':
              setView('PROFILE');
              setProfileTab('TROPHY_ROAD');
              setTimeout(() => {
                 setTutorialStep('LADDER_INTRO'); 
              }, 500);
              break;
          case 'LADDER_INTRO':
               if (canAffordStoreItem) {
                   setTutorialStep('STORE_INTRO');
               } else {
                   setProfileTab('LEADERBOARD');
                   setTutorialStep('LEADERBOARD_INTRO');
               }
               break;
          case 'STORE_INTRO':
               // Should be handled by purchase, but fallback if they skip?
               setProfileTab('LEADERBOARD');
               setTutorialStep('LEADERBOARD_INTRO');
               break;
          case 'LEADERBOARD_INTRO':
              setTutorialStep('NONE');
              triggerToast("Tutorial Complete! Enjoy BettaFuel.");
              break;
          default:
              setTutorialStep('NONE');
      }
  };

  const simulate15Days = () => {
    setShowSimulationButton(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);

    setTimeout(() => {
        setUser(prev => {
            const updatedLadders = prev.ladders.map(ladder => {
                if (ladder.metric === 'streak') {
                    return {
                        ...ladder,
                        steps: ladder.steps.map(s => ({
                           ...s,
                           isClaimed: false
                        }))
                    };
                }
                return ladder;
            });

            return {
                ...prev,
                level: 5,
                currentXP: 850,
                maxXP: 1000,
                coins: 4200,
                hasSpunDailyWheel: false, 
                stats: {
                    streak: 15,
                    totalProtein: 650,
                    totalFibre: 120,
                    healthyOrders: 14
                },
                ladders: updatedLadders
            };
        });

        setTutorialStep('WAITING_FOR_SPIN');
        setShowDailySpin(true);

    }, 1000);
  };

  const xpPercentage = Math.min((user.currentXP / user.maxXP) * 100, 100);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleUpgradeMembership = (tier: MembershipTier) => {
    setUser(prev => ({ ...prev, membershipTier: tier }));
    setShowMembershipModal(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    triggerToast(`Welcome to ${tier} Membership!`);
    
    if (tutorialStep === 'TRIGGER_MEMBERSHIP') {
        setTutorialStep('ORDER_GUIDE');
    }
  };
  
  const handleMembershipModalClose = () => {
      setShowMembershipModal(false);
      if (tutorialStep === 'TRIGGER_MEMBERSHIP') {
          setTutorialStep('ORDER_GUIDE');
      }
  };

  const handleShareProduct = (item: MenuItem) => {
    const xpBonus = 10;
    setUser(prev => ({
       ...prev,
       currentXP: prev.currentXP + xpBonus
    }));
    triggerToast(`Shared ${item.name}! You earned +${xpBonus} XP`);
  };

  const handleStartSupportChat = () => {
     setShowSupportModal(false);
     triggerToast("Connecting to live agent... (Demo)");
  };

  const handleUpdatePhysicalStats = (newStats: PhysicalStats) => {
    setUser(prev => ({ ...prev, physicalStats: newStats }));
    triggerToast("Profile Updated Successfully");
  };

  const handleScratchClaim = () => {
      // Legacy handler, just in case
      setUser(prev => ({
        ...prev,
        coins: prev.coins + scratchReward.amount,
        currentXP: prev.currentXP // XP added previously
      }));
      setShowScratchCard(false);
  };

  // --- SLOT MACHINE LOGIC ---
  const handleSlotSpin = (cost: number, winAmount: number) => {
      setUser(prev => ({
          ...prev,
          coins: prev.coins - cost + winAmount
      }));
      
      if (winAmount > 0) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
      }
  };

  const handleSlotMachineClose = () => {
      setShowSlotMachine(false);
      if (tutorialStep === 'SLOT_MACHINE_INTRO') {
          setTutorialStep('PROFILE_INTRO');
          setView('PROFILE');
          setProfileTab('TROPHY_ROAD');
      }
  };

  // --- REWARD CLAIMING LOGIC ---
  const processContactReward = (updatedUser: UserState) => {
    if (!pendingContactReward) return;

    if (pendingContactReward.type === 'LADDER_ITEM') {
        const { ladderId, stepId } = pendingContactReward.data;
        setUser(prev => {
            const ladderIndex = prev.ladders.findIndex(l => l.id === ladderId);
            if (ladderIndex === -1) return prev;
            const newLadders = [...prev.ladders];
            const stepIndex = newLadders[ladderIndex].steps.findIndex(s => s.id === stepId);
            if (stepIndex === -1) return prev;
            
            const step = newLadders[ladderIndex].steps[stepIndex];
            newLadders[ladderIndex].steps[stepIndex] = { ...step, isClaimed: true };

            return { ...prev, ladders: newLadders };
        });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2500);
        triggerToast("Voucher Sent to your Email!");
    } 
    else if (pendingContactReward.type === 'STORE') {
        const { item } = pendingContactReward.data;
        setUser(prev => ({
            ...prev,
            coins: prev.coins - item.cost,
            inventory: [...prev.inventory, item.id]
        }));
        triggerToast(`Purchased ${item.name}! Details sent to email.`);
    }
    setPendingContactReward(null);
  };

  const handleContactSubmit = (email: string, phone: string) => {
      const updatedUser = { ...user, email, phoneNumber: phone };
      setUser(updatedUser);
      setShowContactModal(false);
      processContactReward(updatedUser);
  };

  const triggerContactFlow = (type: 'LADDER_ITEM' | 'STORE', data: any) => {
      if (!user.email || !user.phoneNumber) {
          setPendingContactReward({ type, data });
          setShowContactModal(true);
      } else {
          setPendingContactReward({ type, data });
          setTimeout(() => processContactReward(user), 0);
      }
  };

  const handleDailySpinClaim = (rewardName: string, amount: number, type: 'COINS' | 'XP') => {
      setUser(prev => ({
        ...prev,
        hasSpunDailyWheel: true,
        coins: type === 'COINS' ? prev.coins + amount : prev.coins,
        currentXP: type === 'XP' ? prev.currentXP + amount : prev.currentXP
      }));
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      triggerToast(`Daily Spin: You won ${amount} ${type}!`);
  };

  const handleDailySpinClose = () => {
    setShowDailySpin(false);
    if (tutorialStep === 'WAITING_FOR_SPIN') {
        setTutorialStep('SIMULATION_READY');
    }
  };

  const handleClaimLadderReward = (ladderId: string, stepId: string) => {
     const ladder = user.ladders.find(l => l.id === ladderId);
     const step = ladder?.steps.find(s => s.id === stepId);
     if (!step) return;

     if (step.rewardType === 'ITEM') {
         triggerContactFlow('LADDER_ITEM', { ladderId, stepId });
     } else {
         setUser(prev => {
            const lIdx = prev.ladders.findIndex(l => l.id === ladderId);
            const newLadders = [...prev.ladders];
            const sIdx = newLadders[lIdx].steps.findIndex(s => s.id === stepId);
            newLadders[lIdx].steps[sIdx] = { ...newLadders[lIdx].steps[sIdx], isClaimed: true };

            let newCoins = prev.coins;
            let newXP = prev.currentXP;
            if (step.rewardType === 'COINS') newCoins += (step.rewardValue || 0);
            if (step.rewardType === 'XP') newXP += (step.rewardValue || 0);

            return { ...prev, ladders: newLadders, coins: newCoins, currentXP: newXP };
         });
         setShowConfetti(true);
         setTimeout(() => setShowConfetti(false), 2000);
         triggerToast(`Claimed ${step.rewardValue} ${step.rewardType}!`);
     }
  };

  const handleClaimAllRewards = (ladderId: string) => {
     const ladder = user.ladders.find(l => l.id === ladderId);
     if (!ladder) return;
     
     const metricValue = user.stats[ladder.metric];
     const claimableSteps = ladder.steps.filter(s => metricValue >= s.threshold && !s.isClaimed);
     if (claimableSteps.length === 0) return;

     let totalCoins = 0;
     let totalXP = 0;
     const items: any[] = [];
     const claimedIds = claimableSteps.map(s => s.id);

     claimableSteps.forEach(step => {
         if (step.rewardType === 'COINS') totalCoins += (step.rewardValue || 0);
         if (step.rewardType === 'XP') totalXP += (step.rewardValue || 0);
         if (step.rewardType === 'ITEM') items.push(step);
     });

     // Deep copy to prevent bugs
     setUser(prev => {
        const ladderIndex = prev.ladders.findIndex(l => l.id === ladderId);
        if (ladderIndex === -1) return prev;

        const newLadders = prev.ladders.map((l, index) => {
            if (index !== ladderIndex) return l;
            return {
                ...l,
                steps: l.steps.map(s => {
                    if (claimedIds.includes(s.id)) {
                        return { ...s, isClaimed: true };
                    }
                    return s;
                })
            };
        });

        return {
            ...prev,
            ladders: newLadders,
            coins: prev.coins + totalCoins,
            currentXP: prev.currentXP + totalXP
        };
     });

     setShowConfetti(true);
     setTimeout(() => setShowConfetti(false), 3000);
     triggerToast(`Claimed: ${totalCoins} Coins, ${totalXP} XP from ${claimableSteps.length} rewards!`);
     
     if (items.length > 0) {
         setTimeout(() => {
             triggerToast(`Also claimed: ${items.map(i => i.rewardDescription).join(', ')}. Check email!`);
         }, 1000);
     }

     if (tutorialStep === 'LADDER_INTRO') {
         setTimeout(() => {
             // Check if user has coins to buy something in store
             if (user.coins >= 50) { // Assuming minimum item cost
                 setTutorialStep('STORE_INTRO');
             } else {
                 setProfileTab('LEADERBOARD');
                 setTutorialStep('LEADERBOARD_INTRO');
             }
         }, 1500);
     }
  };

  // --- SHOPPING & CART ---

  const handleAddToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    triggerToast(`Added ${item.name} to cart`);
    
    if (tutorialStep === 'ORDER_GUIDE') {
        setTutorialStep('CHECKOUT_GUIDE');
        setView('CART');
        setTimeout(() => {
             window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 300);
    }
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const handleStorePurchase = (item: StoreItem) => {
    if (user.coins >= item.cost) {
        triggerContactFlow('STORE', { item });
        
        // Advance tutorial if in STORE_INTRO
        if (tutorialStep === 'STORE_INTRO') {
             setTimeout(() => {
                 setView('PROFILE');
                 setProfileTab('LEADERBOARD');
                 setTutorialStep('LEADERBOARD_INTRO');
             }, 1500);
        }
    }
  };

  const handleStreakClick = () => {
    setView('PROFILE');
    setProfileTab('TROPHY_ROAD');
  };

  const handleCheckout = (method: PaymentMethod) => {
    let multiplier = 1;
    if (user.membershipTier === 'GOLD') multiplier = 1.5;
    if (user.membershipTier === 'PLATINUM') multiplier = 2;

    const totalXP = Math.floor(cart.reduce((sum, item) => sum + (item.xpValue * item.quantity), 0) * multiplier);
    const totalCoins = Math.floor((totalXP / 5) * multiplier);

    const newProtein = cart.reduce((sum, item) => sum + (item.macros.protein * item.quantity), 0);
    const newFibre = cart.reduce((sum, item) => sum + (item.macros.fibre * item.quantity), 0);
    const healthyItemsCount = cart.filter(item => item.tags.includes(QuestType.HEALTHY) || item.tags.includes(QuestType.PROTEIN)).reduce((sum, item) => sum + item.quantity, 0);

    const newXP = user.currentXP + totalXP;
    
    setUser(prev => ({
      ...prev,
      currentXP: newXP, 
      coins: prev.coins + totalCoins,
      stats: {
        ...prev.stats,
        streak: prev.stats.streak + 1, 
        totalProtein: prev.stats.totalProtein + newProtein,
        totalFibre: prev.stats.totalFibre + newFibre,
        healthyOrders: prev.stats.healthyOrders + healthyItemsCount,
      }
    }));

    const updatedQuests = quests.map(q => {
      if (q.isCompleted) return q;
      const hasMatchingItem = cart.some(item => 
        item.tags.includes(q.type) || item.tags.includes(QuestType.ANY) || (q.type === QuestType.INDIAN && item.tags.includes(QuestType.INDIAN))
      );
      if (hasMatchingItem) {
        setUser(prev => ({ ...prev, currentXP: prev.currentXP + q.xpReward, coins: prev.coins + q.coinReward }));
        return { ...q, isCompleted: true };
      }
      return q;
    });
    setQuests(updatedQuests);

    setCart([]);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    
    // Switch to Slot Machine flow
    if (tutorialStep === 'CHECKOUT_GUIDE') {
        setTutorialStep('SLOT_MACHINE_INTRO');
    }
    
    setTimeout(() => {
        // Instead of Scratch Card, show Slot Machine
        // Give small bonus coins immediately so they have funds to play
        triggerToast(`Order Complete! You earned ${totalCoins} FC.`);
        setTimeout(() => setShowSlotMachine(true), 1000);
    }, 1500);

    setView('MENU');
  };

  const handleCheer = (amount: number) => {
     setUser(prev => ({
        ...prev,
        currentXP: prev.currentXP + amount
     }));
     triggerToast(`Cheered! +${amount} XP for supporting others.`);
  };

  const handleLevelUpClaimRedirect = () => {
      setShowLevelUp(false);
      setView('STORE');
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-brand-red selection:text-white pb-safe transition-colors duration-500 ${user.membershipTier === 'PLATINUM' ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-slate-800'}`}>
      <div className={`max-w-md mx-auto min-h-screen shadow-2xl relative transition-colors duration-500 ${user.membershipTier === 'PLATINUM' ? 'bg-slate-950' : 'bg-gray-50'}`}>
        
        {/* SIMULATE 15 DAYS BUTTON */}
        <AnimatePresence>
            {showSimulationButton && tutorialStep === 'NONE' && (
                <motion.button 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    onClick={simulate15Days}
                    className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[80] bg-brand-yellow text-black px-6 py-4 rounded-full font-black shadow-[0_0_30px_rgba(234,179,8,0.6)] border-2 border-yellow-200 flex items-center gap-3 animate-bounce hover:scale-105 active:scale-95 transition-transform"
                >
                    <div className="bg-black text-white p-1.5 rounded-full">
                        <FastForward size={20} />
                    </div>
                    <div className="text-left leading-tight">
                        <div className="text-[10px] uppercase font-bold opacity-60">Developer Mode</div>
                        <div className="text-base">Simulate 15 Days</div>
                    </div>
                </motion.button>
            )}
        </AnimatePresence>

        <Header 
          streak={user.stats.streak} 
          coins={user.coins} 
          tier={user.membershipTier}
          onStreakClick={handleStreakClick}
          onProfileClick={() => setView('PROFILE')}
          isHighlighted={tutorialStep === 'HUD_INTRO'}
        />

        <main className="relative">
          {view === 'MENU' && (
            <>
              <div className="px-4 py-4 space-y-4">
                 <div className={`flex p-1 rounded-xl ${user.membershipTier === 'PLATINUM' ? 'bg-slate-800' : 'bg-gray-200'}`}>
                    <button 
                      onClick={() => setDeliveryMode('DELIVERY')}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${deliveryMode === 'DELIVERY' ? (user.membershipTier === 'PLATINUM' ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm') : 'text-gray-500'}`}
                    >
                      Delivery
                    </button>
                    <button 
                      onClick={() => setDeliveryMode('TAKEAWAY')}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${deliveryMode === 'TAKEAWAY' ? (user.membershipTier === 'PLATINUM' ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm') : 'text-gray-500'}`}
                    >
                      Takeaway
                    </button>
                 </div>

                 <div className="flex items-center gap-2 text-xs text-gray-500 px-1">
                    <MapPin size={12} className="text-brand-red" />
                    <span className="truncate">Home • B-402, Cyber Heights, Hitech City, Hyderabad</span>
                 </div>

                 <div className={`p-4 rounded-2xl border shadow-sm ${user.membershipTier === 'PLATINUM' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex flex-col">
                        <span className="text-brand-red font-bold text-[10px] uppercase tracking-widest">Rank</span>
                        <div className={`text-2xl font-black leading-none ${user.membershipTier === 'PLATINUM' ? 'text-white' : 'text-gray-900'}`}>Level {user.level}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 text-xs font-mono">{user.currentXP}/{user.maxXP} XP</span>
                      </div>
                    </div>
                    
                    <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
                      <motion.div 
                        className="absolute top-0 left-0 h-full bg-brand-red"
                        initial={{ width: `${xpPercentage}%` }}
                        animate={{ width: `${xpPercentage}%` }}
                        transition={{ type: "spring", stiffness: 50, damping: 15 }}
                      />
                    </div>
                 </div>
              </div>

              <div className="px-4">
                <QuestList 
                    id="quest-section"
                    quests={quests} 
                    isHighlighted={tutorialStep === 'QUEST_INTRO'}
                />
                <MenuList 
                  id="menu-section"
                  items={MENU_ITEMS} 
                  onAddToCart={handleAddToCart} 
                  onItemClick={setSelectedProduct} 
                  highlightItemIndex={tutorialStep === 'MENU_XP_INTRO' || tutorialStep === 'ORDER_GUIDE' ? 0 : -1}
                />
              </div>
            </>
          )}

          {view === 'STORE' && (
            <Store 
                items={STORE_ITEMS} 
                user={user} 
                onPurchase={handleStorePurchase} 
                isHighlighted={tutorialStep === 'STORE_INTRO'}
            />
          )}

          {view === 'CART' && (
            <Checkout 
              cart={cart} 
              user={user} 
              onRemove={handleRemoveFromCart}
              onCheckout={handleCheckout} 
              isHighlighted={tutorialStep === 'CHECKOUT_GUIDE'}
            />
          )}

          {view === 'PROFILE' && (
            <Profile 
              id="profile-ladders"
              user={user} 
              defaultTab={profileTab}
              onClaimReward={handleClaimLadderReward}
              onClaimAll={handleClaimAllRewards}
              onUpdateStats={handleUpdatePhysicalStats}
              onOpenMembership={() => setShowMembershipModal(true)}
              onCheer={handleCheer}
              isHighlighted={tutorialStep === 'LADDER_INTRO' || tutorialStep === 'LEADERBOARD_INTRO'}
            />
          )}
        </main>

        <BottomNav 
            currentView={view} 
            onChangeView={setView} 
            cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)} 
            highlightTab={tutorialStep === 'CHECKOUT_GUIDE' ? 'CART' : undefined}
            notifications={notifications}
        />

        <button 
           onClick={() => setShowSupportModal(true)}
           className="fixed bottom-20 right-4 z-40 bg-slate-900 text-white p-3 rounded-full shadow-lg shadow-slate-500/30 hover:scale-110 transition-transform active:scale-95 border border-slate-700"
        >
           <Headphones size={24} />
        </button>

      </div>

      <LevelUpOverlay 
        isVisible={showLevelUp} 
        newLevel={user.level} 
        onClose={() => setShowLevelUp(false)}
        hasClaimableRewards={canAffordStoreItem && user.stats.streak >= 15}
        onClaimStoreReward={handleLevelUpClaimRedirect}
      />

      {showDailySpin && (
        <DailySpin 
          onClaim={handleDailySpinClaim} 
          onClose={handleDailySpinClose} 
          userTier={user.membershipTier}
        />
      )}
      
      {showConfetti && <Confetti />}
      
      <TutorialOverlay 
        step={tutorialStep} 
        onNext={handleNextTutorialStep} 
      />

      <ContactModal 
        isVisible={showContactModal} 
        onClose={() => setShowContactModal(false)}
        onSubmit={handleContactSubmit}
      />

      <SupportModal 
        isVisible={showSupportModal} 
        onClose={() => setShowSupportModal(false)}
        onStartChat={handleStartSupportChat}
      />

      <ProductDetailModal 
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onShare={handleShareProduct}
      />

      <SlotMachineModal 
        isVisible={showSlotMachine}
        onClose={handleSlotMachineClose}
        userCoins={user.coins}
        onSpin={handleSlotSpin}
        isTutorial={tutorialStep === 'SLOT_MACHINE_INTRO'}
      />

      {/* Kept scratch card modal logic just in case, but slot machine is primary now */}
      <ScratchCardModal 
        isVisible={showScratchCard}
        onClose={() => setShowScratchCard(false)}
        onClaim={handleScratchClaim}
        reward={scratchReward}
        potentialAmount={scratchPotential}
        isPlatinum={user.membershipTier === 'PLATINUM'}
        onUpgrade={() => {
            setShowScratchCard(false);
            setShowMembershipModal(true);
        }}
      />

      <MembershipModal 
        isVisible={showMembershipModal}
        currentTier={user.membershipTier}
        onClose={handleMembershipModalClose}
        onUpgrade={handleUpgradeMembership}
        isTutorialMode={tutorialStep === 'TRIGGER_MEMBERSHIP'}
      />

      <Toast 
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      <Analytics />
    </div>
  );
}
