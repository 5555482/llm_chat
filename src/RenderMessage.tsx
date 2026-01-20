import Markdown from "react-markdown";
import type { Message } from "./global";

export default function RenderMessage({ message }: { message: Message }) {
  if (message.type === "USER") {
    return (
      <li className="chat-message-user">
        <p>{message.content}</p>
      </li>
    );
  } else {
    return (
      <li className="chat-message-llm">
        <Markdown>{message.content}</Markdown>
      </li>
    );
  }
}