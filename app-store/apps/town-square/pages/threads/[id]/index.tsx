import { Message } from "@app-store/apps/town-square/api-contracts/message.schema";
import MessageComponent from "@app-store/apps/town-square/components/Message";
import { User } from "@app-store/apps/town-square/components/Message";
import NewMessageForm from "@app-store/apps/town-square/components/NewMessageForm";
import Shell from "@app-store/shared/components/Shell";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";

interface MessageParams {
  id: string;
}

export default function NewThread({ id }: MessageParams) {
  const router = useRouter();
  const { data: thread } = useMessageThread(id);

  if (!thread) return <div className="h1">Loading...</div>;

  const formValues = {
    threadId: thread.id,
  };

  return (
    <Shell>
      <div className="layout py-8">
        <div className="flex items-center">
          <ArrowLeftIcon
            className="w-10 h-5 text-white cursor-pointer"
            onClick={() => router.push("/apps/town-square")}
          />
          <p className="text-white ">Threads</p>
        </div>
        <MessageComponent values={thread.mainMessage} />
        <div className="ml-4">
          {thread.messages.map((message: Message & User) => (
            <MessageComponent key={message.id} values={message} />
          ))}
        </div>
        <NewMessageForm formValues={formValues} />
      </div>
    </Shell>
  );
}

export function useMessageThread(id: string, findByMainMessageId?: boolean) {
  const getMessageThread = async (id: string) => {
    const response = await axios.get(`/api/apps/town-square/threads/${id}/show`, {
      params: { findByMainMessageId },
    });
    return response.data;
  };

  return useQuery(["town-square", "threads", "show", id], () => getMessageThread(id));
}
