import { IS_PRODUCTION } from "@app-store/shared/helpers/config/constants";
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (!IS_PRODUCTION) {
  globalThis.prisma = prisma;
}

export default prisma;
