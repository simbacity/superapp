import type { MessageResponse } from "../../../api-contracts/message.schema";
import { threadSchema } from "../../../api-contracts/thread.schema";
import MessageComponent from "../../../components/Message";
import NewMessageForm from "../../../components/NewMessageForm";
import Shell from "../../../../../shared/components/Shell";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";

interface ThreadParams {
  id: string;
}

export default function Thread({ id }: ThreadParams) {
  const router = useRouter();
  const { data: thread } = useThread(id);

  if (!thread) return <div className="h1">Loading...</div>;

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
      </div>
    </Shell>
  );
}

export function useThread(id: string) {
  const getThread = async (id: string) => {
    const response = await axios.get(
      `/api/apps/town-square/threads/${id}/show`
    );
    return threadSchema.parse(response.data);
  };

  return useQuery(["town-square", "threads", "show", id], () => getThread(id));
}
