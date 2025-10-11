import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Plus, Camera, Image as ImageIcon } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

const AddWorker = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    phone: "",
    email: "",
    location: "",
    description: "",
    experience_years: 0,
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [workImages, setWorkImages] = useState<File[]>([]);
  const [workPreviews, setWorkPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add a worker profile",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };

    const fetchCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");
      setCategories(data || []);
    };

    checkAuth();
    fetchCategories();
  }, [navigate, toast]);

  // Profile image preview
  useEffect(() => {
    if (profileImage) {
      const objectUrl = URL.createObjectURL(profileImage);
      setProfilePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [profileImage]);

  // Work images preview
  useEffect(() => {
    const objectUrls = workImages.map(file => URL.createObjectURL(file));
    setWorkPreviews(objectUrls);
    return () => objectUrls.forEach(url => URL.revokeObjectURL(url));
  }, [workImages]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setProfileImage(file);
    }
  };

  const handleWorkImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (workImages.length + validFiles.length > 10) {
      toast({
        title: "Too many images",
        description: "You can upload up to 10 work images",
        variant: "destructive",
      });
      return;
    }

    setWorkImages(prev => [...prev, ...validFiles]);
  };

  const removeWorkImage = (index: number) => {
    setWorkImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfilePreview("");
  };

  const uploadImage = async (file: File, path: string): Promise<string> => {
    const { data, error } = await supabase.storage
      .from('worker-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('worker-images')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to add a worker",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name.trim() || !formData.category_id || !formData.phone.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let profileImageUrl = null;
      const workImageUrls: string[] = [];

      // Upload profile image
      if (profileImage) {
        const profilePath = `profiles/${user.id}/${Date.now()}_${profileImage.name}`;
        profileImageUrl = await uploadImage(profileImage, profilePath);
      }

      // Upload work images
      for (const [index, image] of workImages.entries()) {
        const workPath = `works/${user.id}/${Date.now()}_${index}_${image.name}`;
        const url = await uploadImage(image, workPath);
        workImageUrls.push(url);
      }

      // Insert worker data
      const { data: workerData, error: workerError } = await supabase
        .from("workers")
        .insert([
          {
            ...formData,
            user_id: user.id,
            profile_image_url: profileImageUrl,
          },
        ])
        .select()
        .single();

      if (workerError) throw workerError;

      // Insert work images
      if (workImageUrls.length > 0 && workerData) {
        const workImageRecords = workImageUrls.map(url => ({
          worker_id: workerData.id,
          image_url: url,
          description: "Previous work"
        }));

        const { error: imagesError } = await supabase
          .from("worker_images")
          .insert(workImageRecords);

        if (imagesError) {
          console.error("Error inserting work images:", imagesError);
        }
      }

      toast({
        title: "Success! 🎉",
        description: "Your worker profile has been created successfully",
      });
      
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error: any) {
      console.error("Error creating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Create Your Professional Profile
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Showcase your skills and connect with customers looking for your expertise
          </p>
        </div>

        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-6 px-8">
            <CardTitle className="text-3xl text-white font-bold">Worker Profile</CardTitle>
            <CardDescription className="text-blue-100 text-lg mt-2">
              Fill in your details to create an amazing profile
            </CardDescription>
          </div>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Basic Info */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-lg font-semibold">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="h-12 text-lg border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-lg font-semibold">Service Category *</Label>
                    <Select
                      required
                      value={formData.category_id}
                      onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                    >
                      <SelectTrigger className="h-12 text-lg border-2 focus:border-blue-500">
                        <SelectValue placeholder="Select your expertise" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id} className="text-lg">
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-lg font-semibold">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="h-12 text-lg border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-lg font-semibold">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="h-12 text-lg border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Right Column - Location & Experience */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-lg font-semibold">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, State"
                      className="h-12 text-lg border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-lg font-semibold">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.experience_years}
                      onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                      className="h-12 text-lg border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Profile Image Upload */}
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold">Profile Photo</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                      {profilePreview ? (
                        <div className="relative inline-block">
                          <img
                            src={profilePreview}
                            alt="Profile preview"
                            className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={removeProfileImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 mb-2">Upload your profile photo</p>
                          <Label htmlFor="profile-upload" className="cursor-pointer">
                            <Button type="button" variant="outline" className="gap-2">
                              <Upload className="h-4 w-4" />
                              Choose Image
                            </Button>
                          </Label>
                        </>
                      )}
                      <Input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Images Upload */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Previous Work Images</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 transition-colors">
                  <div className="text-center mb-4">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">Upload images of your previous work</p>
                    <Label htmlFor="work-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Work Images
                      </Button>
                    </Label>
                    <Input
                      id="work-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleWorkImagesChange}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500 mt-2">Up to 10 images, 5MB each</p>
                  </div>

                  {workPreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
                      {workPreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Work ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-500 transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => removeWorkImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg font-semibold">About Yourself & Services</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell us about your experience, skills, services you offer, and what makes you unique..."
                  rows={6}
                  className="text-lg border-2 focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full py-6 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Creating Your Profile...
                  </div>
                ) : (
                  "Launch Your Profile"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddWorker;