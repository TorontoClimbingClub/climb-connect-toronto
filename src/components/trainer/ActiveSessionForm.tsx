
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Clock } from 'lucide-react';
import ClimbEntry from './ClimbEntry';
import { useActiveSession } from '@/hooks/trainer/useActiveSession';
import { format } from 'date-fns';

const ActiveSessionForm = () => {
  const { activeSession, updateLocalSession, endSession, isEnding } = useActiveSession();

  if (!activeSession) return null;

  const addClimb = () => {
    const newClimb = {
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
    updateLocalSession({
      climbs: [...activeSession.climbs, newClimb]
    });
  };

  const updateClimb = (id: string, updates: any) => {
    const updatedClimbs = activeSession.climbs.map(climb => 
      climb.id === id ? { ...climb, ...updates } : climb
    );
    updateLocalSession({ climbs: updatedClimbs });
  };

  const removeClimb = (id: string) => {
    const updatedClimbs = activeSession.climbs.filter(climb => climb.id !== id);
    updateLocalSession({ climbs: updatedClimbs });
  };

  const addTechnique = () => {
    updateLocalSession({
      techniques: [...activeSession.techniques, '']
    });
  };

  const updateTechnique = (index: number, value: string) => {
    const newTechniques = [...activeSession.techniques];
    newTechniques[index] = value;
    updateLocalSession({ techniques: newTechniques });
  };

  const removeTechnique = (index: number) => {
    const newTechniques = activeSession.techniques.filter((_, i) => i !== index);
    updateLocalSession({ techniques: newTechniques });
  };

  const addGear = () => {
    updateLocalSession({
      gear: [...activeSession.gear, '']
    });
  };

  const updateGear = (index: number, value: string) => {
    const newGear = [...activeSession.gear];
    newGear[index] = value;
    updateLocalSession({ gear: newGear });
  };

  const removeGear = (index: number) => {
    const newGear = activeSession.gear.filter((_, i) => i !== index);
    updateLocalSession({ gear: newGear });
  };

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card className="border-[#E55A2B]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#E55A2B]">
            <Clock className="h-5 w-5" />
            Active Training Session
          </CardTitle>
          <p className="text-sm text-gray-600">
            Session started on {format(new Date(activeSession.sessionDate), 'EEEE, MMMM d, yyyy')}
          </p>
        </CardHeader>
      </Card>

      {/* Climbs Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Climbs ({activeSession.climbs.length})
            <Button type="button" onClick={addClimb} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Climb
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeSession.climbs.map((climb) => (
            <ClimbEntry
              key={climb.id}
              climb={climb}
              onUpdate={(updates) => updateClimb(climb.id, updates)}
              onRemove={() => removeClimb(climb.id)}
            />
          ))}
          {activeSession.climbs.length === 0 && (
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
                checked={activeSession.warmUpDone}
                onCheckedChange={(checked) => updateLocalSession({ warmUpDone: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="feltTiredAtEnd">Felt tired at end?</Label>
              <Switch
                id="feltTiredAtEnd"
                checked={activeSession.feltTiredAtEnd}
                onCheckedChange={(checked) => updateLocalSession({ feltTiredAtEnd: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="newTechniquesTried">Tried new techniques?</Label>
              <Switch
                id="newTechniquesTried"
                checked={activeSession.newTechniquesTried}
                onCheckedChange={(checked) => updateLocalSession({ newTechniquesTried: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="gearUsed">Used gear?</Label>
              <Switch
                id="gearUsed"
                checked={activeSession.gearUsed}
                onCheckedChange={(checked) => updateLocalSession({ gearUsed: checked })}
              />
            </div>

            <div>
              <Label htmlFor="feltAfterSession">How did you feel after?</Label>
              <Select
                value={activeSession.feltAfterSession || ''}
                onValueChange={(value) => updateLocalSession({ feltAfterSession: value })}
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
            {activeSession.newTechniquesTried && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>New Techniques Tried</Label>
                  <Button type="button" onClick={addTechnique} size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {activeSession.techniques.map((technique, index) => (
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
            {activeSession.gearUsed && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Gear Used</Label>
                  <Button type="button" onClick={addGear} size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {activeSession.gear.map((item, index) => (
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
                value={activeSession.wouldChangeNextTime || ''}
                onChange={(e) => updateLocalSession({ wouldChangeNextTime: e.target.value })}
                placeholder="Reflections on what to improve..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex justify-end">
        <Button 
          onClick={endSession} 
          disabled={isEnding} 
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {isEnding ? 'Ending Session...' : 'End Session'}
        </Button>
      </div>
    </div>
  );
};

export default ActiveSessionForm;
