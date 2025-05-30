
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getGenericErrorMessage } from "@/utils/security";

export function useAuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showClimbingInfo, setShowClimbingInfo] = useState(false);
  const [newUserId, setNewUserId] = useState<string | null>(null);
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !showClimbingInfo) {
      navigate("/");
    }
  }, [user, navigate, showClimbingInfo]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: getGenericErrorMessage(error),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to TCC.",
        });
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: getGenericErrorMessage(error),
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await signUp(email, password, fullName);
      
      if (result.error) {
        toast({
          title: "Sign up failed",
          description: getGenericErrorMessage(result.error),
          variant: "destructive",
        });
        setLoading(false);
      } else {
        toast({
          title: "Account created successfully!",
          description: "Please check your email and click the verification link to complete your registration.",
          duration: 8000,
        });
        
        setTimeout(async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('climbing_level, phone')
              .eq('id', session.user.id)
              .single();
            
            if (!profile?.climbing_level || !profile?.phone) {
              setNewUserId(session.user.id);
              setShowClimbingInfo(true);
              toast({
                title: "Complete your profile",
                description: "Please complete your climbing profile to continue.",
              });
            } else {
              navigate("/");
            }
          }
          setLoading(false);
        }, 500);
      }
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: getGenericErrorMessage(error),
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleClimbingInfoSubmit = async (climbingData: {
    fullName: string;
    phone: string;
    climbingLevel: string;
    climbingExperience: string[];
  }) => {
    if (!newUserId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: climbingData.fullName,
          phone: climbingData.phone,
          climbing_level: climbingData.climbingLevel,
          climbing_experience: climbingData.climbingExperience
        })
        .eq('id', newUserId);

      if (error) throw error;

      toast({
        title: "Profile completed!",
        description: "Welcome to TCC! You can now join climbing events.",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: getGenericErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    loading,
    showClimbingInfo,
    handleSignIn,
    handleSignUp,
    handleClimbingInfoSubmit,
  };
}
