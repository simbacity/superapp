import {
  messageRequestSchema,
  MessageRequest,
  messageDefaultSchema,
} from "@app-store/apps/town-square/api-contracts/message.schema";
import { useSocket } from "@app-store/shared/hooks/useSocket";
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
    textareaElement.style.height = `${textareaElement.scrollHeight}px`;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmitHandler)}>
      <div className="fixed bottom-11 left-0 w-full">
        <div className="flex layout px-0 lg:px-8 relative">
          <textarea
            {...form.register("content")}
            className="textarea"
            placeholder="What's on your mind?"
            rows={2}
            onKeyDown={handleKeyDown}
            name="content"></textarea>
          <div className="absolute bottom-0 right-0 lg:right-8">
            <button
              type="submit"
              disabled={createMessage.isLoading}
              className="default-button--small mb-0 mr-0">
              Share
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
