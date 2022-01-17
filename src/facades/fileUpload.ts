import { BlobServiceClient, StorageSharedKeyCredential, newPipeline } from '@azure/storage-blob';
import crypto from 'crypto';
import fs, { existsSync, mkdirSync } from 'fs';
import moveFile from 'move-file';
import path from 'path';

import { FileUpload, StoredFileUpload } from '../types';
import { STORAGE_MECHANISM_AZURE, STORAGE_MECHANISM_LOCAL_FILES } from '../constants';

const { AZURE_STORAGE_ACCOUNT_ACCESS_KEY } = process.env;
const { AZURE_STORAGE_ACCOUNT_NAME } = process.env;
const { LOCAL_ASSETS_HOST_DIR } = process.env;
const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;
const { NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM } = process.env;
const HASHING_ALGO = 'sha256';
const FOLDER_SPREAD_CHAR_COUNT = 2;

const getFileHash = (filePath: string, algorithm = HASHING_ALGO): string => {
  const fileContent = fs.readFileSync(filePath);
  const sha1sum = crypto.createHash(algorithm);
  sha1sum.update(fileContent);

  return sha1sum.digest('hex');
};

const getFileStorePath = (fileUpload: FileUpload, fileHash: string): string => {
  const fileDestDir = path.join(fileHash.substr(0, FOLDER_SPREAD_CHAR_COUNT));
  const fileDestPath = path.join(fileDestDir, fileHash + path.extname(fileUpload.path));

  return fileDestPath;
};

const moveLocalUpload = async (fileUpload: FileUpload, fileHash: string): Promise<string> => {
  const fileDestDir = path.join(LOCAL_ASSETS_HOST_DIR!, fileHash.substr(0, FOLDER_SPREAD_CHAR_COUNT));
  if (!existsSync(fileDestDir)) {
    mkdirSync(fileDestDir);
  }

  const fileDestPath = path.join(fileDestDir, fileHash + path.extname(fileUpload.path));
  console.info('Storing file upload under...', fileDestPath); // eslint-disable-line no-console
  await moveFile(fileUpload.path, fileDestPath);

  return fileDestPath;
};

export const storeUpload = async (file: FileUpload): Promise<StoredFileUpload> => {
  const fileHash = getFileHash(file.path);
  const fileStorePath = getFileStorePath(file, fileHash);

  switch (NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM) {
    case STORAGE_MECHANISM_AZURE: {
      const blobServiceClient = new BlobServiceClient(
        `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
        newPipeline(new StorageSharedKeyCredential(AZURE_STORAGE_ACCOUNT_NAME!, AZURE_STORAGE_ACCOUNT_ACCESS_KEY!)),
      );
      const containerClient = blobServiceClient.getContainerClient(NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME!);
      const blockBlobClient = containerClient.getBlockBlobClient(fileStorePath);

      await blockBlobClient.uploadFile(file.path, {
        blobHTTPHeaders: { blobContentType: file.headers['content-type'] },
      });

      return {
        contentHash: fileHash,
        originalFilename: file.originalFilename,
        storedFile: fileStorePath,
        mimeType: file.headers['content-type'],
      };
    }

    case STORAGE_MECHANISM_LOCAL_FILES: {
      await moveLocalUpload(file, fileHash);

      return {
        contentHash: fileHash,
        originalFilename: file.originalFilename,
        storedFile: fileStorePath,
        mimeType: file.headers['content-type'],
      };
    }

    default:
      throw new Error('Unknown PUBLIC_ASSETS_STORAGE_MECHANISM');
  }
};

export const storeUploadUserPhoto = async (file: FileUpload): Promise<StoredFileUpload> => {
  const fileHash = getFileHash(file.path);
  const fileStorePath = getFileStorePath(file, fileHash);

  switch (NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM) {
    case STORAGE_MECHANISM_AZURE: {
      const blobServiceClient = new BlobServiceClient(
        `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
        newPipeline(new StorageSharedKeyCredential(AZURE_STORAGE_ACCOUNT_NAME!, AZURE_STORAGE_ACCOUNT_ACCESS_KEY!)),
      );
      const containerPath = path.join(NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME!,'users-photos');
      const containerClient = blobServiceClient.getContainerClient(containerPath);
      const blockBlobClient = containerClient.getBlockBlobClient(fileStorePath);

      await blockBlobClient.uploadFile(file.path, {
        blobHTTPHeaders: { blobContentType: file.headers['content-type'] },
      });

      return {
        contentHash: fileHash,
        originalFilename: file.originalFilename,
        storedFile: fileStorePath,
        mimeType: file.headers['content-type'],
      };
    }

    case STORAGE_MECHANISM_LOCAL_FILES: {
      await moveLocalUpload(file, fileHash);

      return {
        contentHash: fileHash,
        originalFilename: file.originalFilename,
        storedFile: fileStorePath,
        mimeType: file.headers['content-type'],
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
