
import { AuthCard } from "@/components/auth/AuthCard";
import { ClimbingInfoForm } from "@/components/auth/ClimbingInfoForm";
import { useAuthPage } from "@/hooks/useAuthPage";

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
