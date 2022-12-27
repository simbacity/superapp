import {
  messageDefaultSchema,
  MessageResponse,
} from "@app-store/apps/town-square/api-contracts/message.schema";
import { threadDefaultSchema, ThreadRequest } from "@app-store/apps/town-square/api-contracts/thread.schema";
import Avatar from "@app-store/apps/town-square/components/Avatar";
import sanitizeContent from "@app-store/apps/town-square/utils/sanitize";
import { useSocket } from "@app-store/shared/hooks/useSocket";
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
      className="flex relative px-2 py-4 gap-2 text-sm text-white break-words group border-b border-slate-700">
      <div>
        <Avatar src={message.user.image || ""} className="w-9 h-9 mt-1" />
      </div>
      <div className="w-full overflow-hidden">
        <div className="flex items-center">
          <p className="font-bold">{message.user.name}</p>
          <p className="text-xs text-gray-400 ml-2">{formatDate(message.createdAt || "")}</p>
        </div>
        <div>
          {message.imageAttachment && (
            <div className="w-1/2 min-h-max mt-1">
              <img src={`/images/${message.imageAttachment}`} alt="Image attachment" />
            </div>
          )}
          <div dangerouslySetInnerHTML={{ __html: sanitizedHtmlContent }} />
        </div>
        <div className="pt-1 flex justify-between">
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
