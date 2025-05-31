
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ClimbData {
  id: string;
  routeGrade: string;
  climbingStyle: string;
  attemptsMade: number;
  completed: boolean;
  fallsCount: number;
  restTimeMinutes: number;
  isHardestClimb: boolean;
  notes: string;
}

interface ClimbEntryProps {
  climb: ClimbData;
  onUpdate: (updates: Partial<ClimbData>) => void;
  onRemove: () => void;
}

const ClimbEntry: React.FC<ClimbEntryProps> = ({ climb, onUpdate, onRemove }) => {
  const climbingStyles = [
    'Sport', 'Trad', 'Top Rope', 'Bouldering', 'Slab', 'Overhang', 
    'Crack', 'Face', 'Arete', 'Chimney', 'Roof', 'Corner'
  ];

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-medium">Climb #{climb.id}</h4>
          <Button
            type="button"
            onClick={onRemove}
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor={`grade-${climb.id}`}>Grade</Label>
            <Input
              id={`grade-${climb.id}`}
              value={climb.routeGrade}
              onChange={(e) => onUpdate({ routeGrade: e.target.value })}
              placeholder="e.g., 5.10a, V4"
            />
          </div>

          <div>
            <Label htmlFor={`style-${climb.id}`}>Style</Label>
            <Select
              value={climb.climbingStyle}
              onValueChange={(value) => onUpdate({ climbingStyle: value })}
            >
              <SelectTrigger id={`style-${climb.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {climbingStyles.map((style) => (
                  <SelectItem key={style} value={style}>{style}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor={`attempts-${climb.id}`}>Attempts</Label>
            <Input
              id={`attempts-${climb.id}`}
              type="number"
              min="1"
              value={climb.attemptsMade}
              onChange={(e) => onUpdate({ attemptsMade: parseInt(e.target.value) || 1 })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor={`falls-${climb.id}`}>Falls</Label>
            <Input
              id={`falls-${climb.id}`}
              type="number"
              min="0"
              value={climb.fallsCount}
              onChange={(e) => onUpdate({ fallsCount: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div>
            <Label htmlFor={`rest-${climb.id}`}>Rest Time (minutes)</Label>
            <Input
              id={`rest-${climb.id}`}
              type="number"
              min="0"
              value={climb.restTimeMinutes}
              onChange={(e) => onUpdate({ restTimeMinutes: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="flex items-center justify-between pt-6">
            <Label htmlFor={`hardest-${climb.id}`}>Hardest climb?</Label>
            <Switch
              id={`hardest-${climb.id}`}
              checked={climb.isHardestClimb}
              onCheckedChange={(checked) => onUpdate({ isHardestClimb: checked })}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <Label htmlFor={`completed-${climb.id}`}>Completed?</Label>
          <Switch
            id={`completed-${climb.id}`}
            checked={climb.completed}
            onCheckedChange={(checked) => onUpdate({ completed: checked })}
          />
        </div>

        <div>
          <Label htmlFor={`notes-${climb.id}`}>Notes</Label>
          <Textarea
            id={`notes-${climb.id}`}
            value={climb.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="Any notes about this climb..."
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClimbEntry;
