/**
 * Moderation Utilities
 *
 * TODO: These functions should call the backend moderation endpoints
 * Backend: WisdmNewsAPI/utils/moderation/gemini/nameModeration.py
 */

interface ModerationResult {
  [key: string]: {
    isProblematic: boolean;
    problematicWords: string[];
  };
}

/**
 * Basic name moderation filter
 * TODO: Replace with backend API call to /api/moderation/name/basic
 */
export function basicNameModerationFilter(
  value: string,
  fieldName: string
): string | null {
  // Temporary client-side implementation
  // TODO: Call backend endpoint instead
  const badWords = [
    "spam",
    "test",
    "admin",
    "moderator",
    "fuck",
    "shit",
    "ass",
  ];
  const lowerValue = value.toLowerCase();
  const problematicWords = badWords.filter((word) => lowerValue.includes(word));

  if (problematicWords.length > 0) {
    return `The following problematic words were detected in your ${fieldName} entry: ${problematicWords.join(
      ", "
    )}`;
  }

  return null;
}

/**
 * AI-powered name moderation
 * TODO: Replace with backend API call to /api/moderation/name/ai
 */
export async function aiNameModerationRequest(data: {
  name: string;
  username: string;
}): Promise<ModerationResult> {
  // Temporary implementation - should call backend
  // TODO: Call backend endpoint that uses Gemini AI
  const result: ModerationResult = {};

  for (const [key, value] of Object.entries(data)) {
    const badWords = [
      "spam",
      "test",
      "admin",
      "moderator",
      "fuck",
      "shit",
      "ass",
    ];
    const lowerValue = value.toLowerCase();
    const problematicWords = badWords.filter((word) =>
      lowerValue.includes(word)
    );

    result[key] = {
      isProblematic: problematicWords.length > 0,
      problematicWords,
    };
  }

  return result;
}
