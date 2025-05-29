
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

interface CommunityStatsProps {
  memberCount: number;
}

export function CommunityStats({ memberCount }: CommunityStatsProps) {
  return (
    <div className="mb-4">
      <Card>
        <CardContent className="p-4 text-center">
          <Users className="h-8 w-8 text-[#E55A2B] mx-auto mb-2" />
          <p className="text-2xl font-bold text-[#E55A2B]">{memberCount}</p>
          <p className="text-sm text-stone-600">Active Members</p>
        </CardContent>
      </Card>
    </div>
  );
}
