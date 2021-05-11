import crypto from 'crypto';
import fs, { existsSync, mkdirSync } from 'fs';
import moveFile from 'move-file';
import path from 'path';

import { FileUpload, StoredFileUpload } from '../types';

const { LOCAL_ASSETS_HOST_DIR } = process.env;
const { PUBLIC_ASSETS_STORAGE_MECHANISM } = process.env;
const HASHING_ALGO = 'sha256';
const FOLDER_SPREAD_CHAR_COUNT = 2;

const getFileHash = (filePath: string, algorithm = HASHING_ALGO): string => {
  const fileContent = fs.readFileSync(filePath);
  const sha1sum = crypto.createHash(algorithm);
  sha1sum.update(fileContent);

  return sha1sum.digest('hex');
};

const moveUploaded = async (fileUpload: FileUpload, fileHash: string): Promise<string> => {
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

  switch (PUBLIC_ASSETS_STORAGE_MECHANISM) {
    case 'local': {
      const fileDestPath = await moveUploaded(file, fileHash);
      const assetsPathPrefixClean = LOCAL_ASSETS_HOST_DIR!.replace('./', '');
      const cutLength = (assetsPathPrefixClean + path.delimiter).length;

      return {
        contentHash: fileHash,
        originalFilename: file.originalFilename,
        storedFile: fileDestPath.substr(cutLength),
        mimeType: file.headers['content-type'],
      };
    }

    default:
      throw new Error('Unknown PUBLIC_ASSETS_STORAGE_MECHANISM');
  }
};
