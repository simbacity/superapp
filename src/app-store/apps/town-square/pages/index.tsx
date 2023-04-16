import type { MessageResponse } from "../api-contracts/message.schema";
import Message from "../components/Message";
import NewMessageForm from "../components/NewMessageForm";
import NotificationsPermissionRequest from "@app-store/shared/components/NotificationsPermissionRequest";
import Shell from "@app-store/shared/components/Shell";
import LoadingSpinner from "@app-store/shared/components/Loading";
import React from "react";
import { api } from "../../../../utils/api";

export default function TownSquare() {
  const {
    data: pagesData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useGetAllMessages();

  if (!pagesData)
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <Shell>
      <div className="layout overflow-auto py-8 pb-52">
        <NotificationsPermissionRequest />
        {pagesData.pages.map((messages, i) => (
          <React.Fragment key={i}>
            {messages.map((message: MessageResponse) => {
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
  const getAllMessages = api.townSquare.messages.list.useInfiniteQuery(
    {
      pageSize: "20",
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.length) {
          return lastPage[lastPage.length - 1]?.id;
        }
        return undefined;
      },
    }
  );

  return getAllMessages;
}
