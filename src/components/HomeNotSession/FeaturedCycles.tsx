import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { FC } from "react";
// import CarouselStatic from "../CarouselStatic";
import useInterestedCycles from '@/src/useInterestedCycles';
import Spinner from "../Spinner";
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from "@mui/material";
// import Image from "next/image";
// import LocalImage from "../LocalImage";

import Link from "next/link";
import { deepPurple } from "@mui/material/colors";

interface Props {
}

const FeaturedCycles:FC<Props> = ({}) => {
    const router = useRouter();
    const { t,lang } = useTranslation('common');
    const {data,isLoading} = useInterestedCycles();

    if(isLoading)return <Spinner/>
    if(!isLoading && !data?.cycles.length)return <></>;

    return <Box>
      <Stack direction={'row'} alignItems={'center'} gap={1}>
        <Avatar sx={{width:24,height:24,bgcolor: 'color-mix(in srgb, var(--color-secondary) 50%, transparent)' }}>🔥</Avatar>
        <Typography variant="h6" color={'secondary'}>{t('Interest cycles')}</Typography>
      </Stack>
      <List>
        {
          data?.cycles.map(c=><ListItem key={`featured-cycle-${c.id}`} sx={{
            margin:0,padding:'0 .5rem',cursor:'pointer',
            ':hover':{
              borderRadius:'4px',
              boxShadow:'0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
              background:'var(--color-secondary)',
              color:'white',
              '& p':{
                color:'lightgray',
              }
            }
            }}>
            {/* <ListItemAvatar>
              <Avatar>
                <LocalImage width={40} height={40} filePath={c.localImages[0].storedFile} alt={c.title}/>
              </Avatar>
            </ListItemAvatar> */}
            <Link href={`/${lang}/cycle/${c.id}`}>
              <ListItemText primary={c.title} secondary={c.creator.name}/>
            </Link>
          </ListItem>)
        }
        
      </List>
      </Box>

    // return (data?.cycles && data?.cycles.length) 
    // ? <div>      
    //    <CarouselStatic
    //     cacheKey={[`cycles-of-interest-${lang}`]}
    //     seeAll={data?.fetched<data.total}
    //     onSeeAll={()=>router.push('/featured-cycles')}
    //     data={data?.cycles}
    //     title={t('Interest cycles')}
    //   />
    //   </div>
    // : <></>;
  };

  export default FeaturedCycles