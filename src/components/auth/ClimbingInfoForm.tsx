
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mountain } from "lucide-react";

const CLIMBING_LEVELS = ['Never Climbed', 'Beginner', 'Intermediate', 'Advanced'];
const CLIMBING_EXPERIENCES = [
  'Top Rope',
  'Top Rope Belay', 
  'Lead',
  'Lead Belay',
  'Cleaning',
  'Anchor Building',
  'Rappelling'
];

interface ClimbingInfoFormProps {
  onSubmit: (data: {
    fullName: string;
    phone: string;
    climbingLevel: string;
    climbingExperience: string[];
  }) => Promise<void>;
  loading: boolean;
}

export const ClimbingInfoForm = ({ onSubmit, loading }: ClimbingInfoFormProps) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [climbingLevel, setClimbingLevel] = useState("");
  const [climbingExperience, setClimbingExperience] = useState<string[]>([]);

  const handleExperienceChange = (experience: string, checked: boolean) => {
    if (checked) {
      setClimbingExperience(prev => [...prev, experience]);
    } else {
      setClimbingExperience(prev => prev.filter(exp => exp !== experience));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      fullName,
      phone,
      climbingLevel,
      climbingExperience
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-3 rounded-xl w-16 h-16 mx-auto mb-4">
          <Mountain className="h-10 w-10 text-white" />
        </div>
        <CardTitle className="text-xl">Complete Your Profile</CardTitle>
        <CardDescription>
          Help us understand your climbing experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="climbingLevel">Climbing Level</Label>
            <Select value={climbingLevel} onValueChange={setClimbingLevel} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your climbing level" />
              </SelectTrigger>
              <SelectContent>
                {CLIMBING_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Climbing Experience</Label>
            <div className="grid grid-cols-1 gap-3">
              {CLIMBING_EXPERIENCES.map((experience) => (
                <div key={experience} className="flex items-center space-x-2">
                  <Checkbox
                    id={experience}
                    checked={climbingExperience.includes(experience)}
                    onCheckedChange={(checked) => 
                      handleExperienceChange(experience, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={experience}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {experience}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#E55A2B] hover:bg-orange-700"
            disabled={loading || !climbingLevel}
          >
            {loading ? "Setting up profile..." : "Complete Registration"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
