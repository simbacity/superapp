import {
  AIChatRequest,
  aiChatSchema,
  aiModelsListSchema,
} from "@app-store/apps/ai-chat/api-contracts/ai-chat.schema";
import NewChatForm from "@app-store/apps/ai-chat/components/NewChatForm";
import Shell from "@app-store/shared/components/Shell";
import { useMutation, useQuery } from "@tanstack/react-query";
import ChatMessage from "app-store/apps/ai-chat/components/ChatMessage";
import axios from "axios";
import { Label, Select } from "flowbite-react";
import React, { useState } from "react";

export interface Chat {
  id: string;
  user: string;
  message: string;
}

export default function Index() {
  const [chatLogs, setChatLogs] = useState<Chat[]>([]);
  const [model, setModel] = useState("davinci");
  const { data: models } = useGetAllModels();
  const createChat = useCreateChat();

  if (!models) return <div className="h1">Loading...</div>;

  function onSubmitHandler(data: AIChatRequest) {
    const chatLogsNew = [...chatLogs, { id: data.message, user: "me", message: data.message }];
    setChatLogs(chatLogsNew);
    createChat.mutate(
      { ...data, model },
      {
        onSuccess: (response) => {
          if (response) {
            setChatLogs([...chatLogsNew, { id: response.id, user: "ai", message: response.message || "" }]);
          }
        },
      }
    );
  }

  function clearChatLogs() {
    setChatLogs([]);
  }

  function modelHanlder(event: React.ChangeEvent<HTMLSelectElement>) {
    setModel(event.target.value);
  }

  return (
    <Shell>
      <div className="flex absolute top-0 left-0 right-0 bottom-0">
        <aside className="w-1/5 bg-gray-800 p-5">
          <div
            className="flex items-center p-3 rounded-md border border-white text-left hover:bg-gray-700 transition-all"
            onClick={clearChatLogs}>
            <p className="text-white">New Chat</p>
          </div>
          <div className="mt-5">
            <Label htmlFor="models" value="Choose Model" />
            <Select id="models" className="bg-transparent" value={model} onChange={modelHanlder}>
              {models.map((model) => (
                <option key={model.id}>{model.id}</option>
              ))}
            </Select>
          </div>
        </aside>
        <section className="flex-1 relative overflow-y-auto pb-28">
          {chatLogs.map((chat) => (
            <ChatMessage key={chat.id} isFromAIChat={chat.user === "ai"} message={chat} />
          ))}
          <NewChatForm submitHandler={onSubmitHandler} />
        </section>
      </div>
    </Shell>
  );
}

export function useCreateChat() {
  const createChat = async (data: AIChatRequest) => {
    const response = await axios.post("/api/apps/ai-chat/chat/create", data);
    return aiChatSchema.parse(response.data);
  };

  return useMutation(createChat);
}

export function useGetAllModels() {
  const getAllModels = async () => {
    const response = await axios.get("/api/apps/ai-chat/models/list");
    return aiModelsListSchema.parse(response.data);
  };

  return useQuery(["ai-chat", "models", "list"], () => getAllModels());
}
