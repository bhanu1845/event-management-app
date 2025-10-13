import React, { useState, useEffect, useRef, useCallback } from "react";
import { ShoppingCart, Trash2, ArrowLeft, Sparkles, Zap, Clock, Shield, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { getCart, removeFromCart, clearCart } from "@/lib/cartUtils";

interface CartItem {
  id: string;
  name: string;
  profile_image_url?: string;
  service?: string;
  rating?: number;
  price?: number;
  category?: string;
  phone?: string;
  location?: string;
  description?: string;
  addedAt?: string;
}

const CartPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check authentication first
      const { data } = await supabase.auth.getSession();
      const currentUser = data?.session?.user ?? null;
      setUser(currentUser);
      
      if (!currentUser) {
        navigate("/auth");
        return;
      }
      
      const cart = getCart(currentUser.id);
      
      if (cart.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      // Fetch complete worker data from Supabase
      const workerIds = cart.map((item: CartItem) => item.id);
      const { data: workers, error } = await supabase
        .from('workers')
        .select(`
          id,
          name,
          profile_image_url,
          phone,
          location,
          description,
          rating,
          categories (
            name
          )
        `)
        .in('id', workerIds);

      if (error) {
        console.error('Error fetching worker data:', error);
        // Fallback to local storage data
        const enhancedCart = cart.map((item: CartItem) => ({
          ...item,
          service: item.service || "General Service",
          rating: item.rating || 4.5,
          price: item.price || 50
        }));
        setCartItems(enhancedCart);
      } else {
        // Combine local cart with backend data
        const enhancedCart = cart.map((cartItem: CartItem) => {
          const workerData = workers?.find((w: { id: string }) => w.id === cartItem.id);
          const serviceName = workerData?.categories?.name || "General Service";
          
          return {
            ...cartItem,
            name: workerData?.name || cartItem.name,
            profile_image_url: workerData?.profile_image_url || cartItem.profile_image_url,
            service: serviceName, // Use the fetched category name
            rating: workerData?.rating || 4.5,
            price: cartItem.price || 50, // Default price or cart-specific price
            phone: workerData?.phone,
            location: workerData?.location,
            description: workerData?.description
          };
        });
        setCartItems(enhancedCart);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadCart();
    // Ensure you handle the event properly if it's being used elsewhere
    const handleCartUpdate = () => loadCart();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [loadCart]);

  const handleRemoveItem = async (workerId: string) => {
    if (!user) return;
    
    setRemovingItem(workerId);
    
    // Animate the removal before updating state
    await new Promise(resolve => setTimeout(resolve, 400));
    
    removeFromCart(user.id, workerId);
    const updatedCart = getCart(user.id);
    setCartItems(updatedCart);
    setRemovingItem(null);

    toast({
      title: "Removed from Cart",
      description: "Worker removed successfully.",
      className: "bg-red-500 text-white",
    });
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsCheckingOut(true);
    
    try {
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "🎉 Booking Confirmed!",
        description: `Successfully booked ${cartItems.length} professional(s). You will receive confirmation shortly.`,
        duration: 5000,
        className: "bg-green-500 text-white",
      });
      
      // Clear cart after successful checkout (always do this)
      if (user) {
        clearCart(user.id);
        setCartItems([]);
        window.dispatchEvent(new Event("cartUpdated"));
      }
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Booking Processed",
        description: "An unexpected error occurred. Cart cleared.",
        className: "bg-red-500 text-white",
      });
      
      // Still clear the cart on general error
      if (user) {
        clearCart(user.id);
        setCartItems([]);
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  // Animation variants
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.8 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { 
        type: "spring" as const, 
        stiffness: 300, 
        damping: 24 
      }
    },
    exit: { 
      opacity: 0, 
      x: 100, 
      scale: 0.8,
      transition: { 
        duration: 0.4 
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 blur-xl"
        animate={floatingAnimation}
      />
      <motion.div 
        className="absolute bottom-20 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-xl"
        animate={{ 
          y: [0, -15, 0],
          transition: { ...floatingAnimation.transition, duration: 3.5 }
        }}
      />

      <div className="container mx-auto px-4 max-w-6xl relative z-10" ref={containerRef}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4"
          >
            <ShoppingCart className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Your Service Cart
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {cartItems.length === 0 
              ? "Ready to find your perfect service professionals?" 
              : `You're ${cartItems.length} step${cartItems.length > 1 ? 's' : ''} away from amazing service!`
            }
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {cartItems.length === 0 ? (
            <motion.div
              key="empty-cart"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-2xl border-0 rounded-3xl mt-10 bg-white/80 backdrop-blur-sm border border-white/20">
                <CardContent className="py-20 text-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="text-8xl mb-6"
                  >
                    🛍️
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Your Cart Feels Lonely!
                  </h2>
                  <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                    Discover skilled professionals ready to bring your projects to life. Your perfect match is just a click away!
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/">
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg">
                        <Sparkles className="h-5 w-5 mr-2" />
                        Explore Professionals
                      </Button>
                    </Link>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="cart-items"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      className={`relative ${removingItem === item.id ? 'opacity-0' : 'opacity-100'} transition-opacity duration-400`}
                    >
                      <Card className="shadow-xl border-0 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm border border-white/20">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-6 flex-1">
                              {/* Profile Image */}
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="relative"
                              >
                                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex-shrink-0 shadow-lg">
                                  {item.profile_image_url ? (
                                    <img
                                      src={item.profile_image_url}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                      {item.name.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <motion.div
                                  animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 1, 0.5]
                                  }}
                                  transition={{ 
                                    duration: 2, 
                                    repeat: Infinity 
                                  }}
                                  className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
                                >
                                  <Zap className="h-3 w-3 text-white" />
                                </motion.div>
                              </motion.div>

                              {/* Content */}
                              <div className="flex-1">
                                <Link 
                                  to={`/worker/${item.id}`}
                                  className="group"
                                >
                                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                                    {item.name}
                                  </h3>
                                </Link>
                                <p className="text-gray-600 mb-1">{item.service}</p>
                                {item.location && (
                                  <p className="text-sm text-gray-500 mb-2">{item.location}</p>
                                )}
                                
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <div className="flex text-yellow-400">
                                      {"★".repeat(Math.floor(item.rating || 0))}
                                      {"☆".repeat(5 - Math.floor(item.rating || 0))}
                                    </div>
                                    <span className="text-gray-500 ml-1">{item.rating?.toFixed(1)}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-green-600 font-semibold">
                                    <Calendar className="h-4 w-4" />
                                    Available Now
                                  </div>
                                </div>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <p className="text-2xl font-bold text-gray-800">
                                  ${item.price?.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-500">per service</p>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => handleRemoveItem(item.id)}
                                aria-label={`Remove ${item.name}`}
                                className="rounded-xl bg-gradient-to-r from-red-500 to-pink-600 border-0 shadow-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Checkout Summary */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="lg:col-span-1"
              >
                <Card className="sticky top-24 shadow-2xl border-0 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 backdrop-blur-sm border border-white/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-blue-600" />
                      Booking Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Summary Items */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600">Professionals</span>
                        <span className="font-semibold">{cartItems.length}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600">Service Fee (10%)</span>
                        <span className="font-semibold">${(totalPrice * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-t border-gray-300">
                        <span className="text-xl font-bold text-gray-800">Total</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ${(totalPrice * 1.1).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 bg-white/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 text-sm">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">Secure Booking Guarantee</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-700">24/7 Customer Support</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Zap className="h-4 w-4 text-yellow-600" />
                        <span className="text-gray-700">Instant Confirmation</span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-bold rounded-xl shadow-lg relative overflow-hidden"
                        onClick={handleCheckout}
                        disabled={isCheckingOut || cartItems.length === 0}
                      >
                        {isCheckingOut ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="flex items-center gap-2"
                          >
                            <Sparkles className="h-5 w-5" />
                            Processing...
                          </motion.div>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5 mr-2" />
                            Confirm Booking - ${(totalPrice * 1.1).toFixed(2)}
                          </>
                        )}
                      </Button>
                    </motion.div>

                    {/* Continue Shopping */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link to="/">
                        <Button 
                          variant="outline" 
                          className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Continue Browsing
                        </Button>
                      </Link>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CartPage;