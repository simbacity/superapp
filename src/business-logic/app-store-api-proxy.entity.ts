/* eslint-disable @next/next/no-assign-module-variable */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { apiEndpoints } from "../app-store/config/generated-files/api.generated";
import NotFoundError from "../app-store/shared/utils/errors/NotFoundError";
import { type NextApiHandler } from "next";

type Module = { default: unknown };

export default class AppStoreApiProxyEntity {
  async run(requestQuery: unknown) {
    if (!Array.isArray(requestQuery)) {
      throw new NotFoundError("Not found");
    }

    // ['mini-blog', 'posts', 'id123', 'update']
    const hasDynamicId = requestQuery.length === 4;

    // mini-blog
    const appNamespace = requestQuery[0];

    // posts
    const resourceName = requestQuery[1];

    // id123
    const id = hasDynamicId ? requestQuery[2] : undefined;

    // update
    const actionName = hasDynamicId ? requestQuery[3] : requestQuery[2];

    const resourcePath = hasDynamicId ? `${resourceName}/[id]` : resourceName;
    const endpointKey = `${appNamespace}/${resourcePath}/${actionName}`;
    const module = (await apiEndpoints[endpointKey]) as Module;
    if (!module) throw new NotFoundError("Not found");

    const apiHandler = module.default as NextApiHandler;
    return { apiHandler, id };
  }
}
