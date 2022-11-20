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
      <div className="layout py-8">
        <div className="flex items-center">
          <ArrowLeftIcon
            className="w-10 h-5 text-white cursor-pointer"
            onClick={() => router.push("/apps/town-square")}
          />
          <p className="text-white ">Thread</p>
        </div>
        <MessageComponent message={thread.mainMessage} />
        <div className="ml-4">
          {thread.messages?.map((message: MessageResponse) => (
            <MessageComponent key={message.id} message={message} />
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
