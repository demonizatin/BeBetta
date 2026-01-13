
import { MenuItem, Quest, QuestType, StoreItem, UserState, Ladder, LadderStep, LeaderboardUser } from './types';

// --- GENERATORS ---

// 30 Days Streak
const generateStreakSteps = (): LadderStep[] => {
  const steps: LadderStep[] = [];
  for (let i = 1; i <= 30; i++) {
    let isMilestone = false;
    let rewardValue = 10; // Base reward for daily login
    let rewardType: 'COINS' | 'XP' | 'ITEM' | undefined = 'COINS';
    let rewardDescription: string | undefined = undefined;

    if (i === 3) { 
        isMilestone = true; 
        rewardValue = 100; 
        rewardType = 'COINS'; 
        rewardDescription = 'Starter Fund (100 FC)'; 
    }
    else if (i === 7) { 
        isMilestone = true; 
        rewardValue = 500; 
        rewardType = 'XP'; 
        rewardDescription = 'Week Warrior Boost (500 XP)'; 
    }
    else if (i === 14) { 
        isMilestone = true; 
        rewardValue = 1000; 
        rewardType = 'COINS'; 
        rewardDescription = 'Fortnight Fortune (1000 FC)'; 
    }
    else if (i === 21) { 
        isMilestone = true; 
        rewardValue = 2000; 
        rewardType = 'XP'; 
        rewardDescription = 'Habit Hero (2000 XP)'; 
    }
    else if (i === 30) { 
        isMilestone = true; 
        rewardValue = 1; 
        rewardType = 'ITEM'; 
        rewardDescription = 'FREE MEAL VOUCHER'; 
    }

    steps.push({
      id: `s${i}`,
      threshold: i,
      rewardDescription,
      rewardValue,
      rewardType,
      isClaimed: false, // Ensure all are unclaimed initially
      isMilestone
    });
  }
  return steps;
};

// Protein Goals
const generateProteinSteps = (): LadderStep[] => {
  const targets = [50, 150, 300, 500, 800, 1200, 1600, 2000, 2500, 3000];
  return targets.map((t, index) => {
    // Milestones at specific gram counts
    const isMilestone = index === 2 || index === 5 || index === 8 || index === 9;
    
    let rewardType: 'COINS' | 'XP' | 'ITEM' = 'COINS';
    let rewardValue = 50 + (index * 20);
    let rewardDescription = undefined;

    if (isMilestone) {
        if (t === 300) {
            rewardValue = 500;
            rewardType = 'COINS';
            rewardDescription = 'Muscle Starter Kit (500 FC)';
        } else if (t === 1200) {
            rewardValue = 1500;
            rewardType = 'XP';
            rewardDescription = 'Anabolic Boost (1500 XP)';
        } else if (t === 2500) {
            rewardValue = 1;
            rewardType = 'ITEM';
            rewardDescription = 'PRO SHAKER BOTTLE';
        } else if (t === 3000) {
            rewardValue = 1;
            rewardType = 'ITEM';
            rewardDescription = '1KG WHEY PROTEIN';
        }
    }

    return {
      id: `p${t}`,
      threshold: t,
      rewardDescription: isMilestone ? rewardDescription : undefined,
      rewardValue,
      rewardType,
      isClaimed: false,
      isMilestone
    };
  });
};

// Fibre Goals
const generateFibreSteps = (): LadderStep[] => {
  const targets = [20, 50, 100, 200, 350, 500, 700, 900];
  return targets.map((t, index) => {
    const isMilestone = index === 2 || index === 5 || index === 7;
    
    let rewardType: 'COINS' | 'XP' | 'ITEM' = 'XP';
    let rewardValue = 30 + (index * 15);
    let rewardDescription = undefined;

    if (isMilestone) {
         if (t === 100) {
            rewardValue = 300;
            rewardType = 'COINS';
            rewardDescription = 'Digestive Aid (300 FC)';
         } else if (t === 500) {
            rewardValue = 800;
            rewardType = 'XP';
            rewardDescription = 'Gut Guardian (800 XP)';
         } else if (t === 900) {
            rewardValue = 1;
            rewardType = 'ITEM';
            rewardDescription = 'ORGANIC FRUIT BASKET';
         }
    }

    return {
      id: `f${t}`,
      threshold: t,
      rewardDescription: isMilestone ? rewardDescription : undefined,
      rewardValue,
      rewardType,
      isClaimed: false,
      isMilestone
    };
  });
};

