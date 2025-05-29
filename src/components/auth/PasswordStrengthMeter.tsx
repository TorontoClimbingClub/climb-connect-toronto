
import { Progress } from "@/components/ui/progress";
import { validateInput } from "@/utils/security";
import { CheckCircle, X } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
  const validation = validateInput.password(password);
  
  // Calculate strength percentage
  const totalCriteria = 5;
  const metCriteria = totalCriteria - validation.errors.length;
  const strengthPercentage = (metCriteria / totalCriteria) * 100;
  
  const getStrengthColor = () => {
    if (strengthPercentage < 40) return "bg-red-500";
    if (strengthPercentage < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (strengthPercentage < 40) return "Weak";
    if (strengthPercentage < 80) return "Medium";
    return "Strong";
  };

  if (!password) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Password Strength</span>
        <span className={`text-sm font-medium ${
          strengthPercentage < 40 ? 'text-red-600' : 
          strengthPercentage < 80 ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {getStrengthText()}
        </span>
      </div>
      
      <Progress 
        value={strengthPercentage} 
        className="h-2"
      />
      
      <div className="space-y-1">
        {[
          { text: "At least 8 characters", met: password.length >= 8 },
          { text: "One lowercase letter", met: /[a-z]/.test(password) },
          { text: "One uppercase letter", met: /[A-Z]/.test(password) },
          { text: "One number", met: /\d/.test(password) },
          { text: "One special character", met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password) },
        ].map((criteria, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {criteria.met ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <X className="h-3 w-3 text-red-500" />
            )}
            <span className={criteria.met ? 'text-green-600' : 'text-gray-500'}>
              {criteria.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
