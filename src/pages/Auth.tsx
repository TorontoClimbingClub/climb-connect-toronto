
import { AuthCard } from "@/components/auth/AuthCard";
import { ClimbingInfoForm } from "@/components/auth/ClimbingInfoForm";
import { useAuthPage } from "@/hooks/useAuthPage";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

export default function Auth() {
  const {
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
  } = useAuthPage();

  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    // Check for various auth-related URL parameters
    const verified = searchParams.get('verified');
    const type = searchParams.get('type');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      toast({
        title: "Authentication Error",
        description: errorDescription || "An error occurred during authentication",
        variant: "destructive",
      });
      // Clear error parameters from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      newUrl.searchParams.delete('error_description');
      window.history.replaceState({}, document.title, newUrl.pathname);
    } else if (verified === 'true' || type === 'email_change' || type === 'signup') {
      toast({
        title: "Email verified successfully!",
        description: "Your account has been activated. You can now sign in.",
      });
      // Clear verification parameters from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('verified');
      newUrl.searchParams.delete('type');
      window.history.replaceState({}, document.title, newUrl.pathname);
    }
  }, [searchParams, toast]);

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
