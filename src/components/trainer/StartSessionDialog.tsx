
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface StartSessionDialogProps {
  onStartSession: (data: { sessionGoal?: string; customGoal?: string }) => void;
  isStarting: boolean;
}

const StartSessionDialog: React.FC<StartSessionDialogProps> = ({ onStartSession, isStarting }) => {
  const [open, setOpen] = useState(false);
  const [sessionGoal, setSessionGoal] = useState('');
  const [customGoal, setCustomGoal] = useState('');

  const { data: goals } = useQuery({
    queryKey: ['session-goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('session_goals_ref')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const handleStartSession = () => {
    onStartSession({
      sessionGoal: sessionGoal === 'custom' ? undefined : sessionGoal,
      customGoal: sessionGoal === 'custom' ? customGoal : undefined
    });
    setOpen(false);
    setSessionGoal('');
    setCustomGoal('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#E55A2B] hover:bg-[#d14919] text-white" size="lg">
          <Activity className="h-5 w-5 mr-2" />
          Start New Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start Training Session</DialogTitle>
          <DialogDescription>
            Set your goal for this climbing session. You can modify details as you climb.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="sessionGoal">Session Goal (Optional)</Label>
            <Select value={sessionGoal} onValueChange={setSessionGoal}>
              <SelectTrigger id="sessionGoal">
                <SelectValue placeholder="Select your main goal for this session" />
              </SelectTrigger>
              <SelectContent>
                {goals?.map((goal) => (
                  <SelectItem key={goal.id} value={goal.name}>
                    {goal.name}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom Goal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {sessionGoal === 'custom' && (
            <div>
              <Label htmlFor="customGoal">Custom Goal</Label>
              <Input
                id="customGoal"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="Describe your custom goal..."
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            onClick={handleStartSession} 
            disabled={isStarting}
            className="bg-[#E55A2B] hover:bg-[#d14919]"
          >
            {isStarting ? 'Starting...' : 'Start Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StartSessionDialog;
