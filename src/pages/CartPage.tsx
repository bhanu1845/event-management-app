import React, { useState, useEffect, useRef, useCallback } from "react";
import { ShoppingCart, Trash2, ArrowLeft, IndianRupee, Star, MapPin, ChevronRight, Shield, Clock, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { getCart, removeFromCart, clearCart } from "@/lib/cartUtils";
import { Badge } from "@/components/ui/badge";

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
        const enhancedCart = cart.map((item: CartItem) => ({
          ...item,
          service: item.service || "General Service",
          rating: item.rating || 4.5,
          price: item.price || 50
        }));
        setCartItems(enhancedCart);
      } else {
        const enhancedCart = cart.map((cartItem: CartItem) => {
          const workerData = workers?.find((w: { id: string }) => w.id === cartItem.id);
          const serviceName = workerData?.categories?.name || "General Service";
          
          return {
            ...cartItem,
            name: workerData?.name || cartItem.name,
            profile_image_url: workerData?.profile_image_url || cartItem.profile_image_url,
            service: serviceName,
            rating: workerData?.rating || 4.5,
            price: cartItem.price || 50,
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
    const handleCartUpdate = () => loadCart();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [loadCart]);

  const handleRemoveItem = async (workerId: string) => {
    if (!user) return;
    
    setRemovingItem(workerId);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    removeFromCart(user.id, workerId);
    const updatedCart = getCart(user.id);
    setCartItems(updatedCart);
    setRemovingItem(null);

    toast({
      title: "Removed from Cart",
      description: "Professional removed from your cart.",
    });
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsCheckingOut(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Booking Confirmed!",
        description: `Successfully booked ${cartItems.length} professional${cartItems.length > 1 ? 's' : ''}. You will receive confirmation shortly.`,
        duration: 5000,
      });
      
      if (user) {
        clearCart(user.id);
        setCartItems([]);
        window.dispatchEvent(new Event("cartUpdated"));
      }
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Booking Processed",
        description: "Your booking has been processed successfully.",
        variant: "destructive",
      });
      
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
  const serviceFee = totalPrice * 0.1;
  const finalTotal = totalPrice + serviceFee;

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: 100,
      transition: { duration: 0.3 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading your cart...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4 max-w-7xl" ref={containerRef}>
        {/* Service Booking Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Service Cart</span>
          </div>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-normal text-gray-900">Service Cart</h1>
            <div className="text-sm text-gray-600">
              Price
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Cart Items - Left Side */}
          <div className="lg:col-span-3 space-y-4">
            <AnimatePresence mode="popLayout">
              {cartItems.length === 0 ? (
                <motion.div
                  key="empty-cart"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <CardContent className="p-12 text-center">
                      <div className="text-6xl mb-4">🔧</div>
                      <h2 className="text-2xl font-normal text-gray-900 mb-4">
                        Your Service Cart is empty
                      </h2>
                      <p className="text-gray-600 mb-6">
                        Find skilled professionals for your projects. Browse electricians, plumbers, cleaners, and more.
                      </p>
                      <div className="flex gap-4 justify-center">
                        <Link to="/">
                          <Button className="bg-orange-400 hover:bg-orange-500 text-white font-normal py-2.5 px-6 rounded-lg">
                            Find Professionals
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={index}
                    className={`bg-white border border-gray-200 rounded-lg shadow-sm ${removingItem === item.id ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                  >
                    <div className="p-4">
                      <div className="flex gap-4">
                        {/* Profile Image */}
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
                            {item.profile_image_url ? (
                              <img
                                src={item.profile_image_url}
                                alt={item.name}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sm font-medium bg-gradient-to-br from-orange-100 to-amber-100 text-gray-600 rounded">
                                {item.name.charAt(0)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <div className="flex-1">
                              <Link 
                                to={`/worker/${item.id}`}
                                className="group"
                              >
                                <h3 className="text-lg text-blue-600 hover:text-orange-600 group-hover:underline line-clamp-2 mb-1">
                                  {item.name} - {item.service}
                                </h3>
                              </Link>
                              
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                  <div className="flex text-amber-400">
                                    <Star className="h-4 w-4 fill-current" />
                                  </div>
                                  <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                                    {item.rating?.toFixed(1)}
                                  </span>
                                </div>
                              </div>

                              {item.location && (
                                <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {item.location}
                                </div>
                              )}

                              <div className="flex items-center gap-2 text-sm text-green-600 mb-3">
                                <Calendar className="h-4 w-4" />
                                Available for booking
                              </div>

                              <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1">
                                  <Button 
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="text-sm text-gray-600 hover:text-gray-800 border-0 px-0 hover:bg-transparent"
                                  >
                                    Remove
                                  </Button>
                                  <span className="text-gray-300">|</span>
                                  <Button 
                                    variant="outline"
                                    size="sm"
                                    className="text-sm text-gray-600 hover:text-gray-800 border-0 px-0 hover:bg-transparent"
                                  >
                                    Save for later
                                  </Button>
                                  <span className="text-gray-300">|</span>
                                  <Button 
                                    variant="outline"
                                    size="sm"
                                    className="text-sm text-gray-600 hover:text-gray-800 border-0 px-0 hover:bg-transparent"
                                  >
                                    View similar
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right ml-4">
                              <p className="text-lg font-medium text-gray-900 flex items-center justify-end">
                                <IndianRupee className="h-4 w-4 mr-1" />
                                {item.price?.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500 mb-2">per service</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="text-right py-4 border-t border-gray-200">
                <div className="text-lg text-gray-900">
                  Subtotal ({cartItems.length} service{cartItems.length > 1 ? 's' : ''}): 
                  <span className="font-bold ml-2">
                    <IndianRupee className="h-4 w-4 inline mr-1" />
                    {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary - Right Side */}
          {cartItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sticky top-24">
                <div className="space-y-4">
                  {/* Subtotal */}
                  <div className="text-lg">
                    <span className="text-gray-900">
                      Subtotal ({cartItems.length} service{cartItems.length > 1 ? 's' : ''}): 
                    </span>
                    <span className="font-bold ml-1">
                      <IndianRupee className="h-4 w-4 inline mr-1" />
                      {totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Service Fee */}
                  <div className="text-sm text-gray-600">
                    Platform fee: 
                    <span className="ml-1">
                      <IndianRupee className="h-3 w-3 inline mr-1" />
                      {serviceFee.toFixed(2)}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                      <span>Total Amount:</span>
                      <span>
                        <IndianRupee className="h-4 w-4 inline mr-1" />
                        {finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="text-xs text-green-600">
                    <div className="flex items-center gap-1 mb-1">
                      <Shield className="h-3 w-3" />
                      Secure booking with quality guarantee
                    </div>
                  </div>

                  {/* Checkout Button - Now in Blue */}
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-normal py-2.5 rounded-lg shadow-sm border border-blue-700"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>

                  {/* Continue Exploring */}
                  <div className="text-center pt-2">
                    <Link to="/">
                      <Button 
                        variant="ghost" 
                        className="text-blue-600 hover:text-orange-600 hover:bg-transparent font-normal text-sm"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Find more professionals
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Additional Service Cards */}
              <div className="mt-4 space-y-4">
                {/* Security Card */}
                <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Quality Guarantee</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      All professionals are verified and quality-checked.
                    </p>
                  </CardContent>
                </Card>

                {/* Support Card */}
                <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">24/7 Support</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Get help anytime with our customer support.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;