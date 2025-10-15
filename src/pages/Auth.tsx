import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const Auth = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkUser();
  }, [navigate]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (isSignUp: boolean) => {
    const newErrors: Record<string, string> = {};

    if (isSignUp) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      } else if (formData.fullName.trim().length < 2) {
        newErrors.fullName = "Full name must be at least 2 characters";
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = "Please enter a valid 10-digit phone number";
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handlePhoneChange = (value: string) => {
    // Format phone number as user types
    const numbers = value.replace(/\D/g, '');
    let formatted = numbers;
    
    if (numbers.length > 3 && numbers.length <= 6) {
      formatted = `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else if (numbers.length > 6) {
      formatted = `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
    
    handleInputChange('phone', formatted);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(true)) return;
    
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: formData.fullName,
          phone: formData.phone
        }
      },
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Account Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome to EventEase!",
        description: "Please check your email to verify your account.",
      });
      setActiveTab("signin");
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        password: ""
      });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(false)) return;
    
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome Back!",
        description: "Ready to create amazing events?",
      });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Background with Local Night Light Decoration Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/background.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-center items-center px-12 relative z-10">
        <div className="text-center space-y-8 text-white">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-sm border border-white/30">
              <Sparkles className="h-16 w-16 text-blue-300" />
            </div>
            <div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
                EventEase
              </h1>
              <p className="text-xl text-blue-100 mt-4 font-light">
                Where Events Come to Life
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header */}
          <div className="lg:hidden text-center">
            <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              EventEase
            </h1>
            <p className="mt-3 text-lg text-blue-100">
              Where Events Come to Life
            </p>
          </div>

          <Card className="w-full border-0 shadow-2xl rounded-3xl bg-white/95 backdrop-blur-sm border border-white/20">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeTab === "signin" ? "Welcome Back" : "Join EventEase"}
                </h2>
                <p className="text-gray-600 mt-2">
                  {activeTab === "signin" 
                    ? "Sign in to manage your events" 
                    : "Create your account to get started"
                  }
                </p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 rounded-2xl">
                  <TabsTrigger 
                    value="signin" 
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-xl transition-all duration-200 text-gray-600 font-medium"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-xl transition-all duration-200 text-gray-600 font-medium"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="signin" className="space-y-6 mt-6">
                  <form onSubmit={handleSignIn} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email-signin" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      <Input
                        id="email-signin"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="h-12 border-gray-300 focus:border-blue-600 focus:ring-blue-600 transition-colors rounded-xl"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password-signin" className="text-sm font-medium text-gray-700">
                          Password
                        </Label>
                        <button
                          type="button"
                          className="text-xs text-blue-700 hover:text-blue-800 font-medium"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <Input
                        id="password-signin"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                        className="h-12 border-gray-300 focus:border-blue-600 focus:ring-blue-600 transition-colors rounded-xl"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-sm shadow-lg transition-all duration-200 rounded-xl"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Signing in...
                        </div>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </form>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium rounded-xl transition-colors"
                    onClick={() => setActiveTab("signup")}
                  >
                    New User? Sign Up
                  </Button>
                </TabsContent>

                {/* Sign Up Form */}
                <TabsContent value="signup" className="space-y-6 mt-6">
                  <form onSubmit={handleSignUp} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        required
                        className="h-12 border-gray-300 focus:border-blue-600 focus:ring-blue-600 transition-colors rounded-xl"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(123) 456-7890"
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        required
                        className="h-12 border-gray-300 focus:border-blue-600 focus:ring-blue-600 transition-colors rounded-xl"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-signup" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      <Input
                        id="email-signup"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="h-12 border-gray-300 focus:border-blue-600 focus:ring-blue-600 transition-colors rounded-xl"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password-signup" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <Input
                        id="password-signup"
                        type="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                        minLength={6}
                        className="h-12 border-gray-300 focus:border-blue-600 focus:ring-blue-600 transition-colors rounded-xl"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Must be at least 6 characters long
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-sm shadow-lg transition-all duration-200 rounded-xl"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating account...
                        </div>
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  </form>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium rounded-xl transition-colors"
                    onClick={() => setActiveTab("signin")}
                  >
                    Existing User? Login
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-white/80">
              By continuing, you agree to our{" "}
              <a href="#" className="text-blue-300 hover:text-blue-200 font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-300 hover:text-blue-200 font-medium">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;