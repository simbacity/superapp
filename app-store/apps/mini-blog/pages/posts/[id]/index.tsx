import { postSchema } from "@app-store/apps/mini-blog/api-contracts/post.schema";
import Shell from "@app-store/shared/components/Shell";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

interface PostParams {
  id: string;
}

export default function Post({ id }: PostParams) {
  const router = useRouter();
  const { data: post } = useGetPost(id);
  const deletePost = useDeletePost();

  const onDeleteHandler = (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost.mutate(id, {
        onSuccess: () => {
          alert("Post deleted successfully.");
          router.push("/apps/mini-blog");
        },
      });
    }
  };

  if (!post) return <div className="h1">Loading...</div>;

  return (
    <Shell>
      <div className="layout py-8">
        <nav className="border-b-4 border-white border-dotted pb-4 mb-6">
          <Link href="/apps/mini-blog" className="link">
            All posts
          </Link>
        </nav>
        <main>
          <div className="flex space-x-2">
            <Link href={`/apps/mini-blog/posts/${id}/edit`} className="link">
              [edit]
            </Link>
            <a className="link" onClick={() => onDeleteHandler(id)}>
              [delete]
            </a>
          </div>
          <h1 className="h1">{post.title}</h1>
          <p className="paragraph">{post.content}</p>
        </main>
      </div>
    </Shell>
  );
}

export function useGetPost(id: string) {
  const getPost = async (id: string) => {
    const response = await axios.get(`/api/apps/mini-blog/posts/${id}/show`);
    return postSchema.parse(response.data);
  };

  return useQuery(["mini-blog", "posts", "show", id], () => getPost(id));
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  const deletePost = async (id: string) => {
    const response = await axios.delete(`/api/apps/mini-blog/posts/${id}/delete`);
    return postSchema.parse(response.data);
  };

  return useMutation((id: string) => deletePost(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["mini-blog", "posts", "list"]);
    },
  });
}
