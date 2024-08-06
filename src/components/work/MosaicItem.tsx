const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT } = process.env;
const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;

import { LOCALES } from "@/src/constants";
import { Size } from "@/src/types";
import useWorkSumary from "@/src/useWorkSumary";
// import useTranslation from 'next-translate/useTranslation';
// import { FunctionComponent, useEffect, useState } from 'react';
// import { Card, Badge, Spinner } from 'react-bootstrap';
// import { useRouter } from 'next/router';
// import { CgMediaLive } from 'react-icons/cg';
// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// import isBetween from 'dayjs/plugin/isBetween';
// import LocalImageComponent from '../LocalImage';
// import styles from './MosaicItem.module.css';
// import { useCycleContext } from '../../useCycleContext';
// import { DATE_FORMAT_SHORT, LOCALES } from '../../constants';
// import useWork from '@/src/useWorkDetail';
// import { WorkDetail, WorkSumary } from '@/src/types/work';
// import useWorkSumary from '@/src/useWorkSumary';
// import WorkSocialInteraction from '../common/WorkSocialInteraction';

import { Badge, Box, BoxProps, Card, Chip, Link } from "@mui/material";
import { shadows } from '@mui/system';
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { FC } from "react";

// dayjs.extend(isBetween);
// dayjs.extend(utc);
// interface Props {
//   work?: WorkSumary;
//   workId: number;
//   showButtonLabels?: boolean;
//   showShare?: boolean;
//   showSocialInteraction?: boolean;
//   showCreateEureka?: boolean;
//   showSaveForLater?: boolean;
//   notLangRestrict?: boolean;
//   style?: { [k: string]: string };
//   cacheKey?: string[];
//   showTrash?: boolean;
//   linkToWork?: boolean;
//   imageLink?: boolean;
//   size?: string;
//   className?: string;
// }
// const MosaicItem: FunctionComponent<Props> = ({
//   work: workItem,
//   workId,
//   showButtonLabels = false,
//   showSocialInteraction = true,
//   showCreateEureka,
//   showSaveForLater,
//   notLangRestrict,
//   style = undefined,
//   cacheKey = undefined,
//   showTrash = false,
//   linkToWork = true,
//   imageLink = false,
//   size,
//   className = '',
// }) => {
//   const { t } = useTranslation('common');
//   const { cycle } = useCycleContext();
//   const [loading, setLoading] = useState<boolean>(false);
//   const router = useRouter();
//   const [work, setWork] = useState(workItem);
//   const { data } = useWorkSumary(workId
 
// );
//   useEffect(() => {
//     if (data && !workItem) setWork(data);
//   }, [data]);

//   if (!work) return <></>;
//   const { id, title, localImages, type } = work;

//   const isActive = () => {
//     if (cycle && cycle.cycleWorksDates) {
//       if (cycle.cycleWorksDates.length) {
//         const idx = cycle.cycleWorksDates.findIndex((cw) => cw.workId === work.id);
//         if (idx > -1) {
//           const cw = cycle.cycleWorksDates[idx];
//           if (cw.startDate && cw.endDate)
//             return dayjs().utc().isBetween(dayjs(cw.startDate), dayjs(cw.endDate), 'day', '[]');
//           if (cw.endDate) return dayjs().isBefore(cw.endDate);
//         }
//       }
//     }
//     return false;
//   };

//   const renderOngoinOrUpcomingDate = () => {
//     if (cycle && cycle.cycleWorksDates) {
//       if (cycle.cycleWorksDates.length) {
//         const idx = cycle.cycleWorksDates.findIndex((cw) => cw.workId === work.id);
//         if (idx > -1) {
//           const cw = cycle.cycleWorksDates[idx];
//           if (cw.endDate) {
//             const sd = cw.startDate ? dayjs(cw.startDate).utc().format(DATE_FORMAT_SHORT) : '-';
//             const ed = dayjs(cw.endDate).utc().format(DATE_FORMAT_SHORT);
//             const isPast = dayjs().isAfter(cw.endDate);
//             const res = () => {
//               const dateOut = (
//                 <span>
//                   <em style={{ fontSize: '.8em' }}>{`${sd} - ${ed}`}</em>
//                 </span>
//               );
//               const labelOut = (label: string) => <span className="d-block">{`${t(label)}`}</span>;
//               if (isActive())
//                 return (
//                   <>
//                     {labelOut('Ongoing')}
//                     {dateOut}
//                   </>
//                 );
//               if (!isPast)
//                 return (
//                   <>
//                     {labelOut('Upcoming')}
//                     {dateOut}
//                   </>
//                 );
//               return (
//                 <>
//                   {labelOut('Past')}
//                   {dateOut}
//                 </>
//               );
//             };
//             return (
//               <h6 className="d-block w-100 text-center mt-2 text-gray-dark position-absolute" style={{ top: '100%' }}>
//                 {res()}
//               </h6>
//             );
//           }
//         }
//       }
//     }
//     return <></>;
//   };

