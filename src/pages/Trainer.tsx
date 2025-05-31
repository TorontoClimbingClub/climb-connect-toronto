
import React, { useState } from 'react';
import { useResponsiveContainer } from '@/hooks/useResponsiveContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BarChart3, History, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import SessionForm from '@/components/trainer/SessionForm';
import TrainingDashboard from '@/components/trainer/TrainingDashboard';
import SessionHistory from '@/components/trainer/SessionHistory';
import Navigation from '@/components/Navigation';
import { useActiveSession } from '@/hooks/trainer/useActiveSession';

const Trainer = () => {
  const { containerClass, paddingClass } = useResponsiveContainer('wide');
  const [activeTab, setActiveTab] = useState('log');
  const { hasActiveSession } = useActiveSession();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className={`${containerClass} ${paddingClass}`}>
        <div className="pt-6 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Tracker</h1>
          <p className="text-gray-600">
            {hasActiveSession 
              ? "Continue your active climbing session" 
              : "Start a new climbing session and track your progress"
            }
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="log" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {hasActiveSession ? 'Active Session' : 'Start Session'}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="log" className="space-y-6">
            {hasActiveSession ? (
              <SessionForm />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>New Training Session</CardTitle>
                  <CardDescription>
                    Start a climbing session that will track your progress in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SessionForm />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <TrainingDashboard />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <SessionHistory />
          </TabsContent>
        </Tabs>
      </div>
      <Navigation />
    </div>
  );
};

export default Trainer;
