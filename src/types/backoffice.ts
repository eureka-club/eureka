import { Prisma} from '@prisma/client';

export interface backOfficePayload {
  SlideImage1: File | null;
  SlideTitle1?: string;
  SlideText1?: string;
  SlideImage2: File | null;
  SlideTitle2?: string;
  SlideText2?: string;
  SlideImage3: File | null;
  SlideTitle3?: string;
  SlideText3?: string;
  CyclesExplorePage? :string
  PostExplorePage?:string
}