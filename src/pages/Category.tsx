import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Star } from "lucide-react";

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
}

interface Category {
  id: string;
  name: string;
  description: string;
}

const Category = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
      }

      setLoading(false);
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId, toast]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      {category && (
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
          <p className="text-muted-foreground text-lg">{category.description}</p>
        </div>
      )}

      {/* Workers List */}
      {workers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground text-lg">
              No workers found in this category yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <Link key={worker.id} to={`/worker/${worker.id}`}>
              <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{worker.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {worker.experience_years} years experience
                      </CardDescription>
                    </div>
                    {worker.rating > 0 && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        {worker.rating.toFixed(1)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {worker.description || "Professional service provider"}
                  </p>
                  <div className="space-y-2 text-sm">
                    {worker.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{worker.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{worker.phone}</span>
                    </div>
                    {worker.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{worker.email}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;
