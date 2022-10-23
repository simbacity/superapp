import { Message, messageSchema } from "@app-store/apps/town-square/api-contracts/message.schema";
import { threadDeleteSchema } from "@app-store/apps/town-square/api-contracts/thread.schema";
import { useMessageThread } from "@app-store/apps/town-square/pages/threads/[id]";
import { useSocket } from "@app-store/shared/hooks/useSocket";
import { DotsHorizontalIcon } from "@heroicons/react/outline";
import { PhotographIcon } from "@heroicons/react/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { processDate } from "../utils/days";

export type User = {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

interface MessageParams {
  values: Message & User;
}

export default function MessagePage({ values }: MessageParams) {
  const router = useRouter();
  const [deleteButton, showDeleteButton] = useState<boolean>(false);
  const { data: session } = useSession();
  const isUser = values.user.id === session?.user.id;
  const deleteMessage = useDeleteMessage();
  const deleteThread = useDeleteThread();

  // get thread ID for navigation
  const { data: thread } = useMessageThread(values.id, true); // findByMainMessageId -> true

  const onDeleteHandler = () => {
    if (thread) {
      deleteThread.mutate(thread.id, {
        onSuccess: () => {
          router.push("/apps/town-square");
        },
      });
    } else {
      deleteMessage.mutate(values.id, {
        onSuccess: () => {
          router.push("/apps/town-square");
        },
      });
    }
  };

  return (
    <div
      key={values.id}
      className="group flex sm:w-full md:w-3/4 my-2 p-2 hover:bg-gray-700"
      onMouseLeave={() => showDeleteButton(false)}>
      {values.user.image ? (
        <img src={values.user.image} className="w-8 h-8 rounded-[16px] border border-white m-1" />
      ) : (
        <PhotographIcon className="w-8 h-8 rounded-[16px] border border-white m-1 text-white" />
      )}
      <div className="w-full">
        <div className="flex mt-1 justify-between">
          <Link
            href={
              thread ? `/apps/town-square/threads/${thread.id}` : `/apps/town-square/threads/new/${values.id}`
            }>
            <a className="w-11/12">
              <div className="flex items-end">
                <p className="text-white text-xs font-bold">{values.user.name}</p>
                <p className="text-[10px] text-gray-400 ml-2">{processDate(values.createdAt)}</p>
              </div>
              <p className="text-white text-sm mt-1">{values.content}</p>
              {thread && (
                <p className="text-[10px] text-blue-300">
                  {thread.messages.length} {thread.messages.length > 1 ? "Replies" : "Reply"}
                </p>
              )}
            </a>
          </Link>
          <div className="relative">
            <DotsHorizontalIcon
              className="w-4 h-4 text-white hidden group-hover:block hover:bg-gray-200 hover:text-black group"
              onClick={() => showDeleteButton(true)}
            />
            {deleteButton && isUser && (
              <div
                className="bg-white text-[12px] absolute top-4 right-0 px-3 cursor-pointer"
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

export function useDeleteMessage() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  const deleteMessage = async (id: string) => {
    const response = await axios.delete(`/api/apps/town-square/messages/${id}/delete`);
    return messageSchema.parse({ ...response.data, createdAt: new Date(response.data.createdAt) });
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
    return threadDeleteSchema.parse([
      { ...response.data[0], createdAt: new Date(response.data[0].createdAt) },
      { ...response.data[1], createdAt: new Date(response.data[1].createdAt) },
    ]);
  };

  return useMutation((id: string) => deleteThread(id), {
    onSuccess: (response) => {
      socket.emit("send_message", response);
      queryClient.invalidateQueries(["town-square", "messages", "list"]);
    },
  });
}
