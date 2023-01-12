import { MessageResponse } from "@app-store/apps/town-square/api-contracts/message.schema";
import { threadSchema } from "@app-store/apps/town-square/api-contracts/thread.schema";
import MessageComponent from "@app-store/apps/town-square/components/Message";
import NewMessageForm from "@app-store/apps/town-square/components/NewMessageForm";
import { useReactQuerySubscription } from "@app-store/apps/town-square/pages";
import Shell from "@app-store/shared/components/Shell";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";

interface ThreadParams {
  id: string;
}

export default function Thread({ id }: ThreadParams) {
  useReactQuerySubscription();
  const router = useRouter();
  const { data: thread } = useThread(id);

  if (!thread) return <div className="h1">Loading...</div>;

  return (
    <Shell>
      <div className="layout py-8 mb-24">
        <div className="flex">
          <div
            className="flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-gray-700"
            onClick={() => router.push("/apps/town-square")}>
            <ArrowLeftIcon className="w-4 h-4 text-white" />
            <p className="text-white ">Thread</p>
          </div>
        </div>
        <MessageComponent message={thread.mainMessage} hideGoToRepliesLink={true} />
        <div className="ml-4">
          {thread.messages.map((message: MessageResponse) => (
            <MessageComponent key={message.id} message={message} hideGoToRepliesLink={true} />
          ))}
        </div>
        <NewMessageForm threadId={thread.id} />
      </div>
    </Shell>
  );
}

export function useThread(id: string) {
  const getThread = async (id: string) => {
    const response = await axios.get(`/api/apps/town-square/threads/${id}/show`);
    return threadSchema.parse(response.data);
  };

  return useQuery(["town-square", "threads", "show", id], () => getThread(id));
}
