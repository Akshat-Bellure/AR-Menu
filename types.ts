export interface Dish {
  id: string;
  name: string;
  price: number;
  category: string;
  isVeg: boolean;
  tags: string[];
  imageUrl: string;
  videoUrl?: string; 
  description: string;
  ingredients: string[];
  calories: number;
  // New field for 360 view
  angles?: {
    front: string;
    right: string;
    back: string;
    left: string;
    top?: string;
    bottom?: string;
  };
}

export interface Restaurant {
  id: string;
  ownerUsername: string; 
  name: string;
  cuisine: string;
  themeColor: string;
  logoUrl: string;
  menu: Dish[];
}

export interface CartItem extends Dish {
  quantity: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered';

export interface Order {
  id: string;
  restaurantId: string;
  tableNo: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  timestamp: number;
}

export type ViewState = 'landing' | 'admin' | 'customer' | 'scanner';

export interface UserCredentials {
  u: string;
  p: string;
}