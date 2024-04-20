import { Stack } from "@mui/material";
import MenuAction from "./MenuAction";
import { RiDashboardLine } from "react-icons/ri";
import useTranslation from "next-translate/useTranslation";
import { useSession } from "next-auth/react";
import slugify from 'slugify';


export const MediathequeLinks = () => {
    const { t } = useTranslation('navbar');
    const{data:session}=useSession();

    const getMediathequeSlug = () => {
    if (session) {
        const u = session.user;
        const s = `${u.name}`;
        const slug = `${slugify(s, { lower: true })}-${u.id}`;
        return slug;
    }
    return '';
    };
    
    const mediathequeLinksInfo = [
        {label:t('My Mediatheque'),link:`/mediatheque/${getMediathequeSlug()}`},
        {label:t('MyReadOrWatched'),link:`/user/${getMediathequeSlug() }/my-read-or-watched`},
    ]
    return <MenuAction key='MediathequeLinks' items={mediathequeLinksInfo} label={
      <Stack justifyContent={'center'} alignItems={'center'}>
        <RiDashboardLine fontSize={'2rem'} />
        {/* <Typography variant="caption" gutterBottom>
          {t('My Mediatheque')}
        </Typography> */}
      </Stack>
    }
    title={t('My Mediatheque')}
    />;
  };