import {
  postListSchema,
  PostListResponse,
  postSchema,
  PostResponse,
} from "@app-store/apps/subscriptions/api-contracts/post.schema";
import Layout from "@app-store/apps/subscriptions/components/Layout";
import { formatDate } from "@app-store/apps/subscriptions/utils/days";
import dayjs from "@app-store/apps/subscriptions/utils/days";
import { XCircleIcon, DotsVerticalIcon } from "@heroicons/react/outline";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Posts() {
  const { data: posts } = useGetAllPosts();
  const { data: session } = useSession();
  const [currentPostId, setCurrentPostId] = useState("");
  const [searchString, setSearchString] = useState("");
  const { data: post } = useGetPost(currentPostId);

  const futurePosts = () => {
    return posts?.filter((post) => dayjs(post.scheduledAt).isAfter(dayjs()));
  };

  const pastPosts = () => {
    return posts?.filter((post) => !dayjs(post.scheduledAt).isAfter(dayjs()));
  };

  const searchPosts = (data?: PostListResponse) => {
    if (searchString === "") {
      return data;
    }
    return data?.filter((post) =>
      post.title.concat(post.content).toLowerCase().includes(searchString.toLowerCase())
    );
  };

  function PostItem(post?: PostResponse) {
    if (!post) return <div className="h1">Loading....</div>;

    return (
      <div className="flex flex-col w-2/4 mx-14">
        <button onClick={() => setCurrentPostId("")} className="flex justify-end my-7">
          <XCircleIcon className="w-8 text-gray-300" />
        </button>
        <div>
          <h1 className="text-xl text-black">{session?.user.name}</h1>
          <p className="text-md text-gray-900">{formatDate(post.scheduledAt)}</p>
        </div>
        <h1 className="h1 text-black font-bold">{post.title}</h1>
        <p>{post.content}</p>
      </div>
    );
  }

  return (
    <Layout>
      {!posts ? (
        <div className="h1">Loading...</div>
      ) : (
        <div className={`${currentPostId ? "flex" : "block"}`}>
          <div className={`bg-slate-800 rounded-md py-7 ${currentPostId ? "w-3/5" : "w-full"}`}>
            <h1 className="text-xl text-white px-4 pb-7">Select post</h1>
            <div className="mx-4 mb-7">
              <input
                id="label_search"
                name="search"
                type="text"
                className="input"
                placeholder="Search Posts"
                onChange={(e) => setSearchString(e.target.value)}
              />
            </div>

            <div className="px-4 pb-10">
              <h1 className="text-lg font-bold text-gray-300">Future posts</h1>
              {futurePosts()?.length === 0 ? (
                <p className="text-sm text-gray-300">
                  No posts yet! Create your first one{" "}
                  <Link href="/apps/subscriptions/posts/new">
                    <span className="text-blue-400 underline cursor-pointer">here</span>
                  </Link>
                </p>
              ) : (
                <div>
                  <div className="flex justify-start text-gray-300 font-bold border-b border-gray-400 py-5">
                    <p className="w-2/4">Post title</p>
                    <p className="w-1/4">When</p>
                  </div>
                  {searchPosts(futurePosts())?.map((post) => (
                    <div key={post.id} className="flex w-full text-gray-300 border-b border-gray-400 py-4">
                      <button className="flex w-full" onClick={() => setCurrentPostId(post.id)}>
                        <p className="w-3/5 text-start">{post.title}</p>
                        <p className="w-2/5 text-start">{formatDate(post.scheduledAt)}</p>
                      </button>
                      <div className="w-1/4 flex justify-end">
                        <button>
                          <DotsVerticalIcon className="w-6" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4">
              <h1 className="text-lg font-bold text-gray-300">Past posts</h1>
              {pastPosts()?.length === 0 ? (
                <p className="text-sm text-gray-300">
                  No posts yet! Create your first one{" "}
                  <Link href="/apps/subscriptions/posts/new">
                    <span className="text-blue-400 underline cursor-pointer">here</span>
                  </Link>
                </p>
              ) : (
                <div>
                  <div className="flex justify-between text-gray-300 font-bold border-b border-gray-400 py-5">
                    <p className="w-3/4">Post title</p>
                    <p className="w-1/4">When</p>
                  </div>
                  {searchPosts(pastPosts())?.map((post) => (
                    <button
                      key={post.id}
                      className="flex w-full text-gray-300 border-b border-gray-400 py-4"
                      onClick={() => setCurrentPostId(post.id)}>
                      <p className="w-3/4 text-start">{post.title}</p>
                      <p className="w-1/4 text-start">{formatDate(post.scheduledAt)}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {!!currentPostId && PostItem(post)}
        </div>
      )}
    </Layout>
  );
}

export function useGetAllPosts() {
  const getAllPosts = async () => {
    const response = await axios.get("/api/apps/subscriptions/posts/list");
    return postListSchema.parse(response.data);
  };

  return useQuery(["subscriptions", "posts", "list"], () => getAllPosts());
}

export function useGetPost(id: string) {
  const getPost = async (id: string) => {
    const response = await axios.get(`/api/apps/subscriptions/posts/${id}/show`);
    return postSchema.parse(response.data);
  };

  return useQuery(["subscriptions", "posts", "show", id], () => getPost(id));
}
