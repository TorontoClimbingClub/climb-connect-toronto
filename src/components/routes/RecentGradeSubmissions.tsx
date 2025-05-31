
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp } from 'lucide-react';
import { useRecentGradeSubmissions } from '@/hooks/useRecentGradeSubmissions';
import { formatDistanceToNow } from 'date-fns';

interface RecentGradeSubmissionsProps {
  onRouteClick: (routeId: string) => void;
}

export const RecentGradeSubmissions = ({ onRouteClick }: RecentGradeSubmissionsProps) => {
  const { submissions, loading } = useRecentGradeSubmissions(8);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#E55A2B]" />
            Recent Grade Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#E55A2B]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#E55A2B]" />
            Recent Grade Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">No recent grade submissions</p>
        </CardContent>
      </Card>
    );
  }

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'Trad':
        return 'bg-orange-100 text-orange-800';
      case 'Sport':
        return 'bg-blue-100 text-blue-800';
      case 'Top Rope':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#E55A2B]" />
          Recent Grade Submissions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {submissions.map((submission) => (
            <button
              key={submission.id}
              onClick={() => onRouteClick(submission.route_id)}
              className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left border border-gray-100"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{submission.route.name}</h4>
                  <p className="text-sm text-gray-600">{submission.route.area} → {submission.route.sector}</p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <span className="font-semibold text-[#E55A2B]">{submission.submitted_grade}</span>
                  <Badge className={getStyleColor(submission.route.style)} variant="secondary">
                    {submission.route.style}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>by {submission.user_name}</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
