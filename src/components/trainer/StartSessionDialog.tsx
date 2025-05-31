
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SessionGoals from './SessionGoals';
import { format } from 'date-fns';

interface StartSessionDialogProps {
  onStartSession: (sessionData: any) => void;
  isStarting: boolean;
}

const StartSessionDialog: React.FC<StartSessionDialogProps> = ({ onStartSession, isStarting }) => {
  const [open, setOpen] = useState(false);
  const [sessionGoal, setSessionGoal] = useState('');
  const [customGoal, setCustomGoal] = useState('');

  const handleStartSession = () => {
    // Validate that a goal is selected
    if (!sessionGoal || sessionGoal === '') {
      return; // Don't start session if no goal selected
    }

    // Validate custom goal if custom is selected
    if (sessionGoal === 'custom' && (!customGoal || customGoal.trim() === '')) {
      return; // Don't start session if custom goal is empty
    }

    const sessionData = {
      sessionDate: format(new Date(), 'yyyy-MM-dd'),
      sessionGoal: sessionGoal === 'custom' ? null : sessionGoal,
      customGoal: sessionGoal === 'custom' ? customGoal : null,
    };
    
    onStartSession(sessionData);
    setOpen(false);
    
    // Reset form
    setSessionGoal('');
    setCustomGoal('');
  };

  const isStartDisabled = () => {
    if (isStarting) return true;
    if (!sessionGoal || sessionGoal === '') return true;
    if (sessionGoal === 'custom' && (!customGoal || customGoal.trim() === '')) return true;
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-[#E55A2B] hover:bg-[#E55A2B]/90 text-white">
          Start Training Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start New Training Session</DialogTitle>
          <DialogDescription>
            Set your goal for today's climbing session. You can track your progress and add climbs once the session starts.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <SessionGoals
            value={sessionGoal}
            customValue={customGoal}
            onGoalChange={setSessionGoal}
            onCustomGoalChange={setCustomGoal}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleStartSession}
            disabled={isStartDisabled()}
            className="bg-[#E55A2B] hover:bg-[#E55A2B]/90"
          >
            {isStarting ? 'Starting...' : 'Start Session'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartSessionDialog;
