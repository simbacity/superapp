import { PostCreateRequest, postCreateSchema } from "@app-store/apps/mini-blog/api-contracts/post.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export default function PostForm() {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PostCreateRequest>({
    resolver: zodResolver(postCreateSchema),
  });

  function onSubmit(data: PostCreateRequest) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="label_title" className="label">
          Title (*)
        </label>
        <input {...register("title")} id="label_title" name="title" type="text" className="input" />
        {errors.title?.message && <p className="error-text">{errors.title.message}</p>}
      </div>
      <div>
        <label htmlFor="label_content" className="label">
          Content (*)
        </label>
        <textarea
          {...register("content")}
          rows={16}
          className="textarea"
          placeholder="What's on your mind..."
          name="content"></textarea>
        {errors.content?.message && <p className="error-text">{errors.content.message}</p>}
      </div>
      <div>
        <button onClick={() => router.back()} className="invisible-button--medium">
          Cancel
        </button>
        <button type="submit" className="default-button--medium">
          Save post
        </button>
      </div>
    </form>
  );
}
