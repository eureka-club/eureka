import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import useTranslation from 'next-translate/useTranslation';
import { useState,  FC } from 'react';
import { LOCALES } from '../../../constants';
import useCycleSumary from '@/src/useCycleSumary'
import UserAvatar from '../../common/UserAvatar';
import { Box, BoxProps, Card, CardContent, CardHeader, CardMedia, CardProps, Chip, Stack, Typography, TypographyProps } from '@mui/material';
import { StyledBadge } from '../../common/StyledBadge';
import Link from 'next/link';
import { JoinLeaveCycleBtn } from './JoinLeaveCycleBtn';
import { Size } from '@/src/types';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

export interface CycleMosaiItemProps extends BoxProps{
  cycleId:string|number;
  size?:Size
  hideHeader?:boolean;
  hideFooter?:boolean;
}
interface TruncateTextProps{
  countCharacters:number;
  text:string;
}
const TruncateTextRender=({truncated,original}:{truncated:string,original:string})=>{
  const[text,setText]=useState(truncated);
  const[toggle,settoggle]=useState(false);
  const ellipseOnClick=(e:any)=>{
    e.stopPropagation();
    const p=!toggle;
    settoggle(p);
    setText(p?original:truncated);
  }
  return <>
    {text?.toLocaleLowerCase().replace(/^\w|\s\w/g,c=>c.toUpperCase())}
    {
      // original.length!=truncated.length 
      //   ? <Button onClick={(e)=>ellipseOnClick(e)} sx={{color:'var(--eureka-grey-dark)',minWidth:'.3rem',fontSize:'1rem',margin:0,padding:0}} size='small'>
      //     {!toggle ? <MoreHorizOutlined /> : <MoreHorizOutlined color="primary" />}
      //   </Button> 
      //   : <></>

        original.length!=truncated.length 
        ? !toggle ? <em>...</em> : <em  color="primary">...</em> 
        : <></>
    }
  </>
}
const TruncateText:FC<TruncateTextProps>=({countCharacters,text})=>{
  if(!text)return <></>;
  if(text.length<=countCharacters){
    return <TruncateTextRender original={text} truncated={text}/>;
  }
  else{
    return <TruncateTextRender original={text} truncated={text.slice(0,countCharacters-3)}/>
    
  }
}
const CardHeaderTitle = ({creatorName}:{creatorName:string})=>{
  return <Typography>
    <TruncateText countCharacters={22} text={creatorName}/>
  </Typography>
}
interface CardTitleProps extends BoxProps{
  title:string;
}
const CardTitle:FC<CardTitleProps> = ({title,...others})=>{
  return <Box {...others}>
    <Typography variant='subtitle2' textAlign={'center'}>
      <TruncateText countCharacters={100} text={title}/>
    </Typography>
  </Box>
}

const MosaicItem:FC<CycleMosaiItemProps> = ({
  cycleId,
  size,
  hideFooter=false,
  hideHeader=false,
  ...others
})=>{
  const{t,lang}=useTranslation('common');
  const{data:cycle}=useCycleSumary(+cycleId);
  const img = `https://${process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${cycle?.localImages[0].storedFile}`; 

  const GetDatesRange = (a:any)=>`${dayjs(a?.startDate).format('YYYY-MM-DD')} - ${dayjs(a?.endDate).format('YYYY-MM-DD')}`
  const cycleAccessTypes = ['','public','private','secret','payment'];
  const cycleAccess = t(cycleAccessTypes[cycle?.access??0]);

  return <Box style={{cursor:'pointer'}} {...others}>
        <Link href={`/${lang}/cycle/${cycleId}`} >
          <Card sx={{minWidth:{xs:'248px',sm:'248px'},maxWidth:{sm:'250px'}}}>
            <style jsx global>{`
              .MuiCardHeader-root{
                padding:.3rem
              }
              .MuiCardHeader-subheader{
                font-size: .8rem;
              }
              .MuiCardHeader-avatar{
                margin-right:.5rem;
              }
            `}</style>
          {
            !hideHeader 
              ?<CardHeader
                avatar={
                <>
                    <UserAvatar size='small' userId={cycle?.creator.id!} />
                </>
                }
                action={
                  <StyledBadge/>
                }
                title={<CardHeaderTitle creatorName={cycle?.creator.name!}/>}
                // title={cycle?.creator.name}
                subheader={GetDatesRange(cycle)}
              />
              :<></>
          }
          <Box position={'relative'}>
            <CardMedia
              component={'img'}
              image={img}
              height={250}
              width={250}
            />
            {
              cycleAccess
                ? 
                <Chip 
                  label={
                    <span>
                        {cycleAccess}
                        <em> ({LOCALES[cycle?.languages!].toUpperCase()})</em>
                      </span>
                  } 
                  color="primary" sx={{position:'absolute',top:'8px',left:'8px',zIndex:999,boxShadow: '0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)'}
                  }
                />
                : <></>
            }
          </Box>
            {
              !hideFooter 
                ? <CardContent>
                    <CardTitle title={cycle?.title!} sx={{paddingBottom:2}}/>
                    <Stack>
                      {
                        <JoinLeaveCycleBtn cycleId={+cycleId} />
                      }
                    </Stack>
                  </CardContent>
                :<></>
            }
          
          </Card>
      </Link>
    </Box>;
  
}

export default MosaicItem;