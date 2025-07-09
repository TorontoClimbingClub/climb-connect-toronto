import { ClimbingType, BelayGroupPrivacy, CLIMBING_TYPE_LABELS, CLIMBING_TYPE_ICONS } from '@/types/belayGroup';

export interface BelayGroupMessageData {
  id: string;
  name: string;
  climbingType: ClimbingType;
  location: string;
  sessionDate: string;
  capacity: number;
  privacy: BelayGroupPrivacy;
  participantCount: number;
}

// Pattern to detect belay group creation messages
const BELAY_GROUP_MESSAGE_PATTERN = /\[BELAY_GROUP:([^\]]+)\]/;

/**
 * Checks if a message is a belay group creation message
 */
export const isBelayGroupMessage = (message: string): boolean => {
  return BELAY_GROUP_MESSAGE_PATTERN.test(message);
};

/**
 * Extracts belay group ID from message content
 */
export const extractBelayGroupId = (message: string): string | null => {
  const match = message.match(BELAY_GROUP_MESSAGE_PATTERN);
  return match ? match[1] : null;
};

/**
 * Formats belay group message content for display
 */
export const formatBelayGroupMessage = (
  name: string,
  climbingType: ClimbingType,
  location: string,
  sessionDate: string,
  capacity: number,
  privacy: BelayGroupPrivacy,
  belayGroupId: string
): string => {
  const typeIcon = CLIMBING_TYPE_ICONS[climbingType];
  const typeLabel = CLIMBING_TYPE_LABELS[climbingType];
  const privacyIcon = privacy === 'public' ? '🌐' : '🔒';
  
  // Compact date format: "Jan 9, 2:00 PM" instead of verbose format
  const sessionDateFormatted = new Date(sessionDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  const partnersNeeded = capacity - 1;
  const partnersText = partnersNeeded === 1 ? '1 more partner' : `${partnersNeeded} more partners`;

  return `🤝 **${name}** - ${typeIcon} ${typeLabel}
📍 ${location} • ${sessionDateFormatted}
👥 Need ${partnersText} • ${privacyIcon} ${privacy === 'public' ? 'Public' : 'Private'}
[BELAY_GROUP:${belayGroupId}]`;
};

/**
 * Parses belay group message content to extract details
 */
export const parseBelayGroupMessage = (message: string): BelayGroupMessageData | null => {
  if (!isBelayGroupMessage(message)) {
    return null;
  }

  const belayGroupId = extractBelayGroupId(message);
  if (!belayGroupId) {
    return null;
  }

  // Extract information using regex patterns for multiline format
  // Split message into lines for easier parsing
  const lines = message.split('\n');
  
  // Line 1: 🤝 **Name** - [emoji] Type (match after emoji and space)
  const line1 = lines[0] || '';
  const nameMatch = line1.match(/🤝 \*\*(.*?)\*\* - /);
  const typeMatch = line1.match(/- \S+ (.+)$/);
  
  // Line 2: 📍 Location • Date
  const line2 = lines[1] || '';
  const locationMatch = line2.match(/📍 (.+?) •/);
  const dateMatch = line2.match(/• (.+)$/);
  
  // Line 3: 👥 Need X more partner(s) • Privacy
  const line3 = lines[2] || '';
  const capacityMatch = line3.match(/👥 Need (\d+) more/);
  const privacyMatch = line3.match(/• [🌐🔒] (Public|Private)$/);
  
  // Clean date (should already be clean since we're using end of line)
  const cleanDate = dateMatch?.[1];

  if (!nameMatch || !typeMatch || !locationMatch || !dateMatch || !capacityMatch) {
    console.error('parseBelayGroupMessage: Failed to parse message format. Lines:', lines);
    return null;
  }

  // Find climbing type from label
  const typeLabel = typeMatch[1];
  let climbingType: ClimbingType = 'mixed';
  for (const [key, label] of Object.entries(CLIMBING_TYPE_LABELS)) {
    if (label === typeLabel) {
      climbingType = key as ClimbingType;
      break;
    }
  }

  return {
    id: belayGroupId,
    name: nameMatch[1],
    climbingType,
    location: locationMatch[1],
    sessionDate: cleanDate || dateMatch[1],
    capacity: parseInt(capacityMatch[1]) + 1, // +1 because message shows "looking for X more"
    privacy: privacyMatch?.[1]?.toLowerCase() === 'private' ? 'private' : 'public',
    participantCount: 1 // Creator is always the first participant
  };
};

/**
 * Formats session date for display in various contexts
 */
export const formatSessionDate = (sessionDate: string, format: 'short' | 'long' | 'time' = 'long'): string => {
  const date = new Date(sessionDate);
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    case 'time':
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      });
    case 'long':
    default:
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
  }
};

/**
 * Calculates time until session starts
 */
export const getTimeUntilSession = (sessionDate: string): string => {
  const now = new Date();
  const session = new Date(sessionDate);
  const diff = session.getTime() - now.getTime();
  
  if (diff < 0) return 'Session started';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

/**
 * Checks if belay group is available for joining
 */
export const canJoinBelayGroup = (
  status: string,
  participantCount: number,
  capacity: number,
  sessionDate: string
): boolean => {
  const now = new Date();
  const session = new Date(sessionDate);
  
  return (
    status === 'active' &&
    participantCount < capacity &&
    session.getTime() > now.getTime()
  );
};