import { PostDbObject } from './models/Post';
import { CreatorDbObject } from './models/User';
import { CycleDbObject } from './models/Cycle';
import { LocalImageDbObject } from './models/LocalImage';
import { WorkDbObject } from './models/Work';

export interface User {
  id: number;
  name: string;
  email: string;
  image: string;
}
export interface Session {
  user: User;
  accessToken?: string;
  expires: string;
}

export interface CycleDetail extends CycleDbObject, CreatorDbObject {}

export interface PostDetail extends PostDbObject, CreatorDbObject, LocalImageDbObject, WorkDbObject, CycleDbObject {}

export interface WorkDetail extends WorkDbObject, PostDbObject, LocalImageDbObject {}

export type MosaicItem = PostDbObject & LocalImageDbObject & WorkDbObject & CycleDbObject;

export const isCycleCover = (object: MosaicItem): object is MosaicItem => object['cycle.is_cover'];
