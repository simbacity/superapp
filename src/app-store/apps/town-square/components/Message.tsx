/* eslint-disable @next/next/no-img-element */
import type { MessageResponse } from "../api-contracts/message.schema";
import { messageDefaultSchema } from "../api-contracts/message.schema";
import type { ThreadRequest } from "../api-contracts/thread.schema";
import { threadDefaultSchema } from "../api-contracts/thread.schema";
import Avatar from "./Avatar";
import markdownStyle from "@app-store/apps/town-square/styles/Markdown.module.css";
import sanitizeContent from "../utils/sanitize";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Modal } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
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
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);

  const sanitizedHtmlContent = sanitizeContent(message.content);

  const onNavigateToThreadsHandler = () => {
    if (message.threadId) {
      return router.push(`/apps/town-square/threads/${message.threadId}`);
    } else {
      createThread.mutate(
        { messageId: message.id || "" },
        {
          onSuccess: (response) => {
            if (response) {
              return router.push(`/apps/town-square/threads/${response.id}`);
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
          return router.push("/apps/town-square");
        },
      });
    } else {
      deleteMessage.mutate(message.id || "", {
        onSuccess: () => {
          return router.push("/apps/town-square");
        },
      });
    }
  };

  const getGoToThreadLinkText = (replyCount: number | undefined) => {
    if (!replyCount) return "Reply";
    const replyMessage = replyCount > 1 ? "Replies" : "Reply";
    return `${replyCount} ${replyMessage}`;
  };

  const toggleImagePreview = () => {
    setImagePreviewVisible(!imagePreviewVisible);
  };

  return (
    <div
      key={message.id}
      className="group relative flex gap-2 break-words border-b border-gray-700 px-2 py-4 text-sm text-white"
    >
      <div>
        <Avatar src={message.user.image || ""} className="mt-1 h-9 w-9" />
      </div>
      <div className="w-full overflow-hidden">
        <div className="flex items-center">
          <p className="font-bold">{message.user.name}</p>
          <p className="ml-2 text-xs text-gray-400">
            {formatDate(message.createdAt || "")}
          </p>
        </div>
        <div>
          {message.imageAttachment && (
            <div
              className="mt-1 max-w-xs cursor-pointer"
              onClick={toggleImagePreview}
            >
              <img
                src={message.imageAttachment}
                width="400"
                height="400"
                alt="Image attachment"
              />
            </div>
          )}
          {message.imageAttachment && (
            <Modal
              onClick={toggleImagePreview}
              show={imagePreviewVisible}
              size="xl"
            >
              <img
                src={message.imageAttachment}
                className="w-full object-contain"
                alt="Image attachment"
                width="400"
                height="400"
                onClick={(e) => e.stopPropagation()}
              />
            </Modal>
          )}
          <div
            className={markdownStyle["markdown-body"]}
            dangerouslySetInnerHTML={{ __html: sanitizedHtmlContent }}
          />
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
  const queryClient = useQueryClient();

  const createThread = async (data: ThreadRequest) => {
    const response = await axios.post(
      "/api/apps/town-square/threads/create",
      data
    );
    return threadDefaultSchema.parse(response.data);
  };

  return useMutation(createThread, {
    onSuccess: () => {
      return queryClient.invalidateQueries(["town-square", "messages", "list"]);
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  const deleteMessage = async (id: string) => {
    const response = await axios.delete(
      `/api/apps/town-square/messages/${id}/delete`
    );
    return messageDefaultSchema.parse(response.data);
  };

  return useMutation((id: string) => deleteMessage(id), {
    onSuccess: () => {
      return queryClient.invalidateQueries(["town-square", "messages", "list"]);
    },
  });
}

export function useDeleteThread() {
  const queryClient = useQueryClient();

  const deleteThread = async (id: string) => {
    const response = await axios.delete(
      `/api/apps/town-square/threads/${id}/delete`
    );
    return threadDefaultSchema.parse(response.data);
  };

  return useMutation((id: string) => deleteThread(id), {
    onSuccess: () => {
      return queryClient.invalidateQueries(["town-square", "messages", "list"]);
    },
  });
}
