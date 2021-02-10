import { User } from '@prisma/client';

import { CycleWithImage } from './types/cycle';
import { WorkWithImage } from './types/work';

export interface FileUpload {
  fieldName: string;
  originalFilename: string;
  path: string;
  headers: Record<string, string>;
  size: number;
}

export interface Session {
  accessToken?: string;
  expires: string;
  user: User;
}

export interface StoredFileUpload {
  contentHash: string;
  originalFilename: string;
  storedFile: string;
  mimeType: string;
}

/*
 * TS type guards
 */

export type MosaicItem = CycleWithImage | WorkWithImage;
export type SearchResult = CycleWithImage | WorkWithImage;

export const isCycle = (obj: MosaicItem | SearchResult): obj is CycleWithImage =>
  typeof (obj as CycleWithImage).title === 'string' &&
  typeof (obj as CycleWithImage).startDate === 'string' &&
  typeof (obj as CycleWithImage).endDate === 'string';
export const isWork = (obj: MosaicItem | SearchResult): obj is WorkWithImage =>
  typeof (obj as WorkWithImage).title === 'string' &&
  typeof (obj as WorkWithImage).author === 'string' &&
  typeof (obj as WorkWithImage).type === 'string';
