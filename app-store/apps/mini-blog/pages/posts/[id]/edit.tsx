import { postSchema } from "@app-store/apps/mini-blog/api-contracts/post.schema";
import PostForm from "@app-store/apps/mini-blog/components/PostForm";
import Shell from "@app-store/shared/components/Shell";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PostParams {
  id: string;
}

export default function PostEdit({ id }: PostParams) {
  const { data: post } = useQuery(["mini-blog.posts.show"], async () => {
    const response = await axios.get("/api/apps/mini-blog/posts/show", { params: { id } });
    return postSchema.parse(response.data);
  });

  if (!post) return <div>No post...</div>;

  return (
    <Shell>
      <div className="layout py-8">
        <h1 className="h1">Edit post</h1>
        <main>
          <PostForm defaultValues={post} />
        </main>
      </div>
    </Shell>
  );
}
