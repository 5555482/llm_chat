export interface Message {
  type: "LLM" | "USER";
  content?: string;
  id: string;
}