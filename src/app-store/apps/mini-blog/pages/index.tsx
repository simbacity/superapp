import { postListSchema } from "../api-contracts/post.schema";
import Shell from "../../../shared/components/Shell";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

export default function Index() {
  const { data: posts } = useGetAllPosts();

  if (!posts) return <div className="h1">Loading...</div>;

  return (
    <Shell>
      <div className="layout py-8">
        <section className="flex items-center justify-between">
          <div>
            <h1 className="h1">Mini blog</h1>
          </div>

          <div>
            <Link href="/apps/mini-blog/posts/new">
              <button className="default-button--medium">New post</button>
            </Link>
          </div>
        </section>
        <section className="border-b-4 border-dotted border-white pb-6"></section>
        <div>
          {posts.map((post) => (
            <div
              key={post.id}
              className="border-b-4 border-dotted border-white py-6"
            >
              <h2 className="h2">{post.title}</h2>
              <p className="paragraph">{buildPostExcerpt(post.content)}</p>
              <Link href={`/apps/mini-blog/posts/${post.id}`} className="link">
                Read more
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function useGetAllPosts() {
  const getAllPosts = async () => {
    const response = await axios.get("/api/apps/mini-blog/posts/list");
    return postListSchema.parse(response.data);
  };

  return useQuery(["mini-blog", "posts", "list"], () => getAllPosts());
}

function buildPostExcerpt(postContent: string) {
  return `${postContent.substring(0, 144)}...`;
}
