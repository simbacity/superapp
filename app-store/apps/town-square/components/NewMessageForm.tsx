import {
  messageRequestSchema,
  MessageRequest,
} from "@app-store/apps/town-square/api-contracts/message.schema";
import { PhotographIcon } from "@heroicons/react/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

interface MessageFormParams {
  formValues?: Omit<MessageRequest, "content">;
}
export default function MessageForm({ formValues }: MessageFormParams) {
  const router = useRouter();
  const form = useForm<MessageRequest>({
    resolver: zodResolver(messageRequestSchema),
    defaultValues: { content: "" },
  });
  const { data: userData } = useSession();
  const createMessage = useCreateMessage();

  function onSubmitHandler(data: MessageRequest) {
    createMessage.mutate(
      { ...data, threadId: formValues?.threadId, messageId: formValues?.messageId },
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
      <div className="flex sm:w-full md:w-3/4">
        {userData?.user.image ? (
          <img src={userData?.user.image} className="w-8 h-8 rounded-[16px] border border-white m-1" />
        ) : (
          <PhotographIcon className="w-8 h-8 rounded-[16px] border border-white m-1 text-white" />
        )}
        <input
          className="border-2 border-gray-400 py-1 px-1 text-sm w-full"
          placeholder="What's on your mind?"
          {...form.register("content")}
          name="content"
          type="text"
        />
        <button type="submit" disabled={createMessage.isLoading} className="default-button--small m-0 ml-2">
          Share
        </button>
      </div>
    </form>
  );
}

export function useCreateMessage() {
  const queryClient = useQueryClient();

  const createMessage = async (data: MessageRequest) => {
    const response = await axios.post("/api/apps/town-square/messages/create", data);
    return response.data;
  };

  return useMutation(createMessage, {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["town-square", "messages", "list"]);
      queryClient.invalidateQueries(["town-square", "threads", "show", response.threadId]);
    },
  });
}
