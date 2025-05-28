
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ClimbCompletion } from "@/hooks/useClimbCompletions";
import { rattlesnakeRoutes } from "@/data/rattlesnakeRoutes";

interface CompletionChartProps {
  completions: ClimbCompletion[];
  title?: string;
}

export function CompletionChart({ completions, title = "Climbing Progress" }: CompletionChartProps) {
  const chartData = useMemo(() => {
    // Group routes by grade
    const gradeGroups: Record<string, { total: number; completed: number }> = {};
    
    // Initialize with all grades from routes
    rattlesnakeRoutes.forEach(route => {
      if (!gradeGroups[route.grade]) {
        gradeGroups[route.grade] = { total: 0, completed: 0 };
      }
      gradeGroups[route.grade].total++;
    });
    
    // Count completions
    completions.forEach(completion => {
      const route = rattlesnakeRoutes.find(r => r.id === completion.route_id);
      if (route && gradeGroups[route.grade]) {
        gradeGroups[route.grade].completed++;
      }
    });
    
    // Convert to chart format and sort by grade
    const sortGrades = (grades: string[]) => {
      return grades.sort((a, b) => {
        const getBaseGrade = (grade: string) => {
          const match = grade.match(/5\.(\d+)/);
          return match ? parseInt(match[1]) : 0;
        };
        return getBaseGrade(a) - getBaseGrade(b);
      });
    };
    
    return sortGrades(Object.keys(gradeGroups)).map(grade => ({
      grade,
      completed: gradeGroups[grade].completed,
      total: gradeGroups[grade].total,
      percentage: Math.round((gradeGroups[grade].completed / gradeGroups[grade].total) * 100),
    }));
  }, [completions]);

  const chartConfig = {
    completed: {
      label: "Completed",
      color: "#E55A2B",
    },
    total: {
      label: "Total",
      color: "#f3f4f6",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-stone-600">
          {completions.length} of {rattlesnakeRoutes.length} routes completed
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="grade" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis fontSize={12} />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value, name, props) => [
                  name === 'completed' 
                    ? `${value}/${props.payload.total} (${props.payload.percentage}%)`
                    : value,
                  name === 'completed' ? 'Completed' : 'Total'
                ]}
              />
              <Bar dataKey="total" fill="#f3f4f6" />
              <Bar dataKey="completed" fill="#E55A2B" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
