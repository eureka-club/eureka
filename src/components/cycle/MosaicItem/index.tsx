import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import useTranslation from 'next-translate/useTranslation';
import { useState,  FC, ReactElement } from 'react';
import { QueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { CgMediaLive } from 'react-icons/cg';
import { MdGroup } from 'react-icons/md';
import { DATE_FORMAT_SHORT, LANGUAGES, LOCALES } from '../../../constants';
import LocalImageComponent from '../../LocalImage';
import styles from './MosaicItem.module.css';
import useCycleSumary from '@/src/useCycleSumary'
import UserAvatar from '../../common/UserAvatar';
import { CycleSumary } from '@/src/types/cycle';
import CycleSocialInteraction from '../../common/CycleSocialInteraction';
import { Box, BoxProps, Button, Card, CardContent, CardHeader, CardMedia, CardProps, Chip, Stack, Typography, TypographyProps } from '@mui/material';
import { StyledBadge } from '../../common/StyledBadge';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowCircleDown, ArrowLeftOutlined, ArrowLeftSharp, ChevronLeft, Expand, ExpandCircleDown, ExpandLess, ExpandLessRounded, ExpandRounded, MoreHorizOutlined, MoreVert, Visibility } from '@mui/icons-material';
import { JoinLeaveCycleBtn } from './JoinLeaveCycleBtn';
import { LocalImage } from '@prisma/client';
import { Size } from '@/src/types';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
// interface Props {
//   cycle?:CycleSumary;
//   cycleId:number;
//   showButtonLabels?: boolean;
//   showShare?: boolean;
//   showParticipants?: boolean;
//   detailed?: boolean;
//   cacheKey?: string[];
//   showSocialInteraction?: boolean;
//   showCreateEureka?: boolean;
//   showSaveForLater?: boolean;
//   showJoinOrLeaveButton?:boolean;
//   showTrash?: boolean;
//   imageLink?: boolean;
//   size?: string;
//   className?: string;
//   linkToCycle?:boolean;
// }


// const MosaicItem: FC<Props> = ({
//   cycle:cycleItem,
//   showButtonLabels = false,
//   detailed = true,
//   showSocialInteraction = true,
//   showParticipants = true,
//   showCreateEureka,
//   showSaveForLater,
//   showJoinOrLeaveButton = true,
//   cacheKey = undefined,
//   showTrash = false,
//   imageLink = false,
//   size,
//   className,
//   cycleId,
//   linkToCycle=true,
// }) => {
//   const {data:session,status} = useSession();
//   const isLoadingSession = status === "loading"
//   const [loading, setLoading] = useState<boolean>(false);
//   const router = useRouter();
//   const {data:c} = useCycleSumary(cycleId
//     // ,{enabled:!!cycleId && !cycleItem}
//   )
//   const cycle = cycleItem??c;
//   const participants = cycle ? [...cycle?.participants!??[],cycle?.creator!] : [];
  
//   // const{data:participants}=useCycleParticipants(cycle?.id!);
//   // const isFetchingParticipants = useIsFetching(['USERS',JSON.stringify(whereCycleParticipants)])
  
//   const { t } = useTranslation('common');
  
//   const isActive = () => cycle ? dayjs().isBetween(cycle.startDate, cycle.endDate, null, '[]') : false;
//   const qc = new QueryClient();

  

  


//   // const showJoinButtonCycle = () => {
//   //   const isLoading = isJoinCycleLoading || isLeaveCycleLoading;
//   //   if (isLoading) return false;
//   //   if (user) {
//   //     if (isJoinCycleLoading) return false;
//   //     if (user.id === cycle!.creator.id) return false;
//   //   }
//   //   return true;
//   // };

  

  

//   const getCycleAccesLbl = () => {
//     let langLbl = `${cycle?.languages?.replaceAll(/\s/g,'').split(',').map(l=>LOCALES[l].toUpperCase()).join(', ')}`
//     let res = '';
//     if (cycle) {
//       if (cycle.access === 1) res = t('public');
//       if (cycle.access === 2) res = t('private');
//       if (cycle.access === 3) res = t('secret');
//       if (cycle.access === 4) res = t('payment');
//     }
//     return <span>{res} (<em>{langLbl}</em>)</span>;
//   };

//   const canNavigate = () => {
//     return !loading;
//   };
//   const onImgClick = () => {
//     if (canNavigate()) router.push(`/cycle/${cycle?.id}`);
//     setLoading(true);
//   }; 

