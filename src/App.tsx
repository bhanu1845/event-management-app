// src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { WorkerCartProvider } from "./contexts/WorkerCartContext";

// Component imports
import Navbar from "@/components/Navbar";
import CategoryNavbar from "@/components/CategoryNavbar";
import Footer from "@/components/Footer";

// Page imports
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Category from "./pages/Category";
import WorkerProfile from "./pages/WorkerProfile";
import AddWorker from "./pages/AddWorker";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SearchResults from "@/pages/SearchResults";
import NotFound from "./pages/NotFound";
import CartPage from "./pages/CartPage";

const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });

    // Listen for auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      // safe cleanup:
      try {
        sub?.subscription?.unsubscribe?.();
      } catch {
        // Ignore errors during unsubscribe cleanup
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <WorkerCartProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar user={user} />
              <CategoryNavbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/category/:categoryId" element={<Category />} />
                  <Route path="/worker/:workerId" element={<WorkerProfile />} />
                  <Route path="/add-worker" element={<AddWorker />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/search" element={<SearchResults />} />
                
                  
                  <Route path="/cart" element={<CartPage />} />

                  {/* Catch-all for 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </WorkerCartProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;