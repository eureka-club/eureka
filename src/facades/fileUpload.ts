import { BlobServiceClient, StorageSharedKeyCredential, newPipeline } from '@azure/storage-blob';
import crypto from 'crypto';
import fs, { existsSync, mkdirSync } from 'fs';
import path from 'path';

import { FileUpload, StoredFileUpload } from '../types';
import { STORAGE_MECHANISM_AZURE, STORAGE_MECHANISM_LOCAL_FILES } from '../constants';
import moveFile  from 'move-file';

const { AZURE_STORAGE_ACCOUNT_ACCESS_KEY } = process.env;
const { AZURE_STORAGE_ACCOUNT_NAME } = process.env;
const { LOCAL_ASSETS_HOST_DIR } = process.env;
const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;
const { NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM } = process.env;
const HASHING_ALGO = 'sha256';
const FOLDER_SPREAD_CHAR_COUNT = 2;

const getFileHash = (file:File, algorithm = HASHING_ALGO): string => {
  // const fileContent = fs.readFileSync("as");
  const fileContent = `${file.name}${file.type}${(new Date()).toISOString()}`;
  const sha1sum = crypto.createHash(algorithm);
  sha1sum.update(Buffer.from(fileContent,"base64"));

  return sha1sum.digest('hex');
};

const getFileStorePath = (fileUpload: File, fileHash: string): string => {
  const fileDestDir = path.join(fileHash.substr(0, FOLDER_SPREAD_CHAR_COUNT));
  const fileDestPath = path.join(fileDestDir, fileHash + path.extname(fileUpload.name));

  return fileDestPath;
};

const moveLocalUpload = async (fileUpload: File, fileHash: string): Promise<string> => {
  const fileDestDir = path.join(LOCAL_ASSETS_HOST_DIR!, fileHash.substr(0, FOLDER_SPREAD_CHAR_COUNT));
  if (!existsSync(fileDestDir)) {
    mkdirSync(fileDestDir);
  }

  const fileDestPath = path.join(fileDestDir, fileHash + path.extname(fileUpload.name));
  console.info('Storing file upload under...', fileDestPath); // eslint-disable-line no-console
  await moveFile(fileUpload.name, fileDestPath);

  return fileDestPath;
};

export const storeUpload = async (file: File): Promise<StoredFileUpload> => {
  const fileHash = getFileHash(file);
  const fileStorePath = getFileStorePath(file, fileHash);

  switch (NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM) {
    case STORAGE_MECHANISM_AZURE: {
      const blobServiceClient = new BlobServiceClient(
        `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
        newPipeline(new StorageSharedKeyCredential(AZURE_STORAGE_ACCOUNT_NAME!, AZURE_STORAGE_ACCOUNT_ACCESS_KEY!)),
      );
      const containerClient = blobServiceClient.getContainerClient(NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME!);
      const blockBlobClient = containerClient.getBlockBlobClient(fileStorePath);

      const ab = await file.arrayBuffer();
      await blockBlobClient.uploadData(ab);
      // await blockBlobClient.uploadFile(file.path, {
      //   blobHTTPHeaders: { blobContentType: file.type },
      // });

      return {
        contentHash: fileHash,
        originalFilename: file.name,
        storedFile: fileStorePath,
        mimeType: file.type,
      };
    }

    case STORAGE_MECHANISM_LOCAL_FILES: {
      await moveLocalUpload(file, fileHash);

      return {
        contentHash: fileHash,
        originalFilename: file.name,
        storedFile: fileStorePath,
        mimeType: file.type,
      };
    }

    default:
      throw new Error('Unknown PUBLIC_ASSETS_STORAGE_MECHANISM');
  }
};

export const storeUploadPhoto = async (file: File,dir:string): Promise<StoredFileUpload> => {
  const fileHash = getFileHash(file);
  const fileStorePath = getFileStorePath(file, fileHash);

  switch (NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM) {
    case STORAGE_MECHANISM_AZURE: {
      const blobServiceClient = new BlobServiceClient(
        `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
        newPipeline(new StorageSharedKeyCredential(AZURE_STORAGE_ACCOUNT_NAME!, AZURE_STORAGE_ACCOUNT_ACCESS_KEY!)),
      );
      const containerPath = path.join(NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME!,dir);
      const containerClient = blobServiceClient.getContainerClient(containerPath);
      const blockBlobClient = containerClient.getBlockBlobClient(fileStorePath);

      await blockBlobClient.uploadFile(file.name, {
        blobHTTPHeaders: { blobContentType: file.type },
      });

      return {
        contentHash: fileHash,
        originalFilename: file.name,
        storedFile: fileStorePath,
        mimeType: file.type,
      };
    }

    case STORAGE_MECHANISM_LOCAL_FILES: {
      await moveLocalUpload(file, fileHash);

      return {
        contentHash: fileHash,
        originalFilename: file.name,
        storedFile: fileStorePath,
        mimeType: file.type,
      };
    }

    default:
      throw new Error('Unknown PUBLIC_ASSETS_STORAGE_MECHANISM');
  }
};

export const storeDeleteFile = async (storedFile: string, subPath:string = ''): Promise<boolean> => {
  const [containerFolder,fileName] = storedFile.split('/');//  /??? :|
  switch (NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM) {
    case STORAGE_MECHANISM_AZURE: {
      const blobServiceClient = new BlobServiceClient(
        `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
        newPipeline(new StorageSharedKeyCredential(AZURE_STORAGE_ACCOUNT_NAME!, AZURE_STORAGE_ACCOUNT_ACCESS_KEY!)),
      );
      const containerPath = path.join(NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME!,subPath,containerFolder);
      const containerClient = blobServiceClient.getContainerClient(containerPath);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      const res = await blockBlobClient.deleteIfExists(); 
      if(!res.succeeded)
        return false;
      return true;
    }

    // TODO remove locally
    // case STORAGE_MECHANISM_LOCAL_FILES: {
    //   await moveLocalUpload(file, fileHash);

    //   return true;
    // }

    default:
      throw new Error('Unknown PUBLIC_ASSETS_STORAGE_MECHANISM');
  }
};
