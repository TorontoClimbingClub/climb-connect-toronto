import React, { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showSendButton?: boolean;
  actionSlot?: React.ReactNode;
  className?: string;
}

export function MessageInput({
  value,
  onChange,
  onSend,
  placeholder = "Type a message...",
  disabled = false,
  showSendButton = true,
  actionSlot,
  className = ''
}: MessageInputProps) {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
    }
  };

  return (
    <div className={`p-4 border-t flex-shrink-0 ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          {actionSlot}
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            className={actionSlot ? "pl-10" : ""}
          />
        </div>
        {showSendButton && (
          <Button 
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}