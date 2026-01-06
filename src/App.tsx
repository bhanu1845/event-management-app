// src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import { WorkerCartProvider } from "./contexts/WorkerCartContext";
import { LanguageProvider } from "./contexts/LanguageContext";

// Component imports
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";
import Footer from "@/components/Footer";

// Page imports
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Category from "./pages/Category";
import WorkerProfile from "./pages/WorkerProfile";
import UserProfile from "./pages/UserProfile";
import AddWorker from "./pages/AddWorker";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SearchResults from "@/pages/SearchResults";
import NotFound from "./pages/NotFound";
import CartPage from "./pages/CartPage";

// Event page imports
import WeddingPage from "./pages/WeddingPage";
import BirthdayPage from "./pages/BirthdayPage";
import EngagementPage from "./pages/EngagementPage";
import AnniversaryPage from "./pages/AnniversaryPage";
import HaldiPage from "./pages/HaldiPage";
import CorporatePage from "./pages/CorporatePage";
import BabyShowerPage from "./pages/BabyShowerPage";
import ReceptionPage from "./pages/ReceptionPage";

const queryClient = new QueryClient();

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageProvider>
            <WorkerCartProvider>
              <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/category/:categoryId" element={<Category />} />
                  <Route path="/worker/:workerId" element={<WorkerProfile />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/add-worker" element={<AddWorker />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/cart" element={<CartPage />} />

                  {/* Event Pages */}
                  <Route path="/events/wedding" element={<WeddingPage />} />
                  <Route path="/events/birthday" element={<BirthdayPage />} />
                  <Route path="/events/engagement" element={<EngagementPage />} />
                  <Route path="/events/anniversary" element={<AnniversaryPage />} />
                  <Route path="/events/haldi" element={<HaldiPage />} />
                  <Route path="/events/corporate" element={<CorporatePage />} />
                  <Route path="/events/babyshower" element={<BabyShowerPage />} />
                  <Route path="/events/reception" element={<ReceptionPage />} />

                  {/* Catch-all for 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <Chatbot 
              isOpen={isChatbotOpen}
              onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
            />
            </WorkerCartProvider>
          </LanguageProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;