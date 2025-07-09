import React, { useRef, useEffect } from 'react';
import { useMobileViewport, applyChatInputPosition } from '@/utils/mobileViewport';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { EmojiPickerComponent } from '@/components/ui/emoji-picker';

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
  const chatInputRef = useRef<HTMLDivElement>(null);
  const viewportState = useMobileViewport();

  // Apply mobile chat input positioning
  useEffect(() => {
    if (chatInputRef.current && viewportState.isMobile) {
      applyChatInputPosition(chatInputRef.current, viewportState);
    }
  }, [viewportState]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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

  return (
    <div 
      ref={chatInputRef}
      className={`p-4 border-t bg-white flex-shrink-0 z-50 ${
        viewportState.isMobile ? '' : 'sticky bottom-0'
      } ${className}`}
    >
      {children}
      <div className="flex gap-2 items-end">
        {leftButton && <div className="flex-shrink-0">{leftButton}</div>}
        <div className="flex-1 relative">
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pr-12"
            disabled={disabled}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <EmojiPickerComponent onEmojiSelect={handleEmojiSelect} />
          </div>
        </div>
        <Button 
          onClick={onSend}
          disabled={!value.trim() || disabled}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}