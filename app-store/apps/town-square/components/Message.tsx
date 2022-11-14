import { MessageResponse, messageSchema } from "@app-store/apps/town-square/api-contracts/message.schema";
import { ThreadRequest, threadSchema } from "@app-store/apps/town-square/api-contracts/thread.schema";
import { useSocket } from "@app-store/shared/hooks/useSocket";
import { DotsHorizontalIcon } from "@heroicons/react/outline";
import { PhotographIcon } from "@heroicons/react/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

import { formatDate } from "../utils/days";

interface MessageParams {
  message?: MessageResponse;
}

export default function MessagePage({ message }: MessageParams) {
  const router = useRouter();
  const [deleteButtonVisible, setIsDeleteButtonVisible] = useState<boolean>(false);
  const { data: session } = useSession();
  const isCurrentUser = message?.user?.id === session?.user.id;
  const createThread = useCreateThread();
  const deleteMessage = useDeleteMessage();
  const deleteThread = useDeleteThread();

  const onNavigateToThreadsHandler = () => {
    if (message?.threadId) {
      router.push(`/apps/town-square/threads/${message.threadId}`);
    } else {
      createThread.mutate(
        { messageId: message?.id || "" },
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
    if (!message?.isReply && message?.threadId) {
      deleteThread.mutate(message.threadId, {
        onSuccess: () => {
          router.push("/apps/town-square");
        },
      });
    } else {
      deleteMessage.mutate(message?.id || "", {
        onSuccess: () => {
          router.push("/apps/town-square");
        },
      });
    }
  };

  return (
    <div
      key={message?.id}
      className="group flex sm:w-full md:w-3/4 my-2 p-2 hover:bg-gray-700"
      onMouseLeave={() => setIsDeleteButtonVisible(false)}>
      {message?.user?.image ? (
        <img
          src={message.user.image}
          referrerPolicy="no-referrer"
          className="w-8 h-8 rounded-full border border-white m-1"
        />
      ) : (
        <PhotographIcon className="w-8 h-8 rounded-full border border-white m-1 text-white" />
      )}
      <div className="w-full">
        <div className="flex mt-1 justify-between">
          <button
            className="w-full items-start"
            onClick={onNavigateToThreadsHandler}
            disabled={createThread.isLoading}>
            <div className="w-11/12">
              <div className="flex items-end">
                <p className="text-white text-xs font-bold">{message?.user?.name}</p>
                <p className="text-xs text-gray-400 ml-2">{formatDate(message?.createdAt || "")}</p>
              </div>
              <p className="text-white text-left text-sm mt-1">{message?.content}</p>
              {!!message?.replyCount && message?.replyCount !== 0 && (
                <p className="text-xs text-left text-blue-300 mt-2">
                  {message?.replyCount} {message?.replyCount > 1 ? "Replies" : "Reply"}
                </p>
              )}
            </div>
          </button>
          <div className="relative">
            <DotsHorizontalIcon
              className="w-4 h-4 text-white hidden group-hover:block hover:bg-gray-200 hover:text-black group"
              onClick={() => setIsDeleteButtonVisible(true)}
            />
            {deleteButtonVisible && isCurrentUser && (
              <div
                className="bg-white text-sm absolute top-4 right-0 px-3 cursor-pointer"
                onClick={() => onDeleteHandler()}>
                Delete
              </div>
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
    return threadSchema.parse(response.data);
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
    return messageSchema.parse(response.data);
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
    return threadSchema.parse(response.data);
  };

  return useMutation((id: string) => deleteThread(id), {
    onSuccess: (response) => {
      socket.emit("send_message", response);
      queryClient.invalidateQueries(["town-square", "messages", "list"]);
    },
  });
}
