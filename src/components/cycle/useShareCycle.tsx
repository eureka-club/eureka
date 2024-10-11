import { useModalContext } from '@/src/hooks/useModal';
import { Box, Button, ButtonProps, Popover, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { FC, useState } from 'react';
import SignInForm from '../forms/SignInForm';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import { WEBAPP_URL } from '@/src/constants';
import { ShareOutlined } from '@mui/icons-material';
import useCycleDetail from '@/src/useCycleDetail';

interface RenderUIProps extends ButtonProps{
    handler:(e:any)=>void;
    active:boolean;
    cycleId:number;
} ;
const RenderUI:FC<RenderUIProps> = ({cycleId,handler,active,...others})=>{
    const{t}=useTranslation('common');
    const{data:cycle}=useCycleDetail(cycleId);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

  const open = Boolean(anchorEl);

    const shareUrl = `${WEBAPP_URL}/cycle/${cycleId}`;
    const shareTextDynamicPart = `${t('cycleShare')} ${`"${cycle?.title}"`}`;
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
                <Typography variant='body2' textTransform={'none'}>
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

export const useShareCycle = (cycleId:number)=>{
console.log('render useShareCycle')
    const{data:session}=useSession();
    const {show} = useModalContext();
    const{data:work}=useCycleDetail(cycleId);

    const active = work?.favs.findIndex(f=>f.id==session?.user.id)!>=0;

    const openSignInModal = () => {
        show(<SignInForm />);
    };
    
    const ShareCycle = ({...others}:ButtonProps)=>{
        const[isActive,setisActive]=useState(active);
        
        const handleShareClick = (ev:any) => {
            if(!session)
                openSignInModal();
            else{
                ev.preventDefault();
                setisActive(p=>!p);
            }
        };
        return <RenderUI cycleId={cycleId} active={isActive} handler={handleShareClick} {...others} />
    }
    return {ShareCycle};
}