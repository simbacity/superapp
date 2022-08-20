import prisma from "@app-store/shared/helpers/prisma";
import { teardown } from "@app-store/shared/helpers/tests/teardown";
import UserEntity from "@business-logic/User";
import { User } from "@prisma/client";

describe("User", () => {
  beforeEach(async () => {
    await teardown();
  });

  describe("#create", () => {
    it("finds an existing user", async () => {
      const data = {
        name: "John Doe",
        email: "john.doe@example.com",
      };

      const user = await prisma.user.create({ data });

      const entity = new UserEntity();
      const result = (await entity.find(user.id)) as User;

      expect(result.email).toBe(user.email);
    });
  });
});
