import { createContext } from 'react';

interface CartItem {
  id: string;
  name: string;
  profile_image_url?: string;
  service?: string;
  rating?: number;
  price?: number;
  phone?: string;
  category?: string;
  addedAt?: string;
}

interface WorkerCartContextType {
  cart: CartItem[];
  addToCart: (worker: CartItem) => void;
  removeFromCart: (workerId: string) => void;
  clearCart: () => void;
  isInCart: (workerId: string) => boolean;
}

export const WorkerCartContext = createContext<WorkerCartContextType | undefined>(undefined);

export type { CartItem, WorkerCartContextType };