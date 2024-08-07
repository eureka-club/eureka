import { Button, Spinner} from 'react-bootstrap';
import toast from 'react-hot-toast';
import useCycleSumary from "@/src/useCycleSumary";
import { useSession } from "next-auth/react";
import styles from './MosaicItem.module.css';
import { FC, MouseEvent } from "react"
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import {useJoinUserToCycleAction, useLeaveUserFromCycleAction} from '@/src/hooks/mutations/useCycleJoinOrLeaveActions'
import useUserSumary from '@/src/useUserSumary';
import { useCyclePrice } from '@/src/hooks/useCyclePrices';
import { useIsFetching } from 'react-query';
import SignInForm from '../../forms/SignInForm';
import { useModalContext } from '@/src/hooks/useModal';


interface Props{
    cycleId:number;
    size?:string;
}
export const JoinLeaveCycleBtn:FC<Props> = ({cycleId,size})=>{
    const { t } = useTranslation('common');
    const {data:session,status} = useSession();
    const isLoadingSession = status === "loading";
    const { data: user } = useUserSumary(session?.user.id!,{ enabled: !!session?.user.id });

    const router=useRouter();
    const {data:cycle} = useCycleSumary(cycleId);
    const {data:{price,currency}={currency:'',price:-1}} =  useCyclePrice(cycle);
    const participants = cycle ? [...cycle?.participants!??[],cycle?.creator!] : [];
    const isFetchingCycle = useIsFetching(['CYCLE',`${cycle?.id}`])
    const {show} = useModalContext();

    const {
        mutate: execLeaveCycle,
        isLoading: isLeaveCycleLoading,
        // isSuccess: isLeaveCycleSuccess,
      } = useLeaveUserFromCycleAction(user!,cycle!,participants!,(_data,error)=>{
        if(!error) {
          toast.success(t('OK'));
          if(router.query.join)
            router.push(`/cycle/${cycle?.id}`);
        }
        else
          toast.error(t('Internal Server Error'));
    });

    const handleLeaveCycleClick = (ev: MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault();
        
        if(cycle?.access==4){
          const res = confirm(t('abandoningPaidCycleWarning'));
          if(!res)return;
        }
        execLeaveCycle();
    }

    const {
        mutate: execJoinCycle,
        isLoading: isJoinCycleLoading,
        data: mutationResponse,
        // isSuccess: isJoinCycleSuccess,
      } = useJoinUserToCycleAction(user!,cycle!,participants!,(_data,error)=>{
        if(!error) {//para q no salgan dos toast al unirse a ciclo privado
          if (cycle && ![2,4].includes(cycle?.access))
            toast.success(t('OK'));
        }
        else
          toast.error(t('Internal Server Error'));
    });

    const handleJoinCycleClick = (ev: MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault();
        if (!session) {
          show(<SignInForm joinToCycle={cycle?.id} />)
        }
        else execJoinCycle();
    }

  const isPending = ()=> isLoadingSession || isFetchingCycle>0 || isJoinCycleLoading || isLeaveCycleLoading;

    
    if (cycle && !isLoadingSession ){

      if(cycle.creator.id == session?.user.id)
        return   <Button   variant="btn-warning border-warning bg-warning text-white fs-6 disabled"
         className={`rounded rounded-3  ${(size =='lg') ? styles.joinButtonContainerlg :styles.joinButtonContainer }`} size='sm'>
          <span className='fs-6'>{t('MyCycle')}</span> {/*MyCycle*/}
      </Button>

      if(participants && participants?.findIndex(p=>p.id==session?.user.id) > -1 )         
          return <Button  disabled={isPending()} onClick={handleLeaveCycleClick} variant="button border-primary bg-white text-primary" 
          className={`rounded rounded-3  ${(size =='lg') ? styles.joinButtonContainerlg :styles.joinButtonContainer }`} size='sm' >
           <span className='fs-6'>{t('common:leaveCycleLabel')}</span>
            </Button>

      if(cycle.currentUserJoinPending)
         return  <Button 
            disabled={true}
            className={`rounded rounded-2 text-white ${(size =='lg') ? styles.joinButtonContainerlg :styles.joinButtonContainer }`} 
            size='sm' >
            <span className='fs-6'>{t('joinCyclePending')}</span>
            </Button>

          return  <Button 
            disabled={isPending()}
            onClick={handleJoinCycleClick} className={`rounded rounded-3 text-white ${(size =='lg') ? styles.joinButtonContainerlg :styles.joinButtonContainer }`} 
            size='sm'>
              <span className='fs-6'>{t('joinCycleLabel')}</span> 
              
              {cycle.access==4 && price!=-1
                ? <span className="mx-1 fw-bolder">{`$${price} ${currency}`}</span>
                : <></>
              }
            </Button>           
    }
    else
    return <Button 
          disabled={true}
          className={`rounded rounded-3  text-white ${(size =='lg') ? styles.joinButtonContainerlg :styles.joinButtonContainer }`}>
            <Spinner size='sm' animation='grow'/>
          </Button>
  }