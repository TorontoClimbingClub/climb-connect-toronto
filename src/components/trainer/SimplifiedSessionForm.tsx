
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Play, Square, Edit2, Clock } from 'lucide-react';
import { useSimplifiedTrainer } from '@/hooks/trainer/useSimplifiedTrainer';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const SimplifiedSessionForm = () => {
  const { 
    activeSession, 
    hasActiveSession, 
    startSession, 
    endSession, 
    addClimb,
    updateClimb,
    removeClimb
  } = useSimplifiedTrainer();
  
  const { toast } = useToast();
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [editingClimbId, setEditingClimbId] = useState<string | null>(null);

  // Form states for adding/editing climbs
  const [climbForm, setClimbForm] = useState({
    grade: '',
    durationMinutes: 0,
    numberOfTakes: 0
  });

  const grades = ['5.6', '5.7', '5.8', '5.9', '5.10a', '5.10b', '5.10c', '5.10d', '5.11a', '5.11b', '5.11c', '5.11d', '5.12a', '5.12b', '5.12c', '5.12d'];

  const handleStartSession = async () => {
    setIsStarting(true);
    try {
      await startSession();
      toast({
        title: "Session Started",
        description: "Your training session has begun. Happy climbing!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start training session. Please try again.",
        variant: "destructive",
      });
    }
    setIsStarting(false);
  };

  const handleEndSession = async () => {
    setIsEnding(true);
    try {
      await endSession();
      toast({
        title: "Session Completed",
        description: "Your training session has been saved!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to end training session. Please try again.",
        variant: "destructive",
      });
    }
    setIsEnding(false);
  };

  const handleAddClimb = () => {
    if (!climbForm.grade || climbForm.durationMinutes <= 0) return;
    
    addClimb(climbForm);
    setClimbForm({
      grade: '',
      durationMinutes: 0,
      numberOfTakes: 0
    });
    toast({
      title: "Climb Added",
      description: `${climbForm.grade} climb logged!`,
    });
  };

  const handleEditClimb = (climbId: string) => {
    const climb = activeSession?.climbs.find(c => c.id === climbId);
    if (climb) {
      setClimbForm({
        grade: climb.grade,
        durationMinutes: climb.durationMinutes,
        numberOfTakes: climb.numberOfTakes
      });
      setEditingClimbId(climbId);
    }
  };

  const handleUpdateClimb = () => {
    if (!editingClimbId) return;
    
    updateClimb(editingClimbId, climbForm);
    setEditingClimbId(null);
    setClimbForm({
      grade: '',
      durationMinutes: 0,
      numberOfTakes: 0
    });
    toast({
      title: "Climb Updated",
      description: "Climb details have been updated!",
    });
  };

  const handleCancelEdit = () => {
    setEditingClimbId(null);
    setClimbForm({
      grade: '',
      durationMinutes: 0,
      numberOfTakes: 0
    });
  };

  const getSessionDuration = () => {
    if (!activeSession?.startTime) return '0 min';
    const start = new Date(activeSession.startTime);
    const end = activeSession.endTime ? new Date(activeSession.endTime) : new Date();
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));
    return `${durationMinutes} min`;
  };

  if (!hasActiveSession) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Start New Session</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleStartSession}
            disabled={isStarting}
            className="flex items-center gap-2 w-full"
          >
            <Play className="h-4 w-4" />
            {isStarting ? 'Starting...' : 'Start Training Session'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card className="border-[#E55A2B]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-[#E55A2B]">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Active Session
            </div>
            <Button 
              onClick={handleEndSession}
              disabled={isEnding}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              {isEnding ? 'Ending...' : 'End Session'}
            </Button>
          </CardTitle>
          <div className="text-sm text-gray-600">
            <p>Started: {format(new Date(activeSession.startTime), 'PPp')}</p>
            <p>Duration: {getSessionDuration()}</p>
          </div>
        </CardHeader>
      </Card>

      {/* Add/Edit Climb */}
      <Card>
        <CardHeader>
          <CardTitle>{editingClimbId ? 'Edit Climb' : 'Add Climb'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Grade</Label>
                <Select value={climbForm.grade} onValueChange={(value) => setClimbForm({...climbForm, grade: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map(grade => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  min="1"
                  value={climbForm.durationMinutes}
                  onChange={(e) => setClimbForm({...climbForm, durationMinutes: parseInt(e.target.value) || 0})}
                  placeholder="Duration in minutes"
                />
              </div>
              
              <div>
                <Label>Number of Takes</Label>
                <Input
                  type="number"
                  min="0"
                  value={climbForm.numberOfTakes}
                  onChange={(e) => setClimbForm({...climbForm, numberOfTakes: parseInt(e.target.value) || 0})}
                  placeholder="Number of falls"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {editingClimbId ? (
                <>
                  <Button onClick={handleUpdateClimb} className="flex items-center gap-2">
                    <Edit2 className="h-4 w-4" />
                    Update Climb
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline">
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleAddClimb} 
                  disabled={!climbForm.grade || climbForm.durationMinutes <= 0} 
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Climb
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Session Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Session Summary ({activeSession.climbs.length} climbs)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeSession.climbs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No climbs logged yet. Add your first climb above.
              </p>
            ) : (
              <div className="space-y-2">
                {activeSession.climbs.map((climb) => (
                  <div key={climb.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">{climb.grade}</Badge>
                      <span className="text-sm text-gray-600">{climb.durationMinutes} min</span>
                      <span className="text-sm text-gray-600">{climb.numberOfTakes} takes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClimb(climb.id)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeClimb(climb.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimplifiedSessionForm;
