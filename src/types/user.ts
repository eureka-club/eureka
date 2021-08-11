import { Prisma } from '@prisma/client';

export interface EditUserClientPayload {
  name?: string;
  email?: string;
  image?: string;
  countryOfOrigin?: string | null;
  aboutMe?: string;
  dashboardType: number;
  tags?: string;
}

type UserFoolow = {
  include: {
    cycles: true;
    joinedCycles: true;
    likedCycles: true;
    favCycles: true;
    posts: true;
    likedWorks: true;
    favWorks: true;
    readOrWatchedWorks: true;
    following: true;
    followedBy: true;
  };
};

export type UserMosaicItem = Prisma.UserGetPayload<UserFoolow> & {
  type: string;
};

export type UserDetail = Prisma.UserGetPayload<{
  include: {
    cycles: true;
    joinedCycles: true;
    likedCycles: true;
    favCycles: true;
    posts: true;
    likedWorks: true;
    favWorks: true;
    readOrWatchedWorks: true;
    following: UserFoolow;
    followedBy: UserFoolow;
  };
}>;
