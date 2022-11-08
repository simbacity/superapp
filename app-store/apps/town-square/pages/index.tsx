import { MessageResponse, messageListSchema } from "@app-store/apps/town-square/api-contracts/message.schema";
import { threadListSchema } from "@app-store/apps/town-square/api-contracts/thread.schema";
import MessageComponent from "@app-store/apps/town-square/components/Message";
import NewMessageForm from "@app-store/apps/town-square/components/NewMessageForm";
import NotificationsPermissionRequest from "@app-store/shared/components/NotificationsPermissionRequest";
import Shell from "@app-store/shared/components/Shell";
import { useSocket } from "@app-store/shared/hooks/useSocket";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";

export default function TownSquare() {
  useReactQuerySubscription();
  const { data: pagesData, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useGetAllMessages();
  const { data: allThreads } = useGetAllThreads();

  if (!pagesData) return <div className="h1">Loading...</div>;

  return (
    <Shell>
      <div className="layout py-8">
        <NotificationsPermissionRequest />
        {pagesData.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.data.map((message: MessageResponse) => {
              // Pass reply count to message component
              const replyCount = allThreads?.find((thread) => thread?.messageId === message.id)?.messages
                ?.length;
              return <MessageComponent key={message.id} message={message} replyCount={replyCount} />;
            })}
          </React.Fragment>
        ))}
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetching || isFetchingNextPage || !hasNextPage}
          className="default-button--medium ml-2">
          Load More
        </button>
        <NewMessageForm />
      </div>
    </Shell>
  );
}

export function useGetAllMessages() {
  const getAllMessages = async ({ pageParam = "" }) => {
    const response = await axios.get(`/api/apps/town-square/messages/list?cursor=${pageParam}&pageSize=100`);
    const parsedResponse = messageListSchema.parse(response.data);
    /*
      The fn returned data structure must conform to the Infinite Query returned data structure,
      otherwise, your changes will be overwritten: https://tanstack.com/query/v4/docs/guides/infinite-queries
     */
    return { data: parsedResponse, pageParams: [] };
  };

  return useInfiniteQuery(["town-square", "messages", "list"], getAllMessages, {
    getNextPageParam: (lastPage) => {
      if (lastPage.data.length) {
        return lastPage.data[lastPage.data.length - 1].id;
      }
      return undefined;
    },
  });
}

export function useGetAllThreads() {
  const getAllThreads = async () => {
    const response = await axios.get("/api/apps/town-square/threads/list");
    return threadListSchema.parse(response.data);
  };

  return useQuery(["town-square", "threads", "list"], getAllThreads);
}

export function useReactQuerySubscription() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    const invalidateQueries = () => {
      queryClient.invalidateQueries(["town-square", "messages", "list"]);
    };

    socket.on("receive_message", invalidateQueries);

    return () => {
      socket.off("receive_message", invalidateQueries);
    };
  }, [queryClient, socket]);
}
