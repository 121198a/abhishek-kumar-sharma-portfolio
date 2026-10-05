// Serialise structured data for <script type="application/ld+json">.
// Escaping "<" (and U+2028/2029) means no string value can ever close the
// script tag, even if a data field later contains user-influenced text.
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
