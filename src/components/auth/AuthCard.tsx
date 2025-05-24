
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mountain } from "lucide-react";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

interface AuthCardProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  fullName: string;
  setFullName: (fullName: string) => void;
  loading: boolean;
  onSignIn: (e: React.FormEvent) => Promise<void>;
  onSignUp: (e: React.FormEvent) => Promise<void>;
}

export const AuthCard = ({
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  loading,
  onSignIn,
  onSignUp,
}: AuthCardProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="bg-gradient-to-br from-orange-600 to-red-700 p-3 rounded-xl w-16 h-16 mx-auto mb-4">
          <Mountain className="h-10 w-10 text-white" />
        </div>
        <CardTitle className="text-2xl">Toronto Climbing Club</CardTitle>
        <CardDescription>
          Join the premier climbing community in Toronto
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4 mt-6">
            <SignInForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
              onSubmit={onSignIn}
            />
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-6">
            <SignUpForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              fullName={fullName}
              setFullName={setFullName}
              loading={loading}
              onSubmit={onSignUp}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
