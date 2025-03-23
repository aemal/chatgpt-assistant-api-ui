"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

interface Message {
  id: number;
  text: string;
  sent: boolean;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I help you today?", sent: false },
    {
      id: 2,
      text: "Hi! I'm interested in learning more about your services.",
      sent: true,
    },
    {
      id: 3,
      text: "Of course! We offer a wide range of solutions. What specific area are you interested in?",
      sent: false,
    },
    {
      id: 4,
      text: "I'd like to know more about your pricing plans.",
      sent: true,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: messages.length + 1,
      text: newMessage,
      sent: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="w-full max-w-[800px] h-[85vh] flex flex-col overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800">
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[70%] p-4 ${
              message.sent
                ? "ml-auto bg-blue-600 text-white rounded-2xl rounded-br-sm"
                : "bg-zinc-800 text-zinc-100 rounded-2xl rounded-bl-sm"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <form
        className="p-4 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur flex gap-3"
        onSubmit={handleSendMessage}
      >
        <Input
          className="flex-1 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
          placeholder="Type your message..."
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button
          className="bg-blue-600 hover:bg-blue-500 text-white px-6"
          type="submit"
        >
          Send
        </Button>
      </form>
    </div>
  );
}
