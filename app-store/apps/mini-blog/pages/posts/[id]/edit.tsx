import { postSchema } from "@app-store/apps/mini-blog/api-contracts/post.schema";
import EditPostForm from "@app-store/apps/mini-blog/components/EditPostForm";
import Shell from "@app-store/shared/components/Shell";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PostParams {
  id: string;
}
// TODO NEXT:
// -> Save and update to database
// -> Refactor api routes /[id]/update, /[id]/delete (instead of /update /delete)
// -> Add delete functionality
// -> Add functionality to see posts from other users in a news feed
export default function PostEdit({ id }: PostParams) {
  const { data: post } = useQuery(["mini-blog.posts.show"], async () => {
    const response = await axios.get("/api/apps/mini-blog/posts/show", { params: { id } });
    return postSchema.parse(response.data);
  });

  if (!post) return <div className="h1">Loading...</div>;

  return (
    <Shell>
      <div className="layout py-8">
        <h1 className="h1">Edit post</h1>
        <main>
          <EditPostForm defaultValues={post} />
        </main>
      </div>
    </Shell>
  );
}
