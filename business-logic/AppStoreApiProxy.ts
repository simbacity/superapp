import { apiEndpoints } from "@app-store/config/generated-files/api.generated";
import NotFoundError from "@app-store/shared/helpers/errors/NotFoundError";
import { NextApiHandler } from "next";

type Module = { default: unknown };

export default class AppStoreApiProxyEntity {
  allowedActions = ["show", "create", "update", "delete", "list"];

  async run(requestQuery: unknown) {
    if (!Array.isArray(requestQuery)) {
      throw new NotFoundError("Not found");
    }

    const [appNamespace, resourceName, actionName] = requestQuery;

    const isAllowedAction = this.allowedActions.includes(actionName);
    if (requestQuery.length !== 3 || !isAllowedAction) {
      const errorMessage =
        "Only these actions are allowed: show.ts, create.ts, update.ts, delete.ts, list.ts";
      throw new NotFoundError(errorMessage);
    }

    const module = (await apiEndpoints[`${appNamespace}/${resourceName}/${actionName}`]) as Module;
    if (!module) throw new NotFoundError("Not found");

    const apiHandler = module.default as NextApiHandler;
    return apiHandler;
  }
}