// --- CONTENT GENERATORS ---

const FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=400', // Chicken
  'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=400', // Biryani
  'https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&q=80&w=400', // Paneer
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400', // Salad
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400', // Pizza
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400', // Burger
  'https://images.unsplash.com/photo-1551183053-bf91b1dca034?auto=format&fit=crop&q=80&w=400', // Indian
  'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=400', // Chicken fry
];

const INGREDIENTS_POOL = [
  'Fresh Basil', 'Olive Oil', 'Garlic', 'Ginger', 'Himalayan Salt', 'Black Pepper',
  'Quinoa', 'Brown Rice', 'Greek Yogurt', 'Chia Seeds', 'Almonds', 'Avocado',
  'Cherry Tomatoes', 'Spinach', 'Bell Peppers', 'Red Onion', 'Coriander', 'Lemon Zest'
];

const generateMenu = (): MenuItem[] => {
  const items: MenuItem[] = [];
  const categories = ['Biryani', 'Bowls', 'Burgers', 'Pizzas', 'Indian Breads', 'Starters', 'Desserts', 'Beverages'];
  const adj = ['Spicy', 'Grilled', 'Butter', 'Crispy', 'Roasted', 'Zesty', 'Cheesy', 'Double', 'Vegan'];
  const proteins = ['Chicken', 'Paneer', 'Tofu', 'Egg', 'Mutton', 'Mushroom', 'Soya'];

  let idCounter = 1;

  categories.forEach(cat => {
    // Generate 12-15 items per category
    const count = 12 + Math.floor(Math.random() * 5);
    
    for(let i=0; i<count; i++) {
      const isVeg = Math.random() > 0.4;
      const protein = isVeg ? ['Paneer', 'Tofu', 'Mushroom', 'Soya'][Math.floor(Math.random()*4)] : ['Chicken', 'Egg', 'Mutton'][Math.floor(Math.random()*3)];
      
      const suffix = cat.endsWith('s') ? cat.slice(0, -1) : cat;
      const name = `${adj[Math.floor(Math.random() * adj.length)]} ${protein} ${suffix}`;
      
      const price = 150 + Math.floor(Math.random() * 500);
      const isJunk = cat === 'Burgers' || cat === 'Pizzas' || cat === 'Desserts';
      
      const p = isVeg ? 10 + Math.floor(Math.random() * 15) : 20 + Math.floor(Math.random() * 30);
      const c = isJunk ? 50 + Math.floor(Math.random() * 50) : 30 + Math.floor(Math.random() * 30);
      const f = isJunk ? 20 + Math.floor(Math.random() * 30) : 10 + Math.floor(Math.random() * 15);
      
      const tags = [];
      if (p > 25) tags.push(QuestType.PROTEIN);
      if (!isJunk && c < 40) tags.push(QuestType.HEALTHY);
      if (cat === 'Biryani' || cat === 'Indian Breads') tags.push(QuestType.INDIAN);
      if (isJunk) tags.push(QuestType.CHEAT);
      
      // Random 4-6 ingredients
      const ingredients = Array.from({ length: 4 + Math.floor(Math.random() * 3) })
        .map(() => INGREDIENTS_POOL[Math.floor(Math.random() * INGREDIENTS_POOL.length)]);

      items.push({
        id: `m${idCounter++}`,
        name: name,
        description: `Delicious ${name} prepared with fresh ingredients and chef's secret spices.`,
        price: price,
        xpValue: Math.floor(price / 3),
        image: FOOD_IMAGES[Math.floor(Math.random() * FOOD_IMAGES.length)],
        tags: tags,
        isJunk: isJunk,
        calories: (p*4) + (c*4) + (f*9),
        macros: { protein: p, carbs: c, fats: f, fibre: isVeg ? 5 + Math.floor(Math.random() * 10) : 2 },
        ingredients: [...new Set(ingredients)], // Remove duplicates
        isVeg: isVeg,
        rating: 3.5 + (Math.random() * 1.5),
        votes: Math.floor(Math.random() * 5000)
      });
    }
  });
  return items;
};

