"use client";

import React from "react";
import { dispatchOpenAiChat } from "@/lib/project-ai-event";

type OpenChatButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  /** Optional question the assistant should start with. */
  question?: string;
};

/** Button that opens the AI assistant. Lets parent sections stay server components. */
export default function OpenChatButton({ question, type = "button", ...rest }: OpenChatButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      onClick={() => dispatchOpenAiChat(question ? { initialQuestion: question } : undefined)}
    />
  );
}
