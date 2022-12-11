import {
  messageRequestSchema,
  MessageRequest,
  messageDefaultSchema,
} from "@app-store/apps/town-square/api-contracts/message.schema";
import EmojiPicker from "@app-store/apps/town-square/components/EmojiPicker";
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
          } else {
            window.scrollTo(0, 0);
          }
        },
      }
    );
  }

  if (!currentSession) return <div className="h1">Loading...</div>;

  const onTextareaKeydown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textareaElement = event.target as HTMLTextAreaElement;
    setTextareaHeight(textareaElement, 180);
  };

  const onTextareaBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const textareaElement = event.target as HTMLTextAreaElement;

    form.setValue("content", form.getValues("content").trim());
    const formContent = form.getValues("content");

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
    <div className="fixed left-0 w-full py-2 text-2xl bottom-11 bg-slate-900">
      <form onSubmit={form.handleSubmit(onSubmitHandler)}>
        <div className="relative flex items-center max-w-6xl px-1 m-auto lg:px-8">
          <textarea
            {...form.register("content")}
            className="w-full px-2 py-2 border-2 border-slate-300 pr-14"
            placeholder="What's on your mind?"
            style={{ height: "0px", minHeight: "45px", resize: "none" }}
            onKeyDown={onTextareaKeydown}
            onBlur={onTextareaBlur}
            name="content"></textarea>
          <div className="ml-2">
            <button
              type="submit"
              disabled={createMessage.isLoading}
              className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-full hover:bg-green-700">
              <PaperAirplaneIcon className="w-5 h-5 text-white rotate-90" />
            </button>
          </div>
        </div>
      </form>
      {/* <EmojiPicker /> */}
    </div>
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