//   const renderLocalImageComponent = () => {
//     const img = cycle?.localImages 
//       ? <div className='img h-100 cursor-pointer'> 
//       <LocalImageComponent className='cycle-img-card'  filePath={cycle?.localImages[0].storedFile} title={cycle?.title} alt={cycle?.title} />
//       {detailed && (cycle && cycle.creator.id && cycle.startDate && cycle.endDate ) && (<div className={`d-flex flex-row justify-content-between  ${styles.date}`}>
//                         <div  className={` d-flex flex-row aling-items-center fs-6`}>
//                          <UserAvatar userId={cycle.creator.id} name={cycle.creator.name!} size="small" />
//                          <div className='d-flex align-items-center'>
//                             {dayjs(cycle?.startDate).add(1, 'day').tz(dayjs.tz.guess()).format(DATE_FORMAT_SHORT)}
//                           <span className='' style={{marginLeft:'1.5px',marginRight:'1.5px'}}>-</span>
//                             {dayjs(cycle?.endDate).add(1, 'day').tz(dayjs.tz.guess()).format(DATE_FORMAT_SHORT)}
//                          </div>                          
//           </div>
//        </div>)}
                          
//       </div>
//       : undefined;
//     if (linkToCycle) {
//       return (
//         <div
//           className={`${!loading ? 'cursor-pointer' : ''} mb-2`}
//           onClick={onImgClick}
//           role="presentation"
//         >
//           {!canNavigate() && <Spinner className="position-absolute top-50 start-50"  size="sm" animation="grow" variant="info" style={{zIndex:'1'}} />}
//           {imageLink ? <a href={`/cycle/${cycle?.id}`}>{img}</a> : img}
//         </div>
//       );
//     }
//     return <div className={`mb-2`} role="presentation">{img}</div>;
//      };


  
  

//   if(!cycle)return <></>

//   return (
//      <Card className={`${size?.length ? `mosaic-${size}` : 'mosaic'} ${isActive() ? 'my-1 isActive' : ''} ${className}`} data-cy={`mosaic-item-cycle-${cycle.id}`} >
//         <Card.Body>  
//         <div className={`${linkToCycle ? 'cursor-pointer' : ''} ${styles.imageContainer}`} >
//             {renderLocalImageComponent()}
//             {isActive() && <CgMediaLive className={`${styles.isActiveCircle}`} />}
//             <Badge bg="primary" className={`d-flex flex-row align-items-center  fw-normal fs-6 text-white rounded-pill px-2 ${styles.type}`}>
//               {getCycleAccesLbl()}
//                {showParticipants && (<div className={`ms-2 d-flex  flex-row`}><MdGroup className='text-white  d-flex align-items-start' style={{fontSize:'1.1em'}}/>
//               <span className='text-white d-flex align-items-center' style={{fontSize:'.9em'}}>{`${participants?.length ||'...'}`}
//             </span></div>)
//           } 
//             </Badge>
//            <div className={`h-100 d-flex justify-content-center align-items-end`}>
//             {
//               participants?.length && showJoinOrLeaveButton && !(participants?.findIndex(p => p.id == session?.user.id) > -1 && cycle.access == 4) 
//                 ? <JoinLeaveCycleBtn cycleId={cycleId}/> 
//                 : <></>
//               }
//            </div> 
//          </div>
                
//       </Card.Body>    
//          {showSocialInteraction && cycle && (
//         <Card.Footer className={`${styles.footer}  d-flex justifify-content-between`}>
//             <CycleSocialInteraction
//               cacheKey={cacheKey||['CYCLE',cycle.id.toString()]}
//               showButtonLabels={showButtonLabels}
//               showRating={false}
//               showCounts
//               entity={cycle}
//               showTrash={showTrash}
//               showCreateEureka={showCreateEureka}
//               showSaveForLater={showSaveForLater}
//               className="w-100"
//             />
         
//         </Card.Footer>
//          )}
//      </Card>
//   );
// };
export interface CycleMosaiItemProps extends BoxProps{
  cycleId:string|number;
  size?:Size
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
          <Card sx={{minWidth:{xs:'100%',sm:'248px'},maxWidth:{sm:'250px'}}}>
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
          <CardHeader
              avatar={
              <>
                  <UserAvatar size='small' name={cycle?.creator.name!} userId={cycle?.creator.id!} image={cycle?.creator.image!} photos={cycle?.creator.photos!}/>
              </>
              }
              action={
                <StyledBadge/>
              }
              title={<CardHeaderTitle creatorName={cycle?.creator.name!}/>}
              // title={cycle?.creator.name}
              subheader={GetDatesRange(cycle)}
          />
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
            <CardContent>
              {/* <Typography>
                {cycle?.title}
              </Typography> */}
              <CardTitle title={cycle?.title!} sx={{paddingBottom:2}}/>
              <Stack>
                {
                  <JoinLeaveCycleBtn cycleId={+cycleId} />
                }
              </Stack>
            </CardContent>
          
          </Card>
      </Link>
    </Box>;
  
}

export default MosaicItem;