const generateStore = (): StoreItem[] => {
  const items: StoreItem[] = [];
  const brands = ['Nike', 'Adidas', 'Puma', 'Under Armour', 'Boat', 'Sony', 'Razer', 'Logitech', 'MuscleBlaze', 'MyProtein'];
  const products = [
    { name: 'Running Shoes', type: 'PHYSICAL', basePrice: 3000 },
    { name: 'Gym T-Shirt', type: 'PHYSICAL', basePrice: 800 },
    { name: 'Smart Watch', type: 'PHYSICAL', basePrice: 2500 },
    { name: 'Wireless Buds', type: 'PHYSICAL', basePrice: 1500 },
    { name: 'Gaming Mouse', type: 'PHYSICAL', basePrice: 2000 },
    { name: 'Whey Protein (1kg)', type: 'PHYSICAL', basePrice: 2800 },
    { name: 'Yoga Mat', type: 'PHYSICAL', basePrice: 1200 },
    { name: 'Gift Card (₹500)', type: 'DIGITAL', basePrice: 2500 },
    { name: 'Spotify Premium', type: 'DIGITAL', basePrice: 800 },
    { name: 'Netflix Mobile', type: 'DIGITAL', basePrice: 900 },
    { name: 'Pro Badge', type: 'DIGITAL', basePrice: 5000 },
    { name: 'XP Booster 2x', type: 'DIGITAL', basePrice: 400 },
  ];

  let idCounter = 1;

  for(let i=0; i<500; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const prod = products[Math.floor(Math.random() * products.length)];
    const variant = ['Pro', 'Elite', 'Max', 'Air', 'Ultra', 'Core'][Math.floor(Math.random() * 6)];
    
    const price = Math.floor(prod.basePrice * (0.8 + Math.random() * 0.4));
    
    items.push({
      id: `store_${idCounter++}`,
      name: `${brand} ${prod.name} ${variant}`,
      cost: price,
      image: prod.type === 'DIGITAL' 
        ? 'https://cdn-icons-png.flaticon.com/512/2622/2622083.png' 
        : 'https://m.media-amazon.com/images/I/61+t-M87uTL._AC_SL1500_.jpg',
      type: prod.type as 'DIGITAL' | 'PHYSICAL',
      description: `Official ${brand} merchandise. High quality ${prod.name.toLowerCase()}.`
    });
  }

  items.push({
    id: 'store_special_1',
    name: 'PlayStation 5 Slim',
    cost: 50000,
    image: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-slim-icon-01-en-26oct23?$1600px$',
    type: 'PHYSICAL',
    description: 'The ultimate gaming console. Ultra-rare stock.'
  });

  return items;
};

// --- LEADERBOARD DATA ---

