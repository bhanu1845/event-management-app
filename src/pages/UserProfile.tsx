import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Camera,
  Settings,
  Shield,
  Heart,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import "../styles/UserProfile.css";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  profile_image_url: string;
  created_at: string;
  updated_at: string;
}

interface Order {
  id: string;
  worker_id: string;
  service_type: string;
  event_date: string;
  status: string;
  total_amount: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  notes: string;
  created_at: string;
  workers?: {
    name: string;
    profile_image_url: string;
    category_id: string;
    categories?: {
      name: string;
    };
  };
}

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    profile_image_url: ""
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.user) {
          console.log("No user session found", { sessionError, hasSession: !!session });
          toast({
            title: currentLanguage === 'te' ? "లాగిన్ అవసరం" : "Login Required",
            description: currentLanguage === 'te' ? "దయచేసి మొదట లాగిన్ చేయండి" : "Please login first",
            variant: "destructive",
          });
          // Redirect to login page after a short delay
          setTimeout(() => {
            window.location.href = '/auth';
          }, 2000);
          return;
        }

        console.log("User found:", session.user.id);
        setUser(session.user);

        // Try to fetch existing profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        console.log("Profile fetch result:", { profileData, profileError });

        if (profileError) {
          console.log("Profile fetch error:", profileError);
          
          // If profile doesn't exist, create a new one
          if (profileError.code === 'PGRST116') {
            console.log("Creating new profile...");
            const defaultProfile = {
              id: session.user.id,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "User",
              email: session.user.email || "",
              phone: "",
              address: "",
              profile_image_url: "",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            console.log("Creating profile with data:", defaultProfile);

            const { data: newProfile, error: createError } = await supabase
              .from("profiles")
              .insert([defaultProfile])
              .select()
              .single();

            if (createError) {
              console.error("Error creating profile:", createError);
              toast({
                title: "Error",
                description: "Failed to create user profile. Please check if you're logged in.",
                variant: "destructive",
              });
              return;
            }

            console.log("New profile created:", newProfile);
            setProfile(newProfile);
            setEditForm({
              full_name: newProfile.full_name,
              phone: newProfile.phone,
              address: newProfile.address,
              profile_image_url: newProfile.profile_image_url
            });
          } else {
            console.error("Unknown profile error:", profileError);
            toast({
              title: "Database Error",
              description: `Failed to fetch profile: ${profileError.message}`,
              variant: "destructive",
            });
            throw profileError;
          }
        } else {
          console.log("Existing profile found:", profileData);
          setProfile(profileData);
          setEditForm({
            full_name: profileData.full_name || "",
            phone: profileData.phone || "",
            address: profileData.address || "",
            profile_image_url: profileData.profile_image_url || ""
          });
        }

        // Fetch user orders
        await fetchUserOrders(session.user.id);

      } catch (error) {
        console.error("Error in fetchUserProfile:", error);
        toast({
          title: currentLanguage === 'te' ? "లోపం" : "Error",
          description: currentLanguage === 'te' ? "ప్రొఫైల్ డేటా లోడ్ చేయడంలో లోపం" : "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchUserOrders = async (userId: string) => {
      setOrdersLoading(true);
      try {
        console.log("Fetching orders for user:", userId);
        
        const { data: ordersData, error } = await supabase
          .from("orders")
          .select(`
            *,
            workers (
              name,
              profile_image_url,
              category_id,
              categories (
                name
              )
            )
          `)
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching orders:", error);
          toast({
            title: currentLanguage === 'te' ? "హెచ్చరిక" : "Warning",
            description: currentLanguage === 'te' ? "ఆర్డర్‌లు లోడ్ చేయడంలో లోపం" : "Failed to load orders",
            variant: "destructive",
          });
        } else {
          console.log("Orders fetched:", ordersData?.length || 0);
          setOrders(ordersData || []);
        }
      } catch (error) {
        console.error("Error in fetchUserOrders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentLanguage, toast]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setEditForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        profile_image_url: profile.profile_image_url || ""
      });
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setSaving(true);
    try {
      const updates = {
        full_name: editForm.full_name,
        phone: editForm.phone,
        address: editForm.address,
        profile_image_url: editForm.profile_image_url,
        updated_at: new Date().toISOString()
      };

      console.log("Updating profile with:", updates);

      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Update error:", error);
        throw error;
      }

      setProfile(data);
      setIsEditing(false);
      
      toast({
        title: currentLanguage === 'te' ? "సఫలం!" : "Success!",
        description: currentLanguage === 'te' ? "మీ ప్రొఫైల్ అప్డేట్ చేయబడింది" : "Your profile has been updated",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(currentLanguage === 'te' ? 'te-IN' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: currentLanguage === 'te' ? "వేచుకుంటున్నది" : "Pending",
      confirmed: currentLanguage === 'te' ? "ధృవీకరించబడింది" : "Confirmed",
      in_progress: currentLanguage === 'te' ? "ప్రోగ్రెస్‌లో" : "In Progress",
      completed: currentLanguage === 'te' ? "పూర్తయింది" : "Completed",
      cancelled: currentLanguage === 'te' ? "రద్దు చేయబడింది" : "Cancelled"
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  if (loading) {
    return (
      <div className="user-profile-container">
        <div className="user-profile-loading">
          <div className="user-profile-loader"></div>
          <p>{currentLanguage === 'te' ? "లోడ్ అవుతోంది..." : "Loading..."}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile-container">
        <div className="user-profile-error">
          <UserIcon className="user-profile-error-icon" />
          <h2>{currentLanguage === 'te' ? "లాగిన్ అవసరం" : "Login Required"}</h2>
          <p>{currentLanguage === 'te' ? "దయచేసి మొదట లాగిన్ చేయండి" : "Please login to view your profile"}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="user-profile-container">
        <div className="user-profile-error">
          <AlertCircle className="user-profile-error-icon" />
          <h2>{currentLanguage === 'te' ? "ప్రొఫైల్ సమస్య" : "Profile Not Found"}</h2>
          <p>{currentLanguage === 'te' ? "దయచేసి లాగిన్ చేసి మళ్లీ ప్రయత్నించండి" : "Please login and try again"}</p>
          <div className="flex gap-4 mt-4">
            <Button onClick={() => window.location.href = '/auth'} className="bg-blue-600 hover:bg-blue-700">
              {currentLanguage === 'te' ? "లాగిన్" : "Login"}
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              {currentLanguage === 'te' ? "మళ్లీ ప్రయత్నించండి" : "Try Again"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-content">
        {/* Header Section */}
        <div className="user-profile-header">
          <div className="user-profile-header-content">
            <div className="user-profile-avatar-section">
              <div className="user-profile-avatar">
                {profile.profile_image_url ? (
                  <img 
                    src={profile.profile_image_url} 
                    alt={profile.full_name}
                    className="user-profile-avatar-image"
                    onError={(e) => {
                      // If image fails to load, fallback to icon
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <UserIcon className="user-profile-avatar-icon" />
                )}
                {isEditing && (
                  <button className="user-profile-avatar-edit">
                    <Camera size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="user-profile-info">
              <h1 className="user-profile-name">
                {profile.full_name || user.email?.split('@')[0] || "User"}
              </h1>
              <p className="user-profile-email">{profile.email}</p>
              <div className="user-profile-stats">
                <div className="user-profile-stat">
                  <Calendar className="user-profile-stat-icon" />
                  <span className="user-profile-stat-text">
                    {currentLanguage === 'te' ? "చేరిన తేదీ: " : "Joined: "}
                    {formatDate(profile.created_at)}
                  </span>
                </div>
                <div className="user-profile-stat">
                  <ShoppingBag className="user-profile-stat-icon" />
                  <span className="user-profile-stat-text">
                    {orders.length} {currentLanguage === 'te' ? "ఆర్డర్‌లు" : "Orders"}
                  </span>
                </div>
              </div>
            </div>

            <div className="user-profile-actions">
              {!isEditing ? (
                <Button onClick={handleEdit} className="user-profile-edit-btn">
                  <Edit3 size={16} />
                  {currentLanguage === 'te' ? "సవరించు" : "Edit Profile"}
                </Button>
              ) : (
                <div className="user-profile-edit-actions">
                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="user-profile-save-btn"
                  >
                    <Save size={16} />
                    {saving ? (currentLanguage === 'te' ? "సేవ్ అవుతోంది..." : "Saving...") : (currentLanguage === 'te' ? "సేవ్ చేయండి" : "Save")}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    className="user-profile-cancel-btn"
                  >
                    <X size={16} />
                    {currentLanguage === 'te' ? "రద్దు చేయండి" : "Cancel"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="user-profile-tabs">
          <button 
            className={`user-profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <UserIcon size={20} />
            {currentLanguage === 'te' ? "ప్రొఫైల్" : "Profile"}
          </button>
          <button 
            className={`user-profile-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={20} />
            {currentLanguage === 'te' ? "మీ ఆర్డర్‌లు" : "Your Orders"}
          </button>
        </div>

        <div className="user-profile-body">
          {activeTab === 'profile' && (
            <>
              {/* Personal Information Section */}
              <Card className="user-profile-section">
                <CardHeader>
                  <CardTitle className="user-profile-section-title">
                    <UserIcon className="user-profile-section-icon" />
                    {currentLanguage === 'te' ? "వ్యక్తిగత సమాచారం" : "Personal Information"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="user-profile-section-content">
                  <div className="user-profile-form">
                    <div className="user-profile-field">
                      <Label htmlFor="full_name">
                        {currentLanguage === 'te' ? "పూర్తి పేరు" : "Full Name"}
                      </Label>
                      {isEditing ? (
                        <Input
                          id="full_name"
                          value={editForm.full_name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                          placeholder={currentLanguage === 'te' ? "మీ పూర్తి పేరు" : "Your full name"}
                        />
                      ) : (
                        <div className="user-profile-field-value">
                          {profile.full_name || (currentLanguage === 'te' ? "పేరు లేదు" : "No name provided")}
                        </div>
                      )}
                    </div>

                    <div className="user-profile-field">
                      <Label htmlFor="email">
                        <Mail className="user-profile-field-icon" />
                        {currentLanguage === 'te' ? "ఇమెయిల్" : "Email"}
                      </Label>
                      <div className="user-profile-field-value">
                        {profile.email}
                      </div>
                    </div>

                    <div className="user-profile-field">
                      <Label htmlFor="phone">
                        <Phone className="user-profile-field-icon" />
                        {currentLanguage === 'te' ? "ఫోన్ నంబర్" : "Phone Number"}
                      </Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder={currentLanguage === 'te' ? "మీ ఫోన్ నంబర్" : "Your phone number"}
                        />
                      ) : (
                        <div className="user-profile-field-value">
                          {profile.phone || (currentLanguage === 'te' ? "ఫోన్ నంబర్ లేదు" : "No phone number")}
                        </div>
                      )}
                    </div>

                    <div className="user-profile-field">
                      <Label htmlFor="address">
                        <MapPin className="user-profile-field-icon" />
                        {currentLanguage === 'te' ? "చిరునామా" : "Address"}
                      </Label>
                      {isEditing ? (
                        <Input
                          id="address"
                          value={editForm.address}
                          onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                          placeholder={currentLanguage === 'te' ? "మీ చిరునామా" : "Your address"}
                        />
                      ) : (
                        <div className="user-profile-field-value">
                          {profile.address || (currentLanguage === 'te' ? "చిరునామా లేదు" : "No address provided")}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Settings Section */}
              <Card className="user-profile-section">
                <CardHeader>
                  <CardTitle className="user-profile-section-title">
                    <Settings className="user-profile-section-icon" />
                    {currentLanguage === 'te' ? "ఖాతా సెట్టింగ్‌లు" : "Account Settings"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="user-profile-section-content">
                  <div className="user-profile-settings">
                    <div className="user-profile-setting-item">
                      <Shield className="user-profile-setting-icon" />
                      <div className="user-profile-setting-info">
                        <h4>{currentLanguage === 'te' ? "ప్రైవసీ సెట్టింగ్‌లు" : "Privacy Settings"}</h4>
                        <p>{currentLanguage === 'te' ? "మీ ప్రైవసీ ప్రాధాన్యతలను నిర్వహించండి" : "Manage your privacy preferences"}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        {currentLanguage === 'te' ? "నిర్వహించండి" : "Manage"}
                      </Button>
                    </div>

                    <div className="user-profile-setting-item">
                      <Heart className="user-profile-setting-icon" />
                      <div className="user-profile-setting-info">
                        <h4>{currentLanguage === 'te' ? "ఇష్టమైన వర్కర్లు" : "Favorite Workers"}</h4>
                        <p>{currentLanguage === 'te' ? "మీ ఇష్టమైన వర్కర్ల జాబితా చూడండి" : "View your favorite workers list"}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        {currentLanguage === 'te' ? "చూడండి" : "View"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'orders' && (
            <Card className="user-profile-section">
              <CardHeader>
                <CardTitle className="user-profile-section-title">
                  <ShoppingBag className="user-profile-section-icon" />
                  {currentLanguage === 'te' ? "మీ ఆర్డర్‌లు" : "Your Orders"}
                </CardTitle>
              </CardHeader>
              <CardContent className="user-profile-section-content">
                {ordersLoading ? (
                  <div className="orders-loading">
                    <div className="user-profile-loader"></div>
                    <p>{currentLanguage === 'te' ? "ఆర్డర్‌లు లోడ్ అవుతున్నాయి..." : "Loading orders..."}</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="no-orders">
                    <ShoppingBag className="no-orders-icon" />
                    <h3>{currentLanguage === 'te' ? "ఆర్డర్‌లు లేవు" : "No Orders Yet"}</h3>
                    <p>{currentLanguage === 'te' ? "మీరు ఇంకా ఏ సేవలను బుక్ చేయలేదు" : "You haven't booked any services yet"}</p>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div className="order-worker">
                            {order.workers?.profile_image_url ? (
                              <img 
                                src={order.workers.profile_image_url} 
                                alt={order.workers.name}
                                className="order-worker-avatar"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <UserIcon className="order-worker-avatar-icon" />
                            )}
                            <div className="order-worker-info">
                              <h4>{order.workers?.name || "Worker"}</h4>
                              <p>{order.workers?.categories?.name || order.service_type}</p>
                            </div>
                          </div>
                          <div className="order-status">
                            {getStatusIcon(order.status)}
                            <span>{getStatusText(order.status)}</span>
                          </div>
                        </div>
                        
                        <div className="order-details">
                          <div className="order-detail">
                            <Calendar className="order-detail-icon" />
                            <span>{formatDate(order.event_date)}</span>
                          </div>
                          <div className="order-detail">
                            <MapPin className="order-detail-icon" />
                            <span>{order.customer_address || (currentLanguage === 'te' ? "చిరునామా లేదు" : "No address")}</span>
                          </div>
                          {order.total_amount && (
                            <div className="order-detail">
                              <span className="order-amount">₹{order.total_amount}</span>
                            </div>
                          )}
                        </div>

                        {order.notes && (
                          <div className="order-notes">
                            <p><strong>{currentLanguage === 'te' ? "గమనికలు:" : "Notes:"}</strong> {order.notes}</p>
                          </div>
                        )}

                        <div className="order-footer">
                          <small>{currentLanguage === 'te' ? "బుక్ చేసిన తేదీ: " : "Booked on: "}{formatDate(order.created_at)}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;