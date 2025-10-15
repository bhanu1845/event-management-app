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
  Heart
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

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    profile_image_url: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          toast({
            title: language === 'te' ? "లాగిన్ అవసరం" : "Login Required",
            description: language === 'te' ? "దయచేసి మొదట లాగిన్ చేయండి" : "Please login first",
            variant: "destructive",
          });
          return;
        }

        setUser(session.user);

        // Check if profile exists in profiles table
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error("Error fetching profile:", error);
        }

        if (profileData) {
          setProfile(profileData);
          setEditForm({
            full_name: profileData.full_name || "",
            phone: profileData.phone || "",
            address: profileData.address || "",
            profile_image_url: profileData.profile_image_url || ""
          });
        } else {
          // Create default profile if doesn't exist
          const defaultProfile = {
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name || "",
            email: session.user.email || "",
            phone: "",
            address: "",
            profile_image_url: "",
          };

          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert([defaultProfile])
            .select()
            .single();

          if (createError) {
            console.error("Error creating profile:", createError);
          } else {
            setProfile(newProfile);
            setEditForm({
              full_name: newProfile.full_name || "",
              phone: newProfile.phone || "",
              address: newProfile.address || "",
              profile_image_url: newProfile.profile_image_url || ""
            });
          }
        }
      } catch (error) {
        console.error("Error in fetchUserProfile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language, toast]);

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
      const { data, error } = await supabase
        .from("profiles")
        .update({
          full_name: editForm.full_name,
          phone: editForm.phone,
          address: editForm.address,
          profile_image_url: editForm.profile_image_url,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
      setIsEditing(false);
      
      toast({
        title: language === 'te' ? "సఫలం!" : "Success!",
        description: language === 'te' ? "మీ ప్రొఫైల్ అప్డేట్ చేయబడింది" : "Your profile has been updated",
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
    return new Date(dateString).toLocaleDateString(language === 'te' ? 'te-IN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="user-profile-container">
        <div className="user-profile-loading">
          <div className="user-profile-loader"></div>
          <p>{language === 'te' ? "లోడ్ అవుతోంది..." : "Loading..."}</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="user-profile-container">
        <div className="user-profile-error">
          <UserIcon className="user-profile-error-icon" />
          <h2>{language === 'te' ? "ప్రొఫైల్ దొరకలేదు" : "Profile Not Found"}</h2>
          <p>{language === 'te' ? "దయచేసి మొదట లాగిన్ చేయండి" : "Please login to view your profile"}</p>
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
                  />
                ) : (
                  <UserIcon className="user-profile-avatar-icon" />
                )}
                <button className="user-profile-avatar-edit">
                  <Camera size={16} />
                </button>
              </div>
            </div>
            
            <div className="user-profile-info">
              <h1 className="user-profile-name">
                {profile.full_name || user.email?.split('@')[0]}
              </h1>
              <p className="user-profile-email">{profile.email}</p>
              <div className="user-profile-stats">
                <div className="user-profile-stat">
                  <Calendar className="user-profile-stat-icon" />
                  <span className="user-profile-stat-text">
                    {language === 'te' ? "చేరిన తేదీ: " : "Joined: "}
                    {formatDate(profile.created_at)}
                  </span>
                </div>
              </div>
            </div>

            <div className="user-profile-actions">
              {!isEditing ? (
                <Button onClick={handleEdit} className="user-profile-edit-btn">
                  <Edit3 size={16} />
                  {language === 'te' ? "సవరించు" : "Edit Profile"}
                </Button>
              ) : (
                <div className="user-profile-edit-actions">
                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="user-profile-save-btn"
                  >
                    <Save size={16} />
                    {saving ? (language === 'te' ? "సేవ్ అవుతోంది..." : "Saving...") : (language === 'te' ? "సేవ్ చేయండి" : "Save")}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    className="user-profile-cancel-btn"
                  >
                    <X size={16} />
                    {language === 'te' ? "రద్దు చేయండి" : "Cancel"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="user-profile-body">
          {/* Personal Information Section */}
          <Card className="user-profile-section">
            <CardHeader>
              <CardTitle className="user-profile-section-title">
                <UserIcon className="user-profile-section-icon" />
                {language === 'te' ? "వ్యక్తిగత సమాచారం" : "Personal Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="user-profile-section-content">
              <div className="user-profile-form">
                <div className="user-profile-field">
                  <Label htmlFor="full_name">
                    {language === 'te' ? "పూర్తి పేరు" : "Full Name"}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="full_name"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder={language === 'te' ? "మీ పూర్తి పేరు" : "Your full name"}
                    />
                  ) : (
                    <div className="user-profile-field-value">
                      {profile.full_name || (language === 'te' ? "పేరు లేదు" : "No name provided")}
                    </div>
                  )}
                </div>

                <div className="user-profile-field">
                  <Label htmlFor="email">
                    <Mail className="user-profile-field-icon" />
                    {language === 'te' ? "ఇమెయిల్" : "Email"}
                  </Label>
                  <div className="user-profile-field-value">
                    {profile.email}
                  </div>
                </div>

                <div className="user-profile-field">
                  <Label htmlFor="phone">
                    <Phone className="user-profile-field-icon" />
                    {language === 'te' ? "ఫోన్ నంబర్" : "Phone Number"}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder={language === 'te' ? "మీ ఫోన్ నంబర్" : "Your phone number"}
                    />
                  ) : (
                    <div className="user-profile-field-value">
                      {profile.phone || (language === 'te' ? "ఫోన్ నంబర్ లేదు" : "No phone number")}
                    </div>
                  )}
                </div>

                <div className="user-profile-field">
                  <Label htmlFor="address">
                    <MapPin className="user-profile-field-icon" />
                    {language === 'te' ? "చిరునామా" : "Address"}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={editForm.address}
                      onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder={language === 'te' ? "మీ చిరునామా" : "Your address"}
                    />
                  ) : (
                    <div className="user-profile-field-value">
                      {profile.address || (language === 'te' ? "చిరునామా లేదు" : "No address provided")}
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
                {language === 'te' ? "ఖాతా సెట్టింగ్‌లు" : "Account Settings"}
              </CardTitle>
            </CardHeader>
            <CardContent className="user-profile-section-content">
              <div className="user-profile-settings">
                <div className="user-profile-setting-item">
                  <Shield className="user-profile-setting-icon" />
                  <div className="user-profile-setting-info">
                    <h4>{language === 'te' ? "ప్రైవసీ సెట్టింగ్‌లు" : "Privacy Settings"}</h4>
                    <p>{language === 'te' ? "మీ ప్రైవసీ ప్రాధాన్యతలను నిర్వహించండి" : "Manage your privacy preferences"}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {language === 'te' ? "నిర్వహించండి" : "Manage"}
                  </Button>
                </div>

                <div className="user-profile-setting-item">
                  <Heart className="user-profile-setting-icon" />
                  <div className="user-profile-setting-info">
                    <h4>{language === 'te' ? "ఇష్టమైన వర్కర్లు" : "Favorite Workers"}</h4>
                    <p>{language === 'te' ? "మీ ఇష్టమైన వర్కర్ల జాబితా చూడండి" : "View your favorite workers list"}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {language === 'te' ? "చూడండి" : "View"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;