import {
  PostRequest,
  postRequestSchema,
  postSchema,
} from "@app-store/apps/subscriptions/api-contracts/post.schema";
import dayjs from "@app-store/apps/subscriptions/utils/days";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function PostForm() {
  const form = useForm<PostRequest>({ resolver: zodResolver(postRequestSchema) });
  const formErrors = form.formState.errors;
  const router = useRouter();
  const createPost = useCreatePost();
  const [schedulePost, setSchedulePost] = useState(false);

  function onSubmitHandler(data: PostRequest) {
    setSchedulePost(false);
    createPost.mutate(
      { ...data, scheduledAt: new Date(data.scheduledAt || Date.now()).toISOString() },
      {
        onSuccess: () => {
          alert("Post creation successfully.");
          router.push(`/apps/subscriptions`);
        },
      }
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmitHandler)}>
      <div>
        <label htmlFor="label_intro" className="text-sm text-gray-200 mb-2">
          Write here the text that you want to be displayed in your SMS. The link to your post will be beneath
          it.
        </label>
        <input
          {...form.register("intro")}
          id="label_intro"
          name="intro"
          type="text"
          className="input"
          placeholder="Intro SMS Message"
        />
        {formErrors.intro?.message && <p className="error-text">{formErrors.intro?.message}</p>}
      </div>
      <div className="mt-8">
        <h1 className="text-xl text-center font-bold text-gray-400">Post content</h1>
        <div>
          <label htmlFor="label_content" className="text-sm text-gray-200">
            Here you provide your post data. Title will be bolded on top and the text will follow. Any
            attachments will be displayed beneath the text.
          </label>
          <>
            <input
              {...form.register("title")}
              id="label_intro"
              name="title"
              type="text"
              className="input mb-5"
              placeholder="Post title"
            />
            {formErrors.title?.message && <p className="error-text">{formErrors.title.message}</p>}
          </>
          <textarea
            {...form.register("content")}
            rows={10}
            className="textarea"
            placeholder="What's on your mind..."
            name="content"></textarea>
          {formErrors.content?.message && <p className="error-text">{formErrors.content.message}</p>}
        </div>
      </div>
      <div>
        <button
          type="button"
          disabled={createPost.isLoading}
          onClick={() => setSchedulePost(true)}
          className="default-button--medium">
          Schedule
        </button>
        <button type="submit" disabled={createPost.isLoading} className="default-button--medium">
          Send Now
        </button>
      </div>
      {schedulePost && (
        <div className="bg-gray-300/25 absolute z-10 h-full w-full left-0 top-0 flex flex-col items-center justify-center">
          <div className=" bg-slate-800 p-7 justify-center w-80 rounded-md">
            <input
              {...form.register("scheduledAt")}
              id="label_scheduledAt"
              type="datetime-local"
              className="input mb-5"
              min={dayjs(Date.now()).format("YYYY-MM-DDTHH:mm")}
            />
            <div>
              <button
                type="button"
                disabled={createPost.isLoading}
                onClick={() => setSchedulePost(false)}
                className="default-button--medium">
                Cancel
              </button>
              <button type="submit" disabled={createPost.isLoading} className="default-button--medium">
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  const createPost = async (data: PostRequest) => {
    const response = await axios.post("/api/apps/subscriptions/posts/create", data);
    return postSchema.parse(response.data);
  };

  return useMutation(createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries(["subscriptions", "posts", "list"]);
    },
  });
}
