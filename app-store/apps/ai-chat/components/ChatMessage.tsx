import { AIChatResponse } from "@app-store/apps/ai-chat/api-contracts/ai-chat.schema";
import Avatar from "@app-store/apps/town-square/components/Avatar";
import { useSession } from "next-auth/react";

export default function MessagePage({
  message,
  isFromAIChat,
}: {
  message: AIChatResponse;
  isFromAIChat?: boolean;
}) {
  const { data: session } = useSession();

  return (
    <div
      key={message.id}
      className="px-6 gap-2 text-sm text-white break-words group border-b border-gray-800">
      <div className="flex relative items-center max-w-4xl m-auto py-4">
        <div>
          {isFromAIChat ? (
            <div className="w-9 h-9 mr-5 rounded-full bg-green-600 text-center pt-2">AI</div>
          ) : (
            <Avatar src={session?.user.image || ""} className="w-9 h-9 mr-5" />
          )}
        </div>
        <div className="w-full overflow-hidden">
          <div>{message.message}</div>
        </div>
      </div>
    </div>
  );
}
