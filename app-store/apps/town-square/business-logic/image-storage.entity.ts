import { ServerSideImage } from "@app-store/apps/town-square/api-contracts/message.schema";
import { IS_PRODUCTION } from "@app-store/shared/utils/config/constants";
import { Storage } from "@google-cloud/storage";

const BUCKET_NAME = process.env.GOOGLE_STORAGE_BUCKET_NAME || "";

export default class ImageStorageEntity {
  async save(file: ServerSideImage) {
    const fileToUpload = file.imageFile;

    if (!fileToUpload) throw new Error("No Image file to upload");
    if (!IS_PRODUCTION) return `/devModeImages/${fileToUpload.newFilename}`;

    console.info("**Uploading image to Google Cloud Storage**");
    console.info(process.env.GOOGLE_PRIVATE_KEY);
    console.info("**END/Uploading image to Google Cloud Storage**");
    const storage = new Storage({
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
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
