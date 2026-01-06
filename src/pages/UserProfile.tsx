import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { authService, type User, type UserProfile } from "@/lib/authService";
import { WorkersService } from "@/lib/dataServices";
import { 
  User as UserIcon, 
  Edit3, 
  Save, 
  Heart, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Briefcase,
  Settings,
  History,
  Star,
  X
} from "lucide-react";

const UserProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favoriteWorkers, setFavoriteWorkers] = useState<any[]>([]);
  
  // Form states
  const [profileForm, setProfileForm] = useState<UserProfile>({
    bio: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    dateOfBirth: '',
    gender: undefined,
    occupation: '',
    company: '',
    preferences: {
      language: 'en',
      notifications: true,
      emailUpdates: false
    },
    avatar: '',
    socialLinks: {},
    eventHistory: [],
    favorites: [],
    updated_at: new Date()
  });

  const [personalForm, setPersonalForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Check authentication and load user data
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access your profile.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setCurrentUser(user);
    setPersonalForm({
      name: user.name,
      email: user.email,
      phone: user.phone || ''
    });
    
    // Load user profile
    const profile = authService.getUserProfile();
    if (profile) {
      setProfileForm(profile);
    }

    // Load favorite workers
    loadFavoriteWorkers(user.profile.favorites || []);
  }, [navigate, toast]);

  const loadFavoriteWorkers = async (favoriteIds: string[]) => {
    if (favoriteIds.length === 0) return;
    
    try {
      const allWorkers = await WorkersService.getAll();
      const favorites = allWorkers.filter(worker => favoriteIds.includes(worker.id));
      setFavoriteWorkers(favorites);
    } catch (error) {
      console.error('Error loading favorite workers:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // Update profile data
      const result = await authService.updateProfile(profileForm);
      
      if (result.success && result.user) {
        setCurrentUser(result.user);
        toast({
          title: "Profile Updated",
          description: "Your profile has been saved successfully.",
        });
        setIsEditing(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (workerId: string) => {
    try {
      const result = await authService.removeFromFavorites(workerId);
      if (result.success) {
        // Update local state
        setFavoriteWorkers(prev => prev.filter(worker => worker.id !== workerId));
        setProfileForm(prev => ({
          ...prev,
          favorites: prev.favorites?.filter(id => id !== workerId) || []
        }));
        
        toast({
          title: "Removed from Favorites",
          description: "Worker removed from your favorites.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove from favorites.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-6 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <UserIcon className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{currentUser.name}</CardTitle>
                  <CardDescription className="text-blue-100">
                    Member since {formatDate(currentUser.created_at.toString())}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500 text-white">
                Active User
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites ({favoriteWorkers.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={personalForm.name}
                        onChange={(e) => setPersonalForm(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={personalForm.email}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={personalForm.phone}
                        onChange={(e) => setPersonalForm(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={profileForm.dateOfBirth || ''}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={profileForm.bio || ''}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>

                  {isEditing && (
                    <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={profileForm.address || ''}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Enter your street address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={profileForm.city || ''}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={profileForm.state || ''}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, state: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="State"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input
                      id="pincode"
                      value={profileForm.pincode || ''}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, pincode: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="PIN Code"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Favorite Workers ({favoriteWorkers.length})
                </CardTitle>
                <CardDescription>
                  Workers you've added to your favorites for easy access
                </CardDescription>
              </CardHeader>
              <CardContent>
                {favoriteWorkers.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No favorite workers yet</p>
                    <p className="text-gray-400 text-sm">Add workers to favorites while browsing</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteWorkers.map((worker) => (
                      <Card key={worker.id} className="relative">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold">{worker.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFromFavorites(worker.id)}
                              className="text-red-500 hover:text-red-700 p-1 h-auto"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{worker.specialization}</p>
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{worker.rating}</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/worker/${worker.id}`)}
                            className="w-full"
                          >
                            View Profile
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Event History
                </CardTitle>
                <CardDescription>
                  Your past bookings and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profileForm.eventHistory?.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No event history yet</p>
                    <p className="text-gray-400 text-sm">Your booked events will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profileForm.eventHistory?.map((event) => (
                      <Card key={event.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{event.eventType}</h3>
                            <Badge variant="outline">
                              {formatDate(event.date)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Workers: {event.workers.length} booked
                          </p>
                          {event.amount && (
                            <p className="text-sm font-medium text-green-600">
                              Amount: ₹{event.amount.toLocaleString()}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive updates about your bookings</p>
                    </div>
                    <Switch
                      checked={profileForm.preferences?.notifications || false}
                      onCheckedChange={(checked) => 
                        setProfileForm(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences!, notifications: checked }
                        }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-gray-500">Receive promotional offers and updates</p>
                    </div>
                    <Switch
                      checked={profileForm.preferences?.emailUpdates || false}
                      onCheckedChange={(checked) => 
                        setProfileForm(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences!, emailUpdates: checked }
                        }))
                      }
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
