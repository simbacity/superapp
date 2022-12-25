import { UserSettingsRequest } from "@app-store/apps/subscriptions/api-contracts/usersettings.schema";
import UserSettingsEntity from "@app-store/apps/subscriptions/business-logic/usersettings";
import prisma from "@app-store/shared/utils/prisma";
import { setup } from "@app-store/shared/utils/tests/setup";
import { teardown } from "@app-store/shared/utils/tests/teardown";
import { Subscriptions_User_Settings } from "@prisma/client";

describe("User Settings", () => {
  beforeEach(async () => {
    await teardown();
  });

  describe("#find", () => {
    it("finds user settings", async () => {
      const { user } = await setup();

      const requestParams: UserSettingsRequest = {
        displayName: "Display Name",
        welcomeMessage: "Welcome message",
        name: "Name",
        surname: "Surname",
        phone: "+256XXXXXXX",
      };

      const entity = new UserSettingsEntity();
      await entity.createOrUpdate(requestParams, user.id);

      const userSettings = await entity.find(user.id);

      expect(userSettings?.displayName).toBe(requestParams.displayName);
      expect(userSettings?.welcomeMessage).toBe(requestParams.welcomeMessage);
      expect(userSettings?.name).toBe(requestParams.name);
      expect(userSettings?.surname).toBe(requestParams.surname);
      expect(userSettings?.phone).toBe(requestParams.phone);
    });
  });

  describe("#create", () => {
    it("creates user settings", async () => {
      const { user } = await setup();

      const requestParams: UserSettingsRequest = {
        displayName: "Display Name",
        welcomeMessage: "Welcome message",
        name: "Name",
        surname: "Surname",
        phone: "+256XXXXXXX",
      };

      const entity = new UserSettingsEntity();
      const result = await entity.createOrUpdate(requestParams, user.id);

      const userSettings = (await prisma.subscriptions_User_Settings.findUnique({
        where: { id: result?.id },
      })) as Subscriptions_User_Settings;

      expect(userSettings?.displayName).toBe(requestParams.displayName);
      expect(userSettings?.welcomeMessage).toBe(requestParams.welcomeMessage);
      expect(userSettings?.name).toBe(requestParams.name);
      expect(userSettings?.surname).toBe(requestParams.surname);
      expect(userSettings?.phone).toBe(requestParams.phone);
    });
  });

  describe("#update", () => {
    it("updates user settings if post is from user", async () => {
      const { user } = await setup();

      const requestParams: UserSettingsRequest = {
        displayName: "Display Name",
        welcomeMessage: "Welcome message",
        name: "Name",
        surname: "Surname",
        phone: "+256XXXXXXX",
      };

      const entity = new UserSettingsEntity();
      const userSettings = await entity.createOrUpdate(requestParams, user.id);

      const newParams: UserSettingsRequest = {
        displayName: "New Display Name",
        welcomeMessage: "New Welcome message",
        name: "New Name",
        surname: "New Surname",
        phone: "+2XXXXXXXXX",
      };
      await entity.createOrUpdate(newParams, user.id);

      const result = await prisma.subscriptions_User_Settings.findUnique({ where: { id: userSettings.id } });

      expect(result?.displayName).toBe(newParams.displayName);
      expect(result?.welcomeMessage).toBe(newParams.welcomeMessage);
      expect(result?.name).toBe(newParams.name);
      expect(result?.surname).toBe(newParams.surname);
      expect(result?.phone).toBe(newParams.phone);
    });
  });

  describe("#delete", () => {
    it("deletes post if post is from user", async () => {
      const { user } = await setup();

      const requestParams: UserSettingsRequest = {
        displayName: "Display Name",
        welcomeMessage: "Welcome message",
        name: "Name",
        surname: "Surname",
        phone: "+256XXXXXXX",
      };

      const entity = new UserSettingsEntity();
      const userSettings = await entity.createOrUpdate(requestParams, user.id);

      await entity.delete(userSettings.id, user.id);

      const result = await prisma.subscriptions_User_Settings.findUnique({ where: { id: userSettings.id } });

      expect(result).toBe(null);
    });

    it("does not delete post if post is from different user", async () => {
      const { user } = await setup();

      const requestParams: UserSettingsRequest = {
        displayName: "Display Name",
        welcomeMessage: "Welcome message",
        name: "Name",
        surname: "Surname",
        phone: "+256XXXXXXX",
      };

      const entity = new UserSettingsEntity();
      const userSettings = await entity.createOrUpdate(requestParams, user.id);

      await expect(async () => {
        await entity.delete(userSettings.id, "random_user_id");
      }).rejects.toThrowError("Forbidden");
    });
  });
});
