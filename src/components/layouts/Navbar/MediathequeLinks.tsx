import { Stack, Typography } from "@mui/material";
import MenuAction from "./MenuAction";
import useTranslation from "next-translate/useTranslation";
import { useSession } from "next-auth/react";
import slugify from 'slugify';
// import { FaRegListAlt } from "react-icons/fa";

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
        {label:t('common:myPosts'),link:`/user/${getMediathequeSlug()}/my-posts`},
        {label:t('common:MyCycles'),link:`/user/${getMediathequeSlug()}/my-cycles`},
        {label:t('MyReadOrWatched'),link:`/user/${getMediathequeSlug() }/my-read-or-watched`},
    ]
    return <MenuAction key='MediathequeLinks' items={mediathequeLinksInfo} label={
      <Stack justifyContent={'center'} alignItems={'center'} paddingTop={1}>
        
        <Typography variant="caption"  gutterBottom sx={{fontSize:16,textWrap:'nowrap'}}>
          {t('My Mediatheque')}
        </Typography>
      </Stack>
    }
    //title={t('My Mediatheque')}
    />;
  };