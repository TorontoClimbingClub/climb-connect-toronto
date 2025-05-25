import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { AuthCard } from "@/components/auth/AuthCard";
import { ClimbingInfoForm } from "@/components/auth/ClimbingInfoForm";
import { supabase } from "@/integrations/supabase/client";

export default function Auth() {
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
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to TCC.",
      });
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await signUp(email, password, fullName);
    
    if (result.error) {
      toast({
        title: "Sign up failed",
        description: result.error.message,
        variant: "destructive",
      });
      setLoading(false);
    } else {
      if (result.user) {
        setNewUserId(result.user.id);
        setShowClimbingInfo(true);
        toast({
          title: "Account created!",
          description: "Please complete your climbing profile.",
        });
      }
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
        description: error.message || "Failed to complete profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showClimbingInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <ClimbingInfoForm 
          onSubmit={handleClimbingInfoSubmit}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <AuthCard
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        fullName={fullName}
        setFullName={setFullName}
        loading={loading}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />
    </div>
  );
}
