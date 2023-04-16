import type { MessageResponse } from "../../../api-contracts/message.schema";
import MessageComponent from "../../../components/Message";
import NewMessageForm from "../../../components/NewMessageForm";
import Shell from "../../../../../shared/components/Shell";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { api } from "../../../../../../utils/api";
import LoadingSpinner from "@app-store/shared/components/Loading";

interface ThreadParams {
  id: string;
}

export default function Thread({ id }: ThreadParams) {
  const router = useRouter();
  const { data: thread, isLoading: threadIsLoading } = useGetThread(id);

  if (threadIsLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <Shell>
      <div className="layout mb-24 py-8">
        <div className="flex">
          <div
            className="flex cursor-pointer items-center gap-2 py-2 px-3 hover:bg-gray-700"
            onClick={() => router.push("/apps/town-square")}
          >
            <ArrowLeftIcon className="h-4 w-4 text-white" />
            <p className="text-white ">Thread</p>
          </div>
        </div>
        {/* in the case where user clicks on notification for an already deleted thread message (comment to be removed) */}
        {!thread || !thread.mainMessage ? (
          <h3 className="h3 ml-4">Message has been deleted</h3>
        ) : (
          <>
            <MessageComponent
              message={thread.mainMessage}
              hideGoToRepliesLink={true}
            />
            <div className="ml-4">
              {thread.messages.map((message: MessageResponse) => (
                <MessageComponent
                  key={message.id}
                  message={message}
                  hideGoToRepliesLink={true}
                />
              ))}
            </div>
            <NewMessageForm threadId={thread.id} />
          </>
        )}
      </div>
    </Shell>
  );
}

export function useGetThread(id: string) {
  const getThread = api.townSquare.threads.show.useQuery({ id });
  return getThread;
}
