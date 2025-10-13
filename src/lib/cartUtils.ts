// Cart utility functions for user-specific cart management

export interface CartItem {
  id: string;
  name: string;
  phone?: string;
  category?: string;
  addedAt?: string;
}

export const getCartKey = (userId: string): string => {
  return `cart_${userId}`;
};

export const getCart = (userId: string): CartItem[] => {
  try {
    const cartKey = getCartKey(userId);
    const raw = localStorage.getItem(cartKey) || "[]";
    const cart = JSON.parse(raw);
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
};

export const addToCart = (userId: string, item: CartItem): void => {
  try {
    const cart = getCart(userId);
    const existingIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingIndex >= 0) {
      // Item already exists, throw error for handling in UI
      throw new Error("Item already in cart");
    }
    
    cart.push(item);
    const cartKey = getCartKey(userId);
    localStorage.setItem(cartKey, JSON.stringify(cart));
    
    // Dispatch event to update cart count in navbar
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error; // Re-throw for UI handling
  }
};

export const removeFromCart = (userId: string, itemId: string): void => {
  try {
    const cart = getCart(userId);
    const filteredCart = cart.filter(item => item.id !== itemId);
    
    const cartKey = getCartKey(userId);
    localStorage.setItem(cartKey, JSON.stringify(filteredCart));
    
    // Dispatch event to update cart count in navbar
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error) {
    console.error("Error removing from cart:", error);
  }
};

export const clearCart = (userId: string): void => {
  try {
    const cartKey = getCartKey(userId);
    localStorage.removeItem(cartKey);
    
    // Dispatch event to update cart count in navbar
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
};