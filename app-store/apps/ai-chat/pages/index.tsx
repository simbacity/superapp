import NewChatForm from "@app-store/apps/ai-chat/components/NewChatForm";
import Shell from "@app-store/shared/components/Shell";
import { PlusIcon } from "@heroicons/react/solid";
import ChatMessage from "app-store/apps/ai-chat/components/ChatMessage";
import { useState } from "react";

export interface Chat {
  id: string;
  user: string;
  message: string;
}

export default function Index() {
  const [chatLogs, setChatLogs] = useState<Chat[]>([]);

  const updateChatLog = (chatLog: Chat) => {
    const chatLogsNew = [...chatLogs, chatLog];
    setChatLogs(chatLogsNew);
  };

  function clearChatLogs() {
    setChatLogs([]);
  }

  return (
    <Shell>
      <div className="flex absolute top-0 left-0 right-0 bottom-0">
        <aside className="w-1/5 bg-gray-800 p-5">
          <div
            className="flex items-center p-3 rounded-md border border-white text-left hover:bg-gray-700 transition-all"
            onClick={clearChatLogs}>
            <PlusIcon color="#ffffff" className="w-5 mr-2" />
            <p className="text-white">New Chat</p>
          </div>
        </aside>
        <section className="flex-1 relative">
          {chatLogs.map((chat) => (
            <ChatMessage key={chat.id} isFromAIChat={chat.user === "ai"} message={chat} />
          ))}
          <NewChatForm updateChat={updateChatLog} />
        </section>
      </div>
    </Shell>
  );
}
