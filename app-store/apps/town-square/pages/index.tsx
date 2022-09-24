import { MessageResponse } from "@app-store/apps/town-square/api-contracts/message.schema";
import Message from "@app-store/apps/town-square/components/Message";
import Shell from "@app-store/shared/components/Shell";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

export default function TownSquare() {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useGetAllMessages();

  if (!data) return <div className="h1">Loading...</div>;

  return (
    <Shell>
      <div className="layout py-8">
        {data?.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.data.map((item: MessageResponse) => {
              const message = { ...item, replyCount: getReplyCount(item.id, group.data) };
              return <Message key={message.id} values={message} />;
            })}
          </React.Fragment>
        ))}
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetching || isFetchingNextPage || !hasNextPage}
          className="default-button--medium ml-2">
          Load More
        </button>
      </div>
    </Shell>
  );
}

export function useGetAllMessages() {
  const getAllMessages = ({ pageParam = "" }) =>
    axios.get(`/api/apps/town-square/messages/list?cursor=${pageParam}&pageSize=100`);

  return useInfiniteQuery(["town-square", "messages", "list"], getAllMessages, {
    getNextPageParam: (lastPage) => {
      if (lastPage.data.length) {
        return lastPage.data[lastPage.data.length - 1].id;
      }
      return undefined;
    },
  });
}

export function getReplyCount(messageId: string, data: MessageResponse[]) {
  return data.filter((message) => {
    if (message.thread) {
      return message.thread.messageId === messageId;
    }
  }).length;
}
