import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * ChatDetailsDropdown - A reusable dropdown component for chat headers
 * 
 * This component provides a consistent way to display expandable details
 * in chat interfaces. It's designed to work across both event and belay chats
 * with customizable styling and behavior.
 * 
 * @example
 * // Basic usage
 * <ChatDetailsDropdown
 *   summary={<span>Event Info</span>}
 * >
 *   <div>Detailed event information</div>
 * </ChatDetailsDropdown>
 * 
 * @example
 * // With custom styling and actions
 * <ChatDetailsDropdown
 *   summary={<span>Session Details</span>}
 *   summaryBackground="bg-green-50"
 *   detailsBackground="bg-green-100"
 *   actions={<Button size="sm">Join</Button>}
 *   onToggle={(expanded) => console.log('Expanded:', expanded)}
 * >
 *   <div>Session information</div>
 * </ChatDetailsDropdown>
 * 
 * Future customization possibilities:
 * - Add keyboard navigation support
 * - Implement controlled vs uncontrolled modes
 * - Add animation presets (slide, fade, etc.)
 * - Support for custom positioning (top, bottom, left, right)
 * - Add accessibility enhancements (ARIA attributes, focus management)
 * - Theme integration with design system colors
 * - Support for nested dropdowns
 * - Add loading states for async content
 * - Implement auto-close on outside click
 * - Add gesture support for mobile (swipe to close)
 */

interface ChatDetailsDropdownProps {
  /** Summary information shown in the header */
  summary: React.ReactNode;
  /** Detailed content shown when expanded */
  children: React.ReactNode;
  /** Optional custom className for the container */
  className?: string;
  /** Whether to show on all screen sizes or just mobile */
  responsiveDisplay?: 'all' | 'mobile-only';
  /** Background color for the summary section */
  summaryBackground?: string;
  /** Background color for the expanded details section */
  detailsBackground?: string;
  /** Custom icon to show when collapsed */
  collapsedIcon?: React.ReactNode;
  /** Custom icon to show when expanded */
  expandedIcon?: React.ReactNode;
  /** Initial expanded state */
  defaultExpanded?: boolean;
  /** Callback when expansion state changes */
  onToggle?: (expanded: boolean) => void;
  /** Additional actions to show in the summary section */
  actions?: React.ReactNode;
  /** Animation duration in milliseconds */
  animationDuration?: number;
}

export function ChatDetailsDropdown({
  summary,
  children,
  className = '',
  responsiveDisplay = 'all',
  summaryBackground = 'bg-blue-50',
  detailsBackground = 'bg-gradient-to-b from-gray-50 to-white',
  collapsedIcon = <ChevronDown className="h-3 w-3" />,
  expandedIcon = <ChevronUp className="h-3 w-3" />,
  defaultExpanded = false,
  onToggle,
  actions,
  animationDuration = 300
}: ChatDetailsDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onToggle?.(newExpanded);
  };

  const responsiveClass = responsiveDisplay === 'mobile-only' ? 'sm:hidden' : '';

  return (
    <div className={`relative ${responsiveClass} ${className}`}>
      {/* Summary Section with Toggle Button */}
      <div className={`${summaryBackground} border-b px-4 py-2 flex-shrink-0`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {summary}
          </div>
          <div className="flex items-center gap-2">
            {actions && (
              <div className="flex items-center gap-1">
                {actions}
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className="h-6 w-6 p-0 hover:bg-gray-100 transition-transform duration-200"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
            >
              {isExpanded ? expandedIcon : collapsedIcon}
            </Button>
          </div>
        </div>
      </div>

      {/* Expandable Details Section */}
      <div 
        className={`absolute top-full left-0 right-0 z-30 bg-white border-b shadow-lg transition-all ease-out ${
          isExpanded 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        style={{
          transitionDuration: `${animationDuration}ms`
        }}
      >
        <div className={`p-4 ${detailsBackground}`}>
          <div className="space-y-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Pre-configured components for specific chat types
export function EventDetailsDropdown({
  summary,
  children,
  className = ''
}: Omit<ChatDetailsDropdownProps, 'summaryBackground' | 'detailsBackground'>) {
  return (
    <ChatDetailsDropdown
      summary={summary}
      className={className}
      summaryBackground="bg-blue-50"
      detailsBackground="bg-gradient-to-b from-blue-50 to-white"
    >
      {children}
    </ChatDetailsDropdown>
  );
}

export function BelayDetailsDropdown({
  summary,
  children,
  className = ''
}: Omit<ChatDetailsDropdownProps, 'summaryBackground' | 'detailsBackground'>) {
  return (
    <ChatDetailsDropdown
      summary={summary}
      className={className}
      summaryBackground="bg-green-50"
      detailsBackground="bg-gradient-to-b from-green-50 to-white"
    >
      {children}
    </ChatDetailsDropdown>
  );
}