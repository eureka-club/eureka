import { useModalContext } from '@/src/hooks/useModal';
import { Box, Button, ButtonBase, ButtonProps, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { FC, useState } from 'react';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { useMutation, useQueryClient } from 'react-query';
import SignInForm from '../forms/SignInForm';
import useUserSumary from '@/src/useUserSumary';
import useWorkDetail from '@/src/useWorkDetail';

interface SocialInteractionClientPayload {
    doCreate: boolean;
    // ratingQty?: number;
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
        <Typography variant='body2'>
            {t('Save for later')}
        </Typography>
    </Button>
}

export const useSaveWorkForLater = (workId:number)=>{
console.log('render useSaveWorkForLater')

    const queryClient = useQueryClient();
    const{data:session}=useSession();
    const{lang}=useTranslation();
    const {show} = useModalContext();
    const{data:work}=useWorkDetail(workId);

    const active = work?.favs.findIndex(f=>f.id==session?.user.id)!>=0;

    const {
        mutate: execSocialInteraction,
        isSuccess,
        isLoading,
        isError
      } = useMutation(
        async ({doCreate}: SocialInteractionClientPayload) => {
            const res = await fetch(`/api/work/${workId}/fav?lang=${lang}`, {
              method: doCreate ? 'POST' : 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                // qty: ratingQty,
                doCreate,
              }),
            });
            return res.json();
        },
        {
          onSettled: (_, error, __, context) => {
            queryClient.invalidateQueries(['USER', `${session?.user.id}`]);
            queryClient.invalidateQueries(['WORK',`${workId}`]);
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