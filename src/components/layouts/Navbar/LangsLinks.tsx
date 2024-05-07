import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import MenuAction from "./MenuAction";
import { Badge, Button, Stack, Typography } from "@mui/material";
import { Language } from "@mui/icons-material";
import styles from './Navbar.module.css';
import { useQueryClient } from "react-query";
import { setCookie } from 'nookies';
import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_TTL, WEBAPP_URL } from '@/src/constants';

export const LangsLinks = () => {
    const { t } = useTranslation('navbar');
    const router=useRouter();
    const queryClient=useQueryClient();
    
    const langsLinksInfo = router?.locales?.map(l=>({
        label:l,
    }));

    const handleLanguageSelect = (locale: string | null) => {
        if (locale != null) {
            queryClient.clear();
            setCookie(null, LOCALE_COOKIE_NAME, locale, {
            maxAge: LOCALE_COOKIE_TTL,
            path: '/',
            });
            window.location.replace(`${WEBAPP_URL}/${locale}${router.asPath}`);
        }
        };
    return <MenuAction key='LangsLinks' items={langsLinksInfo||[]} label={
      <Stack justifyContent={'center'} alignItems={'center'}>
        <Badge badgeContent={router.locale} color="secondary">
          <Language sx={{fontSize:'2rem'}}/>
        </Badge>
        {<Typography variant="caption" gutterBottom>
          {t('Language')}
        </Typography> }
      </Stack>
    }
    //title={t('Language')}
    renderMenuItem={
      (i)=>{
        return <Button sx={{padding:0}} variant='text' size='small' onClick={()=>handleLanguageSelect(i.label)}>
          <Typography className={styles.langLinkInfo}>{i.label?.toUpperCase()}</Typography>
        </Button>;
      }
    }
    />;
  };