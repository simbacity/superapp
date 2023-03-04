import type { MessageResponse } from "../api-contracts/message.schema";
import { messageListSchema } from "../api-contracts/message.schema";
import Message from "../components/Message";
import NewMessageForm from "../components/NewMessageForm";
import NotificationsPermissionRequest from "../../../shared/components/NotificationsPermissionRequest";
import Shell from "../../../shared/components/Shell";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

export default function TownSquare() {
  const {
    data: pagesData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useGetAllMessages();

  if (!pagesData) return <div className="h1">Loading...</div>;

  return (
    <Shell>
      <div className="layout overflow-auto py-8 pb-52">
        <NotificationsPermissionRequest />
        {pagesData.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.data.map((message: MessageResponse) => {
              return <Message key={message.id} message={message} />;
            })}
          </React.Fragment>
        ))}
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetching || isFetchingNextPage || !hasNextPage}
          className="invisible-button--small ml-2"
        >
          Load More
        </button>
        <NewMessageForm />
      </div>
    </Shell>
  );
}

export function useGetAllMessages() {
  const getAllMessages = async ({ pageParam = "" }) => {
    const response = await axios.get(
      `/api/apps/town-square/messages/list?cursor=${pageParam}&pageSize=20`
    );
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
        return lastPage.data[lastPage.data.length - 1]?.id;
      }
      return undefined;
    },
  });
}
