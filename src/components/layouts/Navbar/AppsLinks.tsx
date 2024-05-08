import { Avatar, Box, Button, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import MenuAction from "./MenuAction";
import useTranslation from "next-translate/useTranslation";
import { Apps } from "@mui/icons-material";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQueryClient } from "react-query";
import { setCookie } from 'nookies';
import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_TTL, WEBAPP_URL } from "@/src/constants";
import { ReactElement } from "react";
import slugify from 'slugify';
import { useSession } from "next-auth/react";


const CreateMenu = ()=>{
  const { t } = useTranslation('navbar');

  return <>
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
  </>
}
const AboutMenu = ()=>{
  const { t } = useTranslation('navbar');

  return <>
  <Typography variant="button">{t('About')}</Typography>
            <ul>
              <li><Link href={'/manifest'}>{t('Manifest')}</Link></li>
              <li><Link href={'/about'}>{t('About Eureka')}</Link></li>
              <li><Link href={'/aboutUs'}>{t('About Us')}</Link></li>
              <li><Link href={'/policy'}>{t('policyText')}</Link></li>
            </ul>
  </>
}
const LangsMenu = ()=>{
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
  return <>
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
  </>
}
const MediathequeMenu = ()=>{
  const { t } = useTranslation('navbar');
  const{data:session}=useSession();
  const getMediathequeSlug = () => {
    if (session?.user) {
        const u = session.user;
        const s = `${u.name}`;
        const slug = `${slugify(s, { lower: true })}-${u.id}`;
        return slug;
    }
    return '';
    };
  return <>
    <Typography variant="button">{t('My Mediatheque')}</Typography>
    <ul>
      <li><Link href={`/mediatheque/${getMediathequeSlug()}`}>{t('My Mediatheque')}</Link></li>
      <li><Link href={`/user/${getMediathequeSlug() }/my-read-or-watched`}>{t('MyReadOrWatched')}</Link></li>
    </ul>
  </>
}
export const TopicsMenu = () => {
  const { t } = useTranslation('navbar');

  return <>
      <Typography variant="caption" gutterBottom sx={{fontSize:16}}>
        {t('Topics')}
      </Typography>
      <ul>
        <li><Link href='/search?q=gender-feminisms'>{`${t(`topics:gender-feminisms`)}`}</Link></li>
        <li><Link href='/search?q=technology'>{`${t(`topics:technology`)}`}</Link></li>
        <li><Link href='/search?q=environment'>{`${t(`topics:environment`)}`}</Link></li>
        <li><Link href='/search?q=racism-discrimination'>{`${t(`topics:racism-discriminatiomn`)}`}</Link></li>
        <li><Link href='/search?q=wellness-sports'>{`${t('topics:wellness-sports')}`}</Link></li>
        <li><Link href='/search?q=social issues'>{`${t(`topics:social issues`)}`}</Link></li>
        <li><Link href='/search?q=politics-economics'>{`${t(`topics:politics-economics`)}`}</Link></li>
        <li><Link href='/search?q=philosophy'>{`${t(`topics:philosophy`)}`}</Link></li>
        <li><Link href='/search?q=migrants-refugees'>{`${t(`topics:migrants-refugees`)}`}</Link></li>
        <li><Link href='/search?q=introspection'>{`${t(`topics:introspection`)}`}</Link></li>
        <li><Link href='/search?q=sciences'>{`${t(`topics:sciences`)}`}</Link></li>
        <li><Link href='/search?q=arts-culture'>{`${t(`topics:arts-culture`)}`}</Link></li>
        <li><Link href='/search?q=history'>{`${t(`topics:history`)}`}</Link></li>
      </ul>
  </>
};
interface Props{
  children?:ReactElement|ReactElement[]
}
export const AppsLinks = ({children}:Props) => {

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
      <Stack direction={'row'}>
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
          ul li ul li {
            //list-style-image: url('/img/lightbulb_circle.svg');
            list-style-type:circle;
            padding-left:.6rem;
            margin-left:.3rem;
            &::marker {
              color:var(--color-primary);
            }
          }
          
          `}
        </style>
        <Box sx={{display:{sx:'inherit',md:'none'}}}>
          <ul>
            <li>
              <MediathequeMenu/>
            </li>
            <li>
              <TopicsMenu/>
            </li>
          </ul>
        </Box>
        <Box>
        
        <ul>
          {children?children:<></>}
          <li>
            <CreateMenu/>
          </li>
          <li>
            <AboutMenu/>
          </li>
          <li>
            <LangsMenu/>
          </li>
        </ul>
        </Box>
        
      </Stack>
    </MenuAction>;
  };