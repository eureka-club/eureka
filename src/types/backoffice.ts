import { Prisma} from '@prisma/client';

export interface backOfficePayload {
  SlideImage1?: File | null;
  SlideTitle1?: string;
  SlideText1?: string;
  SlideImage2?: File | null;
  SlideTitle2?: string;
  SlideText2?: string;
  SlideImage3?: File | null;
  SlideTitle3?: string;
  SlideText3?: string;
  CyclesExplorePage? :string
  PostExplorePage?:string
}

type backOfficeModel = {
  select:{
    id: true,
    SlideTitle1: true,
    SlideText1: true,
    SlideTitle2: true,
    SlideText2: true,
    SlideTitle3: true,
    SlideText3: true,
    CyclesExplorePage: true,
    PostExplorePage: true,
    sliderImages:{select:{storedFile:true}},
  }
};

export type backOfficeData = Prisma.BackOfficeSettingsGetPayload<backOfficeModel> & {
  type?: 'backOfficeSettings';
};