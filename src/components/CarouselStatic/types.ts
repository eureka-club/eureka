import { BoxProps } from '@mui/material';
import { MosaicItem, Size } from '../../types';

export interface GenericMosaicItemProps extends BoxProps{
    item: MosaicItem;
    showSocialInteraction?: boolean;
    cacheKey:string[];
    customMosaicStyle?: { [key: string]: string };
    size?: Size;
    userMosaicDetailed?:boolean
  }
