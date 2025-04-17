export interface Category {
  id: number;
  name: string;
  image: any; // Using any for require() type
}

export interface Recipe {
  id: number;
  name: string;
  image: any;
  rating: number;
  time: string;
  category?: string;
}

export interface Chef {
  id: number;
  name: string;
  specialty: string;
  image: any;
  rating: number;
  recipes: number;
}

export interface Collection {
  id: number;
  name: string;
  icon: string;
  count: number;
  gradient: [string, string];
}

export interface ChatMessage {
  id: number;
  sender: string;
  message: string;
  time: string;
  isUser: boolean;
}

export interface UserProfile {
  name: string;
  bio: string;
  image: any;
  stats: {
    recipes: number;
    followers: number;
    following: number;
  };
}

export const categories: Category[] = [
  { id: 1, name: 'Indian', image: require('../../assets/curry.webp') },
  { id: 2, name: 'Italian', image: require('../../assets/pasta.webp') },
  { id: 3, name: 'Nepalese', image: require('../../assets/curry.webp') },
  { id: 4, name: 'Japanese', image: require('../../assets/shusi.jpg') },
  { id: 5, name: 'American', image: require('../../assets/beef.jpg') },
  { id: 6, name: 'Chinese', image: require('../../assets/vege.jpg') },
  { id: 7, name: 'Desserts', image: require('../../assets/dessert.webp') },
];

export const trendingRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Tortilla Pizza Recipe',
    image: require('../../assets/tor.jpg'),
    rating: 4.8,
    time: '25 mins',
    category: 'Italian'
  },
  {
    id: 2,
    name: 'Salmon Sushi Recipe',
    image: require('../../assets/shusi.jpg'),
    rating: 4.8,
    time: '30 mins',
    category: 'Japanese'
  },
  {
    id: 3,
    name: 'Chicken Curry Recipe',
    image: require('../../assets/curry.webp'),
    rating: 4.7,
    time: '40 mins',
    category: 'Indian'
  },
  {
    id: 4,
    name: 'Vegetable Stir Fry',
    image: require('../../assets/vege.jpg'),
    rating: 4.6,
    time: '20 mins',
    category: 'Chinese'
  },
  {
    id: 5,
    name: 'Beef Tacos',
    image: require('../../assets/beef.jpg'),
    rating: 4.9,
    time: '35 mins',
    category: 'Mexican'
  }
];

export const featuredChefs: Chef[] = [
  {
    id: 1,
    name: 'Gordon Ramsay',
    specialty: 'British Cuisine',
    image: require('../../assets/rohan.jpg'),
    rating: 4.9,
    recipes: 156
  },
  {
    id: 2,
    name: 'Jamie Oliver',
    specialty: 'Italian Cuisine',
    image: require('../../assets/rohan.jpg'),
    rating: 4.8,
    recipes: 143
  },
  {
    id: 3,
    name: 'Wolfgang Puck',
    specialty: 'French Cuisine',
    image: require('../../assets/rohan.jpg'),
    rating: 4.9,
    recipes: 98
  }
];

export const userRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Classic Pasta Carbonara',
    image: require('../../assets/pasta.webp'),
    category: 'Italian',
    time: '30 mins',
    rating: 4.8
  },
  {
    id: 2,
    name: 'Spicy Chicken Curry',
    image: require('../../assets/curry.webp'),
    category: 'Indian',
    time: '45 mins',
    rating: 4.7
  },
  {
    id: 3,
    name: 'Grilled Salmon',
    image: require('../../assets/beef.jpg'),
    category: 'Seafood',
    time: '25 mins',
    rating: 4.9
  }
];

export const recipeCollections: Collection[] = [
  {
    id: 1,
    name: 'Popular',
    icon: 'flame',
    count: 12,
    gradient: ['#FF6B6B', '#EE5D5D']
  },
  {
    id: 2,
    name: 'Quick & Easy',
    icon: 'time',
    count: 8,
    gradient: ['#4ECDC4', '#45B7AF']
  },
  {
    id: 3,
    name: 'Favorites',
    icon: 'star',
    count: 15,
    gradient: ['#FFD93D', '#F4C724']
  },
  {
    id: 4,
    name: 'Healthy',
    icon: 'leaf',
    count: 6,
    gradient: ['#6C5CE7', '#5D4ED8']
  }
];

export const chatMessages: ChatMessage[] = [
  {
    id: 1,
    sender: 'Chef Gordon',
    message: 'Hi! I can help you with your cooking questions.',
    time: '10:30 AM',
    isUser: false
  },
  {
    id: 2,
    sender: 'You',
    message: 'How do I make perfect pasta?',
    time: '10:31 AM',
    isUser: true
  },
  {
    id: 3,
    sender: 'Chef Gordon',
    message: 'Start with boiling water and add salt. Cook until al dente!',
    time: '10:32 AM',
    isUser: false
  }
];

export const userProfile: UserProfile = {
  name: 'Rohan',
  bio: 'Passionate food creator',
  image: require('../../assets/rohan.jpg'),
  stats: {
    recipes: 24,
    followers: 1234,
    following: 567
  }
}; 