import { postSchema } from "@app-store/apps/mini-blog/api-contracts/post.schema";
import EditPostForm from "@app-store/apps/mini-blog/components/EditPostForm";
import Shell from "@app-store/shared/components/Shell";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PostParams {
  id: string;
}

export default function PostEdit({ id }: PostParams) {
  const { data: post } = useQuery(["mini-blog.posts.show", id], async () => {
    const response = await axios.get(`/api/apps/mini-blog/posts/${id}/show`);
    return postSchema.parse(response.data);
  });

  if (!post) return <div className="h1">Loading...</div>;

  return (
    <Shell>
      <div className="layout py-8">
        <h1 className="h1">Edit post</h1>
        <main>
          <EditPostForm formValues={post} />
        </main>
      </div>
    </Shell>
  );
}
