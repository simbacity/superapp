import type { ServerSideFile } from "@api-contracts/file-upload.schema";
import { IS_PRODUCTION } from "@app-store/shared/utils/config/constants";
import { Storage } from "@google-cloud/storage";
import { FILE_FOLDER_PATH_FOR_DEV_MODE } from "@app-store/shared/utils/config/constants";

const BUCKET_NAME = process.env.GOOGLE_STORAGE_BUCKET_NAME || "";

export default class FileUploadEntity {
  async save(file: ServerSideFile, folderName: string) {
    const fileToUpload = file.file;

    if (!fileToUpload) throw new Error("No Image file to upload");

    if (!IS_PRODUCTION)
      return `/${FILE_FOLDER_PATH_FOR_DEV_MODE}/${fileToUpload.newFilename}`;

    const storage = new Storage({
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // adding the private key via the vercel dashbaord didn't work because it formats the key incorrectly
        // related comment on github:
        // https://github.com/auth0/node-jsonwebtoken/issues/642#issuecomment-585173594
        private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(
          /\\n/gm,
          "\n"
        ),
      },
    });

    const bucket = storage.bucket(BUCKET_NAME);

    const options = {
      destination: `${folderName}/${fileToUpload.newFilename}`,
    };

    await bucket.upload(fileToUpload.filepath, options);
    const imageUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${folderName}/${fileToUpload.newFilename}`;
    return imageUrl;
  }
}
