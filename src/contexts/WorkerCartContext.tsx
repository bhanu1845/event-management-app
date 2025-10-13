// src/contexts/WorkerCartContext.tsx

import React, { useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { getCart, addToCart as addToUserCart, removeFromCart as removeFromUserCart, clearCart as clearUserCart } from "@/lib/cartUtils";
import { WorkerCartContext, type CartItem, type WorkerCartContextType } from './WorkerCartContextDefinition';

export const WorkerCartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Check user authentication and load their cart
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data?.session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        const userCart = getCart(currentUser.id);
        setCart(userCart);
      } else {
        setCart([]);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      
      if (newUser) {
        const userCart = getCart(newUser.id);
        setCart(userCart);
      } else {
        setCart([]);
      }
    });

    // Listen for cart updates
    const handleCartUpdate = () => {
      if (user) {
        const userCart = getCart(user.id);
        setCart(userCart);
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      subscription?.unsubscribe();
    };
  }, [user]);

  const addToCart = (worker: CartItem) => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to sign in to add workers to your cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      const cartItem = {
        id: worker.id,
        name: worker.name,
        profile_image_url: worker.profile_image_url,
        service: worker.service,
        rating: worker.rating,
        price: worker.price,
      };
      
      addToUserCart(user.id, cartItem);
      const updatedCart = getCart(user.id);
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
    if (!user) return;
    
    removeFromUserCart(user.id, workerId);
    const updatedCart = getCart(user.id);
    setCart(updatedCart);
    
    toast({
      title: "Removed from Cart",
      description: "Worker removed from your cart.",
    });
  };

  const clearCart = () => {
    if (!user) return;
    
    clearUserCart(user.id);
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

