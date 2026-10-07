/**
 * Strips unnecessary Markdown asterisks, bold tags, and bracketed bold lists
 * from AI Assistant responses to keep the tone natural, clean, and recruiter-friendly.
 */
export function formatAiResponse(text: string): string {
  if (!text) return "";
  let cleaned = text;

  // Clean bracketed bold arrays: [**React.js**, **Next.js**] -> React.js, Next.js
  cleaned = cleaned.replace(/\[\s*(?:\*\*)?([^*\]]+?)(?:\*\*)?\s*(?:,\s*(?:\*\*)?([^*\]]+?)(?:\*\*)?)*\s*\]/g, (match) => {
    // If it's a markdown link [text](url), leave it intact
    if (match.endsWith("](") || match.includes("](")) return match;
    return match.replace(/^\[|\]$/g, "").replace(/\*\*/g, "").trim();
  });

  // Clean brackets around single words: [React.js] -> React.js (when not markdown link [text](url))
  cleaned = cleaned.replace(/\[([^\]()\n]+)\](?!\()/g, "$1");

  // Remove bold markdown (**text** or ***text*** -> text)
  cleaned = cleaned.replace(/\*{2,3}([^*]+)\*{2,3}/g, "$1");

  // Remove stray asterisks (*word* -> word) when used as emphasis
  cleaned = cleaned.replace(/(^|\s)\*([^*\s]+)\*(\s|$|[.,!?;:])/g, "$1$2$3");

  // Remove markdown headers if any (### Title -> Title)
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, "");

  // Collapse consecutive spaces but preserve intentional newlines
  cleaned = cleaned.replace(/[ \t]{2,}/g, " ");

  return cleaned.trim();
}
