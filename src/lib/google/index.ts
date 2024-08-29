"use strict";
import { Storage } from "@google-cloud/storage";

export const GOOGLE_STORAGE_URL = "https://storage.googleapis.com"


import axios from "axios";

const { GOOGLE_CLOUD_PROJECT, GOOGLE_CLOUD_KEYFILE } = process.env;

const storage = new Storage({
  projectId: GOOGLE_CLOUD_PROJECT,
  keyFilename: GOOGLE_CLOUD_KEYFILE,
});

export function isDataUrl(url: string) {
  return url && url.startsWith("data");
}
export interface StoragePayload {
  url: string;
  bucket: string;
  folderName: string;
  key: string;
  isPublic?: boolean;
}

export function uploadToCloudStorage(payload: StoragePayload): Promise<any> {
  return new Promise((resolve, reject) => {
    const { url, bucket, key, folderName, isPublic = true } = payload;

    const gcloudBucket = storage.bucket(bucket);

    if (isDataUrl(url)) {
      const imageBuffer = Buffer.from(
        url.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      const type = url.split(";")[0].split("/")[1];

      const file = gcloudBucket.file(`${folderName}/` + `${key}.${type}`);

      file.save(
        imageBuffer,
        {
          metadata: { contentType: `image/${type}` },
          validation: "md5",
        },
        function (error) {
          if (!error) {
            resolve({ type });
          } else {
            reject(error);
          }
        }
      );
    } else {
      axios({
        method: "get",
        url,
        responseType: "stream",
      }).then(function (response) {
        const file = gcloudBucket.file(`${folderName}/` + `${key}.png`);

        file.save(
          response.data,
          {
            metadata: { contentType: `image/png` },
            public: false,
            validation: "md5",
          },
          function (error) {
            if (!error) {
              resolve({ type: "png" });
            } else {
              reject(error);
            }
          }
        );
      });
    }
  });
}

