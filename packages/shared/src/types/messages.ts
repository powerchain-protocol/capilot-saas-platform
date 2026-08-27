export type MessageRole = "user" | "assistant" | "system";
export type MessageStatus = "sending" | "sent" | "failed";

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt?: string;
  status?: MessageStatus;
};

export type MessageAction = {
  label: string;
  href: string;
};
