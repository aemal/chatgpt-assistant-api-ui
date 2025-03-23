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
    <div className="w-full max-w-[800px] h-[85vh] flex flex-col overflow-hidden rounded-xl bg-background border border-default-200">
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[70%] p-4 ${
              message.sent
                ? "ml-auto bg-[#0066FF] text-white rounded-2xl rounded-br-sm"
                : "bg-default-100 text-foreground rounded-2xl rounded-bl-sm"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <form
        className="px-6 py-4 border-t border-default-200 bg-background/90 backdrop-blur"
        onSubmit={handleSendMessage}
      >
        <div className="flex gap-3">
          <Input
            className="flex-1 bg-default-100 border-default-200 text-foreground placeholder:text-default-400 rounded-none focus:ring-primary"
            placeholder="Type your message..."
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-6 rounded-lg"
            type="submit"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
