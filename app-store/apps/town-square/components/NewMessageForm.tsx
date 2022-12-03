import {
  messageRequestSchema,
  MessageRequest,
  messageDefaultSchema,
} from "@app-store/apps/town-square/api-contracts/message.schema";
import { useSocket } from "@app-store/shared/hooks/useSocket";
import { PaperAirplaneIcon } from "@heroicons/react/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export default function MessageForm({ threadId }: { threadId?: string }) {
  const router = useRouter();
  const form = useForm<MessageRequest>({
    resolver: zodResolver(messageRequestSchema),
    defaultValues: { content: "" },
  });
  const { data: currentSession } = useSession();
  const createMessage = useCreateMessage();

  function onSubmitHandler(data: MessageRequest) {
    createMessage.mutate(
      { ...data, threadId },
      {
        onSuccess: (response) => {
          form.reset();
          if (response.threadId) {
            router.push(`/apps/town-square/threads/${response.threadId}`);
          }
        },
      }
    );
  }

  if (!currentSession) return <div className="h1">Loading...</div>;

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    const textareaElement = event.target as HTMLTextAreaElement;
    textareaElement.style.height = "inherit";
    textareaElement.style.height = `${textareaElement.scrollHeight + 20}px`;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmitHandler)}>
      <div className="fixed bottom-11 left-0 w-full bg-slate-900 py-2">
        <div className="flex relative max-w-6xl m-auto px-1 lg:px-8 items-center">
          <textarea
            {...form.register("content")}
            className="w-full border-2 border-slate-300 px-2 py-2 pr-14"
            placeholder="What's on your mind?"
            rows={1}
            onKeyDown={handleKeyDown}
            name="content"></textarea>
          <div className="ml-2">
            <button
              type="submit"
              disabled={createMessage.isLoading}
              className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center">
              <PaperAirplaneIcon className="w-5 h-5 rotate-90 text-white" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export function useCreateMessage() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  const createMessage = async (data: MessageRequest) => {
    const response = await axios.post("/api/apps/town-square/messages/create", data);
    return messageDefaultSchema.parse(response.data);
  };

  return useMutation(createMessage, {
    onSuccess: (response) => {
      socket.emit("send_message", response);
      queryClient.invalidateQueries(["town-square", "messages", "list"]);
      queryClient.invalidateQueries(["town-square", "threads", "show", response.threadId]);
    },
  });
}
