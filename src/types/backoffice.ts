import { Prisma} from '@prisma/client';
import { StdioNull } from 'child_process';

export interface backOfficePayload {
  SlideTitle1?: string;
  SlideText1?: string;
  SlideImage1?: string |null;
  Image1?: File | null;
  SlideTitle2?: string;
  SlideText2?: string;
  Image2?: File | null;
  SlideImage2?:string |null;
  SlideTitle3?: string;
  SlideText3?: string;
  SlideImage3?: string |null;
  Image3?: File | null;
  CyclesExplorePage? :string
  PostExplorePage?:string
}

type backOfficeModel = {
  select:{
    id: true,
    SlideTitle1: true,
    SlideText1: true,
    SlideImage1:true,
    SlideTitle2: true,
    SlideText2: true,
    SlideImage2:true,
    SlideTitle3: true,
    SlideText3: true,
    SlideImage3:true,
    CyclesExplorePage: true,
    PostExplorePage: true,
    sliderImages:{select:{storedFile:true,originalFilename:true}},
  }
};

export type backOfficeData = Prisma.BackOfficeSettingsGetPayload<backOfficeModel> & {
  type?: 'backOfficeSettings';
};