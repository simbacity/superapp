import {
  PostCreateRequest,
  postCreateSchema,
  PostResponse,
} from "@app-store/apps/mini-blog/api-contracts/post.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

interface PostFormParams {
  defaultValues: PostResponse;
}

export default function PostForm({ defaultValues }: PostFormParams) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PostCreateRequest>({
    defaultValues,
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
        <Link href={`/apps/mini-blog/posts/${defaultValues.id}`}>
          <button className="invisible-button--medium">Cancel</button>
        </Link>
        <button type="submit" className="default-button--medium">
          Save post
        </button>
      </div>
    </form>
  );
}
