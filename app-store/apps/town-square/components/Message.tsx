import {
  messageDefaultSchema,
  MessageResponse,
} from "@app-store/apps/town-square/api-contracts/message.schema";
import { threadDefaultSchema, ThreadRequest } from "@app-store/apps/town-square/api-contracts/thread.schema";
import Avatar from "@app-store/apps/town-square/components/Avatar";
import sanitizeContent from "@app-store/apps/town-square/utils/sanitize";
import { useSocket } from "@app-store/shared/hooks/useSocket";
import { EmojiHappyIcon } from "@heroicons/react/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { formatDate } from "../utils/days";

export default function MessagePage({
  message,
  hideGoToRepliesLink,
}: {
  message: MessageResponse;
  hideGoToRepliesLink?: boolean;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const isCurrentUser = message.userId === session?.user.id;
  const createThread = useCreateThread();
  const deleteMessage = useDeleteMessage();
  const deleteThread = useDeleteThread();

  const sanitizedHtmlContent = sanitizeContent(message.content);

  const onNavigateToThreadsHandler = () => {
    if (message.threadId) {
      router.push(`/apps/town-square/threads/${message.threadId}`);
    } else {
      createThread.mutate(
        { messageId: message.id || "" },
        {
          onSuccess: (response) => {
            if (response) {
              router.push(`/apps/town-square/threads/${response.id}`);
            }
          },
        }
      );
    }
  };

  const onDeleteHandler = () => {
    if (!message.isReply && message.threadId) {
      deleteThread.mutate(message.threadId, {
        onSuccess: () => {
          router.push("/apps/town-square");
        },
      });
    } else {
      deleteMessage.mutate(message.id || "", {
        onSuccess: () => {
          router.push("/apps/town-square");
        },
      });
    }
  };

  const getGoToThreadLinkText = (replyCount: number | undefined) => {
    if (!replyCount) return "Reply";
    const replyMessage = replyCount > 1 ? "Replies" : "Reply";
    return `${replyCount} ${replyMessage}`;
  };

  return (
    <div
      key={message.id}
      className="relative flex gap-2 px-2 py-4 text-sm text-white break-words border-b group border-slate-700">
      <div>
        <Avatar src={message.user.image || ""} className="mt-1 w-9 h-9" />
      </div>
      <div className="w-full overflow-hidden">
        <div className="flex items-center">
          <p className="font-bold">{message.user.name}</p>
          <p className="ml-2 text-xs text-gray-400">{formatDate(message.createdAt || "")}</p>
        </div>
        <div>
          <div dangerouslySetInnerHTML={{ __html: sanitizedHtmlContent }} />
        </div>
        <div className="mt-2 ml-0.5">
          <button className="px-1.5 py-1 rounded-xl bg-slate-600 hover:brightness-125 focus:ring focus:ring-white">
            <EmojiHappyIcon className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="flex justify-between pt-1">
          <div>
            {!hideGoToRepliesLink && (
              <button className="link" onClick={onNavigateToThreadsHandler}>
                {getGoToThreadLinkText(message.replyCount)}
              </button>
            )}
          </div>
          <div>
            {isCurrentUser && (
              <button className="link" onClick={onDeleteHandler}>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function useCreateThread() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  const createThread = async (data: ThreadRequest) => {
    const response = await axios.post("/api/apps/town-square/threads/create", data);
    return threadDefaultSchema.parse(response.data);
  };

  return useMutation(createThread, {
    onSuccess: (response) => {
      socket.emit("send_message", response);
      queryClient.invalidateQueries(["town-square", "messages", "list"]);
    },
  });
}

export function useDeleteMessage() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  const deleteMessage = async (id: string) => {
    const response = await axios.delete(`/api/apps/town-square/messages/${id}/delete`);
    return messageDefaultSchema.parse(response.data);
  };

  return useMutation((id: string) => deleteMessage(id), {
    onSuccess: (response) => {
      socket.emit("send_message", response);
      queryClient.invalidateQueries(["town-square", "messages", "list"]);
    },
  });
}

export function useDeleteThread() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  const deleteThread = async (id: string) => {
    const response = await axios.delete(`/api/apps/town-square/threads/${id}/delete`);
    return threadDefaultSchema.parse(response.data);
  };

  return useMutation((id: string) => deleteThread(id), {
    onSuccess: (response) => {
      socket.emit("send_message", response);
      queryClient.invalidateQueries(["town-square", "messages", "list"]);
    },
  });
}
