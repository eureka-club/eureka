import { useModalContext } from '@/src/hooks/useModal';
import { Button, ButtonProps, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { FC, useState } from 'react';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { useMutation, useQueryClient } from 'react-query';
import SignInForm from '../forms/SignInForm';
import useCycleDetail from '@/src/useCycleDetail';

interface SocialInteractionClientPayload {
    doCreate: boolean;
}
interface RenderUIProps extends ButtonProps{
    handler:(e:any)=>void;
    disabled:boolean;
    active:boolean;
} ;
const RenderUI:FC<RenderUIProps> = ({handler,disabled,active,...others})=>{
    const{t}=useTranslation('common');

    return <Button
        size='small'
        variant={active?'contained':'outlined'}
        color='primary'
        title={t('Save for later')}
        onClick={handler}
        disabled={disabled}
        startIcon={
            active 
                ? <BsBookmarkFill/> 
                : <BsBookmark />
        }
        {...others}
        style={{
            justifyContent:'flex-start'
        }}
    >
        <Typography variant='body2' textTransform={'none'}>
            {t('Save for later')}
        </Typography>
    </Button>
}

export const useSaveCycleForLater = (cycleId:number)=>{

    const queryClient = useQueryClient();
    const{data:session}=useSession();
    const{lang}=useTranslation();
    const {show} = useModalContext();
    const{data:cycle}=useCycleDetail(cycleId);

    const active = cycle?.favs.findIndex(f=>f.id==session?.user.id)!>=0;

    const {
        mutate: execSocialInteraction,
        isSuccess,
        isLoading,
        isError
      } = useMutation(
        async ({doCreate}: SocialInteractionClientPayload) => {
            const res = await fetch(`/api/cycle/${cycleId}/fav?lang=${lang}`, {
              method: doCreate ? 'POST' : 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                doCreate,
              }),
            });
            return res.json();
        },
        {
          onSettled: (_, error, __, context) => {
            queryClient.invalidateQueries(['USER', `${session?.user.id}`]);
            queryClient.invalidateQueries(['CYCLE',`${cycleId}`]);
          },
        },
      );
    
    const openSignInModal = () => {
        show(<SignInForm />);
    };
    
    const SaveForLater = ({...others}:ButtonProps)=>{
        const[isActive,setisActive]=useState(active);
        console.log('render SaveForLater')
        
        const handleFavClick = (ev:any) => {
            if(!session)
                openSignInModal();
            else{
                ev.preventDefault();
                execSocialInteraction({ doCreate: !isActive });
                if(!isError)
                setisActive(p=>!p);
            }
        };
        return <RenderUI active={isActive} handler={handleFavClick} disabled={isLoading} {...others} />
      }
      return {SaveForLater};
}