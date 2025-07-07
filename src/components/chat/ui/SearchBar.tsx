import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showSearch: boolean;
  onToggleSearch: () => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  searchTerm,
  onSearchChange,
  showSearch,
  onToggleSearch,
  placeholder = "Search messages...",
  className = ''
}: SearchBarProps) {
  const handleToggle = () => {
    onToggleSearch();
    if (showSearch) {
      onSearchChange('');
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showSearch && (
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-48"
        />
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
      >
        {showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
      </Button>
    </div>
  );
}