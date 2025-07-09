// Utility functions for detecting and handling event creation messages

export const extractEventId = (content: string): string | null => {
  const eventMatch = content.match(/\[EVENT:([^\]]+)\]/);
  return eventMatch ? eventMatch[1] : null;
};

export const isEventCreationMessage = (content: string): boolean => {
  return content.includes('[EVENT:') && content.includes('🎯 New Event Created:');
};

export const formatEventMessageContent = (content: string): {
  title: string;
  details: string;
  eventId: string | null;
} => {
  const eventId = extractEventId(content);
  
  // Extract title from "🎯 New Event Created: "Title""
  const titleMatch = content.match(/🎯 New Event Created: "([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : 'New Event';
  
  // Extract everything before [EVENT:...] for details
  const eventTagIndex = content.indexOf('[EVENT:');
  const details = eventTagIndex > -1 ? content.substring(0, eventTagIndex).trim() : content;
  
  return {
    title,
    details,
    eventId
  };
};