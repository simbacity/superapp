import { ServerSideImage } from "@app-store/apps/town-square/api-contracts/message.schema";
import { Storage } from "@google-cloud/storage";

const bucketName = process.env.GOOGLE_STORAGE_BUCKET_NAME || "";

export default class ImageStorageEntity {
  async save(file: ServerSideImage) {
    const storage = new Storage({
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      },
    });

    const bucket = storage.bucket(bucketName);
    const fileToUpload = file.imageFile;

    if (fileToUpload) {
      const options = {
        destination: `messages/${fileToUpload.newFilename}`,
      };

      try {
        await bucket.upload(fileToUpload.filepath, options);
        const imageUrl = `https://storage.googleapis.com/${bucketName}/messages/${fileToUpload.newFilename}`;
        return imageUrl;
      } catch (err) {
        console.log(err);
      }
    }
  }
}
