
import { useState } from "react";
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

interface EditRouteDialogProps {
  route: ClimbingRoute | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (routeData: Partial<ClimbingRoute>) => void;
}

const generateGradeOptions = () => {
  const grades = [];
  
  // Generate 5.0 through 5.14 with a, b, c variations
  for (let i = 0; i <= 14; i++) {
    if (i === 0) {
      grades.push('5.0');
    } else {
      grades.push(`5.${i}`);
      if (i >= 10) {
        grades.push(`5.${i}a`, `5.${i}b`, `5.${i}c`, `5.${i}d`);
      }
    }
  }
  
  // Add aid climbing grades
  grades.push('A0', 'A1', 'A2', 'A3', 'A4', 'A5');
  
  return grades;
};

export function EditRouteDialog({ route, open, onOpenChange, onSave }: EditRouteDialogProps) {
  const [formData, setFormData] = useState({
    name: route?.name || '',
    grade: route?.grade || '',
    style: route?.style || 'Trad' as 'Trad' | 'Sport' | 'Top Rope',
    area: route?.area || '',
    sector: route?.sector || '',
  });
  const [riskRating, setRiskRating] = useState('');
  const { toast } = useToast();

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
    if (riskRating && formData.style === 'Trad') {
      finalGrade = `${formData.grade}${riskRating}`;
    }

    onSave({
      ...formData,
      grade: finalGrade,
      style: formData.style as 'Trad' | 'Sport' | 'Top Rope',
    });
    
    onOpenChange(false);
  };

  const gradeOptions = generateGradeOptions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {route ? 'Edit Route' : 'Add New Route'}
          </DialogTitle>
        </DialogHeader>
        
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
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="R">R (Runout)</SelectItem>
                  <SelectItem value="X">X (Extremely Dangerous)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
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
