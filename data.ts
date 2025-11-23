
import { Restaurant } from './types';

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: "rest-paradise",
    ownerUsername: "paradise_owner",
    name: "Paradise Biryani",
    cuisine: "Hyderabadi",
    themeColor: "orange",
    logoUrl: "",
    menu: [
      {
        id: "chicken-biryani",
        name: "Chicken Biryani",
        price: 210,
        category: "Biryanis",
        isVeg: false,
        tags: ["Bestseller", "Spicy"],
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
        // Mocking 360 angles using similar looking images for demo purposes
        angles: {
          front: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
          right: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
          back: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80",
          left: "https://images.unsplash.com/photo-1631515243349-e06036043944?auto=format&fit=crop&w=800&q=80",
          top: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
        },
        description: "Legendary Paradise Chicken Biryani with saffron and ghee. The world's favorite biryani.",
        ingredients: ["Basmati Rice", "Chicken", "Saffron", "Spices"],
        calories: 850
      },
      {
        id: "veg-biryani",
        name: "Veg. Biryani",
        price: 154,
        category: "Biryanis",
        isVeg: true,
        tags: ["Vegetarian", "Flavorful"],
        imageUrl: "https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=800&q=80",
        description: "Fresh vegetable medley cooked with aromatic Basmati rice and exotic spices.",
        ingredients: ["Basmati Rice", "Carrots", "Beans", "Spices"],
        calories: 600
      },
      {
        id: "tandoori-chicken",
        name: "Tandoori Chicken",
        price: 280,
        category: "Starters",
        isVeg: false,
        tags: ["Spicy", "Tandoor"],
        imageUrl: "https://images.unsplash.com/photo-1628294895950-98052523e036?auto=format&fit=crop&w=800&q=80",
        description: "Whole chicken marinated in yogurt and spices, roasted in a clay oven.",
        ingredients: ["Chicken", "Yogurt", "Red Chili", "Lemon"],
        calories: 450
      }
    ]
  },
  {
    id: "rest-burger-king",
    ownerUsername: "burger_king_owner",
    name: "Burger Hub",
    cuisine: "American",
    themeColor: "red",
    logoUrl: "",
    menu: [
      {
        id: "smash-burger",
        name: "Double Smash",
        price: 12.99,
        category: "Burgers",
        isVeg: false,
        tags: ["Juicy", "Cheesy"],
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        description: "Double patty smashed to perfection with melting cheddar.",
        ingredients: ["Beef", "Cheese", "Bun", "Pickles"],
        calories: 950
      },
      {
        id: "truffle-fries",
        name: "Truffle Fries",
        price: 6.99,
        category: "Sides",
        isVeg: true,
        tags: ["Crispy", "Premium"],
        imageUrl: "https://images.unsplash.com/photo-1630431341973-4830edb49f9f?auto=format&fit=crop&w=800&q=80",
        description: "Crispy fries tossed in truffle oil and parmesan.",
        ingredients: ["Potatoes", "Truffle Oil", "Parmesan"],
        calories: 400
      }
    ]
  }
];

export const INITIAL_USERS = [
  {u: "Founder", p: "arproakb123"},
  {u: "paradise_owner", p: "biryani123"}, 
  {u: "burger_king_owner", p: "burger123"}
];
