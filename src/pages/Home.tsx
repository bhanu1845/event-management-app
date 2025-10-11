import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Users, Award, Clock, Sparkles, Search, Calendar, Heart, ArrowRight } from "lucide-react";

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
}

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredWorkers, setFeaturedWorkers] = useState<Worker[]>([]);
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

        // Fetch featured workers (top rated)
        const { data: workersData, error: workersError } = await supabase
          .from("workers")
          .select("id, name, rating, experience_years, category_id")
          .order("rating", { ascending: false })
          .limit(6);

        if (workersError) throw workersError;
        setFeaturedWorkers(workersData || []);

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

  /**
   * Get category image based on category name
   */
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

  // Features data array for cleaner code
  const features = [
    {
      icon: <Award className="h-8 w-8" />,
      title: "Verified Professionals",
      description: "All our workers are thoroughly verified and background checked"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Quick Booking",
      description: "Book your preferred professional in just a few clicks"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Top Ratings",
      description: "Choose from highly rated and reviewed experts"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2000ms' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4000ms' }}></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl">
          <Badge className="mb-6 bg-white/10 backdrop-blur-sm text-white border-0 px-6 py-2 text-lg">
            🎉 Trusted by 5000+ Customers
          </Badge>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              Event Expert
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with verified professionals for weddings, corporate events, parties, and more. 
            Your dream event is just a click away!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild size="lg" className="bg-gradient-to-r from-yellow-500 to-pink-500 hover:from-yellow-600 hover:to-pink-600 text-white px-8 py-6 text-lg font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
              <Link to="/auth">
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started Free
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-6 text-lg font-bold rounded-2xl backdrop-blur-sm">
              <Link to="#categories">
                <Search className="w-5 h-5 mr-2" />
                Explore Services
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">5000+</div>
              <div className="text-white/70">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">200+</div>
              <div className="text-white/70">Expert Workers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-white/70">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">4.9★</div>
              <div className="text-white/70">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-1 text-sm">
              🎯 OUR SERVICES
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Discover Amazing Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From photography to catering, find everything you need for your perfect event
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse border-0 rounded-2xl shadow-lg">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-2xl"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link key={category.id} to={`/category/${category.id}`}>
                  <Card className="group h-full border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden bg-white/80 backdrop-blur-sm">
                    <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="relative w-full h-full">
                          <img
                            src={getCategoryImage(category.name)}
                            alt={category.name}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=${encodeURIComponent(category.name)}`;
                            }}
                          />
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>
                          
                          <div className="absolute top-2 right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                            <span className="text-sm">⭐</span>
                          </div>
                          
                          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="text-white text-center">
                              <div className="text-lg font-bold mb-1 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                                Explore Services
                              </div>
                              <div className="w-8 h-1 bg-yellow-400 mx-auto transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-300"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 left-4">
                        <div className="w-3 h-3 bg-white rounded-full animate-ping opacity-60"></div>
                      </div>
                      
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          {category.name.includes("DJ") ? "🎵 Music" : 
                           category.name.includes("Catering") ? "🍽️ Food" :
                           category.name.includes("Photography") ? "📸 Photos" :
                           category.name.includes("Decoration") ? "🎨 Decor" :
                           category.name.includes("Venue") ? "🏢 Venue" :
                           category.name.includes("Entertainment") ? "🎭 Fun" : "Popular"}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6 relative">
                      <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
                      </div>
                      
                      <CardTitle className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors relative z-10">
                        {category.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed relative z-10">
                        {category.description}
                      </CardDescription>
                      
                      <div className="flex items-center justify-between mt-4 relative z-10">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Users className="h-4 w-4" />
                          <span>50+ Experts</span>
                        </div>
                        <div className="relative">
                          <ArrowRight className="h-5 w-5 text-blue-500 transform group-hover:translate-x-1 transition-transform" />
                          <div className="absolute -inset-2 bg-blue-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                      
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl transition-all duration-500 pointer-events-none"></div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Workers Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-1 text-sm">
              ⭐ FEATURED EXPERTS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Meet Our Top Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked experts with proven track records and excellent customer reviews
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredWorkers.map((worker, index) => (
              <Card key={worker.id} className="group border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-800">
                        {worker.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{worker.rating}</span>
                        <span className="text-gray-500">•</span>
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-600">{worker.experience_years} years</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {worker.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completed Projects</span>
                      <span className="font-semibold">150+</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-semibold text-green-600">Within 1 hour</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Satisfaction Rate</span>
                      <span className="font-semibold">98%</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button asChild className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Link to={`/worker/${worker.id}`}>
                        View Profile
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-1 text-sm">
              ✨ WHY CHOOSE US
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              The Best Platform for Event Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make event planning simple, reliable, and stress-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold mb-3">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Plan Your Perfect Event?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect event professionals through our platform
          </p>
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-bold rounded-2xl">
            <Link to="/auth">
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started Today
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;