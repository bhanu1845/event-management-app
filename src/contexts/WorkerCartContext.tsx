// src/contexts/WorkerCartContext.tsx

import React, { useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

import { getCart, addToCart as addToUserCart, removeFromCart as removeFromUserCart, clearCart as clearUserCart } from "@/lib/cartUtils";
import { WorkerCartContext, type CartItem, type WorkerCartContextType } from './WorkerCartContextDefinition';

const GUEST_USER_ID = 'guest';

export const WorkerCartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load guest user cart
  useEffect(() => {
    const loadGuestCart = () => {
      const guestCart = getCart(GUEST_USER_ID);
      setCart(guestCart);
    };

    loadGuestCart();

    // Listen for cart updates
    const handleCartUpdate = () => {
      const guestCart = getCart(GUEST_USER_ID);
      setCart(guestCart);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const addToCart = (worker: CartItem) => {
    try {
      const cartItem = {
        id: worker.id,
        name: worker.name,
        profile_image_url: worker.profile_image_url,
        service: worker.service,
        rating: worker.rating,
        price: worker.price,
      };
      
      addToUserCart(GUEST_USER_ID, cartItem);
      const updatedCart = getCart(GUEST_USER_ID);
      setCart(updatedCart);
      
      toast({
        title: "Added to Cart",
        description: `${worker.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Already in Cart",
        description: `${worker.name} is already in your cart.`,
      });
    }
  };

  const removeFromCart = (workerId: string) => {
    removeFromUserCart(GUEST_USER_ID, workerId);
    const updatedCart = getCart(GUEST_USER_ID);
    setCart(updatedCart);
    
    toast({
      title: "Removed from Cart",
      description: "Worker removed from your cart.",
    });
  };

  const clearCart = () => {
    clearUserCart(GUEST_USER_ID);
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