//   const canNavigate = () => {
//     return !loading;
//   };
//   const onImgClick = () => {
//     if (canNavigate()) router.push(`/work/${id}`);
//     setLoading(true);
//   };
//   const renderLocalImageComponent = () => {
//     const localePath = router.locale ? `${router.locale}/`:"";
//     const img = localImages ? (
//       <LocalImageComponent filePath={localImages[0].storedFile} title={title} alt={title} />
//     ) : undefined;
//     if (linkToWork) {
//       return (
//         <div
//           className={`${styles.imageContainer} ${!loading ? 'cursor-pointer' : ''}`}
//           onClick={onImgClick}
//           role="presentation"
//           style={style}
//         >
//           {!canNavigate() && (
//             <Spinner className="position-absolute top-50 start-50" size="sm" animation="grow" variant="info" />
//           )}
//           {imageLink ? <a href={`/${localePath}work/${id}`}>{img}</a> : img}
//         </div>
//       );
//     }
//     return img;
//   };
//   return (
//     <Card
//       className={`${size?.length ? `mosaic-${size}` : 'mosaic'} ${isActive() ? 'my-1 isActive' : ''} ${className}`}
//       data-cy={`mosaic-item-work-${id}`}
//     >
//       <div className={`${styles.imageContainer}`}>
//         {renderLocalImageComponent()}
//         {isActive() && <CgMediaLive className={`${styles.isActiveCircle}`} />}
        
//           <Badge bg="orange" className={`fw-normal fs-6 text-black px-2 rounded-pill ${styles.type}`}>
//             <span>
//               {type ? t(type) : '...'}
//               <em>
//                 {` (${work.language?LOCALES[work.language].toUpperCase():''})`}
//               </em>
//             </span>
//           </Badge>

//       </div>
//       {renderOngoinOrUpcomingDate()}
//       {showSocialInteraction && work && (
//         <Card.Footer className={`${styles.footer}  d-flex justify-content-end `}>
//           <WorkSocialInteraction
//             cacheKey={cacheKey || ['WORK', work.id.toString()]}
//             showButtonLabels={showButtonLabels}
//             showRating={false}
//             showCounts
//             entity={work}
//             showTrash={showTrash}
//             showSaveForLater={showSaveForLater}
//             showCreateEureka={showCreateEureka}
//             className="w-100"
//           />
//         </Card.Footer>
//       )}
//     </Card>
//   );
// };

// export default MosaicItem;
interface Props extends BoxProps{
  workId:number;
  size?:Size
}
const MosaicItem:FC<Props> = ({workId,...others})=>{
  const{data:work}=useWorkSumary(workId);
  const storedFile = work?.localImages?.length 
    ? work?.localImages[0].storedFile!
    : 'TODO';
  const {t,lang}=useTranslation('common');
  const href=`/${lang}/work/${workId}`;

  return <Box 
  sx={{
      'img':{
        height:'300px',
      }
    }}
    {...others}
    style={{
      position:'relative',
      
    }}
    >
    <Chip 
      label={<span>
        {work?.type ? t(work?.type) : '...'}
          <em>
            {` (${work?.language?LOCALES[work.language].toUpperCase():''})`}
          </em>
        </span>
      } 
      color="secondary" sx={{position:'absolute',top:'8px',left:'8px'}}
    />
    <Link href={href}>
      <img 
        className="work-mosaic-img"
        src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${storedFile}`}
        style={{
          border:'solid 1px lightgray',
          borderRadius:'4px',
          boxShadow:`0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)`
        }}
      />
    </Link>
  </Box>
}
export default MosaicItem
