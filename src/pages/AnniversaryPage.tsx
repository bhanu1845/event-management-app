import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Heart, Gift, Camera, Music, Sparkles, MapPin, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import "@/styles/AnniversaryPage.css";

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

interface Worker {
  id: string;
  name: string;
  category_id: string;
  phone: string;
  email?: string;
  location: string;
  description?: string;
  profile_image_url?: string;
  experience_years: number;
  rating: number;
  created_at: string;
  categories?: Category;
  specialty?: string;
  reviews?: number;
  projects_completed?: number;
}

const AnniversaryPage = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Anniversary-related category names to filter by
  const anniversaryRelatedCategories = [
    "Decoration",
    "Photography", 
    "Catering",
    "Entertainment",
    "DJ Services",
    "Venue Management"
  ];

  const anniversaryCategories = [
    {
      id: "decoration",
      name: t('anniversaryDecoration') || "Decoration Specialists",
      icon: <Sparkles className="h-5 w-5" />,
      count: workers.filter(w => w.categories?.name === "Decoration").length
    },
    {
      id: "photography",
      name: t('anniversaryPhotography') || "Photography",
      icon: <Camera className="h-5 w-5" />,
      count: workers.filter(w => w.categories?.name === "Photography").length
    },
    {
      id: "catering",
      name: t('romanticDinner') || "Catering & Dining",
      icon: <Heart className="h-5 w-5" />,
      count: workers.filter(w => w.categories?.name === "Catering").length
    },
    {
      id: "entertainment",
      name: "Entertainment",
      icon: <Music className="h-5 w-5" />,
      count: workers.filter(w => w.categories?.name === "Entertainment" || w.categories?.name === "DJ Services").length
    },
    {
      id: "planning",
      name: "Event Planning",
      icon: <Gift className="h-5 w-5" />,
      count: workers.filter(w => w.categories?.name === "Venue Management").length
    }
  ];

  useEffect(() => {
    const fetchAnniversaryWorkers = async () => {
      try {
        setIsLoading(true);

        // Static categories data
        const staticCategories: Category[] = [
          { id: "decoration", name: "Decoration", description: "Beautiful anniversary decorations", image_url: "/images/decoration.jpg" },
          { id: "photography", name: "Photography", description: "Capture anniversary moments", image_url: "/images/photography.jpg" },
          { id: "catering", name: "Catering", description: "Anniversary dining services", image_url: "/images/catring.jpg" },
          { id: "entertainment", name: "Entertainment", description: "Anniversary entertainment", image_url: "/images/dj.jpg" },
          { id: "planning", name: "Venue Management", description: "Anniversary venue planning", image_url: "/images/venue.jpg" }
        ];
        setCategories(staticCategories);

        // Static workers data for anniversary
        const staticWorkers: Worker[] = [
          {
            id: "w1",
            name: "Romantic Decorations",
            category_id: "decoration",
            phone: "+91 98765 43210",
            email: "romantic@example.com",
            location: "Hyderabad",
            description: "Specializing in romantic anniversary setups",
            profile_image_url: "/images/worker1.jpg",
            experience_years: 8,
            rating: 4.9,
            created_at: "2023-01-15",
            categories: { id: "decoration", name: "Decoration", description: "Decoration services", image_url: "/images/decoration.jpg" },
            specialty: "Decoration",
            reviews: 156,
            projects_completed: 98
          },
          {
            id: "w2",
            name: "Anniversary Photography",
            category_id: "photography",
            phone: "+91 98765 43211",
            email: "photos@example.com",
            location: "Vijayawada",
            description: "Capturing beautiful anniversary moments",
            profile_image_url: "/images/worker2.jpg",
            experience_years: 6,
            rating: 4.8,
            created_at: "2023-02-20",
            categories: { id: "photography", name: "Photography", description: "Photography services", image_url: "/images/photography.jpg" },
            specialty: "Photography",
            reviews: 134,
            projects_completed: 76
          },
        ];
        setWorkers(staticWorkers);

      } catch (error) {
        console.error("Error loading anniversary data:", error);
        toast({
          title: "Error",
          description: "Failed to load anniversary specialists",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnniversaryWorkers();
  }, [toast]);

  // Filter workers based on active category
  const filteredWorkers = activeCategory === "all" 
    ? workers 
    : workers.filter(worker => {
        switch(activeCategory) {
          case "decoration":
            return worker.categories?.name === "Decoration";
          case "photography": 
            return worker.categories?.name === "Photography";
          case "catering":
            return worker.categories?.name === "Catering";
          case "entertainment":
            return worker.categories?.name === "Entertainment" || worker.categories?.name === "DJ Services";
          case "planning":
            return worker.categories?.name === "Venue Management";
          default:
            return true;
        }
      });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardHoverVariants = {
    initial: { scale: 1, y: 0 },
    hover: { 
      scale: 1.02, 
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-purple-400/20 rounded-full blur-xl"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-center mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-4"
            >
              <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
                <Heart className="h-5 w-5 fill-current" />
                <span className="text-sm font-semibold">Celebrating Love</span>
              </div>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
              {t('anniversaryTitle') || 'Anniversary Magic'}
            </h1>
            <p className="text-xl md:text-2xl mb-6 font-light">
              {t('anniversaryQuote') || 'Crafting unforgettable moments of love 💫'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 -mt-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory("all")}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === "all"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Professionals
            </motion.button>
            {anniversaryCategories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.icon}
                {category.name}
                <Badge variant="secondary" className="ml-1 bg-white/20 text-white">
                  {category.count}
                </Badge>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Workers Grid */}
      <div className="container mx-auto px-4 py-16">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[1, 2, 3, 4, 5, 6].map((skeleton) => (
                <motion.div
                  key={skeleton}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: skeleton * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
                >
                  <div className="animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-gray-300 h-16 w-16"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredWorkers.map((worker, index) => (
                <motion.div
                  key={worker.id}
                  variants={itemVariants}
                  layout
                  className="relative"
                >
                  <motion.div
                    variants={cardHoverVariants}
                    initial="initial"
                    whileHover="hover"
                    className="h-full"
                  >
                    <Card className="h-full bg-white/70 backdrop-blur-sm border border-purple-100/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                      {worker.rating >= 4.8 && (
                        <div className="absolute top-4 left-4 z-10">
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                            <Star className="h-3 w-3 fill-current mr-1" />
                            Top Rated
                          </Badge>
                        </div>
                      )}
                      
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className="relative"
                            >
                              {worker.profile_image_url ? (
                                <img 
                                  src={worker.profile_image_url} 
                                  alt={worker.name}
                                  className="w-16 h-16 rounded-2xl shadow-lg object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl shadow-lg flex items-center justify-center text-white font-bold text-lg">
                                  {worker.name.split(' ').map(n => n[0]).join('')}
                                </div>
                              )}
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-500"></div>
                            </motion.div>
                            <div>
                              <CardTitle className="text-xl font-bold text-gray-800">
                                {worker.name}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-1 mt-1">
                                <MapPin className="h-4 w-4" />
                                {worker.location}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {worker.specialty}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{worker.rating}</span>
                              <span className="text-gray-500">({worker.reviews})</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600">{worker.experience_years}+ years</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <Badge variant="secondary" className="bg-green-50 text-green-700 text-lg font-bold px-3 py-1">
                            Contact for pricing
                          </Badge>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg transition-all duration-300"
                          >
                            {t('viewProfile') || 'View Profile'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {filteredWorkers.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 border border-purple-100 shadow-lg">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Professionals Found</h3>
              <p className="text-gray-500 mb-6">We couldn't find any professionals for this category at the moment.</p>
              <Button 
                onClick={() => setActiveCategory("all")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                View All Professionals
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AnniversaryPage;