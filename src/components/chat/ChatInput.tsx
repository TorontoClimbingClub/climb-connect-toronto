import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { EmojiPickerComponent } from '@/components/ui/emoji-picker';
import { useApprovalStatus } from '@/hooks/useApprovalStatus';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode; // For additional content above input
  leftButton?: React.ReactNode; // For inline button on the left
}

export function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  placeholder = "Type a message...",
  disabled = false,
  className = '',
  children,
  leftButton 
}: ChatInputProps) {
  const { isApproved, isLoading } = useApprovalStatus();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && isApproved) {
      e.preventDefault();
      onSend();
      // Force scroll to bottom after sending message
      setTimeout(() => {
        const messageContainer = document.querySelector('.chat-scrollbar');
        if (messageContainer) {
          messageContainer.scrollTop = messageContainer.scrollHeight;
        }
      }, 100);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    onChange(value + emoji);
  };

  const isInputDisabled = disabled || isLoading || !isApproved;

  return (
    <div 
      className={`border-t bg-white flex-shrink-0 z-50 ${className}`}
      style={{
        paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))'
      }}
    >
      {!isApproved && !isLoading && (
        <div className="px-4 py-2 bg-orange-50 border-b border-orange-200 text-center">
          <p className="text-sm text-orange-800">
            Your account is pending approval. You cannot send messages until an admin approves your account.
          </p>
        </div>
      )}
      <div className="p-4">
        {children}
        <div className="flex gap-2 items-end">
          {leftButton && <div className="flex-shrink-0">{leftButton}</div>}
          <div className="flex-1 relative">
            <Input
              placeholder={isApproved ? placeholder : "Awaiting approval to chat..."}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12"
              disabled={isInputDisabled}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <EmojiPickerComponent onEmojiSelect={handleEmojiSelect} />
            </div>
          </div>
          <Button 
            onClick={onSend}
            disabled={!value.trim() || isInputDisabled}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}