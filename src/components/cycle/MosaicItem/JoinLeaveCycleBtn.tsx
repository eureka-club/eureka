import toast from 'react-hot-toast';
import useCycleSumary from "@/src/useCycleSumary";
import { useSession } from "next-auth/react";
import { FC, MouseEvent } from "react"
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import {useJoinUserToCycleAction, useLeaveUserFromCycleAction} from '@/src/hooks/mutations/useCycleJoinOrLeaveActions'
import useUserSumary from '@/src/useUserSumary';
import { useCyclePrice } from '@/src/hooks/useCyclePrices';
import { useIsFetching } from 'react-query';
import SignInForm from '../../forms/SignInForm';
import { useModalContext } from '@/src/hooks/useModal';
import { Button, ButtonBaseProps, CircularProgress, Stack } from '@mui/material';
import Spinner from '../../Spinner';

interface Props extends ButtonBaseProps{
    cycleId:number;
    size?:string;
    label?:string;
    
} 
export const JoinLeaveCycleBtn = ({cycleId,size,label,...others}:Props)=>{
    const { t } = useTranslation('common');
    const {sx}=others
    const {data:session,status} = useSession();
    const isLoadingSession = status === "loading";
    const { data: user } = useUserSumary(session?.user.id!,{ enabled: !!session?.user.id });

    const router=useRouter();
    const {data:cycle} = useCycleSumary(cycleId);
    const {data:{price,currency}={currency:'',price:-1}} =  useCyclePrice(cycle);
    const isFetchingCycle = useIsFetching(['CYCLE',`${cycle?.id}`])
    const {show} = useModalContext();

    const {
        mutate: execLeaveCycle,
        isLoading: isLeaveCycleLoading,
        // isSuccess: isLeaveCycleSuccess,
      } = useLeaveUserFromCycleAction(user!,cycle!,(_data,error)=>{
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
        try{
          execLeaveCycle();

        }
        catch(e){}
        finally{

        }
    }

    const {
        mutate: execJoinCycle,
        isLoading: isJoinCycleLoading,
        data: mutationResponse,
        // isSuccess: isJoinCycleSuccess,
      } = useJoinUserToCycleAction(user!,cycle!,(_data,error)=>{
        if(!error) {//para q no salgan dos toast al unirse a Club privado
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
    if(!session){
      if(cycle.access==4 && price!=-1){
        return <Button sx={sx} variant='contained' onClick={(e)=>{
          e.preventDefault();
          router.push(`/${router.locale}/payment-options/${cycleId}`)
        }}>
          <>
            {label??t('joinCycleLabel')}
            <span className="mx-1 fw-bolder">{`$${price} ${currency}`}</span>
          </>
        </Button>;
        // return <BuyButton
        //   cycleId={cycle.id}
        //   label={
        //     <>
        //       {t('joinCycleLabel')}
        //       <span className="mx-1 fw-bolder">{`$${price} ${currency}`}</span>
        //     </>
        //   }
        // />
      }
      return <Button sx={sx} disabled={isPending()} variant='contained' onClick={handleJoinCycleClick}>
          {label??t('joinCycleLabel')}
          {/* {
            cycle.access==4 && price!=-1
              ? <span className="mx-1 fw-bolder">{`$${price} ${currency}`}</span>
              : <></>
          } */}
        </Button>
    }

    if(cycle.creator.id == session?.user.id){
      return <Button sx={sx}  variant='contained' color='secondary'>{label??t('MyCycle')}</Button>
      //   return   <Button sx={sx}   variant="btn-warning border-warning bg-warning text-white fs-6 disabled"
      //    className={`rounded rounded-3  ${(size =='lg') ? styles.joinButtonContainerlg :styles.joinButtonContainer }`} size='sm'>
      //     <span className='fs-6'>{t('MyCycle')}</span> {/*MyCycle*/}
      // </Button>
    }

    if(cycle?.participants.findIndex(p=>p.id==session?.user.id)>=0){
      return <Button sx={sx} variant='outlined' disabled={isPending()} onClick={handleLeaveCycleClick}>{label??t('common:leaveCycleLabel')}</Button>     
        // return <Button sx={sx}  disabled={isPending()} onClick={handleLeaveCycleClick} variant="button border-primary bg-white text-primary" 
        // className={`rounded rounded-3  ${(size =='lg') ? styles.joinButtonContainerlg :styles.joinButtonContainer }`} size='sm' >
        //  <span className='fs-6'>{t('common:leaveCycleLabel')}</span>
        //   </Button>
    }
    
    if(cycle?.participants.findIndex(p=>p.id==session?.user.id)<0){
      if(cycle.access==4 && price!=-1){
        return <Button sx={sx} variant='contained' onClick={(e)=>{
          e.preventDefault();
          router.push(`/${router.locale}/payment-options/${cycleId}`)
        }}>
          <>
            {label??t('joinCycleLabel')}
            <span className="mx-1 fw-bolder">{`$${price} ${currency}`}</span>
          </>
        </Button>;
        // return <BuyButton
        //   cycleId={cycle.id}
        //   label={
        //     <>
        //       {t('joinCycleLabel')}
        //       <span className="mx-1 fw-bolder">{`$${price} ${currency}`}</span>
        //     </>
        //   }
        // />
      }
      return <Button sx={sx} disabled={isPending()} variant='contained' onClick={handleJoinCycleClick}>
        <Stack gap={1} direction={'row'} alignItems={'center'}>
          {isPending() ? <CircularProgress color="inherit" size={'1rem'}/> : <></>}
          {label??t('joinCycleLabel')}
          {/* {
            cycle.access==4 && price!=-1
              ? <span className="mx-1 fw-bolder">{`$${price} ${currency}`}</span>
              : <></>
          } */}
        </Stack>
        </Button>
    }

    if(cycle?.usersJoined.findIndex(u=>u.userId==session?.user.id&&u.pending)){
      return <Button sx={sx} disabled={true}>{label??t('joinCyclePending')}</Button>
      //  return  <Button sx={sx} 
      //     disabled={true}
      //     className={`rounded rounded-2 text-white ${(size =='lg') ? styles.joinButtonContainerlg :styles.joinButtonContainer }`} 
      //     size='sm' >
      //     <span className='fs-6'>{t('joinCyclePending')}</span>
      //     </Button>
    }
                
  }
  return <Button sx={sx}><Spinner/></Button>
}