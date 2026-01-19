import React, { useState } from 'react'
import './App.css'
import { makeQuery } from './api'

const initialQuery = "What are the presidents of the United States?"

function App() {
  const [userMessage, setUserMessage] = useState < string > (initialQuery)
  const [userHistory, setUserHistory] = useState < string[] > ([])
  const [isThinking, setIsThinking] = useState < boolean > (false)
  const [llmHistory, setLlmHistory] = useState < string[] > ([])

  async function onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setUserHistory([...userHistory, userMessage]);
    setIsThinking(true);
    setUserMessage("");

    const stream = await makeQuery(userMessage);

    let answer = "";
    // Add placeholder for streaming update
    setLlmHistory([...llmHistory, answer]);

    for await (const chunk of stream) {
      answer += chunk.choices[0]?.delta?.content || "";

      setLlmHistory((prev) => {
        const newLLMHistory = [...prev];
        newLLMHistory[newLLMHistory.length - 1] = answer;
        return newLLMHistory;
      });
    }

    setIsThinking(false);
  }


  return (
    <>
      <nav>
        <h1>LLM chat</h1>
        <ul>{llmHistory.map(message =>
          <p>
            {message}
          </p>)}

        </ul>
        <form onSubmit={onFormSubmit}>
          <input
            type="text" placeholder="Type your message..."
            value={userMessage} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserMessage(e.target.value)}
            name="userQuery"
          />
          <button type="submit" disabled={isThinking}>
            Send
          </button>
        </form>
      </nav>
    </>
  )
}

export default App
