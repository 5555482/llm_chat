import React, { useState } from 'react'
import './App.css'

const initialQuery = "What are the presidents of the United States?"

function App() {
  const [userMessage, setUserMessage] = useState < string > (initialQuery)
  const [userHistory, setUserHistory] = useState < string[] > ([])
  const [isThinking, setIsThinking] = useState < boolean > (false)

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUserHistory([...userHistory, userMessage]);
    setIsThinkinga(true);
    setUserMessage('');

  }

  return (
    <>
      <nav>
        <h1>LLM chat</h1>
        <ul>{userHistory.map(message =>
          <p>
            <li>
              {message}
            </li>
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
