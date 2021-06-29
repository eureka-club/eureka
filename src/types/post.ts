import { LocalImage, Post, Prisma } from '@prisma/client';

export interface PostWithImages extends Post {
  localImages: LocalImage[];
  // type: string;
}

export type PostMosaicItem = Prisma.PostGetPayload<{
  include: {
    creator: true;
    localImages: true;
    works: true;
    likes: true;
    favs: true;
  };
}>;

export type PostDetail = Prisma.PostGetPayload<{
  include: {
    creator: true;
    localImages: true;
    cycles: { include: { localImages: true } };
    likes: true;
    favs: true;
  };
}>;

export type PostWithCyclesWorks = Prisma.PostGetPayload<{
  include: {
    cycles: true;
    works: true;
  };
}>;

interface CreatePostClientPayloadBase {
  title: string;
  image: File;
  language: string;
  contentText: string;
  isPublic: boolean;
  topics?: string;
}
export interface CreatePostAboutCycleClientPayload extends CreatePostClientPayloadBase {
  selectedCycleId: number;
  selectedWorkId: null;
}

export interface EditPostAboutCycleClientPayload {
  id: string;
  title?: string;
  image?: File;
  language?: string;
  contentText?: string;
  isPublic?: boolean;
  selectedCycleId?: number;
  selectedWorkId?: null;
  topics?: string;
}
export interface CreatePostAboutWorkClientPayload extends CreatePostClientPayloadBase {
  selectedCycleId: number | null;
  selectedWorkId: number;
}

export interface EditPostAboutWorkClientPayload {
  id: string;
  title?: string;
  image?: File;
  language?: string;
  contentText?: string;
  isPublic?: boolean;
  selectedCycleId?: number | null;
  selectedWorkId?: number;
  topics?: string;
}

export interface CreatePostServerFields {
  selectedCycleId?: string[];
  selectedWorkId?: string[];
  title: string[];
  language: string[];
  contentText: string[];
  isPublic: boolean[];
  topics?: string;
}

export interface EditPostServerFields {
  id: string;
  selectedCycleId?: string[];
  selectedWorkId?: string[];
  title?: string[];
  language?: string[];
  contentText?: string[];
  isPublic?: boolean[];
  topics?: string;
}

export interface CreatePostServerPayload {
  selectedCycleId?: number;
  selectedWorkId?: number;
  title: string;
  language: string;
  contentText: string;
  isPublic: boolean;
  topics?: string;
}

export interface EditPostServerPayload {
  id: string;
  selectedCycleId?: number;
  selectedWorkId?: number;
  title?: string;
  language?: string;
  contentText?: string;
  isPublic?: boolean;
  topics?: string;
}
