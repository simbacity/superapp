import {
  AIChatRequest,
  aiChatRequestSchema,
  aiChatSchema,
} from "@app-store/apps/ai-chat/api-contracts/ai-chat.schema";
import { Chat } from "@app-store/apps/ai-chat/pages";
import { PaperAirplaneIcon } from "@heroicons/react/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";

export default function NewChatForm({ updateChat }: { updateChat: (chat: Chat) => void }) {
  const form = useForm<AIChatRequest>({
    resolver: zodResolver(aiChatRequestSchema),
    defaultValues: { message: "" },
  });
  const { data: currentSession } = useSession();
  const createChat = useCreateChat();

  function onSubmitHandler(data: AIChatRequest) {
    updateChat({ id: data.message, user: "me", message: data.message });
    createChat.mutate(data, {
      onSuccess: (response) => {
        form.reset();
        if (response) {
          updateChat({ id: response.id, user: "ai", message: response.message || "" });
        }
      },
    });
  }

  if (!currentSession) return <div className="h1">Loading...</div>;

  const onTextareaKeydown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textareaElement = event.target as HTMLTextAreaElement;
    setTextareaHeight(textareaElement, 180);
  };

  const onTextareaBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const textareaElement = event.target as HTMLTextAreaElement;

    form.setValue("message", form.getValues("message").trim());
    const formContent = form.getValues("message");

    if (formContent.length === 0) {
      textareaElement.style.height = `${0}px`;
    } else {
      setTextareaHeight(textareaElement, 180);
    }
  };

  const setTextareaHeight = (textareaElement: HTMLTextAreaElement, height: number) => {
    textareaElement.style.height = "inherit";

    const scrollheight = textareaElement.scrollHeight;
    const newHeight = scrollheight < height ? scrollheight : height;
    textareaElement.style.height = `${newHeight}px`;
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmitHandler)}>
      <div className="absolute bottom-11 left-0 w-full bg-gray-900 py-2">
        <div className="flex relative max-w-6xl m-auto px-1 lg:px-8 items-center">
          <textarea
            {...form.register("message")}
            className="w-full border-2 border-gray-300 px-2 py-2 pr-14"
            placeholder="What's on your mind?"
            style={{ height: "0px", minHeight: "45px", resize: "none" }}
            onKeyDown={onTextareaKeydown}
            onBlur={onTextareaBlur}
            name="message"></textarea>
          <div className="ml-2">
            <button
              type="submit"
              disabled={false}
              className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center">
              <PaperAirplaneIcon className="w-5 h-5 rotate-90 text-white" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export function useCreateChat() {
  const createChat = async (data: AIChatRequest) => {
    const response = await axios.post("/api/apps/ai-chat/chat/create", data);
    return aiChatSchema.parse(response.data);
  };

  return useMutation(createChat);
}
