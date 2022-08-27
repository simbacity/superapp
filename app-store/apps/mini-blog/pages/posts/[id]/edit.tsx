import { postSchema } from "@app-store/apps/mini-blog/api-contracts/post.schema";
import Shell from "@app-store/shared/components/Shell";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PostParams {
  id: string;
}

function usePostData(id: string) {
  return useQuery(["post"], async () => {
    const response = await axios.get("/api/apps/mini-blog/posts/show", { params: { id } });
    return postSchema.parse(response.data);
  });
}

export default function PostEdit({ id }: PostParams) {
  const { data: post } = usePostData(id);

  if (!post) return <div>No post...</div>;

  return (
    <Shell>
      <div className="layout py-8">
        <h1 className="h1">Edit post</h1>
        <main>
          <h1 className="h1">{post.title}</h1>
          <p className="paragraph">{post.content}</p>
        </main>
      </div>
    </Shell>
  );
}
