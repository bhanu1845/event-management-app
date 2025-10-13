import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

interface NavbarProps {
  user: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  /**
   * Cart Count Synchronization Logic - User-specific cart
   * Only shows cart for logged-in users, each user has separate cart data
   */
  useEffect(() => {
    const updateCartCount = () => {
      if (!user) {
        setCartCount(0);
        return;
      }
      
      try {
        const cartKey = `cart_${user.id}`; // User-specific cart key
        const raw = localStorage.getItem(cartKey) || "[]";
        const cart = JSON.parse(raw);
        setCartCount(Array.isArray(cart) ? cart.length : 0);
      } catch {
        setCartCount(0);
      }
    };

    // 1. Initial load
    updateCartCount();
    
    // 2. Listen for custom event from other components (like WorkerProfile)
    window.addEventListener("cartUpdated", updateCartCount); 
    
    // 3. Listen for changes in localStorage from other tabs/windows
    const onStorage = (e: StorageEvent) => {
      if (user && e.key === `cart_${user.id}`) updateCartCount();
    };
    window.addEventListener("storage", onStorage);

    // Cleanup listeners
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", onStorage);
    };
  }, [user]); // Re-run when user changes

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
      navigate("/");
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
    else navigate("/search");
  };

  const getInitial = () => {
    if (!user) return "?";
    if (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) {
      const n = (user.user_metadata.full_name || user.user_metadata.name) as string;
      return n.trim().charAt(0).toUpperCase();
    }
    if (user.email) return user.email.trim().charAt(0).toUpperCase();
    return "?";
  };

  const displayName = () => {
    if (!user) return "";
    if (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) {
      return (user.user_metadata.full_name || user.user_metadata.name) as string;
    }
    if (user.email) return user.email.split("@")[0];
    return "Profile";
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/vibezonlogo.png" alt="Vibezon" className="h-8 w-8 object-contain" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Vibezon
            </span>
          </Link>

          {/* Search (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 items-center">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Search"
              />
            </div>
            <button type="submit" className="ml-2 p-2 rounded hover:bg-muted/50" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
          </form>

          {/* Desktop nav (visible on md+) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* Cart button - only for logged-in users */}
                <button
                  onClick={() => navigate("/cart")}
                  className="relative p-2 rounded hover:bg-muted/50"
                  aria-label="Open cart"
                  title="Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium leading-none text-white bg-destructive rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Add Worker Link */}
                <Link to="/add-worker">
                  <Button variant="default">Add Worker</Button>
                </Link>

                {/* Profile Link */}
                <Link to="/profile" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted/50">
                  <div className="h-8 w-8 rounded-full bg-muted text-sm font-medium text-white flex items-center justify-center overflow-hidden">
                    <span>{getInitial()}</span>
                  </div>
                  <span className="hidden md:inline text-sm">{displayName()}</span>
                </Link>

                {/* Sign Out */}
                <Button variant="ghost" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-4 mt-8">
                {/* Mobile search */}
                <form onSubmit={handleSearch} className="mb-4 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="search"
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      aria-label="Search"
                    />
                  </div>
                  <button type="submit" className="p-2 rounded hover:bg-muted/50" aria-label="Search">
                    <Search className="h-5 w-5" />
                  </button>
                </form>

                {/* Mobile links */}
                
                {/* Cart link - only for logged-in users */}
                {user && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/cart");
                    }}
                    className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Cart
                    {cartCount > 0 && <span className="ml-2 text-sm text-destructive">({cartCount})</span>}
                  </button>
                )}

                <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                  Home
                </Link>
                <Link to="/about" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                  About
                </Link>

                {/* Show Add Worker in mobile if logged in */}
                {user && (
                  <Link to="/add-worker" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                    Add Worker
                  </Link>
                )}

                <Link to="/contact" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                  Contact Us
                </Link>

                {user ? (
                  <div className="flex items-center justify-between mt-4 border-t pt-4">
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted text-sm font-medium text-white flex items-center justify-center overflow-hidden">
                        <span className="text-lg">{getInitial()}</span>
                      </div>
                      <div>
                        <div className="font-medium">{displayName()}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </Link>

                    <Button variant="ghost" onClick={() => { setIsOpen(false); handleSignOut(); }}>
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="w-full mt-4">Sign In</Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;