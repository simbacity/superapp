import { Message } from "@app-store/apps/town-square/api-contracts/message.schema";
import MessageComponent, { User } from "@app-store/apps/town-square/components/Message";
import NewMessageForm from "@app-store/apps/town-square/components/NewMessageForm";
import Shell from "@app-store/shared/components/Shell";
import { useSocket } from "@app-store/shared/hooks/useSocket";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";

export default function TownSquare() {
  useReactQuerySubscription();
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useGetAllMessages();

  if (!data) return <div className="h1">Loading...</div>;

  return (
    <Shell>
      <div className="layout py-8">
        {data.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.data.map((message: Message & User) => {
              return <MessageComponent key={message.id} values={message} />;
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
    return response;
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
