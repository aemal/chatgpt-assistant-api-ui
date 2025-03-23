"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { SendHorizontal, Loader2 } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sent: boolean;
}

export default function Chat() {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I help you today?", sent: false },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sent: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: messages.length + 2,
        text: data.response,
        sent: false,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error. Please try again.",
        sent: false,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
        {isLoading && (
          <div className="flex items-center gap-2 text-default-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
      </div>

      <form
        className="px-6 py-4 border-t border-default-200 bg-background/90 backdrop-blur rounded-b-[20px] overflow-hidden"
        onSubmit={handleSendMessage}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              className="bg-default-100 border-default-200 text-foreground placeholder:text-default-400 rounded-[12px]"
              disabled={isLoading}
              placeholder="Type your message..."
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </div>
          <Button
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white w-10 h-10 p-0 flex items-center justify-center rounded-full shrink-0"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <SendHorizontal className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
