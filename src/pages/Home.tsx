import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Users, Award, Clock, Sparkles, Search, Calendar, Heart, ArrowRight, ShoppingCart, User, ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

interface Worker {
  id: string;
  name: string;
  rating: number;
  experience_years: number;
  category_id: string;
  category?: Category;
  response_time: string;
  projects_completed: number;
  specialization: string;
  profile_image_url?: string;
}

// Image Slider Component
const ImageSlider: React.FC<{ categories: Category[] }> = ({ categories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Slider images with category mapping
  const sliderImages = [
    {
      id: "catering",
      image: "/images/catring.jpg",
      title: "Catering Services",
      description: "Delicious food for your events",
      fallback: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop"
    },
    {
      id: "photography", 
      image: "/images/photography.jpg",
      title: "Photography",
      description: "Capture your precious moments",
      fallback: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=400&fit=crop"
    },
    {
      id: "dj",
      image: "/images/dj.jpg", 
      title: "DJ Services",
      description: "Music and entertainment for your party",
      fallback: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop"
    },
    {
      id: "venue",
      image: "/images/venue.jpg",
      title: "Venue Decoration", 
      description: "Beautiful decorations for your venue",
      fallback: "https://images.unsplash.com/photo-1519167758481-83f29b1fe26d?w=800&h=400&fit=crop"
    },
    {
      id: "decoration",
      image: "/images/decoration.jpg",
      title: "Event Decoration",
      description: "Creative decorations for any occasion", 
      fallback: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=400&fit=crop"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + sliderImages.length) % sliderImages.length);
  };

  // Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  const handleImageClick = (slideId: string) => {
    const matchingCategory = categories.find(cat => 
      cat.name.toLowerCase().includes(slideId.toLowerCase()) ||
      (slideId === "catering" && cat.name.toLowerCase().includes("catering")) ||
      (slideId === "photography" && cat.name.toLowerCase().includes("photography")) ||
      (slideId === "dj" && (cat.name.toLowerCase().includes("dj") || cat.name.toLowerCase().includes("music"))) ||
      (slideId === "venue" && cat.name.toLowerCase().includes("venue")) ||
      (slideId === "decoration" && cat.name.toLowerCase().includes("decoration"))
    );
    
    if (matchingCategory) {
      window.location.href = `/category/${matchingCategory.id}`;
    }
  };

  return (
    <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden shadow-lg bg-white">
      <div className="relative h-full">
        {sliderImages.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 cursor-pointer ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => handleImageClick(slide.id)}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = slide.fallback;
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">{slide.title}</h3>
                <p className="text-lg md:text-xl">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 shadow-lg"
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 shadow-lg"
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Professional Card Component with enhanced animations
const ProfessionalCard: React.FC<{ worker: Worker; index: number }> = ({ worker, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const getExperienceText = (years: number) => {
    if (years === 0) return "Fresher";
    if (years <= 2) return `${years} years`;
    if (years <= 5) return `${years} years`;
    return `${years}+ years`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Card 
        className="border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 bg-white"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-4">
          {/* Header with Avatar and Rating */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-black font-bold text-sm">
                {worker.profile_image_url ? (
                  <img 
                    src={worker.profile_image_url} 
                    alt={worker.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(worker.name)
                )}
              </div>
              <div>
                <h3 className="font-semibold text-black text-sm">{worker.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-black text-black" />
                  <span className="text-sm font-bold text-black">{worker.rating}</span>
                  <span className="text-xs text-gray-500">({worker.projects_completed} reviews)</span>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className={`p-1 h-8 w-8 ${isLiked ? 'text-pink-500' : 'text-gray-400'}`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Specialization and Experience */}
          <div className="mb-3">
            <Badge variant="secondary" className="bg-gray-100 text-black text-xs mb-2">
              {worker.specialization}
            </Badge>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-gray-600" />
                <span>{getExperienceText(worker.experience_years)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-gray-600" />
                <span>{worker.projects_completed}+ projects</span>
              </div>
            </div>
          </div>

          {/* Action Button with Radium Colors */}
          <Button 
            asChild 
            size="sm"
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white text-xs h-8 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link to={`/worker/${worker.id}`}>
              View Profile
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Category Section Component
const CategoryProfessionals: React.FC<{ 
  category: Category; 
  workers: Worker[]; 
  categoryIndex: number 
}> = ({ category, workers, categoryIndex }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, categoryIndex * 300);
    return () => clearTimeout(timer);
  }, [categoryIndex]);

  if (workers.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
      className="py-6 bg-white"
    >
      <div className="container mx-auto px-4">
        {/* Category Header */}
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-black">
            {category.name}
          </h2>
          <p className="text-sm text-gray-600 mt-1">Workers</p>
        </div>

        {/* Professionals Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {workers.slice(0, 6).map((worker, index) => (
            <ProfessionalCard 
              key={worker.id} 
              worker={worker} 
              index={index}
            />
          ))}
        </div>

        {/* View More Button */}
        {workers.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.6 + 0.4 }}
            className="text-center mt-6"
          >
            <Button 
              asChild
              variant="outline"
              className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white px-8 py-3 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <Link to={`/category/${category.id}`}>
                View All {category.name} Professionals
                <Users className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

// Import motion from framer-motion
import { motion } from "framer-motion";

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredWorkers, setFeaturedWorkers] = useState<Worker[]>([]);
  const [workersByCategory, setWorkersByCategory] = useState<Map<string, Worker[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .order("name");

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

        // Fetch workers with category data and enhanced fields
        const { data: workersData, error: workersError } = await supabase
          .from("workers")
          .select(`
            id, 
            name, 
            rating, 
            experience_years, 
            category_id,
            categories (
              id,
              name,
              description,
              image_url
            )
          `)
          .order("rating", { ascending: false })
          .limit(20);

        if (workersError) throw workersError;

        // Transform workers data with enhanced fields
        const transformedWorkers: Worker[] = (workersData || []).map(worker => ({
          ...worker,
          category: worker.categories as Category,
          response_time: "Within 1 hour",
          projects_completed: Math.floor(Math.random() * 200) + 50, // Random projects between 50-250
          specialization: worker.categories ? (worker.categories as Category).name : "General"
        }));

        setFeaturedWorkers(transformedWorkers);

        // Group workers by category
        const grouped = new Map<string, Worker[]>();
        transformedWorkers.forEach(worker => {
          if (worker.category) {
            const categoryWorkers = grouped.get(worker.category.id) || [];
            categoryWorkers.push(worker);
            grouped.set(worker.category.id, categoryWorkers);
          }
        });
        
        setWorkersByCategory(grouped);

      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Rest of the existing code remains the same...
  const getCategoryImage = (categoryName: string) => {
    const normalizedName = categoryName.toLowerCase();
    
    if (normalizedName.includes("catering") || normalizedName.includes("food")) {
      return "/images/catring.jpg"; 
    }
    if (normalizedName.includes("photography") || normalizedName.includes("photo")) {
      return "/images/photography.jpg"; 
    }
    if (normalizedName.includes("venue") || normalizedName.includes("hall")) {
      return "/images/venue.jpg";
    }
    if (normalizedName.includes("dj") || normalizedName.includes("music") || normalizedName.includes("entertainment")) {
      return "/images/dj.jpg";
    }
    if (normalizedName.includes("decoration") || normalizedName.includes("decor")) {
      return "/images/decoration.jpg";
    }

    return "/images/default-event.jpg";
  };

  const smallCategoryButtons = [
    {
      id: "catering",
      name: "Catering",
      emoji: "🍽️",
      color: "hover:bg-orange-50 border-orange-200"
    },
    {
      id: "photography", 
      name: "Photography",
      emoji: "📸",
      color: "hover:bg-purple-50 border-purple-200"
    },
    {
      id: "venue",
      name: "Venue",
      emoji: "🏛️",
      color: "hover:bg-green-50 border-green-200"
    },
    {
      id: "dj",
      name: "DJ & Music",
      emoji: "🎵",
      color: "hover:bg-pink-50 border-pink-200"
    },
    {
      id: "decoration",
      name: "Decoration", 
      emoji: "🎨",
      color: "hover:bg-yellow-50 border-yellow-200"
    },
    {
      id: "entertainment",
      name: "Entertainment",
      emoji: "🎭",
      color: "hover:bg-indigo-50 border-indigo-200"
    },
    {
      id: "makeup",
      name: "Makeup",
      emoji: "💄",
      color: "hover:bg-rose-50 border-rose-200"
    },
    {
      id: "planning",
      name: "Planning",
      emoji: "📋",
      color: "hover:bg-blue-50 border-blue-200"
    }
  ];

  const findCategoryId = (categoryName: string) => {
    const category = categories.find(cat => 
      cat.name.toLowerCase().includes(categoryName.toLowerCase())
    );
    return category?.id || "#";
  };

  return (
    <div className="min-h-screen">
      {/* Compact Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        </div>

        {/* Small Category Buttons */}
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between overflow-x-auto space-x-1">
            {smallCategoryButtons.map((button) => (
              <Link 
                key={button.id}
                to={`/category/${findCategoryId(button.name)}`}
                className="flex flex-col items-center p-2 min-w-[80px] rounded-lg border transition-all duration-200 hover:shadow-md group"
              >
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-200">
                  {button.emoji}
                </div>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight group-hover:text-blue-600">
                  {button.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Banner with Image Slider */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-8">
        <div className="container mx-auto px-4">
          <ImageSlider categories={categories} />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Discover Services
            </h2>
            <p className="text-gray-600">
              Everything you need for your perfect event
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse border rounded-lg">
                  <div className="h-40 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link key={category.id} to={`/category/${category.id}`}>
                  <Card className="group h-full border rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="relative h-40 bg-gray-100 overflow-hidden rounded-t-lg">
                      <img
                        src={getCategoryImage(category.name)}
                        alt={category.name}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=${encodeURIComponent(category.name)}`;
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-white/90 backdrop-blur-sm">
                          {category.name.includes("DJ") ? "🎵" : 
                           category.name.includes("Catering") ? "🍽️" :
                           category.name.includes("Photography") ? "📸" :
                           category.name.includes("Decoration") ? "🎨" :
                           category.name.includes("Venue") ? "🏛️" : "⭐"}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <CardTitle className="text-lg font-semibold text-gray-800 mb-2">
                        {category.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600 line-clamp-2">
                        {category.description}
                      </CardDescription>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Users className="h-3 w-3" />
                          <span>50+ Experts</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-blue-500 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Top Professionals Section by Category */}
      {Array.from(workersByCategory.entries()).map(([categoryId, workers], index) => {
        const category = categories.find(cat => cat.id === categoryId);
        if (!category) return null;
        
        return (
          <CategoryProfessionals
            key={categoryId}
            category={category}
            workers={workers}
            categoryIndex={index}
          />
        );
      })}
    </div>
  );
};

export default Home;