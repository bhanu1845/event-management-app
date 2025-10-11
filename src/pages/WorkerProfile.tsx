import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Star, Calendar, Award, Users, Shield, ShoppingCart, MessageCircle, Share2 } from "lucide-react";

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

const WorkerProfile = () => {
  const { workerId } = useParams();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [images, setImages] = useState<WorkerImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
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

      setLoading(false);
    };

    if (workerId) {
      fetchData();
    }
  }, [workerId, toast]);

  const handleAddToCart = () => {
    if (!worker) return;
    
    // Simplified object to store in cart (for cleaner localStorage)
    const item = {
      id: worker.id,
      name: worker.name,
      profile_image_url: worker.profile_image_url,
      // You can add a price/rate field here if your worker table had one
    };
    
    // 1. Get existing cart from localStorage using the 'cart' key
    const existingCartRaw = localStorage.getItem('cart') || '[]';
    let existingCart: any[];
    try {
        existingCart = JSON.parse(existingCartRaw);
    } catch {
        existingCart = [];
    }
    
    // 2. Check if worker is already in cart
    const isAlreadyInCart = existingCart.some((cartItem: typeof item) => cartItem.id === item.id);
    
    if (isAlreadyInCart) {
      toast({
        title: "Already in Cart",
        description: `${worker.name} is already in your cart.`,
        variant: "destructive",
      });
      return;
    }

    // 3. Add to cart and save
    const updatedCart = [...existingCart, item];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // 4. Dispatch the event to update the Navbar/any other listener
    window.dispatchEvent(new Event("cartUpdated")); 

    toast({
      title: "Added to Cart! 🛒",
      description: `${worker.name} has been added to your cart for booking.`,
      duration: 3000
    });
  };

  const handleShareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${worker?.name} - Professional Worker`,
          text: `Check out ${worker?.name}'s profile on EventHub`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Profile link copied to clipboard",
      });
    }
  };

  const handleContact = () => {
    if (worker?.phone) {
      // Clean the phone number (remove non-digits) before calling
      const phoneNumber = worker.phone.replace(/\D/g, '');
      window.open(`tel:${phoneNumber}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            {/* Profile Skeleton */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-20 bg-muted rounded" />
                </div>
                <div className="w-full lg:w-80 space-y-4">
                  <div className="h-12 bg-muted rounded" />
                  <div className="h-12 bg-muted rounded" />
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-16 text-center">
              <div className="text-6xl mb-4">😔</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Worker Not Found</h2>
              <p className="text-muted-foreground">The worker profile you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        {/* Main Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 relative">
                <div className="absolute -bottom-16 left-8">
                  <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    {worker.profile_image_url ? (
                      <img
                        src={worker.profile_image_url}
                        alt={worker.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {worker.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <CardContent className="pt-20 pb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-3xl font-bold text-gray-800">{worker.name}</CardTitle>
                      {worker.rating > 0 && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-0 px-3 py-1 flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current" />
                          {worker.rating.toFixed(1)}
                        </Badge>
                      )}
                    </div>
                    {worker.categories && (
                      <Badge variant="secondary" className="text-lg px-4 py-1">
                        {worker.categories.name}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShareProfile}
                      className="flex items-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Award className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{worker.experience_years}+</div>
                    <div className="text-sm text-gray-600">Years Exp</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">50+</div>
                    <div className="text-sm text-gray-600">Projects</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Star className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{worker.rating}</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Shield className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">100%</div>
                    <div className="text-sm text-gray-600">Verified</div>
                  </div>
                </div>

                {/* Description */}
                {worker.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">About Me</h3>
                    <p className="text-gray-600 leading-relaxed bg-white p-4 rounded-lg border">
                      {worker.description}
                    </p>
                  </div>
                )}

                {/* Contact Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-gray-800">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Phone className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="font-medium text-gray-800">{worker.phone}</div>
                      </div>
                    </div>
                    {worker.email && (
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Mail className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Email</div>
                          <div className="font-medium text-gray-800">{worker.email}</div>
                        </div>
                      </div>
                    )}
                    {worker.location && (
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <MapPin className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Location</div>
                          <div className="font-medium text-gray-800">{worker.location}</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Member Since</div>
                        <div className="font-medium text-gray-800">
                          {new Date(worker.created_at).getFullYear()}
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
            <Card className="shadow-xl border-0 rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleContact}
                    variant="outline"
                    className="w-full py-3 text-lg border-2"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Call Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full py-3 text-lg border-2"
                    onClick={() => {
                        const phoneNumber = worker?.phone?.replace(/\D/g, '') || '';
                        window.open(`https://wa.me/${phoneNumber}`, '_blank')
                    }}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Availability Card */}
            <Card className="shadow-xl border-0 rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">Availability</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <Badge className="bg-green-100 text-green-800 border-0">Available</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-medium">Within 1 hour</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Work Type</span>
                    <span className="font-medium">Full-time</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Previous Works Gallery */}
        {images.length > 0 && (
          <Card className="shadow-xl border-0 rounded-2xl mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Award className="h-6 w-6 text-purple-600" />
                Previous Works Gallery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image, index) => (
                  <div key={image.id} className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl overflow-hidden">
                      {image.image_url ? (
                        <img
                          src={image.image_url}
                          alt={image.description || `Work ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          📷
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      {image.description && (
                        <p className="text-sm">{image.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Testimonials Section */}
        <Card className="shadow-xl border-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="h-6 w-6 text-green-600" />
              Client Testimonials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">
                  "Excellent work! Professional and delivered on time. Highly recommended for any event planning needs."
                </p>
                <div className="font-semibold text-gray-800">- Rajesh Kumar</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">
                  "Outstanding service and attention to detail. Made our wedding day absolutely perfect!"
                </p>
                <div className="font-semibold text-gray-800">- Priya Sharma</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkerProfile;