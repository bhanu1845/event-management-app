import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}

const CategoryNavbar: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("id, name, description, image_url")
          .order("name");
        
        if (error) throw error;
        setCategories((data as Category[]) || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-3">
            <div className="text-sm text-muted-foreground">Loading categories...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-6 py-3 overflow-x-auto scrollbar-hide">
          <Link 
            to="/" 
            className="flex-shrink-0 text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
          >
            All Services
          </Link>
          
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="flex-shrink-0 text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavbar;