
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Edit3, Trash2 } from 'lucide-react';
import { useGradeSubmissions } from '@/hooks/useGradeSubmissions';
import { ClimbingRoute } from '@/types/routes';
import { gradeOptions } from '@/utils/gradeUtils';

interface GradeSubmissionFormProps {
  route: ClimbingRoute;
}

const GradeSubmissionForm: React.FC<GradeSubmissionFormProps> = ({ route }) => {
  const { userSubmission, loading, submitGrade, deleteSubmission, fetchSubmissions } = useGradeSubmissions(route.id);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch submissions when component mounts or route changes
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Update form state when userSubmission changes
  useEffect(() => {
    if (userSubmission) {
      setSelectedGrade(userSubmission.submitted_grade);
      setNotes(userSubmission.notes || '');
    } else {
      setSelectedGrade('');
      setNotes('');
    }
  }, [userSubmission]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrade) return;

    const success = await submitGrade(selectedGrade, notes, route.style);
    if (success) {
      setIsOpen(false);
    }
  };

  const handleDelete = async () => {
    const success = await deleteSubmission();
    if (success) {
      setSelectedGrade('');
      setNotes('');
      setIsOpen(false);
    }
  };

  // Get grade options based on route style
  const availableGrades = gradeOptions[route.style] || [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={userSubmission ? "outline" : "default"} size="sm" className="flex items-center gap-2">
          {userSubmission ? <Edit3 className="h-4 w-4" /> : <Star className="h-4 w-4" />}
          {userSubmission ? "Update Grade" : "Submit Grade"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {userSubmission ? "Update" : "Submit"} Grade Assessment
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="route-info">Route</Label>
            <div className="text-sm text-gray-600">
              {route.name} - {route.grade} ({route.style})
            </div>
          </div>

          <div>
            <Label htmlFor="grade-select">Your Grade Assessment</Label>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Select a grade" />
              </SelectTrigger>
              <SelectContent>
                {availableGrades.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Explain why you think this grade is more accurate..."
              maxLength={200}
              rows={3}
            />
            <div className="text-xs text-gray-500 mt-1">
              {notes.length}/200 characters
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex gap-2">
              {userSubmission && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!selectedGrade || loading}>
                {userSubmission ? "Update" : "Submit"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GradeSubmissionForm;
