import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Star, Calendar } from "lucide-react";

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
      // Fetch worker details
      const { data: workerData, error: workerError } = await supabase
        .from("workers")
        .select("*")
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground text-lg">Worker not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Worker Profile Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-3xl">{worker.name}</CardTitle>
                {worker.rating > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current" />
                    {worker.rating.toFixed(1)}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                {worker.experience_years} years of professional experience
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          {worker.description && (
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-muted-foreground">{worker.description}</p>
            </div>
          )}

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <span>{worker.phone}</span>
              </div>
              {worker.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>{worker.email}</span>
                </div>
              )}
              {worker.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>{worker.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Member since {new Date(worker.created_at).getFullYear()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Previous Works */}
      {images.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Previous Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <Card key={image.id}>
                <CardContent className="p-4">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-4xl">📷</span>
                  </div>
                  {image.description && (
                    <p className="text-sm text-muted-foreground">{image.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerProfile;
