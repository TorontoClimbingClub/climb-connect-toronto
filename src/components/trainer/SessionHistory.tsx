
import React, { useState } from 'react';
import { useOfflineTrainer } from '@/hooks/trainer/useOfflineTrainer';
import { useToast } from '@/hooks/use-toast';
import SessionFilters from './history/SessionFilters';
import SessionCard from './history/SessionCard';
import EmptyHistoryState from './history/EmptyHistoryState';

const SessionHistory = () => {
  const { allSessions, deleteSession } = useOfflineTrainer();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGoal, setFilterGoal] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Filter and sort sessions
  const filteredSessions = allSessions
    .filter(session => {
      const matchesSearch = session.sessionGoal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.customGoal?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGoal = filterGoal === 'all' || session.sessionGoal === filterGoal;
      return matchesSearch && matchesGoal;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime();
        case 'date-desc':
          return new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime();
        case 'climbs-desc':
          return b.climbs.length - a.climbs.length;
        case 'climbs-asc':
          return a.climbs.length - b.climbs.length;
        default:
          return 0;
      }
    });

  // Get unique session goals for filter
  const uniqueGoals = [...new Set(allSessions.map(s => s.sessionGoal).filter(Boolean))];

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      toast({
        title: "Session Deleted",
        description: "Training session has been permanently deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete training session.",
        variant: "destructive",
      });
    }
  };

  if (allSessions.length === 0) {
    return <EmptyHistoryState type="no-sessions" />;
  }

  return (
    <div className="space-y-6">
      <SessionFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterGoal={filterGoal}
        setFilterGoal={setFilterGoal}
        sortBy={sortBy}
        setSortBy={setSortBy}
        uniqueGoals={uniqueGoals}
      />

      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onDelete={handleDeleteSession}
          />
        ))}

        {filteredSessions.length === 0 && (
          <EmptyHistoryState type="no-results" />
        )}
      </div>
    </div>
  );
};

export default SessionHistory;
