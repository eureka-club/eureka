import { useModalContext } from '@/src/hooks/useModal';
import { Box, Button, ButtonBase, ButtonProps, Popover, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { FC, useState } from 'react';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { useMutation, useQueryClient } from 'react-query';
import SignInForm from '../forms/SignInForm';
import useUserSumary from '@/src/useUserSumary';
import useWorkDetail from '@/src/useWorkDetail';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import { WEBAPP_URL } from '@/src/constants';
import work from 'pages/api/work';
import useWorkSumary from '@/src/useWorkSumary';
import { ShareOutlined, ShareRounded } from '@mui/icons-material';

interface SocialInteractionClientPayload {
    doCreate: boolean;
    //  ratingQty?: number;
}
interface RenderUIProps extends ButtonProps{
    handler:(e:any)=>void;
    active:boolean;
    workId:number;
} ;
const RenderUI:FC<RenderUIProps> = ({workId,handler,active,...others})=>{
    const{t}=useTranslation('common');
    const{data:work}=useWorkSumary(workId);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

  const open = Boolean(anchorEl);

    const shareUrl = `${WEBAPP_URL}/work/${workId}`;
    const shareTextDynamicPart = `${t('workShare')} ${`"${work?.title}"`}`;
    const shareText = `${shareTextDynamicPart}  ${t('complementShare')}`;


    return <Box position={'relative'}>
        <Button
            size='small'
            variant={open?'contained':'outlined'}
            color='primary'
            title={t('Share')}
            onClick={(e:any)=>{
                handler(e);
                setAnchorEl(e?.currentTarget!);
            }}
            startIcon={<ShareOutlined/>}
            {...others}
            style={{
                justifyContent:'flex-start'
            }}
        >
                <Typography variant='body2'>
                    {t('Share')}
                </Typography>
        </Button>
        <Popover 
            open={open} 
            onClose={handleClose}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            sx={{padding:'10rem'}}
        >
            <Stack gap={2} justifyContent={'flex-start'}>
                <TwitterShareButton style={{padding:'.5rem 0 0'}} windowWidth={800} windowHeight={600} url={shareUrl} title={shareText} via="eleurekaclub">
                    <TwitterIcon size={30} round />
                    {/* <Typography variant='body2'>
                        {` ${t('wayShare')} Twitter`}
                    </Typography>  */}
                </TwitterShareButton>
                <FacebookShareButton style={{padding:'0 .5rem 0'}} windowWidth={800} windowHeight={600} url={shareUrl} quote={shareText}>
                    <FacebookIcon size={30} round />
                    {/* <Typography variant='body2'>
                        {` ${t('wayShare')} Facebook`}
                    </Typography> */}
                </FacebookShareButton>
                <WhatsappShareButton
                    style={{padding:'0 .5rem .5rem'}}
                    windowWidth={800}
                    windowHeight={600}
                    url={shareUrl}
                    title={`${shareText} ${t('whatsappComplement')}`}
                >
                    <WhatsappIcon size={30} round />
                    {/* <Typography variant='body2'>
                        {` ${t('wayShare')} Whatsapp`}
                    </Typography> */}
                </WhatsappShareButton>
            </Stack>
        </Popover>
    </Box>
}

export const useShareWork = (workId:number)=>{
console.log('render useShareWork')
    const{data:session}=useSession();
    const{lang}=useTranslation();
    const {show} = useModalContext();
    const{data:work}=useWorkDetail(workId);

    const active = work?.favs.findIndex(f=>f.id==session?.user.id)!>=0;

    const openSignInModal = () => {
        show(<SignInForm />);
    };
    
    const ShareWork = ({...others}:ButtonProps)=>{
        const[isActive,setisActive]=useState(active);
        console.log('render ShareWork')
        
        const handleShareClick = (ev:any) => {
            if(!session)
                openSignInModal();
            else{
                ev.preventDefault();
                setisActive(p=>!p);
            }
        };
        return <RenderUI workId={workId} active={isActive} handler={handleShareClick} {...others} />
    }
    return {ShareWork};
}