// src/pages/Category.tsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Star, Search, Filter, Users, Award, Clock, Sparkles } from "lucide-react";
import { useWorkerCart } from "@/hooks/useWorkerCart";

interface Worker {
  id: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  location: string;
  profile_image_url: string;
  experience_years: number;
  rating: number;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

const Category = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "experience" | "newest">("rating");
  const { toast } = useToast();
  
  const { cart, addToCart } = useWorkerCart();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch category details
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("*")
        .eq("id", categoryId)
        .single();

      if (categoryError) {
        toast({
          title: "Error",
          description: "Failed to load category",
          variant: "destructive",
        });
      } else {
        setCategory(categoryData);
      }

      // Fetch workers in this category
      const { data: workersData, error: workersError } = await supabase
        .from("workers")
        .select("*")
        .eq("category_id", categoryId)
        .order("rating", { ascending: false });

      if (workersError) {
        toast({
          title: "Error",
          description: "Failed to load workers",
          variant: "destructive",
        });
      } else {
        setWorkers(workersData || []);
        setFilteredWorkers(workersData || []);
      }

      setLoading(false);
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId, toast]);

  // Filter and sort workers
  useEffect(() => {
    let result = [...workers];

    // Search filter
    if (searchQuery) {
      result = result.filter(worker =>
        worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "experience":
        result.sort((a, b) => b.experience_years - a.experience_years);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    setFilteredWorkers(result);
  }, [workers, searchQuery, sortBy]);

  const handleAddToCart = (worker: Worker, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(worker);
  };
  
  const isWorkerInCart = (workerId: string) => {
    return cart.some(item => item.id === workerId);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        {/* Category Header */}
        {category && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-600">Premium Category</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {category.name}
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {category.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{workers.length}+</div>
                <div className="text-gray-600">Expert Workers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.max(...workers.map(w => w.experience_years))}+
                </div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {workers.filter(w => w.rating >= 4).length}+
                </div>
                <div className="text-gray-600">Top Rated</div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search workers by name, location, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-full border-0 bg-white/50"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "rating" | "experience" | "newest")}
                className="px-4 py-2 rounded-full border-0 bg-white/50 text-sm font-medium"
              >
                <option value="rating">Sort by Rating</option>
                <option value="experience">Sort by Experience</option>
                <option value="newest">Sort by Newest</option>
              </select>
              
              <Button variant="outline" size="icon" className="rounded-full">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Workers Grid */}
        {filteredWorkers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Workers Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
            <Button onClick={() => setSearchQuery("")} variant="outline">
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorkers.map((worker) => (
              <Link key={worker.id} to={`/worker/${worker.id}`}>
                <Card className="group h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer border-0 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
                  {/* Header with Image and Badges */}
                  <CardHeader className="p-0 relative">
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                      {worker.profile_image_url ? (
                        <img
                          src={worker.profile_image_url}
                          alt={worker.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600">
                          {worker.name.charAt(0)}
                        </div>
                      )}
                      
                      {/* Experience Badge */}
                      <Badge className="absolute top-4 left-4 bg-blue-600 text-white border-0">
                        <Award className="h-3 w-3 mr-1" />
                        {worker.experience_years} yrs
                      </Badge>
                      
                      {/* Rating Badge */}
                      <Badge className="absolute top-4 right-4 bg-yellow-500 text-white border-0">
                        <Star className="h-3 w-3 mr-1" />
                        {worker.rating}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    {/* Title and Description */}
                    <CardTitle className="text-xl mb-2 group-hover:text-blue-600 transition-colors">
                      {worker.name}
                    </CardTitle>
                    
                    <CardDescription className="text-sm mb-4 line-clamp-2">
                      {worker.description || "Professional service provider with excellent skills and experience."}
                    </CardDescription>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      {worker.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{worker.phone}</span>
                        </div>
                      )}
                      
                      {worker.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{worker.email}</span>
                        </div>
                      )}
                      
                      {worker.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{worker.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {isWorkerInCart(worker.id) ? (
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700 cursor-default"
                          disabled
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          In Cart
                        </Button>
                      ) : (
                        <Button 
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={(e) => handleAddToCart(worker, e)}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      )}
                      
                      <Button variant="outline" size="icon" asChild>
                        <Link to={`/worker/${worker.id}`}>
                          <Users className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our platform is constantly growing with new professionals joining every day. 
              Check back soon or try adjusting your search criteria.
            </p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Link to="/">
                Browse All Categories
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;