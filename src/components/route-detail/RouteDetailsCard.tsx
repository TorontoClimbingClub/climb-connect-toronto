
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Check } from 'lucide-react';
import { ClimbingRoute } from '@/types/routes';
import { useAuth } from '@/contexts/AuthContext';
import { useClimbCompletions } from '@/hooks/useClimbCompletions';
import BetaGradeDisplay from './BetaGradeDisplay';
import GradeSubmissionForm from './GradeSubmissionForm';
import { useGradeSubmissions } from '@/hooks/useGradeSubmissions';

interface RouteDetailsCardProps {
  route: ClimbingRoute;
}

const RouteDetailsCard: React.FC<RouteDetailsCardProps> = ({ route }) => {
  const { user } = useAuth();
  const { isCompleted, toggleCompletion, loading } = useClimbCompletions(route.id);
  const { betaGrade, fetchSubmissions } = useGradeSubmissions(route.id);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'Trad':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Sport':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Top Rope':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{route.name}</span>
            {user && (
              <div className="flex items-center gap-2">
                <GradeSubmissionForm route={route} />
                <Button
                  variant={isCompleted ? "default" : "outline"}
                  size="sm"
                  onClick={toggleCompletion}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {isCompleted ? (
                    <>
                      <Check className="h-4 w-4" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4" />
                      Mark Complete
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Grade</h3>
              <p className="text-lg font-semibold">{route.grade}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Style</h3>
              <Badge className={getStyleColor(route.style)}>
                {route.style}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Area</h3>
              <p className="text-sm">{route.area}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Sector</h3>
              <p className="text-sm">{route.sector}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{route.area} → {route.sector}</span>
          </div>
        </CardContent>
      </Card>

      <BetaGradeDisplay 
        betaGrade={betaGrade}
        originalGrade={route.grade}
        routeStyle={route.style}
      />
    </div>
  );
};

export default RouteDetailsCard;
