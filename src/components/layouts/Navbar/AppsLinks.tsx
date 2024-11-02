import { Avatar, Box, IconButton, ListItemText, MenuItem, MenuList, Stack, Typography } from "@mui/material";
import MenuAction from "./MenuAction";
import useTranslation from "next-translate/useTranslation";
import { Apps } from "@mui/icons-material";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQueryClient } from "react-query";
import { setCookie } from 'nookies';
import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_TTL, WEBAPP_URL } from "@/src/constants";
import slugify from 'slugify';
import { useSession } from "next-auth/react";

const CreateMenu = ()=>{
  const { t } = useTranslation('navbar');
  const{data:session}=useSession();

  return <>
    {
      session?.user 
        ? <MenuList>
              <Typography variant="button">{t('create')}</Typography>
              {
                session.user.roles.includes('admin')
                ? <MenuItem>
                    <Link href='/cycle/create'>{t('cycle')}</Link>
                  </MenuItem>
                : <></>
              }
              <MenuItem>
                <Link href='/post/create'>{t('post')}</Link>
              </MenuItem>
              <MenuItem>
                <Link href='/work/create'>{t('work')}</Link>
              </MenuItem>
            </MenuList>
        : <></>
    }
  </>
}
const AboutMenu = ()=>{
  const { t } = useTranslation('navbar');
  return  <MenuList>
        <Typography variant="button">{t('About')}</Typography>
        <MenuItem><Link href={'/manifest'}>{t('Manifest')}</Link></MenuItem>
        <MenuItem><Link href={'/about'}>{t('About Eureka')}</Link></MenuItem>
        <MenuItem><Link href={'/aboutUs'}>{t('About Us')}</Link></MenuItem>
        <MenuItem><Link href={'/policy'}>{t('policyText')}</Link></MenuItem>
    </MenuList>

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
  return <MenuList className="langsMenu">
        <Typography variant="button">{t('Language')}</Typography>
        <Stack direction={'row'}>
          {langsLinksInfo?.map(l=>
                <MenuItem key={l.label}>
                <ListItemText>
                    <IconButton key={l.label} onClick={()=>handleLanguageSelect(l.label)}>
                      <Avatar sx={{width:25,height:25,bgcolor:'var(--color-secondary)'}}>
                        <Typography color='white' variant="caption">{l.label}</Typography>
                      </Avatar>
                    </IconButton>
                </ListItemText>
                </MenuItem>
          )}
        </Stack>
    </MenuList>
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
    {
      session?.user
        ? 
          <MenuList>
            <Typography variant="button">{t('My Mediatheque')}</Typography>
            <MenuItem><Link href={`/mediatheque/${getMediathequeSlug()}`}>{t('My Mediatheque')}</Link></MenuItem>
            <MenuItem><Link href={`/user/${getMediathequeSlug() }/my-read-or-watched/books`}>{t('MyReadOrWatched')}</Link></MenuItem>
          </MenuList>
        :<></>
    }
  </>
}
export const TopicsMenu = () => {
  const { t } = useTranslation('navbar');
  return <MenuList>
        <Typography variant="caption" gutterBottom sx={{fontSize:16}}>
          {t('Topics')}
        </Typography>
        <MenuItem><Link href='/search?q=gender-feminisms'>{`${t(`topics:gender-feminisms`)}`}</Link></MenuItem>
        <MenuItem><Link href='/search?q=technology'>{`${t(`topics:technology`)}`}</Link></MenuItem>
        <MenuItem><Link href='/search?q=environment'>{`${t(`topics:environment`)}`}</Link></MenuItem>
        <MenuItem><Link href='/search?q=racism-discrimination'>{`${t(`topics:racism-discrimination`)}`}</Link></MenuItem>
        <MenuItem><Link href='/search?q=wellness-sports'>{`${t('topics:wellness-sports')}`}</Link></MenuItem>
        <MenuItem><Link href='/search?q=social issues'>{`${t(`topics:social issues`)}`}</Link></MenuItem>
        <MenuItem><Link href='/search?q=politics-economics'>{`${t(`topics:politics-economics`)}`}</Link></MenuItem>
        <MenuItem><Link href='/search?q=philosophy'>{`${t(`topics:philosophy`)}`}</Link></MenuItem>
        <MenuItem><Link href='/search?q=migrants-refugees'>{`${t(`topics:migrants-refugees`)}`}</Link></MenuItem>
        <MenuItem><Link href='/search?q=introspection'>{`${t(`topics:introspection`)}`}</Link></MenuItem>
        <MenuItem><Link href='/search?q=sciences'>{`${t(`topics:sciences`)}`}</Link></MenuItem>
        <MenuItem><Link href='/search?q=arts-culture'>{`${t(`topics:arts-culture`)}`}</Link></MenuItem>
        <MenuItem><Link href='/search?q=history'>{`${t(`topics:history`)}`}</Link></MenuItem>
</MenuList>
};
interface Props{
  // children?:ReactElement|ReactElement[]
}
export const AppsLinks = ({}:Props) => {

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
      <Stack direction={'column'}>
        <style jsx global>{`
          ul li{
            padding: 0 0 0 1rem;
            &:hover{
              background-color:transparent!important;
              cursor:inherit;
            }
          }
          ul li ul{
            width:100%;
          }
          ul li ul li{
            &:hover{
              background-color: rgba(0, 0, 0, 0.04)!important;
            }
          }
          ul li ul li a{
            display:block;
            width:100%;
          }
          ul.langsMenu li{
            padding:.1rem;
            list-style:none;
              &:hover{
                background-color: transparent !important;
              }
          }
        `}</style>
        <Box sx={{display:{sx:'inherit',md:'none'}}}>
          <MenuList>
            <MenuItem>
              <MediathequeMenu/>
            </MenuItem>
            <MenuItem>
              <TopicsMenu/>
            </MenuItem>
          </MenuList>
        </Box>
        <Box>
          <MenuList>
            <MenuItem>
              <CreateMenu/>
            </MenuItem>
            <MenuItem>
              <AboutMenu/>
            </MenuItem>
            <MenuItem>
              <LangsMenu/>
            </MenuItem>
          </MenuList>
        </Box>
      </Stack>
    </MenuAction>;
  };