import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Worker = {
  id: string;
  name: string;
  bio?: string | null;
  skills?: string | null;
  avatar_url?: string | null;
};

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").trim();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!q) {
          const { data, error } = await supabase.from<Worker>("workers").select("*").order("name");
          if (error) throw error;
          setWorkers(data || []);
        } else {
          const pattern = `%${q}%`;
          const { data, error } = await supabase
            .from<Worker>("workers")
            .select("*")
            .or(`name.ilike.${pattern},skills.ilike.${pattern},bio.ilike.${pattern}`)
            .order("name");
          if (error) throw error;
          setWorkers(data || []);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [q]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">{q ? `Search results for "${q}"` : "All workers"}</h1>
        <Link to="/">
          <Button variant="ghost">Back</Button>
        </Link>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-destructive">Error: {error}</div>}
      {!loading && !error && workers.length === 0 && <div>No results found.</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {workers.map((w) => (
          <Card key={w.id} className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-muted overflow-hidden flex items-center justify-center text-lg font-medium text-white">
                {w.avatar_url ? (
                  <img src={w.avatar_url} className="h-full w-full object-cover" alt={w.name} />
                ) : (
                  w.name?.charAt(0).toUpperCase() ?? "?"
                )}
              </div>

              <div className="flex-1">
                <div className="font-semibold">{w.name}</div>
                {w.skills && <div className="text-sm text-muted-foreground">{w.skills}</div>}
                {w.bio && <div className="text-sm mt-1 line-clamp-2">{w.bio}</div>}
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Link to={`/worker/${w.id}`}>
                <Button size="sm">View</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;