
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClimbingRoute } from "@/types/routes";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

interface EditRouteDialogProps {
  route: ClimbingRoute | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (routeData: Partial<ClimbingRoute>) => void;
}

const generateGradeOptions = () => {
  const grades = [];
  
  // Generate 5.0 through 5.9 without variations
  for (let i = 0; i <= 9; i++) {
    grades.push(`5.${i}`);
  }
  
  // Generate 5.10 through 5.14 with a, b, c, d variations
  for (let i = 10; i <= 14; i++) {
    grades.push(`5.${i}`);
    grades.push(`5.${i}a`, `5.${i}b`, `5.${i}c`, `5.${i}d`);
  }
  
  return grades;
};

const generateAidGradeOptions = () => {
  return ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'];
};

export function EditRouteDialog({ route, open, onOpenChange, onSave }: EditRouteDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    style: 'Trad' as 'Trad' | 'Sport' | 'Top Rope',
    area: '',
    sector: '',
  });
  const [riskRating, setRiskRating] = useState('none');
  const [aidGrade, setAidGrade] = useState('none');
  const { toast } = useToast();

  // Reset form data when route changes or dialog opens
  useEffect(() => {
    if (open) {
      if (route) {
        // Parse existing grade to extract base grade, risk rating, and aid grade
        const gradeStr = route.grade;
        let baseGrade = gradeStr;
        let extractedRiskRating = 'none';
        let extractedAidGrade = 'none';

        // Extract risk rating (R or X)
        if (gradeStr.includes('R') && !gradeStr.includes('A')) {
          baseGrade = gradeStr.replace('R', '').trim();
          extractedRiskRating = 'R';
        } else if (gradeStr.includes('X') && !gradeStr.includes('A')) {
          baseGrade = gradeStr.replace('X', '').trim();
          extractedRiskRating = 'X';
        }

        // Extract aid grade (A0-A5)
        const aidMatch = gradeStr.match(/A[0-5]/);
        if (aidMatch) {
          extractedAidGrade = aidMatch[0];
          baseGrade = baseGrade.replace(aidMatch[0], '').trim();
        }

        setFormData({
          name: route.name,
          grade: baseGrade,
          style: route.style,
          area: route.area,
          sector: route.sector,
        });
        setRiskRating(extractedRiskRating);
        setAidGrade(extractedAidGrade);
      } else {
        // Reset for new route
        setFormData({
          name: '',
          grade: '',
          style: 'Trad',
          area: '',
          sector: '',
        });
        setRiskRating('none');
        setAidGrade('none');
      }
    }
  }, [route, open]);

  const handleSave = () => {
    if (!formData.name.trim() || !formData.grade || !formData.area.trim() || !formData.sector.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    let finalGrade = formData.grade;
    
    // Add risk rating for Trad routes
    if (riskRating && riskRating !== 'none' && formData.style === 'Trad') {
      finalGrade = `${formData.grade}${riskRating}`;
    }
    
    // Add aid grade if selected
    if (aidGrade && aidGrade !== 'none') {
      finalGrade = `${finalGrade} ${aidGrade}`;
    }

    onSave({
      ...formData,
      grade: finalGrade,
      style: formData.style as 'Trad' | 'Sport' | 'Top Rope',
    });
    
    onOpenChange(false);
  };

  const gradeOptions = generateGradeOptions();
  const aidGradeOptions = generateAidGradeOptions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {route ? 'Edit Route' : 'Add New Route'}
          </DialogTitle>
        </DialogHeader>

        {/* Route Details Reference Card */}
        {route && (
          <Card className="bg-stone-50 border-[#E55A2B]/20">
            <CardContent className="pt-4">
              <div className="text-sm">
                <div className="font-semibold text-[#E55A2B] mb-2">Current Route Details:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className="text-stone-600">Name:</span>
                  <span className="font-medium">{route.name}</span>
                  <span className="text-stone-600">Grade:</span>
                  <span className="font-medium">{route.grade}</span>
                  <span className="text-stone-600">Style:</span>
                  <span className="font-medium">{route.style}</span>
                  <span className="text-stone-600">Area:</span>
                  <span className="font-medium">{route.area}</span>
                  <span className="text-stone-600">Sector:</span>
                  <span className="font-medium">{route.sector}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Route Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter route name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="style">Style *</Label>
            <Select 
              value={formData.style} 
              onValueChange={(value: 'Trad' | 'Sport' | 'Top Rope') => setFormData(prev => ({ ...prev, style: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select climbing style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Trad">Trad</SelectItem>
                <SelectItem value="Sport">Sport</SelectItem>
                <SelectItem value="Top Rope">Top Rope</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="grade">Grade *</Label>
            <Select 
              value={formData.grade} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {gradeOptions.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.style === 'Trad' && (
            <div className="grid gap-2">
              <Label htmlFor="risk">Risk Rating (Optional)</Label>
              <Select value={riskRating} onValueChange={setRiskRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select risk rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="R">R (Runout)</SelectItem>
                  <SelectItem value="X">X (Extremely Dangerous)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="aid">Aid Grade (Optional)</Label>
            <Select value={aidGrade} onValueChange={setAidGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Select aid grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {aidGradeOptions.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="area">Area *</Label>
            <Input
              id="area"
              value={formData.area}
              onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
              placeholder="Enter area name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="sector">Sector *</Label>
            <Input
              id="sector"
              value={formData.sector}
              onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
              placeholder="Enter sector name"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-[#E55A2B] hover:bg-orange-700">
            {route ? 'Update Route' : 'Add Route'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
