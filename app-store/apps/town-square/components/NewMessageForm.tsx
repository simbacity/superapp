import {
  messageRequestSchema,
  MessageRequest,
  messageSchema,
} from "@app-store/apps/town-square/api-contracts/message.schema";
import { useSocket } from "@app-store/shared/hooks/useSocket";
import { PhotographIcon } from "@heroicons/react/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import axios from "axios";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import rehypeSanitize from "rehype-sanitize";

interface MessageFormParams {
  threadId?: string;
}

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function MessageForm({ threadId }: MessageFormParams) {
  const router = useRouter();
  const form = useForm<MessageRequest>({
    resolver: zodResolver(messageRequestSchema),
    defaultValues: { content: "" },
  });
  const { data: userData } = useSession();
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

  return (
    <form onSubmit={form.handleSubmit(onSubmitHandler, (e) => console.log(e))}>
      <div className="flex sm:w-full md:w-3/4 bg-slate-800 fixed bottom-0">
        {userData?.user.image ? (
          <img
            src={userData?.user.image}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full border border-white m-1"
          />
        ) : (
          <PhotographIcon className="w-8 h-8 rounded-full border border-white m-1 text-white" />
        )}
        <div className="xs:w-full sm:w-3/4">
          <Controller
            control={form.control}
            name="content"
            render={({ field }) => (
              <MDEditor
                {...field}
                height={140}
                style={{ border: "2px solid #a1a1aa", borderRadius: 0 }}
                preview="edit"
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize]],
                }}
                textareaProps={{
                  placeholder: "What is on your mind?",
                }}
              />
            )}
          />
          <button
            type="submit"
            disabled={createMessage.isLoading}
            className="default-button--small w-full mt-2">
            Share
          </button>
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
    return messageSchema.parse(response.data);
  };

  return useMutation(createMessage, {
    onSuccess: (response) => {
      socket.emit("send_message", response);
      queryClient.invalidateQueries(["town-square", "messages", "list"]);
      queryClient.invalidateQueries(["town-square", "threads", "show", response.threadId]);
    },
  });
}
