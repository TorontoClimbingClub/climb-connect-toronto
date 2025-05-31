
import { Users } from "lucide-react";

interface CommunityHeaderProps {
  memberCount: number;
  isLoading: boolean;
}

export function CommunityHeader({ memberCount, isLoading }: CommunityHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Users className="h-6 w-6 text-[#E55A2B]" />
        <h1 className="text-2xl font-bold text-[#E55A2B]">Community</h1>
        {!isLoading && (
          <span className="text-sm text-stone-600 ml-2">
            ({memberCount} members)
          </span>
        )}
      </div>
      <p className="text-stone-600">Connect with fellow climbers</p>
    </div>
  );
}
