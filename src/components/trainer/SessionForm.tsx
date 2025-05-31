
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTrainingSessions } from '@/hooks/trainer/useTrainingSessions';
import ClimbEntry from './ClimbEntry';
import SessionGoals from './SessionGoals';

interface SessionFormData {
  sessionDate: string;
  startTime: string;
  endTime: string;
  sessionGoal: string;
  customGoal: string;
  warmUpDone: boolean;
  feltAfterSession: string;
  feltTiredAtEnd: boolean;
  wouldChangeNextTime: string;
  newTechniquesTried: boolean;
  gearUsed: boolean;
}

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

const SessionForm = () => {
  const { toast } = useToast();
  const { createSession, isLoading } = useTrainingSessions();
  const [climbs, setClimbs] = useState<ClimbData[]>([]);
  const [techniques, setTechniques] = useState<string[]>([]);
  const [gear, setGear] = useState<string[]>([]);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<SessionFormData>({
    defaultValues: {
      sessionDate: new Date().toISOString().split('T')[0],
      startTime: new Date().toTimeString().slice(0, 5),
      warmUpDone: false,
      feltTiredAtEnd: false,
      newTechniquesTried: false,
      gearUsed: false,
    }
  });

  const addClimb = () => {
    const newClimb: ClimbData = {
      id: Date.now().toString(),
      routeGrade: '',
      climbingStyle: 'Sport',
      attemptsMade: 1,
      completed: true,
      fallsCount: 0,
      restTimeMinutes: 0,
      isHardestClimb: false,
      notes: ''
    };
    setClimbs([...climbs, newClimb]);
  };

  const updateClimb = (id: string, updates: Partial<ClimbData>) => {
    setClimbs(climbs.map(climb => 
      climb.id === id ? { ...climb, ...updates } : climb
    ));
  };

  const removeClimb = (id: string) => {
    setClimbs(climbs.filter(climb => climb.id !== id));
  };

  const addTechnique = () => {
    setTechniques([...techniques, '']);
  };

  const updateTechnique = (index: number, value: string) => {
    const newTechniques = [...techniques];
    newTechniques[index] = value;
    setTechniques(newTechniques);
  };

  const removeTechnique = (index: number) => {
    setTechniques(techniques.filter((_, i) => i !== index));
  };

  const addGear = () => {
    setGear([...gear, '']);
  };

  const updateGear = (index: number, value: string) => {
    const newGear = [...gear];
    newGear[index] = value;
    setGear(newGear);
  };

  const removeGear = (index: number) => {
    setGear(gear.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: SessionFormData) => {
    try {
      const totalClimbs = climbs.length;
      const maxGrade = climbs.reduce((max, climb) => {
        return climb.routeGrade > max ? climb.routeGrade : max;
      }, '');

      const sessionData = {
        ...data,
        partnerCount: 0, // Set to 0 since we removed the field
        totalClimbs,
        maxGradeClimbed: maxGrade,
        climbs: climbs.filter(climb => climb.routeGrade),
        techniques: techniques.filter(Boolean),
        gear: gear.filter(Boolean)
      };

      await createSession(sessionData);
      
      toast({
        title: "Session Logged",
        description: "Your training session has been successfully recorded!",
      });

      reset();
      setClimbs([]);
      setTechniques([]);
      setGear([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save session. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Session Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="sessionDate">Session Date</Label>
          <Input
            id="sessionDate"
            type="date"
            {...register('sessionDate', { required: true })}
          />
        </div>
        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            {...register('startTime', { required: true })}
          />
        </div>
        <div>
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            {...register('endTime')}
          />
        </div>
      </div>

      {/* Session Goals */}
      <SessionGoals
        value={watch('sessionGoal')}
        customValue={watch('customGoal')}
        onGoalChange={(goal) => setValue('sessionGoal', goal)}
        onCustomGoalChange={(goal) => setValue('customGoal', goal)}
      />

      {/* Climbs Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Climbs
            <Button type="button" onClick={addClimb} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Climb
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {climbs.map((climb) => (
            <ClimbEntry
              key={climb.id}
              climb={climb}
              onUpdate={(updates) => updateClimb(climb.id, updates)}
              onRemove={() => removeClimb(climb.id)}
            />
          ))}
          {climbs.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No climbs added yet. Click "Add Climb" to start logging your routes.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Session Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="warmUpDone">Did you warm up?</Label>
              <Switch
                id="warmUpDone"
                checked={watch('warmUpDone')}
                onCheckedChange={(checked) => setValue('warmUpDone', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="feltTiredAtEnd">Felt tired at end?</Label>
              <Switch
                id="feltTiredAtEnd"
                checked={watch('feltTiredAtEnd')}
                onCheckedChange={(checked) => setValue('feltTiredAtEnd', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="newTechniquesTried">Tried new techniques?</Label>
              <Switch
                id="newTechniquesTried"
                checked={watch('newTechniquesTried')}
                onCheckedChange={(checked) => setValue('newTechniquesTried', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="gearUsed">Used gear?</Label>
              <Switch
                id="gearUsed"
                checked={watch('gearUsed')}
                onCheckedChange={(checked) => setValue('gearUsed', checked)}
              />
            </div>

            <div>
              <Label htmlFor="feltAfterSession">How did you feel after?</Label>
              <Select
                value={watch('feltAfterSession')}
                onValueChange={(value) => setValue('feltAfterSession', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select feeling" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Great">Great</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Okay">Okay</SelectItem>
                  <SelectItem value="Tired">Tired</SelectItem>
                  <SelectItem value="Exhausted">Exhausted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Techniques */}
            {watch('newTechniquesTried') && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>New Techniques Tried</Label>
                  <Button type="button" onClick={addTechnique} size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {techniques.map((technique, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={technique}
                      onChange={(e) => updateTechnique(index, e.target.value)}
                      placeholder="Technique name"
                    />
                    <Button
                      type="button"
                      onClick={() => removeTechnique(index)}
                      size="sm"
                      variant="outline"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Gear */}
            {watch('gearUsed') && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Gear Used</Label>
                  <Button type="button" onClick={addGear} size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {gear.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateGear(index, e.target.value)}
                      placeholder="Gear item"
                    />
                    <Button
                      type="button"
                      onClick={() => removeGear(index)}
                      size="sm"
                      variant="outline"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <Label htmlFor="wouldChangeNextTime">What would you change next time?</Label>
              <Textarea
                id="wouldChangeNextTime"
                {...register('wouldChangeNextTime')}
                placeholder="Reflections on what to improve..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} className="bg-[#E55A2B] hover:bg-[#d14919]">
          {isLoading ? 'Saving...' : 'Save Session'}
        </Button>
      </div>
    </form>
  );
};

export default SessionForm;
