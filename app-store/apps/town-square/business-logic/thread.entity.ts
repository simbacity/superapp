import NotFoundError from "@app-store/shared/utils/errors/NotFoundError";
import prisma from "@app-store/shared/utils/prisma";

export default class MessageThreadEntity {
  async find(id: string) {
    const thread = await prisma.messageThread_TownSquare.findUnique({
      where: { id },
      include: {
        messages: { include: { user: { select: { id: true, image: true, name: true } } } },
        mainMessage: { include: { user: { select: { id: true, image: true, name: true } } } },
      },
    });

    if (!thread) {
      throw new NotFoundError("Not Found");
    }

    return thread;
  }
}
