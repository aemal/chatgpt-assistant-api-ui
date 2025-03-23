"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { SendHorizontal } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sent: boolean;
}

export default function Chat() {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
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

  // Scroll to bottom whenever messages change
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full max-w-[800px] h-[85vh] flex flex-col overflow-hidden rounded-[20px] bg-background border border-default-200">
      <div
        ref={messagesContainerRef}
        className="flex-1 p-6 overflow-y-auto space-y-4 scroll-smooth"
      >
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
        className="px-6 py-4 border-t border-default-200 bg-background/90 backdrop-blur rounded-b-[20px] overflow-hidden"
        onSubmit={handleSendMessage}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              className="bg-default-100 border-default-200 text-foreground placeholder:text-default-400 rounded-[12px]"
              placeholder="Type your message..."
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </div>
          <Button
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white w-10 h-10 p-0 flex items-center justify-center rounded-full shrink-0"
            type="submit"
          >
            <SendHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
