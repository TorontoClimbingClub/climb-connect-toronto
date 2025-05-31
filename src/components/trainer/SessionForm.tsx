
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Play, Square, Edit2 } from 'lucide-react';
import { useOfflineTrainer } from '@/hooks/trainer/useOfflineTrainer';
import { useToast } from '@/hooks/use-toast';

const SessionForm = () => {
  const { 
    activeSession, 
    hasActiveSession, 
    startSession, 
    endSession, 
    updateSession,
    addClimb,
    updateClimb,
    removeClimb,
    addTechnique,
    removeTechnique
  } = useOfflineTrainer();
  
  const { toast } = useToast();
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [editingClimbId, setEditingClimbId] = useState<string | null>(null);

  // Form states for new session
  const [sessionGoal, setSessionGoal] = useState('');
  const [customGoal, setCustomGoal] = useState('');

  // Form states for adding/editing climbs
  const [climbForm, setClimbForm] = useState({
    routeGrade: '',
    climbingStyle: 'Sport',
    attemptsMade: 1,
    completed: true,
    fallsCount: 0,
    restTimeMinutes: 0,
    isHardestClimb: false,
    notes: ''
  });

  // Form states for adding techniques
  const [selectedTechnique, setSelectedTechnique] = useState('');

  const sessionGoals = [
    'Technique Practice',
    'Endurance Training', 
    'Strength Building',
    'Grade Progression',
    'Route Reading',
    'Mental Training',
    'Custom'
  ];

  const climbingStyles = ['Sport', 'Trad', 'Top Rope', 'Bouldering'];
  const grades = ['5.6', '5.7', '5.8', '5.9', '5.10a', '5.10b', '5.10c', '5.10d', '5.11a', '5.11b', '5.11c', '5.11d', '5.12a', '5.12b', '5.12c', '5.12d'];
  
  const techniques = [
    'Heel Hooks',
    'Toe Hooks',
    'Flagging',
    'Stemming',
    'Layback',
    'Mantling',
    'Crimping',
    'Pinching',
    'Slopers',
    'Jugs',
    'Crack Climbing',
    'Face Climbing',
    'Dynamic Moves',
    'Dead Points',
    'Foot Placement',
    'Body Position',
    'Rest Positions',
    'Route Reading',
    'Grip Strength',
    'Core Engagement'
  ];

  const handleStartSession = async () => {
    setIsStarting(true);
    try {
      await startSession({
        sessionGoal: sessionGoal === 'Custom' ? customGoal : sessionGoal,
        customGoal: sessionGoal === 'Custom' ? customGoal : undefined
      });
      toast({
        title: "Session Started",
        description: "Your training session has begun. Happy climbing!",
      });
      setSessionGoal('');
      setCustomGoal('');
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
    if (!climbForm.routeGrade) return;
    
    addClimb(climbForm);
    setClimbForm({
      routeGrade: '',
      climbingStyle: 'Sport',
      attemptsMade: 1,
      completed: true,
      fallsCount: 0,
      restTimeMinutes: 0,
      isHardestClimb: false,
      notes: ''
    });
    toast({
      title: "Climb Added",
      description: `${climbForm.routeGrade} ${climbForm.climbingStyle} climb logged!`,
    });
  };

  const handleEditClimb = (climbId: string) => {
    const climb = activeSession?.climbs.find(c => c.id === climbId);
    if (climb) {
      setClimbForm(climb);
      setEditingClimbId(climbId);
    }
  };

  const handleUpdateClimb = () => {
    if (!editingClimbId) return;
    
    updateClimb(editingClimbId, climbForm);
    setEditingClimbId(null);
    setClimbForm({
      routeGrade: '',
      climbingStyle: 'Sport',
      attemptsMade: 1,
      completed: true,
      fallsCount: 0,
      restTimeMinutes: 0,
      isHardestClimb: false,
      notes: ''
    });
    toast({
      title: "Climb Updated",
      description: "Climb details have been updated!",
    });
  };

  const handleCancelEdit = () => {
    setEditingClimbId(null);
    setClimbForm({
      routeGrade: '',
      climbingStyle: 'Sport',
      attemptsMade: 1,
      completed: true,
      fallsCount: 0,
      restTimeMinutes: 0,
      isHardestClimb: false,
      notes: ''
    });
  };

  const handleAddTechnique = () => {
    if (!selectedTechnique) return;
    
    addTechnique(selectedTechnique);
    setSelectedTechnique('');
    updateSession({ newTechniquesTried: true });
    toast({
      title: "Technique Added",
      description: `${selectedTechnique} technique logged!`,
    });
  };

  if (!hasActiveSession) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="session-goal">Session Goal</Label>
            <Select value={sessionGoal} onValueChange={setSessionGoal}>
              <SelectTrigger>
                <SelectValue placeholder="Select your session goal" />
              </SelectTrigger>
              <SelectContent>
                {sessionGoals.map(goal => (
                  <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {sessionGoal === 'Custom' && (
            <div>
              <Label htmlFor="custom-goal">Custom Goal</Label>
              <Textarea
                id="custom-goal"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="Describe your custom session goal..."
                rows={3}
              />
            </div>
          )}

          <Button 
            onClick={handleStartSession}
            disabled={!sessionGoal || (sessionGoal === 'Custom' && !customGoal.trim()) || isStarting}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            {isStarting ? 'Starting...' : 'Start Session'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Active Session</span>
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
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label>Session Goal</Label>
              <p className="text-sm text-gray-600">{activeSession?.sessionGoal}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="warm-up"
                  checked={activeSession?.warmUpDone || false}
                  onCheckedChange={(checked) => updateSession({ warmUpDone: checked })}
                />
                <Label htmlFor="warm-up">Warm-up completed</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="tired"
                  checked={activeSession?.feltTiredAtEnd || false}
                  onCheckedChange={(checked) => updateSession({ feltTiredAtEnd: checked })}
                />
                <Label htmlFor="tired">Feeling tired</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Climb */}
      <Card>
        <CardHeader>
          <CardTitle>{editingClimbId ? 'Edit Climb' : 'Log Climb'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Grade</Label>
                <Select value={climbForm.routeGrade} onValueChange={(value) => setClimbForm({...climbForm, routeGrade: value})}>
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
                <Label>Style</Label>
                <Select value={climbForm.climbingStyle} onValueChange={(value) => setClimbForm({...climbForm, climbingStyle: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {climbingStyles.map(style => (
                      <SelectItem key={style} value={style}>{style}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Attempts</Label>
                <Input
                  type="number"
                  min="1"
                  value={climbForm.attemptsMade}
                  onChange={(e) => setClimbForm({...climbForm, attemptsMade: parseInt(e.target.value) || 1})}
                />
              </div>
              
              <div>
                <Label>Falls</Label>
                <Input
                  type="number"
                  min="0"
                  value={climbForm.fallsCount}
                  onChange={(e) => setClimbForm({...climbForm, fallsCount: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div>
                <Label>Rest (min)</Label>
                <Input
                  type="number"
                  min="0"
                  value={climbForm.restTimeMinutes}
                  onChange={(e) => setClimbForm({...climbForm, restTimeMinutes: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="completed"
                  checked={climbForm.completed}
                  onCheckedChange={(checked) => setClimbForm({...climbForm, completed: checked})}
                />
                <Label htmlFor="completed">Completed</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="hardest"
                  checked={climbForm.isHardestClimb}
                  onCheckedChange={(checked) => setClimbForm({...climbForm, isHardestClimb: checked})}
                />
                <Label htmlFor="hardest">Hardest climb today</Label>
              </div>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={climbForm.notes}
                onChange={(e) => setClimbForm({...climbForm, notes: e.target.value})}
                placeholder="Any notes about this climb..."
                rows={2}
              />
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
                <Button onClick={handleAddClimb} disabled={!climbForm.routeGrade} className="flex items-center gap-2">
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
          <CardTitle>Session Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label>Climbs ({activeSession?.climbs.length || 0})</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {activeSession?.climbs.map((climb, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {climb.routeGrade} {climb.climbingStyle}
                    <Edit2 
                      className="h-3 w-3 cursor-pointer hover:text-blue-500" 
                      onClick={() => handleEditClimb(climb.id)}
                    />
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeClimb(climb.id)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Techniques ({activeSession?.techniques.length || 0})</Label>
              <div className="flex items-center gap-2 mt-2">
                <Select value={selectedTechnique} onValueChange={setSelectedTechnique}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select technique practiced..." />
                  </SelectTrigger>
                  <SelectContent>
                    {techniques.map(technique => (
                      <SelectItem key={technique} value={technique}>{technique}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddTechnique} size="sm" disabled={!selectedTechnique}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {activeSession?.techniques.map((technique, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {technique}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeTechnique(technique)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionForm;
