
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
    // Check if user was redirected after email verification
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      toast({
        title: "Email verified successfully!",
        description: "Your account has been activated. You can now sign in.",
      });
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
