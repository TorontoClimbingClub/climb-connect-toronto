
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface ClimbCompletion {
  id: string;
  user_id: string;
  route_id: string;
  completed_at: string;
  created_at: string;
}

export function useClimbCompletions() {
  const [completions, setCompletions] = useState<ClimbCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCompletions = async (userId?: string) => {
    try {
      setLoading(true);
      let query = supabase.from('climb_completions').select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setCompletions(data || []);
    } catch (error: any) {
      console.error('Error fetching completions:', error);
      toast({
        title: "Error",
        description: "Failed to load climb completions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletion = async (routeId: string) => {
    if (!user) return;

    try {
      const existing = completions.find(c => c.route_id === routeId && c.user_id === user.id);
      
      if (existing) {
        // Remove completion
        const { error } = await supabase
          .from('climb_completions')
          .delete()
          .eq('id', existing.id);
          
        if (error) throw error;
        
        setCompletions(prev => prev.filter(c => c.id !== existing.id));
        
        toast({
          title: "Route unmarked",
          description: "Route removed from completed climbs",
        });
      } else {
        // Add completion
        const { data, error } = await supabase
          .from('climb_completions')
          .insert({
            user_id: user.id,
            route_id: routeId,
          })
          .select()
          .single();
          
        if (error) throw error;
        
        setCompletions(prev => [...prev, data]);
        
        toast({
          title: "Route completed!",
          description: "Added to your completed climbs",
        });
      }
    } catch (error: any) {
      console.error('Error toggling completion:', error);
      toast({
        title: "Error",
        description: "Failed to update completion status",
        variant: "destructive",
      });
    }
  };

  const isCompleted = (routeId: string, userId?: string) => {
    const targetUserId = userId || user?.id;
    return completions.some(c => c.route_id === routeId && c.user_id === targetUserId);
  };

  const getUserCompletionStats = (userId: string) => {
    const userCompletions = completions.filter(c => c.user_id === userId);
    return {
      total: userCompletions.length,
      completions: userCompletions,
    };
  };

  useEffect(() => {
    // Fetch all completions for all users to avoid flickering when viewing community stats
    fetchCompletions();
  }, []);

  return {
    completions,
    loading,
    toggleCompletion,
    isCompleted,
    getUserCompletionStats,
    fetchCompletions,
  };
}
