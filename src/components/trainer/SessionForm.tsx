
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Play, Square } from 'lucide-react';
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
    removeClimb,
    addTechnique,
    removeTechnique,
    addGear,
    removeGear
  } = useOfflineTrainer();
  
  const { toast } = useToast();
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  // Form states for new session
  const [sessionGoal, setSessionGoal] = useState('');
  const [customGoal, setCustomGoal] = useState('');

  // Form states for adding items
  const [newClimb, setNewClimb] = useState({
    routeGrade: '',
    climbingStyle: 'Sport',
    attemptsMade: 1,
    completed: true,
    fallsCount: 0,
    restTimeMinutes: 0,
    isHardestClimb: false,
    notes: ''
  });
  const [newTechnique, setNewTechnique] = useState('');
  const [newGearItem, setNewGearItem] = useState('');

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
        description: "Your training session has been saved locally!",
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
    if (!newClimb.routeGrade) return;
    
    addClimb(newClimb);
    setNewClimb({
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
      description: `${newClimb.routeGrade} ${newClimb.climbingStyle} climb logged!`,
    });
  };

  const handleAddTechnique = () => {
    if (!newTechnique.trim()) return;
    
    addTechnique(newTechnique.trim());
    setNewTechnique('');
    updateSession({ newTechniquesTried: true });
    toast({
      title: "Technique Added",
      description: `${newTechnique} technique logged!`,
    });
  };

  const handleAddGear = () => {
    if (!newGearItem.trim()) return;
    
    addGear(newGearItem.trim());
    setNewGearItem('');
    updateSession({ gearUsed: true });
    toast({
      title: "Gear Added",
      description: `${newGearItem} gear logged!`,
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

      {/* Add Climb */}
      <Card>
        <CardHeader>
          <CardTitle>Log Climb</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Grade</Label>
                <Select value={newClimb.routeGrade} onValueChange={(value) => setNewClimb({...newClimb, routeGrade: value})}>
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
                <Select value={newClimb.climbingStyle} onValueChange={(value) => setNewClimb({...newClimb, climbingStyle: value})}>
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
                  value={newClimb.attemptsMade}
                  onChange={(e) => setNewClimb({...newClimb, attemptsMade: parseInt(e.target.value) || 1})}
                />
              </div>
              
              <div>
                <Label>Falls</Label>
                <Input
                  type="number"
                  min="0"
                  value={newClimb.fallsCount}
                  onChange={(e) => setNewClimb({...newClimb, fallsCount: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div>
                <Label>Rest (min)</Label>
                <Input
                  type="number"
                  min="0"
                  value={newClimb.restTimeMinutes}
                  onChange={(e) => setNewClimb({...newClimb, restTimeMinutes: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="completed"
                  checked={newClimb.completed}
                  onCheckedChange={(checked) => setNewClimb({...newClimb, completed: checked})}
                />
                <Label htmlFor="completed">Completed</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="hardest"
                  checked={newClimb.isHardestClimb}
                  onCheckedChange={(checked) => setNewClimb({...newClimb, isHardestClimb: checked})}
                />
                <Label htmlFor="hardest">Hardest climb today</Label>
              </div>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={newClimb.notes}
                onChange={(e) => setNewClimb({...newClimb, notes: e.target.value})}
                placeholder="Any notes about this climb..."
                rows={2}
              />
            </div>

            <Button onClick={handleAddClimb} disabled={!newClimb.routeGrade} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Climb
            </Button>
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
                <Input
                  value={newTechnique}
                  onChange={(e) => setNewTechnique(e.target.value)}
                  placeholder="Add technique practiced..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTechnique()}
                />
                <Button onClick={handleAddTechnique} size="sm">
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

            <div>
              <Label>Gear Used ({activeSession?.gear.length || 0})</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={newGearItem}
                  onChange={(e) => setNewGearItem(e.target.value)}
                  placeholder="Add gear used..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddGear()}
                />
                <Button onClick={handleAddGear} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {activeSession?.gear.map((gear, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {gear}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeGear(gear)}
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
