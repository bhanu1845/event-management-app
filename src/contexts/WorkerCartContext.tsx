// src/contexts/WorkerCartContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  profile_image_url: string;
  service?: string;
  rating?: number;
  price?: number;
}

interface WorkerCartContextType {
  cart: CartItem[];
  addToCart: (worker: CartItem) => void;
  removeFromCart: (workerId: string) => void;
  clearCart: () => void;
  isInCart: (workerId: string) => boolean;
}

const WorkerCartContext = createContext<WorkerCartContextType | undefined>(undefined);

export const WorkerCartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    // Dispatch event for other components to listen to
    window.dispatchEvent(new Event('cartUpdated'));
  }, [cart]);

  const addToCart = (worker: CartItem) => {
    setCart(prevCart => {
      // Check if worker is already in cart
      if (prevCart.some(item => item.id === worker.id)) {
        toast({
          title: "Already in Cart",
          description: `${worker.name} is already in your cart.`,
        });
        return prevCart;
      }
      
      const newCart = [...prevCart, worker];
      toast({
        title: "Added to Cart",
        description: `${worker.name} has been added to your cart.`,
      });
      return newCart;
    });
  };

  const removeFromCart = (workerId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== workerId));
    toast({
      title: "Removed from Cart",
      description: "Worker removed from your cart.",
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (workerId: string) => {
    return cart.some(item => item.id === workerId);
  };

  return (
    <WorkerCartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      isInCart,
    }}>
      {children}
    </WorkerCartContext.Provider>
  );
};

export const useWorkerCart = () => {
  const context = useContext(WorkerCartContext);
  if (context === undefined) {
    throw new Error('useWorkerCart must be used within a WorkerCartProvider');
  }
  return context;
};