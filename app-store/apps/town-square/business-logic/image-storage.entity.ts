import { ServerSideImage } from "@app-store/apps/town-square/api-contracts/message.schema";
import { IS_PRODUCTION } from "@app-store/shared/utils/config/constants";
import { Storage } from "@google-cloud/storage";

const BUCKET_NAME = process.env.GOOGLE_STORAGE_BUCKET_NAME || "";

export default class ImageStorageEntity {
  async save(file: ServerSideImage) {
    const fileToUpload = file.imageFile;

    if (!fileToUpload) throw new Error("No Image file to upload");
    if (!IS_PRODUCTION) return `/devModeImages/${fileToUpload.newFilename}`;

    const storage = new Storage({
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // adding the private key via the vercel dashbaord didn't work because it formats the key incorrectly
        // related comment on github:
        // https://github.com/auth0/node-jsonwebtoken/issues/642#issuecomment-585173594
        private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/gm, "\n"),
      },
    });

    const bucket = storage.bucket(BUCKET_NAME);

    const options = {
      destination: `messages/${fileToUpload.newFilename}`,
    };

    await bucket.upload(fileToUpload.filepath, options);
    const imageUrl = `https://storage.googleapis.com/${BUCKET_NAME}/messages/${fileToUpload.newFilename}`;
    return imageUrl;
  }
}
