import { Avatar, Button, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import MenuAction from "./MenuAction";
import useTranslation from "next-translate/useTranslation";
import { Apps } from "@mui/icons-material";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQueryClient } from "react-query";
import { setCookie } from 'nookies';
import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_TTL, WEBAPP_URL } from "@/src/constants";
import { ReactElement } from "react";

interface Props{
  children?:ReactElement|ReactElement[]
}
export const AppsLinks = ({children}:Props) => {
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

    return <MenuAction key='AppssLinks' label={
      <Stack justifyContent={'center'} alignItems={'center'} >
        <Avatar
          sx={{width:32,height:32,bgcolor:'var(--color-primary)'}} 
        >
          <Apps/>
        </Avatar>
      </Stack>
    }
     //title={t('Apps')}
    >
      <>
        <style jsx global>
          {`
          ul{
            margin:0;
            padding:0;
          }
          ul li{
            list-style:none;
            padding:0 .5rem 0 1rem
          }
          `}
        </style>
        <ul>
          {children?children:<></>}
          <li>
            <Typography variant="button">{t('create')}</Typography>
            <ul>
              <li>
                <Link href='/cycle/create'>{t('cycle')}</Link>
              </li>
              <li>
                <Link href='/post/create'>{t('post')}</Link>
              </li>
              <li>
                <Link href='/work/create'>{t('work')}</Link>
              </li>
            </ul>
          </li>
          <li>
            <Typography variant="button">{t('About')}</Typography>
            <ul>
              <li><Link href={'/manifest'}>{t('Manifest')}</Link></li>
              <li><Link href={'/about'}>{t('About Eureka')}</Link></li>
              <li><Link href={'/aboutUs'}>{t('About Us')}</Link></li>
              <li><Link href={'/policy'}>{t('policyText')}</Link></li>
            </ul>
          </li>
          <li>
            <Typography variant="button">{t('Language')}</Typography>
            <ul>
              <li>
                <Stack direction={'row'} gap={1}>
                {langsLinksInfo?.map(l=>
                  <IconButton key={l.label} sx={{width:25,minWidth:25}} onClick={()=>handleLanguageSelect(l.label)}>
                    <Avatar sx={{width:25,height:25,bgcolor:'var(--color-secondary)'}}>
                      <Typography color='white' variant="caption">{l.label}</Typography>
                    </Avatar>
                  </IconButton>
                )}
                </Stack>
              </li>
            </ul>
          </li>
        </ul>
      </>
    </MenuAction>;
  };