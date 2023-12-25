import { MosaicItem } from '../../types';

export interface GenericMosaicItemProps{
    item: MosaicItem;
    showSocialInteraction?: boolean;
    cacheKey:string[];
    customMosaicStyle?: { [key: string]: string };
    size?: string;
    userMosaicDetailed?:boolean
  }
