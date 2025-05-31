
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useBadges } from "@/hooks/useBadges";
import { useState } from "react";

export function BadgeSyncButton() {
  const { syncAllUserBadges } = useBadges();
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      await syncAllUserBadges();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={isLoading}
      variant="outline"
      className="flex items-center gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      {isLoading ? 'Syncing Badges...' : 'Sync All User Badges'}
    </Button>
  );
}
