
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SessionGoalsProps {
  value: string;
  customValue: string;
  onGoalChange: (goal: string) => void;
  onCustomGoalChange: (goal: string) => void;
}

const SessionGoals: React.FC<SessionGoalsProps> = ({
  value,
  customValue,
  onGoalChange,
  onCustomGoalChange
}) => {
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

  const isCustomGoal = value === 'custom';

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="sessionGoal">Session Goal</Label>
        <Select value={value} onValueChange={onGoalChange}>
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

      {isCustomGoal && (
        <div>
          <Label htmlFor="customGoal">Custom Goal</Label>
          <Input
            id="customGoal"
            value={customValue}
            onChange={(e) => onCustomGoalChange(e.target.value)}
            placeholder="Describe your custom goal..."
          />
        </div>
      )}
    </div>
  );
};

export default SessionGoals;
