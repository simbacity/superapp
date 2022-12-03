import {
  messageRequestSchema,
  MessageRequest,
  messageSchema,
} from "@app-store/apps/town-square/api-contracts/message.schema";
import { useSocket } from "@app-store/shared/hooks/useSocket";
import { PaperAirplaneIcon } from "@heroicons/react/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "@uiw/react-markdown-preview/markdown.css";
import { commands } from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import axios from "axios";
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
    <form onSubmit={form.handleSubmit(onSubmitHandler)}>
      <div className="flex w-full md:w-3/4 bg-slate-800 fixed bottom-12 pr-6 md:pr-0">
        <div className="xs:w-full sm:w-3/4 bg-black w-full">
          <style jsx global>{`
            .w-md-editor-toolbar li > button {
              width: 35px;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .w-md-editor-toolbar li > button > svg {
              height: 14px;
              width: 12px;
              color: grey;
            }

            @media screen and (min-width: 400px) {
              .w-md-editor-toolbar li > button {
                width: 45px;
              }
              .w-md-editor-toolbar li > button > svg {
                height: 15px;
                width: 15px;
              }
            }

            @media screen and (min-width: 992px) {
              .w-md-editor-toolbar li > button {
                width: 65px;
              }
              .w-md-editor-toolbar li > button > svg {
                height: 17px;
                width: 17px;
              }
            }
          `}</style>
          <Controller
            control={form.control}
            name="content"
            render={({ field }) => (
              <MDEditor
                {...field}
                height={90}
                style={{ border: "2px solid #a1a1aa", borderRadius: 0 }}
                commands={[
                  commands.bold,
                  commands.italic,
                  commands.quote,
                  commands.strikethrough,
                  commands.code,
                  commands.fullscreen,
                ]}
                extraCommands={[
                  {
                    name: "Share",
                    keyCommand: "Share",
                    render: () => {
                      return (
                        <button type="submit" disabled={createMessage.isLoading} className="w-full">
                          <div className="bg-green-700 py-1 px-2 rounded-md">
                            <PaperAirplaneIcon className="w-4 rotate-90 text-white" />
                          </div>
                        </button>
                      );
                    },
                  },
                ]}
                preview="edit"
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize]],
                }}
                textareaProps={{
                  placeholder: "What is on your mind?",
                }}
                visibleDragbar={false}
                toolbarBottom={true}
              />
            )}
          />
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
