
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useState } from 'react';
import { RouteBetaGrade } from '@/types/routes';
import { gradeToNumber } from '@/utils/gradeUtils';

interface BetaGradeDisplayProps {
  betaGrade: RouteBetaGrade | null;
  originalGrade: string;
  routeStyle: string;
}

const BetaGradeDisplay: React.FC<BetaGradeDisplayProps> = ({ 
  betaGrade, 
  originalGrade, 
  routeStyle 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!betaGrade) {
    return (
      <Card className="border-l-4 border-l-gray-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            Beta Grade
            <Badge variant="outline" className="text-xs">
              Needs more data
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            No community grade available yet. Be the first to submit your assessment!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Compare grades
  const originalGradeNum = gradeToNumber(originalGrade, routeStyle as any);
  const betaGradeNum = gradeToNumber(betaGrade.beta_grade, routeStyle as any);
  const gradeDifference = betaGradeNum - originalGradeNum;

  let comparisonIcon;
  let comparisonText;
  let borderColor;

  if (gradeDifference > 0) {
    comparisonIcon = <TrendingUp className="h-4 w-4 text-red-500" />;
    comparisonText = "Harder than book";
    borderColor = "border-l-red-500";
  } else if (gradeDifference < 0) {
    comparisonIcon = <TrendingDown className="h-4 w-4 text-green-500" />;
    comparisonText = "Easier than book";
    borderColor = "border-l-green-500";
  } else {
    comparisonIcon = <Minus className="h-4 w-4 text-blue-500" />;
    comparisonText = "Matches book grade";
    borderColor = "border-l-blue-500";
  }

  // Prepare grade distribution data
  const gradeDistribution = Object.entries(betaGrade.grade_distribution)
    .map(([grade, count]) => ({ grade, count: count as number }))
    .sort((a, b) => gradeToNumber(a.grade, routeStyle as any) - gradeToNumber(b.grade, routeStyle as any));

  const maxCount = Math.max(...gradeDistribution.map(d => d.count));

  return (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            Beta Grade: {betaGrade.beta_grade}
            {comparisonIcon}
          </div>
          <Badge variant="outline" className="text-xs">
            {betaGrade.submission_count} submissions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Community consensus</span>
          <span className={`font-medium ${
            gradeDifference > 0 ? 'text-red-600' : 
            gradeDifference < 0 ? 'text-green-600' : 'text-blue-600'
          }`}>
            {comparisonText}
          </span>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
            View grade distribution
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Grade Distribution:</h4>
              {gradeDistribution.map(({ grade, count }) => (
                <div key={grade} className="flex items-center gap-2">
                  <span className="text-sm w-12">{grade}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default BetaGradeDisplay;
