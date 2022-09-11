import EditPostForm from "@app-store/apps/mini-blog/components/EditPostForm";
import { useGetPost } from "@app-store/apps/mini-blog/pages/posts/[id]";
import Shell from "@app-store/shared/components/Shell";

interface PostParams {
  id: string;
}

export default function PostEdit({ id }: PostParams) {
  const { data: post } = useGetPost(id);

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
