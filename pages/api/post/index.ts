import crypto from 'crypto';
import fs, { existsSync, mkdirSync } from 'fs';
import { Form } from 'multiparty';
import moveFile from 'move-file';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import path from 'path';
import * as uuid from 'uuid';

import { Session } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import { getDbConnection } from '../../../src/lib/db';

type FileUpload = {
  fieldName: string;
  originalFilename: string;
  path: string;
  headers: Record<string, string>;
  size: number;
};

type PostProps = {
  workTitle: string[];
  workAuthor: string[];
  workLink?: string[];
  workType: string[];
  language: string[];
  hashtags: string[];
  description?: string[];
  isPublic: string[];
};

const { LOCAL_ASSETS_HOST_DIR } = process.env;
const DB_TABLE_LOCAL_IMAGE = 'local_image';
const DB_TABLE_POST = 'post';
const DB_TABLE_WORK = 'work';
const FOLDER_SPREAD_CHAR_COUNT = 2;

export const config = {
  api: {
    bodyParser: false,
  },
};

const getFileHash = (filePath: string, algorithm = 'sha1'): string => {
  const fileContent = fs.readFileSync(filePath);
  const sha1sum = crypto.createHash(algorithm);
  sha1sum.update(fileContent);

  return sha1sum.digest('hex');
};

const moveUploadedFileByHash = async (fileUpload: FileUpload, fileHash: string): Promise<string> => {
  const fileDestDir = path.join(LOCAL_ASSETS_HOST_DIR!, fileHash.substr(0, FOLDER_SPREAD_CHAR_COUNT));
  if (!existsSync(fileDestDir)) {
    mkdirSync(fileDestDir);
  }

  const fileDestPath = path.join(fileDestDir, fileHash + path.extname(fileUpload.path));
  console.info('Storing file upload under...', fileDestPath); // eslint-disable-line no-console
  await moveFile(fileUpload.path, fileDestPath);

  return fileDestPath;
};

const saveImageUploadToDB = async (
  imageUpload: FileUpload,
  imageDestPath: string,
  imageHash: string,
): Promise<string> => {
  const assetsPathPrefixClean = LOCAL_ASSETS_HOST_DIR!.replace('./', '');
  const cutLength = (assetsPathPrefixClean + path.delimiter).length;

  const connection = await getDbConnection();
  const table = connection(DB_TABLE_LOCAL_IMAGE);
  const pk = uuid.v4();
  await table.insert({
    id: pk,
    original_filename: imageUpload.originalFilename,
    stored_file: imageDestPath.substr(cutLength),
    mime_type: imageUpload.headers['content-type'],
    content_hash: imageHash,
  });

  return pk;
};

const getPostWork = async (postProps: PostProps): Promise<string> => {
  const connection = await getDbConnection();
  const table = connection(DB_TABLE_WORK);

  const existingWork = await table
    .where({
      title: postProps.workTitle[0].trim(),
      author: postProps.workAuthor[0].trim(),
      type: postProps.workType[0].trim(),
    })
    .first();
  if (existingWork != null) {
    return existingWork.id;
  }

  const pk = uuid.v4();
  await table.insert({
    id: pk,
    type: postProps.workType[0].trim(),
    title: postProps.workTitle[0].trim(),
    author: postProps.workAuthor[0].trim(),
    link: postProps.workLink != null ? postProps.workLink[0].trim() : null,
  });

  return pk;
};

const savePost = async (
  postProps: PostProps,
  localImageUuid: string,
  workUuid: string,
  creatorId: number,
): Promise<string> => {
  const connection = await getDbConnection();
  const table = connection(DB_TABLE_POST);

  const pk = uuid.v4();
  await table.insert({
    id: pk,
    creator_id: creatorId,
    local_image_id: localImageUuid,
    work_id: workUuid,
    language: postProps.language[0].trim(),
    content_text: postProps.description != null ? postProps.description[0].trim() : null,
    is_public: !!postProps.isPublic[0],
  });

  return pk;
};

const assignToCycle = async (postUuid: string, cycleId: string): Promise<void> => {
  const connection = await getDbConnection();
  const table = connection('cycle_post');

  await table.insert({
    cycle_id: cycleId,
    post_id: postUuid,
    is_cover: false,
  });
};

export default getApiHandler().post<NextApiRequest, NextApiResponse>(
  async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as Session;
    if (session == null) {
      res.status(401).end();
      return;
    }

    new Form().parse(req, async (err, fields, files) => {
      if (err != null) {
        console.error(err); // eslint-disable-line no-console
        res.status(500).json({ status: 'server error' });
        return;
      }
      if (files?.image == null) {
        res.status(422).json({ error: 'no image received' });
        return;
      }

      try {
        const imageUpload: FileUpload = files.image[0];
        const imageHash = getFileHash(imageUpload.path);
        const imageDestPath = await moveUploadedFileByHash(imageUpload, imageHash);
        const localImageDbRecordUuid = await saveImageUploadToDB(imageUpload, imageDestPath, imageHash);
        const workDbRecordUuid = await getPostWork(fields);
        const postUuid = await savePost(fields, localImageDbRecordUuid, workDbRecordUuid, session.user.id);

        if (fields.cycleId != null) {
          await assignToCycle(postUuid, fields.cycleId[0]);
        }

        res.json({ postUuid });
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        res.status(500).json({ status: 'server error' });
      }
    });
  },
);
