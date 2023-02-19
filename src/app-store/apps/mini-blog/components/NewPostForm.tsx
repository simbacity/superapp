import type { PostRequest } from "../api-contracts/post.schema";
import { postRequestSchema, postSchema } from "../api-contracts/post.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export default function PostForm() {
  const form = useForm<PostRequest>({
    resolver: zodResolver(postRequestSchema),
  });
  const formErrors = form.formState.errors;
  const router = useRouter();
  const createPost = useCreatePost();

  function onSubmitHandler(data: PostRequest) {
    createPost.mutate(data, {
      onSuccess: (response) => {
        alert("Post created successfully.");
        router.push(`/apps/mini-blog/posts/${response.id}`);
      },
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmitHandler)}>
      <div>
        <label htmlFor="label_title" className="label">
          Title (*)
        </label>
        <input
          {...form.register("title")}
          id="label_title"
          name="title"
          type="text"
          className="input"
        />
        {formErrors.title?.message && (
          <p className="error-text">{formErrors.title.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="label_content" className="label">
          Content (*)
        </label>
        <textarea
          {...form.register("content")}
          rows={16}
          className="textarea"
          placeholder="What's on your mind..."
          name="content"
        ></textarea>
        {formErrors.content?.message && (
          <p className="error-text">{formErrors.content.message}</p>
        )}
      </div>
      <div>
        <button
          onClick={() => router.back()}
          className="invisible-button--medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createPost.isLoading}
          className="default-button--medium"
        >
          Save post
        </button>
      </div>
    </form>
  );
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  const createPost = async (data: PostRequest) => {
    const response = await axios.post("/api/apps/mini-blog/posts/create", data);
    return postSchema.parse(response.data);
  };

  return useMutation(createPost, {
    onSuccess: () => {
      return queryClient.invalidateQueries(["mini-blog", "posts", "list"]);
    },
  });
}
