import type { MessageRequest } from "../api-contracts/message.schema";
import {
  messageRequestSchema,
  messageDefaultSchema,
} from "../api-contracts/message.schema";
import {
  PaperAirplaneIcon,
  PlusIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function MessageForm({ threadId }: { threadId?: string }) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const router = useRouter();
  const form = useForm<MessageRequest>({
    resolver: zodResolver(messageRequestSchema),
  });
  const { data: currentSession } = useSession();
  const createMessage = useCreateMessage();

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const newPreviewURL = URL.createObjectURL(e.target.files[0] as Blob);
      if (newPreviewURL !== imagePreviewUrl) {
        setImagePreviewUrl(newPreviewURL);
      }
      form.setValue("imageAttachment", e.target.files[0]);
    }
  }

  function onClearImageAttachment() {
    URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl("");
    form.resetField("imageAttachment");
  }

  function onSubmitHandler(data: MessageRequest) {
    createMessage.mutate(
      { ...data, threadId },
      {
        onSuccess: (response) => {
          form.reset();
          onClearImageAttachment();
          if (response.threadId) {
            return router.push(
              `/apps/town-square/threads/${response.threadId}`
            );
          } else {
            window.scrollTo(0, 0);
          }
        },
      }
    );
  }

  if (!currentSession) return <div className="h1">Loading...</div>;

  const onTextareaKeydown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    const textareaElement = event.target as HTMLTextAreaElement;
    setTextareaHeight(textareaElement, 180);
  };

  const onTextareaBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const textareaElement = event.target as HTMLTextAreaElement;

    form.setValue("content", form.getValues("content").trim());
    const formContent = form.getValues("content");

    if (formContent.length === 0) {
      textareaElement.style.height = `${0}px`;
    } else {
      setTextareaHeight(textareaElement, 180);
    }
  };

  const setTextareaHeight = (
    textareaElement: HTMLTextAreaElement,
    height: number
  ) => {
    textareaElement.style.height = "inherit";

    const scrollheight = textareaElement.scrollHeight;
    const newHeight = scrollheight < height ? scrollheight : height;
    textareaElement.style.height = `${newHeight}px`;
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmitHandler)}>
      <div className="fixed bottom-11 left-0 w-full bg-gray-900 py-2">
        {imagePreviewUrl && (
          <div className="h m-auto max-w-6xl px-1 lg:px-8">
            <div className="relative my-2 h-16 w-16 pl-12">
              <XCircleIcon
                className="absolute -right-4 -top-4 z-20 w-8 cursor-pointer text-red-600"
                onClick={onClearImageAttachment}
              />
              <Image
                alt=""
                src={imagePreviewUrl}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
        )}

        <div className="relative m-auto flex max-w-6xl items-center px-1 lg:px-8">
          <div className="mr-1">
            <label htmlFor="file" className="cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center bg-gray-600">
                <PlusIcon className="h-5 w-5 text-white" />
              </div>
            </label>
            <input
              id="file"
              {...form.register("imageAttachment")}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageChange}
            />
          </div>
          <textarea
            {...form.register("content")}
            className="w-full border-2 border-gray-300 px-2 py-2 pr-14"
            placeholder="What's on your mind?"
            style={{ height: "0px", minHeight: "45px", resize: "none" }}
            onKeyDown={onTextareaKeydown}
            onBlur={onTextareaBlur}
            name="content"
          ></textarea>
          <div className="ml-2">
            <button
              type="submit"
              disabled={createMessage.isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 hover:bg-green-700"
            >
              <PaperAirplaneIcon className="h-5 w-5 rotate-90 text-white" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export function useCreateMessage() {
  const queryClient = useQueryClient();

  const createMessage = async (data: MessageRequest) => {
    const formData = new FormData();
    formData.append("content", data.content);

    if (data.threadId) {
      formData.append("threadId", data.threadId);
    }

    if (data.imageAttachment) {
      formData.append("imageFile", data.imageAttachment as File);
    }

    const response = await axios.post(
      "/api/apps/town-square/messages/create",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return messageDefaultSchema.parse(response.data);
  };

  return useMutation(createMessage, {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["town-square", "messages", "list"]);
      queryClient.invalidateQueries([
        "town-square",
        "threads",
        "show",
        response.threadId,
      ]);
    },
  });
}
