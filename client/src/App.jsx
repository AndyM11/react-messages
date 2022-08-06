import { useEffect, useState } from "react";
import io from "socket.io-client";
import favicon from "../public/chat.png";
import { Helmet } from "react-helmet";

//const socket = io("http://localhost:4000");
const socket = io("/");

export default function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    const newMessage = {
      body: message,
      from: "Me",
    };
    setMessages([newMessage, ...messages]);
    setMessage("");
  };

  useEffect(() => {
    const receiveMessage = (message) => {
      setMessages((messages) => [message, ...messages]);
    };

    socket.on("message", receiveMessage);

    return () => {
      socket.off("message", receiveMessage);
    };
  }, [messages]);

  return (
    <>
      <Helmet>
        <title>Chat App</title>
        <link rel="shortcut icon" href={favicon} typo="image/x-icon" />
      </Helmet>

      <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
          <h1 className="text-2xl font-bold my-2">Chat React</h1>
          <input
            name="message"
            type="text"
            placeholder="Write your message..."
            onChange={(e) => setMessage(e.target.value)}
            className="border-2 border-zinc-500 p-2 w-full text-black"
            value={message}
            autoFocus
          />

          <ul className="h-80 overflow-y-auto">
            {messages.map((message, index) => (
              <li
                key={index}
                className={`my-2 p-2 table text-sm rounded-md ${message.from === "Me" ? "bg-sky-700 ml-auto" : "bg-black"
                  }`}
              >
                <b>{message.from}</b>:{message.body}
              </li>
            ))}
          </ul>
        </form>
      </div>
    </>

  );
}
