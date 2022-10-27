import { messageSchema } from "@app-store/apps/town-square/api-contracts/message.schema";
import Message from "@app-store/apps/town-square/components/Message";
import NewMessageForm from "@app-store/apps/town-square/components/NewMessageForm";
import Shell from "@app-store/shared/components/Shell";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";

interface MessageParams {
  headMessage: string;
}

export default function NewThread({ headMessage }: MessageParams) {
  const router = useRouter();
  const { data: message } = useGetMessage(headMessage);

  if (!message) return <div className="h1">Loading...</div>;

  const formValues = {
    messageId: message.id,
  };

  return (
    <Shell>
      <div className="layout py-8">
        <div className="flex items-center">
          <ArrowLeftIcon className="w-10 h-5 text-white cursor-pointer" onClick={() => router.back()} />
          <p className="text-white ">Threads</p>
        </div>
        <Message values={message} />
        <NewMessageForm formValues={formValues} />
      </div>
    </Shell>
  );
}

export function useGetMessage(id: string) {
  const getMessage = async (id: string) => {
    const response = await axios.get(`/api/apps/town-square/messages/${id}/show`);
    return messageSchema.parse(response.data);
  };

  return useQuery(["town-square", "messages", "show", id], () => getMessage(id));
}
