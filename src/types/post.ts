interface CreatePostClientPayloadBase {
  title: string;
  image: File;
  language: string;
  contentText: string | null;
  isPublic: boolean;
}
export interface CreatePostAboutCycleClientPayload extends CreatePostClientPayloadBase {
  selectedCycleId: number;
  selectedWorkId: null;
}
export interface CreatePostAboutWorkClientPayload extends CreatePostClientPayloadBase {
  selectedCycleId: number | null;
  selectedWorkId: number;
}

export interface CreatePostServerFields {
  selectedCycleId?: string[];
  selectedWorkId?: string[];
  title: string[];
  language: string[];
  contentText?: string[];
  isPublic: boolean[];
}

export interface CreatePostServerPayload {
  selectedCycleId?: number;
  selectedWorkId?: number;
  title: string;
  language: string;
  contentText?: string;
  isPublic: boolean;
}
