import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { Star, Users, Award, Clock, Sparkles, Search, Calendar, Heart, ArrowRight, ShoppingCart, User, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { CategoriesService, WorkersService, type Category, type Worker, getConnectionStatus } from "@/lib/dataServices";
import "@/styles/Home.css";
import "@/styles/ServiceCategories.css";
import "@/styles/ProfessionalCards.css";

// Event Category Card Component with clean design
const EventCategoryCard: React.FC<{ 
  event: { 
    id: string; 
    name: string; 
    description: string; 
    images: string[];
    emoji: string;
  }; 
  index: number;
  t: (key: string) => string;
}> = ({ event, index, t }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered && event.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % event.images.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isHovered, event.images.length]);

  const handleCardClick = () => {
    window.location.href = `/events/${event.id}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
      }}
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
    >
      <Card className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full bg-white border border-gray-100">
        <div className="relative h-40 overflow-hidden">
          {/* Sliding Images */}
          {event.images.map((image, imgIndex) => (
            <motion.div
              key={imgIndex}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: imgIndex === currentImageIndex ? 1 : 0,
                scale: imgIndex === currentImageIndex ? (isHovered ? 1.05 : 1) : 1.1
              }}
              transition={{ 
                duration: 0.8, 
                ease: "easeInOut"
              }}
            >
              <img
                src={image}
                alt={`${event.name} ${imgIndex + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=${encodeURIComponent(event.name)}`;
                }}
              />
            </motion.div>
          ))}
          
          {/* Emoji Badge */}
          <div className="absolute top-3 right-3">
            <div className="text-xl bg-white/90 rounded-full p-2 shadow-sm">
              {event.emoji}
            </div>
          </div>
          
          {/* Overlay Content */}
          <div className="absolute inset-0 bg-black/20 flex items-end p-3">
            <div className="text-white w-full">
              <h3 className="text-base font-semibold mb-1 drop-shadow-md">
                {t(event.name) || event.name}
              </h3>
              <p className="text-xs opacity-95 drop-shadow-sm line-clamp-2">
                {t(event.description) || event.description}
              </p>
            </div>
          </div>
        </div>
        
        <CardContent className="p-3 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
              {t('exploreServices')}
            </span>
            <motion.div
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="h-3 w-3 text-blue-500" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Image Slider Component
const ImageSlider: React.FC<{ categories: Category[]; t: (key: string) => string }> = ({ categories, t }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderImages = [
    {
      id: "wedding",
      image: "/images/wedding/w1.png",
      title: t('weddingTitle') || 'Wedding Ceremonies',
      description: t('weddingQuote') || 'Two hearts, one soul, endless love 💍',
      fallback: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=400&fit=crop"
    },
    {
      id: "birthday", 
      image: "/images/birthday/b1.png",
      title: t('birthdayTitle') || 'Birthday Celebrations',
      description: t('birthdayQuote') || 'Another year of blessings and joy 🎂',
      fallback: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&h=400&fit=crop"
    },
    {
      id: "engagement",
      image: "/images/engagement/e2.png", 
      title: t('engagementTitle') || 'Engagement Ceremonies',
      description: t('engagementQuote') || 'The beginning of forever starts here 💕',
      fallback: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=400&fit=crop"
    },
    {
      id: "anniversary",
      image: "/images/anniversary/a2.png",
      title: t('anniversaryTitle') || 'Anniversary Celebrations', 
      description: t('anniversaryQuote') || 'Years of love, memories to treasure 🥂',
      fallback: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=400&fit=crop"
    },
    {
      id: "haldi",
      image: "/images/haldi/h2.png",
      title: t('haldiTitle') || 'Haldi Ceremonies',
      description: t('haldiQuote') || 'Golden traditions, blessed beginnings 💛', 
      fallback: "https://images.unsplash.com/photo-1594736797933-d0813ba00f30?w=800&h=400&fit=crop"
    },
    {
      id: "corporate",
      image: "/images/corporate/c1.png",
      title: t('corporateTitle') || 'Corporate Events',
      description: t('corporateQuote') || 'Success celebrates with style 💼',
      fallback: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop"
    },
    {
      id: "babyshower",
      image: "/images/babyshower/baby1.png",
      title: t('babyshowerTitle') || 'Baby Shower',
      description: t('babyshowerQuote') || 'Little miracles bring big joy 👶',
      fallback: "https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=800&h=400&fit=crop"
    },
    {
      id: "reception",
      image: "/images/reception/r1.png",
      title: t('receptionTitle') || 'Reception Parties',
      description: t('receptionQuote') || 'Dance, dine, and celebrate life 🎉',
      fallback: "https://images.unsplash.com/photo-1519167758481-83f29b1fe26d?w=800&h=400&fit=crop"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + sliderImages.length) % sliderImages.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  const handleImageClick = (slideId: string) => {
    // Navigate to specific event pages
    switch(slideId) {
      case "wedding":
        window.location.href = `/events/wedding`;
        break;
      case "birthday":
        window.location.href = `/events/birthday`;
        break;
      case "engagement":
        window.location.href = `/events/engagement`;
        break;
      case "anniversary":
        window.location.href = `/events/anniversary`;
        break;
      case "haldi":
        window.location.href = `/events/haldi`;
        break;
      case "corporate":
        window.location.href = `/events/corporate`;
        break;
      case "babyshower":
        window.location.href = `/events/babyshower`;
        break;
      case "reception":
        window.location.href = `/events/reception`;
        break;
      default: {
        // Fallback to category search if no matching event page
        const matchingCategory = categories.find(cat => 
          cat.name.toLowerCase().includes(slideId.toLowerCase())
        );
        if (matchingCategory) {
          window.location.href = `/category/${matchingCategory.id}`;
        }
        break;
      }
    }
  };

  return (
    <div className="relative w-full h-40 md:h-48 rounded-lg overflow-hidden shadow-sm bg-white">
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
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-1">{slide.title}</h3>
                <p className="text-sm md:text-base">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 transition-all duration-200 shadow-sm"
      >
        <ChevronLeft className="h-4 w-4 text-gray-800" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 transition-all duration-200 shadow-sm"
      >
        <ChevronRight className="h-4 w-4 text-gray-800" />
      </button>

      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Professional Card Component
const ProfessionalCard: React.FC<{ worker: Worker; index: number; t: (key: string) => string }> = ({ worker, index, t }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const getExperienceText = (years: number) => {
    if (years === 0) return t('fresher');
    if (years <= 2) return `${years} ${t('years')}`;
    if (years <= 5) return `${years} ${t('years')}`;
    return `${years}+ ${t('years')}`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group"
    >
      <Card 
        className="rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-black font-medium text-xs border">
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
                <h3 className="font-medium text-black text-sm leading-tight">{worker.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold text-black">{worker.rating}</span>
                  <span className="text-xs text-gray-500">({worker.projects_completed})</span>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className={`p-1 h-6 w-6 ${isLiked ? 'text-pink-500' : 'text-gray-400'}`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          </div>

          <div className="mb-2">
            <Badge variant="secondary" className="bg-gray-100 text-black text-xs mb-1">
              {worker.specialization}
            </Badge>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-gray-500" />
                <span>{getExperienceText(worker.experience_years)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-gray-500" />
                <span>{worker.projects_completed}+</span>
              </div>
            </div>
          </div>

          <Button 
            asChild 
            size="sm"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 transition-colors"
          >
            <Link to={`/worker/${worker.id}`}>
              {t('viewDetails')}
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
  categoryIndex: number;
  t: (key: string) => string;
}> = ({ category, workers, categoryIndex, t }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, categoryIndex * 200);
    return () => clearTimeout(timer);
  }, [categoryIndex]);

  if (workers.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
      className="py-4 bg-white"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-3">
          <h2 className="text-lg font-semibold text-black">
            {t(category.name) || category.name}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{t('workers')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {workers.slice(0, 6).map((worker, index) => (
            <ProfessionalCard 
              key={worker.id} 
              worker={worker} 
              index={index}
              t={t}
            />
          ))}
        </div>

        {workers.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3, delay: categoryIndex * 0.4 + 0.2 }}
            className="text-center mt-4"
          >
            <Button 
              asChild
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-2 text-sm rounded-lg transition-colors"
            >
              <Link to={`/category/${category.id}`}>
                {t('viewAll')} {t(category.name) || category.name}
                <Users className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

// Horizontal Scrolling Card Component
const HorizontalScrollingCard: React.FC<{ 
  service: { 
    id: string;
    name: string;
    description: string;
    image: string;
    rating: number;
    projects: number;
    emoji: string;
    price: string;
  }; 
  index: number;
  t: (key: string) => string;
}> = ({ service, index, t }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        transition: { duration: 0.2 }
      }}
      className="flex-shrink-0 w-48 bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 overflow-hidden cursor-pointer transform-style-preserve-3d"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-32 overflow-hidden">
        <motion.img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover"
          animate={{
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ duration: 0.3 }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/200x150/4F46E5/FFFFFF?text=${encodeURIComponent(service.name)}`;
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Emoji Badge */}
        <motion.div 
          className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-lg"
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-sm">{service.emoji}</span>
        </motion.div>
        
        {/* Price Tag */}
        <motion.div 
          className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ delay: index * 0.1 + 0.5 }}
        >
          {service.price}
        </motion.div>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-1">
          {service.name}
        </h3>
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {service.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-gray-700">{service.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">{service.projects}+</span>
          </div>
        </div>
        
        <motion.div
          className="mt-2 pt-2 border-t border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.7 }}
        >
          <Button 
            size="sm" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-6"
          >
            Book Now
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Horizontal Scrolling Container Component
const HorizontalScrollingContainer: React.FC<{ t: (key: string) => string }> = ({ t }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const featuredServices = [
    {
      id: "premium-catering",
      name: "Premium Catering",
      description: "Gourmet food with traditional flavors",
      image: "/images/catring.jpg",
      rating: 4.9,
      projects: 234,
      emoji: "🍽️",
      price: "₹15K"
    },
    {
      id: "wedding-photography",
      name: "Wedding Photography",
      description: "Capture your special moments beautifully",
      image: "/images/photography.jpg",
      rating: 4.8,
      projects: 189,
      emoji: "📸",
      price: "₹25K"
    },
    {
      id: "luxury-venue",
      name: "Luxury Venue",
      description: "Elegant spaces for grand celebrations",
      image: "/images/venue.jpg",
      rating: 4.7,
      projects: 156,
      emoji: "🏛️",
      price: "₹50K"
    },
    {
      id: "dj-entertainment",
      name: "DJ & Entertainment",
      description: "Keep the party alive with great music",
      image: "/images/dj.jpg",
      rating: 4.6,
      projects: 142,
      emoji: "🎵",
      price: "₹12K"
    },
    {
      id: "floral-decoration",
      name: "Floral Decoration",
      description: "Beautiful floral arrangements",
      image: "/images/decoration.jpg",
      rating: 4.9,
      projects: 198,
      emoji: "💐",
      price: "₹18K"
    },
    {
      id: "makeup-artist",
      name: "Makeup Artist",
      description: "Professional bridal makeup services",
      image: "/images/makeup.jpg",
      rating: 4.8,
      projects: 167,
      emoji: "💄",
      price: "₹8K"
    },
    {
      id: "event-planning",
      name: "Event Planning",
      description: "Complete event management solutions",
      image: "/images/planning.jpg",
      rating: 4.7,
      projects: 213,
      emoji: "📋",
      price: "₹30K"
    },
    {
      id: "lighting-specialist",
      name: "Lighting Specialist",
      description: "Create magical atmospheres with lights",
      image: "/images/lighting.jpg",
      rating: 4.5,
      projects: 98,
      emoji: "💡",
      price: "₹10K"
    }
  ];

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section className="py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {t('featuredServices') || "Featured Services"}
          </h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            {t('discoverTopServices') || "Handpicked services for your perfect event experience"}
          </p>
        </motion.div>

        {/* Scroll Container */}
        <div className="relative">
          {/* Scroll Left Button */}
          <motion.button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg border border-gray-200 backdrop-blur-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </motion.button>

          {/* Scroll Right Button */}
          <motion.button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg border border-gray-200 backdrop-blur-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </motion.button>

          {/* Horizontal Scrolling Container */}
          <div
            ref={containerRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth py-4 px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredServices.map((service, index) => (
              <HorizontalScrollingCard
                key={service.id}
                service={service}
                index={index}
                t={t}
              />
            ))}
          </div>
        </div>

        {/* Scroll Indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {featuredServices.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                Math.floor(scrollPosition / 200) === index ? 'bg-blue-600 w-4' : 'bg-gray-300'
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredWorkers, setFeaturedWorkers] = useState<Worker[]>([]);
  const [workersByCategory, setWorkersByCategory] = useState<Map<string, Worker[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Event categories data
  const eventCategories = [
    {
      id: "wedding",
      name: "Wedding",
      description: "Complete wedding planning services with premium vendors",
      images: [
        "/images/wedding/w1.png",
        "/images/wedding/w2.png", 
        "/images/wedding/w3.png",
        "/images/wedding/w4.png"
      ],
      emoji: "💍"
    },
    {
      id: "birthday",
      name: "Birthday", 
      description: "Memorable birthday celebrations for all ages",
      images: [
        "/images/birthday/b1.png",
        "/images/birthday/b2.png",
        "/images/birthday/b3.png",
        "/images/birthday/b4.png"
      ],
      emoji: "🎂"
    },
    {
      id: "haldi",
      name: "Haldi",
      description: "Traditional haldi ceremony with authentic rituals",
      images: [
        "/images/haldi/h1.png",
        "/images/haldi/h2.png",
        "/images/haldi/h3.png",
        "/images/haldi/h4.png"
      ],
      emoji: "💛"
    },
    {
      id: "corporate",
      name: "Corporate",
      description: "Professional corporate events and conferences",
      images: [
        "/images/corporate/c1.png",
        "/images/corporate/c2.png",
        "/images/corporate/c3.png",
        "/images/corporate/c4.png"
      ],
      emoji: "💼"
    },
    {
      id: "anniversary",
      name: "Anniversary",
      description: "Romantic anniversary celebrations",
      images: [
        "/images/anniversary/a1.png",
        "/images/anniversary/a2.png",
        "/images/anniversary/a3.png",
        "/images/anniversary/a4.png"
      ],
      emoji: "🥂"
    },
    {
      id: "babyshower",
      name: "Baby Shower",
      description: "Joyful baby shower celebrations",
      images: [
        "/images/babyshower/baby1.png",
        "/images/babyshower/baby2.png",
        "/images/babyshower/baby3.png",
        "/images/babyshower/baby4.png"
      ],
      emoji: "👶"
    },
    {
      id: "engagement",
      name: "Engagement",
      description: "Beautiful engagement ceremony planning",
      images: [
        "/images/engagement/e1.png",
        "/images/engagement/e2.png",
        "/images/engagement/e3.png",
        "/images/engagement/e4.png"
      ],
      emoji: "💕"
    },
    {
      id: "reception",
      name: "Reception",
      description: "Grand reception party arrangements",
      images: [
        "/images/reception/r1.png",
        "/images/reception/r2.png",
        "/images/reception/r3.png",
        "/images/reception/r4.png"
      ],
      emoji: "🎉"
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Show database connection status
        const dbStatus = await getConnectionStatus();
        console.log('🔗 Database Connection Status:', dbStatus);
        
        if (!dbStatus.connected) {
          toast({
            title: "Database Status",
            description: dbStatus.message,
            duration: 3000,
          });
        }

        // Fetch categories from data service
        console.log('📋 Fetching categories...');
        const categoriesData = await CategoriesService.getAll();
        console.log('✅ Categories loaded:', categoriesData.length);
        setCategories(categoriesData);

        // Fetch featured workers from data service
        console.log('👥 Fetching workers...');
        const workersData = await WorkersService.getFeatured(12);
        console.log('✅ Workers loaded:', workersData.length);
        
        // Set featured workers for display
        setFeaturedWorkers(workersData.slice(0, 6));
        
        // Group workers by category for category sections
        const workersByCategory = new Map<string, Worker[]>();
        for (const category of categoriesData) {
          const categoryWorkers = await WorkersService.getByCategory(category.id);
          if (categoryWorkers.length > 0) {
            workersByCategory.set(category.id, categoryWorkers.slice(0, 4));
          }
        }
        setWorkersByCategory(workersByCategory);

        console.log('✅ Data loading completed successfully');
        
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Using fallback content.",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

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
    },
    {
      id: "photography", 
      name: "Photography",
      emoji: "📸",
    },
    {
      id: "venue",
      name: "Venue",
      emoji: "🏛️",
    },
    {
      id: "dj",
      name: "DJ & Music",
      emoji: "🎵",
    },
    {
      id: "decoration",
      name: "Decoration", 
      emoji: "🎨",
    },
    {
      id: "entertainment",
      name: "Entertainment",
      emoji: "🎭",
    },
    {
      id: "makeup",
      name: "Makeup",
      emoji: "💄",
    },
    {
      id: "planning",
      name: "Planning",
      emoji: "📋",
    }
  ];

  const findCategoryId = (categoryName: string) => {
    const category = categories.find(cat => 
      cat.name.toLowerCase().includes(categoryName.toLowerCase())
    );
    return category?.id || "#";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Compact Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          {/* Small Category Buttons */}
          <div className="flex items-center justify-between overflow-x-auto space-x-1">
            {smallCategoryButtons.map((button) => (
              <Link 
                key={button.id}
                to={`/category/${findCategoryId(button.name)}`}
                className="flex flex-col items-center p-2 min-w-[70px] rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group"
              >
                <div className="text-xl mb-1">
                  {button.emoji}
                </div>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                  {button.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Banner with Image Slider */}
      <section className="py-4 bg-white">
        <div className="container mx-auto px-4">
          <ImageSlider categories={categories} t={t} />
        </div>
      </section>

      {/* Animated Horizontal Scrolling Cards Section */}
      <HorizontalScrollingContainer t={t} />

      {/* Event Categories Section */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {t('exploreEvents') || "Explore Events"}
            </h2>
            <p className="text-sm text-gray-600">
              {t('eventCategoriesDescription') || "Discover perfect services for every special occasion"}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {eventCategories.map((event, index) => (
              <EventCategoryCard 
                key={event.id}
                event={event}
                index={index}
                t={t}
              />
            ))}
          </div>
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
            t={t}
          />
        );
      })}
    </div>
  );
};

export default Home;