import { InviteeRequest } from "@api-contracts/invitee.schema";
import prisma from "@app-store/shared/helpers/prisma";
import { teardown } from "@app-store/shared/helpers/tests/teardown";
import InviteeEntity from "@business-logic/invitee.entity";
import { Invitee } from "@prisma/client";

describe("Invitee", () => {
  beforeEach(async () => {
    await teardown();
  });

  describe("#create", () => {
    it("creates invitee if has correct invite token", async () => {
      const inviteCode = await prisma.inviteCode.create({
        data: {
          token: "XYZ-TOKEN",
        },
      });

      const requestParams: InviteeRequest = {
        token: inviteCode.token,
        email: "random@example.com",
      };

      const entity = new InviteeEntity();
      const result = await entity.create(requestParams);

      const invitee = (await prisma.invitee.findUnique({ where: { id: result?.id } })) as Invitee;

      expect(inviteCode.token).toBe(requestParams.token);
      expect(invitee.email).toBe(requestParams.email);
    });

    it("returns invitee if it already exists (even with wrong invite token)", async () => {
      const inviteCode = await prisma.inviteCode.create({
        data: {
          token: "XYZ-TOKEN",
        },
      });

      const requestParams: InviteeRequest = {
        token: inviteCode.token,
        email: "random@example.com",
      };

      const entity = new InviteeEntity();
      await entity.create(requestParams);

      const requestParamsSecondTry: InviteeRequest = { ...requestParams, token: "WRONG-TOKEN" };
      const response = await entity.create(requestParamsSecondTry);
      const invitee = (await prisma.invitee.findUnique({ where: { id: response?.id } })) as Invitee;

      expect(invitee.email).toBe(requestParams.email);
    });

    it("throws error if invite token is not correct", async () => {
      await prisma.inviteCode.create({
        data: {
          token: "XYZ-TOKEN",
        },
      });

      const requestParams: InviteeRequest = {
        token: "NOT-CORRECT",
        email: "random@example.com",
      };

      const entity = new InviteeEntity();

      await expect(async () => {
        await entity.create(requestParams);
      }).rejects.toThrowError("Not found");
    });
  });

  describe("#isInvited", () => {
    it("returns true if user is invited", async () => {
      const inviteCode = await prisma.inviteCode.create({
        data: {
          token: "XYZ-TOKEN",
        },
      });

      const requestParams: InviteeRequest = {
        token: inviteCode.token,
        email: "random@example.com",
      };

      const entity = new InviteeEntity();
      await entity.create(requestParams);

      const isInvited = await entity.isInvited(requestParams.email);
      expect(isInvited).toBe(true);
    });

    it("returns fals if user is not invited", async () => {
      const entity = new InviteeEntity();
      const isInvited = await entity.isInvited("not-invited@example.com");
      expect(isInvited).toBe(false);
    });
  });
});
