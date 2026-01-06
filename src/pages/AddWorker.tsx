import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { CategoriesService, WorkersService, isDatabaseConfigured } from "@/lib/dataServices";
import type { Category } from "@/lib/dataServices";

const AddWorker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category_id: '',
    location: '',
    experience_years: '',
    description: '',
    price_range: '',
    skills: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await CategoriesService.getAll();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.category_id) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        return;
      }

      // Validate phone format
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
        toast({
          title: "Invalid Phone",
          description: "Please enter a valid phone number",
          variant: "destructive",
        });
        return;
      }

      console.log('📝 Submitting worker registration:', formData);

      // Prepare worker data
      const workerData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        category_id: formData.category_id,
        location: formData.location.trim(),
        experience_years: parseInt(formData.experience_years) || 0,
        description: formData.description.trim(),
        price_range: formData.price_range.trim(),
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        availability: true,
        response_time: 'Within 2 hours',
        specialization: categories.find(cat => cat.id === formData.category_id)?.name || '',
        profile_image_url: '/images/workers/default-worker.jpg'
      };

      // Add worker to database
      const result = await WorkersService.addWorker(workerData);

      if (result) {
        toast({
          title: "Registration Successful!",
          description: `Welcome ${formData.name}! Your worker profile has been created.`,
          duration: 5000,
        });

        console.log('✅ Worker registered successfully:', result);

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          category_id: '',
          location: '',
          experience_years: '',
          description: '',
          price_range: '',
          skills: ''
        });

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        throw new Error('Failed to register worker in database');
      }

    } catch (error) {
      console.error('❌ Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "There was an error creating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if database is configured
  const dbConfigured = isDatabaseConfigured();

  if (!dbConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-6 px-8">
              <CardTitle className="text-3xl text-white font-bold">Worker Registration</CardTitle>
              <CardDescription className="text-blue-100 text-lg mt-2">
                Join our platform as a service provider
              </CardDescription>
            </div>
            
            <CardContent className="p-8 text-center">
              <div className="space-y-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Database Configuration Required
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Worker registration requires database connectivity. Please configure your MongoDB credentials in the .env file.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
                    Go to Home
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-6 px-8">
            <CardTitle className="text-3xl text-white font-bold">Worker Registration</CardTitle>
            <CardDescription className="text-blue-100 text-lg mt-2">
              Join our platform as a service provider
            </CardDescription>
          </div>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Service Category *</Label>
                  <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your service category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => handleInputChange('experience_years', e.target.value)}
                    placeholder="5"
                    min="0"
                    max="50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Service Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your services and experience..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price_range">Price Range</Label>
                  <Input
                    id="price_range"
                    type="text"
                    value={formData.price_range}
                    onChange={(e) => handleInputChange('price_range', e.target.value)}
                    placeholder="₹10,000 - ₹50,000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills/Specializations</Label>
                  <Input
                    id="skills"
                    type="text"
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    placeholder="Photography, Videography, Editing"
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-6">
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register as Worker"}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddWorker;