export const GLOBAL_LEADERBOARD: LeaderboardUser[] = [
  { id: 'u1', name: 'GigaChad_99', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', xp: 45000, rank: 1, tier: 'PLATINUM', streak: 45 },
  { id: 'u2', name: 'FitQueen_X', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', xp: 42300, rank: 2, tier: 'PLATINUM', streak: 32 },
  { id: 'u3', name: 'IronPump', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', xp: 41000, rank: 3, tier: 'GOLD', streak: 28 },
  { id: 'u4', name: 'MealPrepper', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100', xp: 38500, rank: 4, tier: 'GOLD', streak: 12 },
  { id: 'u5', name: 'ZenMaster', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100', xp: 36000, rank: 5, tier: 'FREE', streak: 60 },
];

export const REGIONAL_LEADERBOARD: LeaderboardUser[] = [
  { id: 'r1', name: 'Hitech_Hero', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', xp: 12000, rank: 1, tier: 'GOLD', streak: 15 },
  { id: 'r2', name: 'CyberFoodie', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', xp: 11500, rank: 2, tier: 'FREE', streak: 10 },
  { id: 'r3', name: 'CodeNChew', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', xp: 10200, rank: 3, tier: 'PLATINUM', streak: 22 },
  { id: 'u_me', name: 'CyberAthlete_99', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', xp: 5800, rank: 4, tier: 'FREE', streak: 15 }, // User is here
  { id: 'r5', name: 'LateNightDev', avatar: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=100', xp: 4000, rank: 5, tier: 'FREE', streak: 3 },
];

// --- DATA ---

export const INITIAL_LADDERS: Ladder[] = [
  {
    id: 'l_streak',
    title: 'Streak Master',
    description: 'Login and order daily. Consistency is key.',
    icon: '🔥',
    metric: 'streak',
    unit: 'Day',
    color: '#ea580c', 
    infoTitle: 'How Streaks Work',
    infoDescription: 'A streak increases every day you place an order. If you miss 1 day, your streak resets to zero. Hit milestones like Day 7 and Day 30 for massive rewards.',
    steps: generateStreakSteps()
  },
  {
    id: 'l_protein',
    title: 'Iron Pumping',
    description: 'Accumulate protein intake across all your orders.',
    icon: '💪',
    metric: 'totalProtein',
    unit: 'g',
    color: '#2563eb',
    infoTitle: 'The Protein Goal',
    infoDescription: 'This ladder tracks the total grams of protein you have consumed this month. High protein meals help you climb faster!',
    steps: generateProteinSteps()
  },
  {
    id: 'l_fibre',
    title: 'Fibre Focus',
    description: 'Hit your dietary fibre targets for gut health.',
    icon: '🌾',
    metric: 'totalFibre',
    unit: 'g',
    color: '#16a34a',
    infoTitle: 'Fibre Tracking',
    infoDescription: 'Dietary fibre is crucial for digestion. We track the fibre content in every Veggie, Grain, and Fruit component of your meal.',
    steps: generateFibreSteps()
  }
];

// FTUE State (Zero State)
export const ZERO_USER_STATE: UserState = {
  level: 1,
  currentXP: 0,
  maxXP: 500,
  coins: 0,
  inventory: [],
  stats: {
    streak: 0, 
    totalProtein: 0,
    totalFibre: 0,
    healthyOrders: 0,
  },
  physicalStats: {
    weight: 75,
    height: 178,
    age: 24,
    gender: 'Male',
    activityLevel: 'Active',
    goal: 'Build Muscle'
  },
  ladders: INITIAL_LADDERS,
  hasSpunDailyWheel: false,
  email: undefined,
  phoneNumber: undefined,
  membershipTier: 'FREE'
};

// Original State for reference
export const INITIAL_USER_STATE: UserState = {
  level: 14,
  currentXP: 1200,
  maxXP: 1500,
  coins: 3500,
  inventory: [],
  stats: {
    streak: 4, 
    totalProtein: 1240,
    totalFibre: 85,
    healthyOrders: 8,
  },
  physicalStats: {
    weight: 75,
    height: 178,
    age: 24,
    gender: 'Male',
    activityLevel: 'Active',
    goal: 'Build Muscle'
  },
  ladders: INITIAL_LADDERS,
  hasSpunDailyWheel: false,
  email: undefined,
  phoneNumber: undefined,
  membershipTier: 'FREE'
};

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'Desi Gains (Order Indian)',
    xpReward: 100,
    coinReward: 20,
    isCompleted: false,
    type: QuestType.INDIAN,
    icon: '🍛'
  },
  {
    id: 'q2',
    title: 'Protein Packer (>30g)',
    xpReward: 50,
    coinReward: 10,
    isCompleted: false,
    type: QuestType.PROTEIN,
    icon: '💪'
  },
  {
    id: 'q3',
    title: 'Clean Fuel Only',
    xpReward: 80,
    coinReward: 15,
    isCompleted: false,
    type: QuestType.HEALTHY,
    icon: '🥗'
  }
];

export const MENU_ITEMS: MenuItem[] = generateMenu();
export const STORE_ITEMS: StoreItem[] = generateStore();
