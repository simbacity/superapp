import { IS_PRODUCTION } from "@app-store/shared/utils/config/constants";
import { Storage } from "@google-cloud/storage";

const BUCKET_NAME = process.env.GOOGLE_STORAGE_BUCKET_NAME || "";
export const IMAGE_FOLDER_PATH_FOR_DEV_MODE = "devModeImages/";

export interface ServerSideImage {
  imageFile?: {
    filepath: string;
    mimetype: string;
    newFilename: string;
    originalFilename: string;
    size: number;
    lastModifiedDate: Date;
  };
}

export default class ImageStorageEntity {
  async save(file: ServerSideImage) {
    const storage = new Storage({
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      },
    });

    const bucket = storage.bucket(BUCKET_NAME);
    const fileToUpload = file.imageFile;

    if (!IS_PRODUCTION) return `/devModeImages/${fileToUpload?.newFilename}`;

    if (fileToUpload) {
      const options = {
        destination: `messages/${fileToUpload.newFilename}`,
      };

      await bucket.upload(fileToUpload.filepath, options);
      const imageUrl = `https://storage.googleapis.com/${BUCKET_NAME}/messages/${fileToUpload.newFilename}`;
      return imageUrl;
    } else {
      throw new Error("No Image file to upload");
    }
  }
}
