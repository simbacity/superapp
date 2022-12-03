import { MessageResponse, messageSchema } from "@app-store/apps/town-square/api-contracts/message.schema";
import { ThreadRequest, threadSchema } from "@app-store/apps/town-square/api-contracts/thread.schema";
import Avatar from "@app-store/apps/town-square/components/Avatar";
import { useSocket } from "@app-store/shared/hooks/useSocket";
import { Menu, Transition } from "@headlessui/react";
import { DotsHorizontalIcon } from "@heroicons/react/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

import { formatDate } from "../utils/days";

export default function MessagePage({ message }: { message: MessageResponse }) {
  const router = useRouter();
  const [deleteButtonVisible, setIsDeleteButtonVisible] = useState<boolean>(false);
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

  //   <div className="flex mt-1 justify-between relative">
  //   <div className="w-full items-start" onClick={onNavigateToThreadsHandler}>
  //     <div className="w-11/12">
  //       <div className="flex items-end">
  //         <p className="text-white text-xs font-bold">{message.user?.name}</p>
  //         <p className="text-xs text-gray-400 ml-2">{formatDate(message.createdAt || "")}</p>
  //       </div>
  //       <p className="text-white text-left text-sm mt-1 break-words">{message.content}</p>
  //       {!!message.replyCount && message.replyCount !== 0 && (
  //         <p className="text-xs text-left text-blue-300 mt-2">
  //           {message.replyCount} {message.replyCount > 1 ? "Replies" : "Reply"}
  //         </p>
  //       )}
  //     </div>
  //   </div>
  // </div>
  return (
    <div key={message.id} className="flex relative px-2 py-4 gap-2 text-sm text-white break-words">
      <div>
        <Avatar src={message?.user?.image || ""} className="w-8 h-8 mt-1" />
      </div>
      <div className="w-full">
        <div className="flex items-center">
          <p className="font-bold">{message.user?.name}</p>
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

      <div className="absolute right-2 top-2">
        <Menu>
          <Menu.Button>
            <div className="px-3 py-1 bg-slate-400 flex items-center">
              <DotsHorizontalIcon className="w-6 h-6 text-white" />
            </div>
          </Menu.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0">
            <Menu.Items className="-translate-x-full">
              <Menu.Item>
                <a
                  className="absolute px-6 py-2 cursor-pointer font-mono bg-white hover:bg-slate-200 text-slate-900"
                  onClick={() => onDeleteHandler()}>
                  Delete
                </a>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
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
