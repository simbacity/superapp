import { ResponseParamsShow } from "@app-store/apps/mini-blog/api-contracts/posts/show";
import Shell from "@app-store/shared/components/Shell";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

interface PostParams {
  id: string;
}

async function getPost(id: string) {
  const response = await axios.get("/api/apps/mini-blog/posts/show", { params: { id } });
  const responseData: ResponseParamsShow = response.data;
  return responseData;
}

export default function Post({ id }: PostParams) {
  const { data: post } = useQuery(["post", id], () => getPost(id));

  if (!post) return <div>No post...</div>;

  return (
    <Shell>
      <div className="layout py-8">
        <nav className="border-b-4 border-white border-dotted pb-4 mb-6">
          <Link href="/apps/mini-blog">
            <a className="link">All posts</a>
          </Link>
        </nav>
        <main>
          <Link href={`/apps/mini-blog/posts/${id}/edit`}>
            <a className="link">[edit]</a>
          </Link>
          <h1 className="h1">{post.title}</h1>
          <p className="paragraph">{post.content}</p>
        </main>
      </div>
    </Shell>
  );
}
