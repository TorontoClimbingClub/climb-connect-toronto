
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterActionsProps {
  onApplyFilters: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterActions = ({ onApplyFilters, onClearFilters, hasActiveFilters }: FilterActionsProps) => {
  return (
    <div className="flex gap-2 pt-2">
      <Button 
        onClick={onApplyFilters}
        className="flex-1 bg-[#E55A2B] hover:bg-orange-700"
      >
        Apply Filters
      </Button>
      {hasActiveFilters && (
        <Button 
          onClick={onClearFilters}
          variant="outline"
          className="flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
};
