import { messagesRouter } from "@server/api/routers/town-square/messages";
import { threadsRouter } from "@server/api/routers/town-square/threads";
import { createTRPCRouter } from "@server/api/trpc";

export const townSquareRouter = createTRPCRouter({
  messages: messagesRouter,
  threads: threadsRouter,
});
