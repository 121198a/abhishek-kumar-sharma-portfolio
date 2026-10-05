import { contactSchema, chatSchema, looksLikeSpam, isValidEmail, stripControlChars } from "../lib/validate";
import { checkRateLimit } from "../lib/rate-limit";
import fs from "node:fs";
import path from "node:path";

let failures = 0;
function test(ok: boolean, desc: string, extra = "") {
  if (!ok) {
    failures++;
    console.error("FAIL:", desc, extra);
  } else {
    console.log("OK  :", desc);
  }
}

console.log("Running comprehensive validation & security checklist tests...\n");

// 1. Zod validation & types
const validContact = {
  name: "John Doe",
  email: "john@example.com",
  message: "Hello Abhishek, I love your portfolio and would like to connect.",
};
const parsedValid = contactSchema.safeParse(validContact);
test(parsedValid.success, "1. Zod validation: Valid contact data parses cleanly");

for (const bad of [null, undefined, 123, [], {}]) {
  const badParse = contactSchema.safeParse(bad);
  test(!badParse.success, `1. Zod validation: Non-object body (${JSON.stringify(bad)}) rejected`);
}

for (const badType of [
  { name: 123, email: "a@b.com", message: "hi" },
  { name: "John", email: ["test"], message: "hi" },
  { name: "John", email: "a@b.com", message: {} },
]) {
  const badParse = contactSchema.safeParse(badType);
  test(!badParse.success, `1. Zod validation: Wrong field type rejected (${JSON.stringify(badType)})`);
}

// 2. Maximum message length
const longMessage = "a".repeat(2001);
const parsedLong = contactSchema.safeParse({ ...validContact, message: longMessage });
test(!parsedLong.success, "2. Maximum message length: Message over 2000 chars rejected");

const exactMaxMessage = "a".repeat(2000);
const parsedExact = contactSchema.safeParse({ ...validContact, message: exactMaxMessage });
test(parsedExact.success, "2. Maximum message length: Message exactly 2000 chars accepted");

const longName = "a".repeat(121);
const parsedLongName = contactSchema.safeParse({ ...validContact, name: longName });
test(!parsedLongName.success, "2. Maximum message length: Name over 120 chars rejected");

// 3. Email format validation
for (const invalidEmail of ["plainaddress", "@missinguser.com", "user@.com", "user@domain..com"]) {
  const parsed = contactSchema.safeParse({ ...validContact, email: invalidEmail });
  test(!parsed.success, `3. Email format validation: '${invalidEmail}' rejected`);
}

const crlfEmail = "user@domain.com\r\nBcc: evil@domain.com";
const parsedCrlfEmail = contactSchema.safeParse({ ...validContact, email: crlfEmail });
test(!parsedCrlfEmail.success, "3. Email format validation: CRLF header injection in email rejected");

// 4. Rate limiting
const testKey = `test-ip-${Date.now()}`;
let rateLimitHit = false;
for (let i = 0; i < 5; i++) {
  const allowed = checkRateLimit(testKey, 3, 60_000);
  if (!allowed) {
    rateLimitHit = true;
    break;
  }
}
test(rateLimitHit, "4. Rate limiting: In-memory limiter triggers after limit reached");

// 5. Honeypot field
const botPayload = { ...validContact, honeypot: "spam_bot_data" };
const parsedBot = contactSchema.safeParse(botPayload);
test(parsedBot.success && parsedBot.data.honeypot === "spam_bot_data", "5. Honeypot field: Honeypot field accepted by schema so route can silently catch bots");

// 6. Chat schema validation
const validChat = { message: "What projects has Abhishek built?" };
const parsedChat = chatSchema.safeParse(validChat);
test(parsedChat.success, "6. Chat Zod validation: Valid chat message parses cleanly");

for (const badChatMessage of ["", "   ", null, 123, []]) {
  const parsed = chatSchema.safeParse({ message: badChatMessage });
  test(!parsed.success, `6. Chat Zod validation: Invalid message (${JSON.stringify(badChatMessage)}) rejected`);
}

// 7. API key only on server
const clientEnvPrefix = "NEXT_PUBLIC_";
const secretKeys = ["RESEND_API_KEY", "NVIDIA_API_KEY", "CHAT_SESSION_SECRET", "GITHUB_TOKEN"];
const envExampleContent = fs.readFileSync(path.resolve(__dirname, "../.env.example"), "utf8");
for (const key of secretKeys) {
  test(!envExampleContent.includes(`${clientEnvPrefix}${key}`), `7. API key only on server: ${key} has no NEXT_PUBLIC_ prefix`);
}

// 8. No API key in GitHub (.gitignore check)
const gitignore = fs.readFileSync(path.resolve(__dirname, "../.gitignore"), "utf8");
test(gitignore.includes(".env*.local") || gitignore.includes(".env.local"), "8. No API key in GitHub: .env.local ignored in .gitignore");
test(gitignore.includes(".env\n") || gitignore.includes(".env\r\n"), "8. No API key in GitHub: .env ignored in .gitignore");

// 9. No sensitive information in error responses & header injection defense
const headerInjectionName = "Abhishek\r\nBcc: hacker@example.com";
const sanitizedName = stripControlChars(headerInjectionName);
test(!sanitizedName.includes("\r") && !sanitizedName.includes("\n"), "9. Header injection defense: stripControlChars removes CRLF");

// 10. Basic spam protection
const spamText = "Check this out https://spam1.com and https://spam2.com also http://spam3.com now!";
test(looksLikeSpam(spamText), "10. Basic spam protection: Multiple links flagged as spam");

const shoutSpam = "BUY CRYPTO NOW HUGE RETURNS GUARANTEED ACT FAST";
test(looksLikeSpam(shoutSpam), "10. Basic spam protection: High-percentage uppercase flagged as spam");

const normalMessage = "Hi Abhishek, I would love to interview you for a Senior Software Engineer position.";
test(!looksLikeSpam(normalMessage), "10. Basic spam protection: Legitimate recruiter message allowed");

if (failures > 0) {
  console.error(`\nValidation test failed with ${failures} error(s).`);
  process.exit(1);
} else {
  console.log("\nAll validation & security checklist tests passed successfully!");
}
