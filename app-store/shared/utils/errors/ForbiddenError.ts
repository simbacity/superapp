import HttpError from "@app-store/shared/utils/errors/HttpError";

export default class ForbiddenError extends HttpError {
  code: number;

  constructor(message: string) {
    super(message);
    this.code = 403;
  }
}
