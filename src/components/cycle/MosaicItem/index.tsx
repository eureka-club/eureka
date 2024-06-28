import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import useTranslation from 'next-translate/useTranslation';
import { useState,  FC } from 'react';
import { QueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { Card, Spinner, Badge} from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { CgMediaLive } from 'react-icons/cg';
import { MdGroup } from 'react-icons/md';
import { DATE_FORMAT_SHORT, LOCALES } from '../../../constants';
import LocalImageComponent from '../../LocalImage';
import styles from './MosaicItem.module.css';
import useCycleSumary from '@/src/useCycleSumary'
import Avatar from '../../common/UserAvatar';
import { CycleSumary } from '@/src/types/cycle';
import CycleSocialInteraction from '../../common/CycleSocialInteraction';
import { JoinLeaveCycleBtn } from './JoinLeaveCycleBtn';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
interface Props {
  cycle?:CycleSumary;
  cycleId:number;
  showButtonLabels?: boolean;
  showShare?: boolean;
  showParticipants?: boolean;
  detailed?: boolean;
  cacheKey?: string[];
  showSocialInteraction?: boolean;
  showCreateEureka?: boolean;
  showSaveForLater?: boolean;
  showJoinOrLeaveButton?:boolean;
  showTrash?: boolean;
  imageLink?: boolean;
  size?: string;
  className?: string;
  linkToCycle?:boolean;
}


const MosaicItem: FC<Props> = ({
  cycle:cycleItem,
  showButtonLabels = false,
  detailed = true,
  showSocialInteraction = true,
  showParticipants = true,
  showCreateEureka,
  showSaveForLater,
  showJoinOrLeaveButton = true,
  cacheKey = undefined,
  showTrash = false,
  imageLink = false,
  size,
  className,
  cycleId,
  linkToCycle=true,
}) => {
  const {data:session,status} = useSession();
  const isLoadingSession = status === "loading"
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const {data:c} = useCycleSumary(cycleId
    // ,{enabled:!!cycleId && !cycleItem}
  )
  const cycle = cycleItem??c;
  const participants = cycle ? [...cycle?.participants!??[],cycle?.creator!] : [];
  
  // const{data:participants}=useCycleParticipants(cycle?.id!);
  // const isFetchingParticipants = useIsFetching(['USERS',JSON.stringify(whereCycleParticipants)])
  
  const { t } = useTranslation('common');
  
  const isActive = () => cycle ? dayjs().isBetween(cycle.startDate, cycle.endDate, null, '[]') : false;
  const qc = new QueryClient();

  

  


  // const showJoinButtonCycle = () => {
  //   const isLoading = isJoinCycleLoading || isLeaveCycleLoading;
  //   if (isLoading) return false;
  //   if (user) {
  //     if (isJoinCycleLoading) return false;
  //     if (user.id === cycle!.creator.id) return false;
  //   }
  //   return true;
  // };

  

  

  const getCycleAccesLbl = () => {
    let langLbl = `${cycle?.languages?.replaceAll(/\s/g,'').split(',').map(l=>LOCALES[l].toUpperCase()).join(', ')}`
    let res = '';
    if (cycle) {
      if (cycle.access === 1) res = t('public');
      if (cycle.access === 2) res = t('private');
      if (cycle.access === 3) res = t('secret');
      if (cycle.access === 4) res = t('payment');
    }
    return <span>{res} (<em>{langLbl}</em>)</span>;
  };

  const canNavigate = () => {
    return !loading;
  };
  const onImgClick = () => {
    if (canNavigate()) router.push(`/cycle/${cycle?.id}`);
    setLoading(true);
  }; 

  const renderLocalImageComponent = () => {
    const img = cycle?.localImages 
      ? <div className='img h-100 cursor-pointer'> 
      <LocalImageComponent className='cycle-img-card'  filePath={cycle?.localImages[0].storedFile} title={cycle?.title} alt={cycle?.title} />
      {detailed && (cycle && cycle.creator.id && cycle.startDate && cycle.endDate ) && (<div className={`d-flex flex-row justify-content-between  ${styles.date}`}>
                        <div  className={` d-flex flex-row aling-items-center fs-6`}>
                         <Avatar className='' width={26} height={26} userId={cycle.creator.id} showName={false} size="xs" />
                         <div className='d-flex align-items-center'>
                            {dayjs(cycle?.startDate).add(1, 'day').tz(dayjs.tz.guess()).format(DATE_FORMAT_SHORT)}
                          <span className='' style={{marginLeft:'1.5px',marginRight:'1.5px'}}>-</span>
                            {dayjs(cycle?.endDate).add(1, 'day').tz(dayjs.tz.guess()).format(DATE_FORMAT_SHORT)}
                         </div>                          
          </div>
       </div>)}
                          
      </div>
      : undefined;
    if (linkToCycle) {
      return (
        <div
          className={`${!loading ? 'cursor-pointer' : ''} mb-2`}
          onClick={onImgClick}
          role="presentation"
        >
          {!canNavigate() && <Spinner className="position-absolute top-50 start-50"  size="sm" animation="grow" variant="info" style={{zIndex:'1'}} />}
          {imageLink ? <a href={`/cycle/${cycle?.id}`}>{img}</a> : img}
        </div>
      );
    }
    return <div className={`mb-2`} role="presentation">{img}</div>;
     };


  
  

  if(!cycle)return <></>

  return (
     <Card className={`${size?.length ? `mosaic-${size}` : 'mosaic'} ${isActive() ? 'my-1 isActive' : ''} ${className}`} data-cy={`mosaic-item-cycle-${cycle.id}`} >
        <Card.Body>  
        <div className={`${linkToCycle ? 'cursor-pointer' : ''} ${styles.imageContainer}`} >
            {renderLocalImageComponent()}
            {isActive() && <CgMediaLive className={`${styles.isActiveCircle}`} />}
            <Badge bg="primary" className={`d-flex flex-row align-items-center  fw-normal fs-6 text-white rounded-pill px-2 ${styles.type}`}>
              {getCycleAccesLbl()}
               {showParticipants && (<div className={`ms-2 d-flex  flex-row`}><MdGroup className='text-white  d-flex align-items-start' style={{fontSize:'1.1em'}}/>
              <span className='text-white d-flex align-items-center' style={{fontSize:'.9em'}}>{`${participants?.length ||'...'}`}
            </span></div>)
          } 
            </Badge>
           <div className={`h-100 d-flex justify-content-center align-items-end`}>
            {
              participants?.length && showJoinOrLeaveButton && !(participants?.findIndex(p => p.id == session?.user.id) > -1 && cycle.access == 4) 
                ? <JoinLeaveCycleBtn cycleId={cycleId}/> 
                : <></>
              }
           </div> 
         </div>
                
      </Card.Body>    
         {showSocialInteraction && cycle && (
        <Card.Footer className={`${styles.footer}  d-flex justifify-content-between`}>
            <CycleSocialInteraction
              cacheKey={cacheKey||['CYCLE',cycle.id.toString()]}
              showButtonLabels={showButtonLabels}
              showRating={false}
              showCounts
              entity={cycle}
              showTrash={showTrash}
              showCreateEureka={showCreateEureka}
              showSaveForLater={showSaveForLater}
              className="w-100"
            />
         
        </Card.Footer>
         )}
     </Card>
  );
};

export default MosaicItem;
