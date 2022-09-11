import {
  PostRequest,
  postRequestSchema,
  PostResponse,
  postSchema,
} from "@app-store/apps/mini-blog/api-contracts/post.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

interface PostFormParams {
  formValues: PostResponse;
}

interface UpdatePostHook {
  id: string;
  data: PostRequest;
}

export default function PostForm({ formValues }: PostFormParams) {
  const form = useForm<PostRequest>({
    defaultValues: formValues,
    resolver: zodResolver(postRequestSchema),
  });
  const formErrors = form.formState.errors;
  const router = useRouter();
  const updatePost = useUpdatePost();

  function onSubmitHandler(data: PostRequest) {
    updatePost.mutate(
      { id: formValues.id, data },
      {
        onSuccess() {
          alert("Post updated successfully.");
          router.push("/apps/mini-blog");
        },
      }
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmitHandler)}>
      <div>
        <label htmlFor="label_title" className="label">
          Title (*)
        </label>
        <input {...form.register("title")} id="label_title" name="title" type="text" className="input" />
        {formErrors.title?.message && <p className="error-text">{formErrors.title.message}</p>}
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
          name="content"></textarea>
        {formErrors.content?.message && <p className="error-text">{formErrors.content.message}</p>}
      </div>
      <div>
        <button onClick={() => router.back()} className="invisible-button--medium">
          Cancel
        </button>
        <button type="submit" disabled={updatePost.isLoading} className="default-button--medium">
          Save post
        </button>
      </div>
    </form>
  );
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  const updatePost = async ({ id, data }: UpdatePostHook) => {
    const response = await axios.patch(`/api/apps/mini-blog/posts/${id}/update`, data);
    return postSchema.parse(response.data);
  };

  return useMutation(updatePost, {
    onSuccess({ id }) {
      queryClient.invalidateQueries(["mini-blog", "posts", "show", id]);
      queryClient.invalidateQueries(["mini-blog", "posts", "list"]);
    },
  });
}
