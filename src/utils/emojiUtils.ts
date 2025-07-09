// Utility functions for emoji detection and handling in chat messages

/**
 * Checks if a message contains only emojis (and optional whitespace)
 * @param message The message content to check
 * @returns true if the message contains only emojis, false otherwise
 */
export function isEmojiOnly(message: string): boolean {
  if (!message || message.trim().length === 0) {
    return false;
  }

  // Remove all whitespace for analysis
  const cleanMessage = message.replace(/\s+/g, '');
  
  // If empty after removing whitespace, it's not emoji-only
  if (cleanMessage.length === 0) {
    return false;
  }

  // Unicode ranges for emojis
  const emojiRegex = /^[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]|[\u{FE0F}]|[\u{200D}]|[\u{E0020}-\u{E007F}]|[\u{1F170}-\u{1F251}]$/u;

  // Split message into individual characters/codepoints
  const characters = [...cleanMessage];
  
  // Check if all characters are emojis
  for (const char of characters) {
    // Check if character is an emoji
    if (!emojiRegex.test(char) && !isEmojiCharacter(char)) {
      return false;
    }
  }

  return true;
}

/**
 * More comprehensive emoji detection for individual characters
 * @param char Single character to check
 * @returns true if character is an emoji
 */
function isEmojiCharacter(char: string): boolean {
  // Get the unicode code point
  const codePoint = char.codePointAt(0);
  
  if (!codePoint) return false;

  // Check various Unicode blocks that contain emojis
  return (
    // Emoticons
    (codePoint >= 0x1F600 && codePoint <= 0x1F64F) ||
    // Miscellaneous Symbols and Pictographs
    (codePoint >= 0x1F300 && codePoint <= 0x1F5FF) ||
    // Transport and Map Symbols
    (codePoint >= 0x1F680 && codePoint <= 0x1F6FF) ||
    // Regional Indicator Symbols (flags)
    (codePoint >= 0x1F1E0 && codePoint <= 0x1F1FF) ||
    // Supplemental Symbols and Pictographs
    (codePoint >= 0x1F900 && codePoint <= 0x1F9FF) ||
    // Miscellaneous Symbols
    (codePoint >= 0x2600 && codePoint <= 0x26FF) ||
    // Dingbats
    (codePoint >= 0x2700 && codePoint <= 0x27BF) ||
    // Enclosed Alphanumeric Supplement
    (codePoint >= 0x1F100 && codePoint <= 0x1F1FF) ||
    // Enclosed Ideographic Supplement
    (codePoint >= 0x1F200 && codePoint <= 0x1F2FF) ||
    // Geometric Shapes Extended
    (codePoint >= 0x1F780 && codePoint <= 0x1F7FF) ||
    // Supplemental Arrows-C
    (codePoint >= 0x1F800 && codePoint <= 0x1F8FF) ||
    // Chess Symbols
    (codePoint >= 0x1FA00 && codePoint <= 0x1FA6F) ||
    // Symbols and Pictographs Extended-A
    (codePoint >= 0x1FA70 && codePoint <= 0x1FAFF) ||
    // Variation Selectors
    (codePoint >= 0xFE00 && codePoint <= 0xFE0F) ||
    // Zero Width Joiner (for complex emojis)
    codePoint === 0x200D ||
    // Combining characters for emoji modifiers
    (codePoint >= 0x20D0 && codePoint <= 0x20FF) ||
    // Some common emoji characters
    codePoint === 0x263A || // ☺
    codePoint === 0x2639 || // ☹
    codePoint === 0x2764 || // ❤
    codePoint === 0x2665 || // ♥
    codePoint === 0x2660 || // ♠
    codePoint === 0x2666 || // ♦
    codePoint === 0x2663    // ♣
  );
}

/**
 * Checks if a message contains a reasonable number of emojis (not spam)
 * @param message The message content to check
 * @returns true if the message has a reasonable emoji count
 */
export function isReasonableEmojiCount(message: string): boolean {
  const cleanMessage = message.replace(/\s+/g, '');
  // Allow up to 5 emojis max for emoji-only messages
  return cleanMessage.length <= 5;
}

/**
 * Determines if a message should be displayed without a speech bubble
 * @param message The message content to check
 * @returns true if message should be displayed without bubble
 */
export function shouldDisplayWithoutBubble(message: string): boolean {
  return isEmojiOnly(message) && isReasonableEmojiCount(message);
}