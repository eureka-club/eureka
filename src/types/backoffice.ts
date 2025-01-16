import { Prisma} from '@prisma/client';

export interface backOfficePayload {
  // SlideTitle1?: string;
  // SlideText1?: string;
  // SlideImage1?: string |null;
  // Image1?: File | null;
  // SlideTitle2?: string;
  // SlideText2?: string;
  // Image2?: File | null;
  // SlideImage2?:string |null;
  // SlideTitle3?: string;
  // SlideText3?: string;
  // SlideImage3?: string |null;
  // Image3?: File | null;
  // sliderImages:File
  CyclesExplorePage? :string;
  PostExplorePage?:string;
  FeaturedUsers?:string;
  FeaturedWorks?:string

}

type backOfficeModel = {
  include:{
    sliders:{select:{
      id:true,
      title:true,
      text:true,
      language:true,
      images:true,
      publishedFrom:true,
      publishedTo:true,
      url:true
    }}
    // sliders:{
    //   include:{
    //     images:{storedFile:true}
    //   }
    // }
    // sliderImages:{select:{storedFile:true,originalFilename:true}},
  }
};

export type backOfficeData = Prisma.BackOfficeSettingsGetPayload<backOfficeModel> & {
  type?: 'backOfficeSettings';
};