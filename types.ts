
export enum QuestType {
  PROTEIN = 'PROTEIN',
  TIME = 'TIME',
  HEALTHY = 'HEALTHY',
  INDIAN = 'INDIAN',
  CHEAT = 'CHEAT',
  ANY = 'ANY'
}

export interface Quest {
  id: string;
  title: string;
  xpReward: number;
  coinReward: number;
  isCompleted: boolean;
  type: QuestType;
  icon: string;
}

export interface Macros {
  protein: number;
  carbs: number;
  fats: number;
  fibre: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  xpValue: number;
  image: string;
  tags: QuestType[];
  isJunk: boolean;
  calories: number;
  macros: Macros;
  ingredients: string[]; 
  isVeg: boolean;
  rating: number;
  votes: number; // Added for UI realism
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface StoreItem {
  id: string;
  name: string;
  cost: number;
  image: string;
  type: 'DIGITAL' | 'PHYSICAL';
  description: string;
}

// Gamification Types
export interface LadderStep {
  id: string;
  threshold: number;
  rewardDescription?: string;
  rewardValue?: number;
  rewardType?: 'COINS' | 'XP' | 'ITEM';
  isClaimed: boolean;
  isMilestone: boolean;
}

export interface Ladder {
  id: string;
  title: string;
  description: string;
  icon: string;
  metric: 'streak' | 'totalProtein' | 'totalFibre';
  unit: string;
  steps: LadderStep[];
  color: string;
  infoTitle: string;
  infoDescription: string;
}

export interface UserStats {
  streak: number;
  totalProtein: number;
  totalFibre: number;
  healthyOrders: number;
}

export interface PhysicalStats {
  weight: number; // kg
  height: number; // cm
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  activityLevel: 'Sedentary' | 'Active' | 'Very Active';
  goal: 'Lose Weight' | 'Maintain' | 'Build Muscle';
}

export type MembershipTier = 'FREE' | 'GOLD' | 'PLATINUM';

export interface UserState {
  level: number;
  currentXP: number;
  maxXP: number;
  coins: number;
  inventory: string[];
  stats: UserStats;
  physicalStats: PhysicalStats;
  ladders: Ladder[];
  hasSpunDailyWheel: boolean;
  email?: string;
  phoneNumber?: string;
  membershipTier: MembershipTier; // Added
}

export type PaymentMethod = 'UPI' | 'CARD' | 'COD';

export type DeliveryMode = 'DELIVERY' | 'TAKEAWAY';

export type ViewState = 'MENU' | 'STORE' | 'CART' | 'PROFILE';

export type TutorialStep = 
  | 'NONE' 
  | 'WELCOME' 
  | 'HUD_INTRO'
  | 'QUEST_INTRO'
  | 'MENU_XP_INTRO' 
  | 'TRIGGER_MEMBERSHIP' 
  | 'ORDER_GUIDE' 
  | 'CHECKOUT_GUIDE'
  | 'SCRATCH_GUIDE'
  | 'SLOT_MACHINE_INTRO'
  | 'PROFILE_INTRO'
  | 'WAITING_FOR_SPIN'
  | 'SIMULATION_READY'
  | 'LADDER_INTRO'
  | 'STORE_INTRO'
  | 'LEADERBOARD_INTRO';

export interface LeaderboardUser {
    id: string;
    name: string;
    avatar: string;
    xp: number;
    rank: number;
    tier: MembershipTier;
    streak: number;
}
