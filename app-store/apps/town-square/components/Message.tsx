import {
  messageDefaultSchema,
  MessageResponse,
} from "@app-store/apps/town-square/api-contracts/message.schema";
import { threadDefaultSchema, ThreadRequest } from "@app-store/apps/town-square/api-contracts/thread.schema";
import Avatar from "@app-store/apps/town-square/components/Avatar";
import { useSocket } from "@app-store/shared/hooks/useSocket";
import { DotsHorizontalIcon } from "@heroicons/react/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

import { formatDate } from "../utils/days";

export default function MessagePage({ message }: { message: MessageResponse }) {
  const router = useRouter();
  const [isDeleteButtonVisible, setIsDeleteButtonVisible] = useState<boolean>(false);
  const { data: session } = useSession();
  const isCurrentUser = message.userId === session?.user.id;
  const createThread = useCreateThread();
  const deleteMessage = useDeleteMessage();
  const deleteThread = useDeleteThread();

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

  const onDeleteHandler = (event: React.MouseEvent<Element, MouseEvent>) => {
    event.stopPropagation();

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

  const setDeleteButtonVisibility = (event: React.MouseEvent<Element, MouseEvent>, isVisible: boolean) => {
    event.stopPropagation();
    setIsDeleteButtonVisible(isVisible);
  };

  return (
    <div
      key={message.id}
      onClick={onNavigateToThreadsHandler}
      onMouseLeave={() => setIsDeleteButtonVisible(false)}
      className="flex relative px-2 py-4 gap-2 text-sm text-white break-words group hover:bg-slate-700 cursor-pointer">
      <div>
        <Avatar src={message.user.image || ""} className="w-9 h-9 mt-1" />
      </div>
      <div className="w-full overflow-hidden">
        <div className="flex items-center">
          <p className="font-bold">{message.user.name}</p>
          <p className="text-xs text-gray-400 ml-2">{formatDate(message.createdAt || "")}</p>
        </div>
        <div>
          <p>{message.content}</p>
        </div>
        {!!message.replyCount && message.replyCount !== 0 && (
          <div className="pt-1">
            <a className="link">
              {message.replyCount} {message.replyCount > 1 ? "Replies" : "Reply"}
            </a>
          </div>
        )}
      </div>

      {isCurrentUser && (
        <div className="group-hover:block hidden absolute right-2 top-2">
          <a
            className="bg-slate-400 px-3 py-1 flex items-center"
            onClick={(event) => setDeleteButtonVisibility(event, true)}>
            <DotsHorizontalIcon className="w-6 h-6 text-white" />
          </a>
          {isDeleteButtonVisible && (
            <div className="-translate-x-full" onMouseLeave={() => setIsDeleteButtonVisible(false)}>
              <a
                className="absolute px-6 py-2 cursor-pointer font-mono bg-white hover:bg-slate-200 text-slate-900"
                onClick={onDeleteHandler}>
                Delete
              </a>
            </div>
          )}
        </div>
      )}
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
