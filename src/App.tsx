import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Send } from "lucide-react";
import { CircleEllipsis } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Message } from "./global";
import { makeQuery } from "./api";

import "./App.css";
import RenderMessage from "./RenderMessage";

const initialQuery = "What are the presidents of the United States?";

function App() {
  const [userMessage, setUserMessage] = useState(initialQuery);
  const [userHistory, setUserHistory] = useState < Message[] > ([]);
  const [llmHistory, setLLMHistory] = useState < Message[] > ([]);
  const [isThinking, setIsThinking] = useState < boolean > (false);
  const bottomRef = useRef < null | HTMLDivElement > (null);

  function onMessageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUserMessage(event.target.value);
  }

  async function onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // GET
    // push the new message to user userHistory
    setUserHistory((userHistory) => [
      ...userHistory,
      {
        content: userMessage,
        id: uuidv4(),
        type: "USER",
      },
    ]);

    // set isThinking to true - disable button, clear input field
    setIsThinking(true);
    setUserMessage("");

    // scroll all the way down
    if (bottomRef && bottomRef.current) {
      bottomRef.current.scrollIntoView();
    }

    // call the LLM with our userQuery
    const responseStream = await makeQuery(userMessage);

    // single string answer
    let answer = "";

    setLLMHistory((llmHistory) => [
      ...llmHistory,
      {
        content: "",
        id: uuidv4(),
        type: "LLM",
      },
    ]);

    for await (const chunk of responseStream) {
      if (chunk?.choices[0]?.delta?.content) {
        answer = answer + chunk?.choices[0]?.delta?.content || "";

        setLLMHistory((llmHistory) => {
          // update the last message
          const newLLMHistory: Message[] = [...llmHistory];

          newLLMHistory[newLLMHistory.length - 1] = {
            ...newLLMHistory[newLLMHistory.length - 1],
            content: answer,
          };

          return newLLMHistory;
        });
      }

      if (bottomRef && bottomRef.current) {
        bottomRef.current.scrollIntoView();
      }
    }

    setIsThinking(false);
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-header-wrapper">
        <nav className="chat-container">
          <h1 className="">Dead Simple AI Chat</h1>
        </nav>
      </div>
      <ul className="chat-container chat-conversation-container">
        {mergeChatHistory(userHistory, llmHistory).map((message) => (
          <RenderMessage message={message} key={message.id} />
        ))}
      </ul>
      <div className="chat-form-wrapper">
        <form onSubmit={onFormSubmit} className="chat-container chat-form">
          <Input
            onChange={onMessageChange}
            value={userMessage}
            name="userQuery"
            className="chat-input"
          ></Input>
          <Button type="submit" disabled={isThinking} className="chat-button">
            {isThinking ? (
              <>
                <span>Thinking</span>
                <CircleEllipsis></CircleEllipsis>
              </>
            ) : (
              <>
                <span>Send</span>
                <Send></Send>
              </>
            )}
          </Button>
        </form>
      </div>
      <div id="bottom" ref={bottomRef}></div>
    </div>
  );
}

export default App;

function mergeChatHistory(userHistory: Message[], chatHistory: Message[]) {
  const mergedHistory = [];

  for (let i = 0; i < userHistory.length; i++) {
    mergedHistory.push(userHistory[i]);
    if (chatHistory[i]) {
      mergedHistory.push(chatHistory[i]);
    }
  }
  return mergedHistory;
}