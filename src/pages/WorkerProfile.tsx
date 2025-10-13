import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Star, Calendar, Award, Users, Shield, ShoppingCart, MessageSquare, Briefcase } from "lucide-react";
import { addToCart } from "@/lib/cartUtils";

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
  category_id: string;
  categories?: {
    name: string;
  };
}

interface WorkerImage {
  id: string;
  image_url: string;
  description: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  client_name: string;
  created_at: string;
}

const WorkerProfile = () => {
  const { workerId } = useParams();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [images, setImages] = useState<WorkerImage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      // Check user authentication
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
      
      // Fetch worker details with category
      const { data: workerData, error: workerError } = await supabase
        .from("workers")
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq("id", workerId)
        .single();

      if (workerError) {
        toast({
          title: "Error",
          description: "Failed to load worker profile",
          variant: "destructive",
        });
      } else {
        setWorker(workerData);
      }

      // Fetch worker images
      const { data: imagesData, error: imagesError } = await supabase
        .from("worker_images")
        .select("*")
        .eq("worker_id", workerId)
        .order("created_at", { ascending: false });

      if (!imagesError) {
        setImages(imagesData || []);
      }

      // Fetch worker reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("worker_reviews")
        .select("*")
        .eq("worker_id", workerId)
        .order("created_at", { ascending: false });

      if (!reviewsError && reviewsData) {
        setReviews(reviewsData);
        
        // Calculate average rating from reviews
        if (reviewsData.length > 0 && workerData) {
          const averageRating = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
          // Update worker with calculated rating
          setWorker(prev => prev ? { ...prev, rating: parseFloat(averageRating.toFixed(1)) } : null);
        }
      }

      setLoading(false);
    };

    if (workerId) {
      fetchData();
    }
  }, [workerId, toast]);

  const handleAddToCart = () => {
    if (!worker || !user) {
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to add workers to your cart.",
        variant: "destructive",
      });
      return;
    }
    
    // Create cart item
    const item = {
      id: worker.id,
      name: worker.name,
      phone: worker.phone,
      category: worker.categories?.name,
      addedAt: new Date().toISOString(),
    };
    
    try {
      addToCart(user.id, item);
      
      toast({
        title: "Added to Cart! 🛒",
        description: `${worker.name} has been added to your cart for booking.`,
        duration: 3000
      });
    } catch (error) {
      toast({
        title: "Already in Cart",
        description: `${worker.name} is already in your cart.`,
        variant: "destructive",
      });
    }
  };

  const handleBookWorker = () => {
    if (!worker || !user) {
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to book workers.",
        variant: "destructive",
      });
      return;
    }
    
    // Create cart item
    const item = {
      id: worker.id,
      name: worker.name,
      phone: worker.phone,
      category: worker.categories?.name,
      addedAt: new Date().toISOString(),
    };
    
    try {
      addToCart(user.id, item);
      
      toast({
        title: "Booked Successfully! ✅",
        description: `${worker.name} has been booked for your event.`,
        duration: 3000
      });
    } catch (error) {
      toast({
        title: "Already Booked",
        description: `${worker.name} is already in your cart.`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-16 bg-gray-200 rounded" />
                </div>
                <div className="w-full lg:w-64 space-y-4">
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-16 text-center">
              <div className="text-6xl mb-4">😔</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Worker Not Found</h2>
              <p className="text-gray-600">The worker profile you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        {/* Main Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Compact Profile Header Card */}
            <Card className="shadow-md border border-gray-300 rounded-lg overflow-hidden bg-white">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-white rounded-full border-2 border-gray-200 shadow-md flex items-center justify-center">
                      {worker.profile_image_url ? (
                        <img
                          src={worker.profile_image_url}
                          alt={worker.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                          {worker.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Profile Details */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl font-semibold text-gray-800">{worker.name}</CardTitle>
                          {worker.rating > 0 && (
                            <Badge className="bg-amber-50 text-amber-700 border-amber-200 px-2 py-1 flex items-center gap-1 text-xs">
                              <Star className="h-3 w-3 fill-current" />
                              {worker.rating.toFixed(1)}
                            </Badge>
                          )}
                        </div>
                        {worker.categories && (
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-sm">
                            {worker.categories.name}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Compact Stats Grid */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
                        <Award className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                        <div className="text-sm font-semibold text-gray-800">{worker.experience_years}+</div>
                        <div className="text-xs text-gray-600">Years</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200 shadow-sm">
                        <Briefcase className="h-4 w-4 text-green-600 mx-auto mb-1" />
                        <div className="text-sm font-semibold text-gray-800">50+</div>
                        <div className="text-xs text-gray-600">Projects</div>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200 shadow-sm">
                        <Star className="h-4 w-4 text-amber-600 mx-auto mb-1" />
                        <div className="text-sm font-semibold text-gray-800">{worker.rating}</div>
                        <div className="text-xs text-gray-600">Rating</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200 shadow-sm">
                        <Shield className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                        <div className="text-sm font-semibold text-gray-800">100%</div>
                        <div className="text-xs text-gray-600">Verified</div>
                      </div>
                    </div>

                    {/* Description */}
                    {worker.description && (
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-700 mb-2">About Me</h3>
                        <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded border border-gray-200">
                          {worker.description}
                        </p>
                      </div>
                    )}

                    {/* Contact Information */}
                    <div>
                      <h3 className="font-medium text-gray-700 mb-3">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-600">Worker Name</div>
                            <div className="text-sm font-medium text-gray-800">{worker.name}</div>
                          </div>
                        </div>
                        {worker.location && (
                          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <MapPin className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">Location</div>
                              <div className="text-sm font-medium text-gray-800">{worker.location}</div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Calendar className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-600">Member Since</div>
                            <div className="text-sm font-medium text-gray-800">
                              {new Date(worker.created_at).getFullYear()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Action Buttons */}
          <div className="space-y-6">
            <Card className="shadow-md border border-gray-300 rounded-lg bg-white">
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {user ? (
                    <>
                      <Button
                        onClick={handleAddToCart}
                        variant="outline"
                        className="w-full border-gray-300 py-2.5 bg-white hover:bg-gray-50"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        onClick={handleBookWorker}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 font-medium"
                      >
                        <Briefcase className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => toast({
                        title: "Please Sign In",
                        description: "You need to sign in to book workers.",
                        variant: "destructive",
                      })}
                      variant="outline"
                      className="w-full py-2.5 border-gray-300 bg-white hover:bg-gray-50"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Sign In to Book
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Availability Card */}
            <Card className="shadow-md border border-gray-300 rounded-lg bg-white">
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Availability</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">Available</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="text-sm font-medium text-gray-800">Within 1 hour</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <span className="text-sm text-gray-600">Work Type</span>
                    <span className="text-sm font-medium text-gray-800">Full-time</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Previous Works Gallery */}
        <Card className="shadow-md border border-gray-300 rounded-lg mb-6 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-gray-600" />
              Previous Works Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            {images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={image.id} className="group relative overflow-hidden rounded-lg border-2 border-blue-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                    <div className="aspect-video bg-blue-50 rounded-lg overflow-hidden">
                      {image.image_url ? (
                        <img
                          src={image.image_url}
                          alt={image.description || `Work ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl text-blue-400">
                          📷
                        </div>
                      )}
                    </div>
                    {image.description && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/80 to-transparent p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-xs">{image.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-blue-50 rounded-lg border-2 border-blue-200">
                <Briefcase className="h-12 w-12 mx-auto mb-3 text-blue-300" />
                <p className="text-sm mb-4">No previous works added yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card className="shadow-md border border-gray-300 rounded-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gray-600" />
              Customer Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-3 w-3 ${
                            star <= review.rating 
                              ? "fill-amber-400 text-amber-400" 
                              : "fill-gray-300 text-gray-300"
                          }`} 
                        />
                      ))}
                      <span className="text-xs text-gray-600 ml-2">({review.rating}.0)</span>
                    </div>
                    <p className="text-gray-600 text-sm italic mb-3">
                      "{review.comment}"
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-gray-800 text-sm">- {review.client_name}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-amber-50 rounded-lg border border-amber-200">
                <MessageSquare className="h-8 w-8 mx-auto mb-3 text-amber-300" />
                <p className="text-sm">No reviews yet. Be the first to review this worker!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkerProfile;