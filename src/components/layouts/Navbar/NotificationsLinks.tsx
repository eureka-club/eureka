import { Button, Stack, Typography } from "@mui/material";
import MenuAction from "./MenuAction";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { Person, Settings } from "@mui/icons-material";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

export const NotificationsLinks = () => {
    const { t } = useTranslation('navbar');

    const notificationLinksInfo = [
        {label:t('A'),link:'/a',icon:<Person />},
        {label:t('B'),link:'/b',icon:<Settings fontSize="small" />},
    ];
    return <MenuAction key='NotificationsLinks' items={notificationLinksInfo||[]} label={
      <Stack justifyContent={'center'} alignItems={'center'}>
        <IoNotificationsCircleOutline fontSize={'2rem'} />
      </Stack>
    }
    title={t('Account')}
    renderMenuItem={
      (i)=>{
          const baseCmp = ()=><Typography>{i.label}</Typography>;
          if(i.hasOwnProperty('link'))
            return <Link href={i['link']}>
              <Stack gap={3} direction={'row'}>
                {i.icon?i.icon:<></>} {baseCmp()}
              </Stack>
            </Link>
          else if(i.hasOwnProperty('onClick'))
            return <Button sx={{padding:0}} variant='text' size='small' onClick={()=>i['onClick'](i.label)}>
              <Stack gap={3} direction={'row'}>
                {i.icon?i.icon:<></>} {baseCmp()}
              </Stack>
            </Button>;
           return <></> 
      }
    }
    />;
  };