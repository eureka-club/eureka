import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent,useState } from 'react';
import { AiOutlineEnvironment } from 'react-icons/ai';
import UserAvatar from '../common/UserAvatar';
import { UserSumary } from '@/src/types/UserSumary';
import useUserSumary from '@/src/useUserSumary';
import { Box, Card, Grid, Stack, StackProps, Typography } from '@mui/material';
import Link from 'next/link';
import slugify from 'slugify';
import { useRouter } from 'next/router';

interface Props {
  user?: UserSumary;
  userId?:number;

}
type Propss = StackProps &{
  user?: UserSumary;
  userId?:number;
}
const MosaicItem: FunctionComponent<Propss> = ({ user:user_,userId,...otherProps }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const{data}=useUserSumary(userId!,{enabled:!user_ && !!userId});
  const [user]=useState<UserSumary>(user_??data!);

  const getMediathequeSlug = (user:UserSumary)=>{
    if(user){
      const s =`${user.name}`
      const slug = `${slugify(s,{lower:true})}-${user.id}` 
      return slug
    }
    return ''
  }

  return  <Link href={`/mediatheque/${getMediathequeSlug(user)}`}>
            <Stack 
            direction={'row'} {...otherProps}
            gap={1}
            sx={{
              cursor:'pointer',
              padding:'.2rem',
            '&:hover':{
            border:'solid 1px var(--color-secondary)',
            borderRadius:'.3rem',
            boxShadow:'1px 1px 0px 2px rgba(243, 246, 249, 0.6)',
            background:'var(--color-secondary)',
            color:'white',            
            transition:'background 1s',
            }}}
            >
              <Box>{user ? <UserAvatar size='small' userId={user.id!} /> : <></>}</Box>
              <Stack>
                <Typography variant='body2'>{user?.name || 'unknown'}</Typography>
                  {
                    user?.countryOfOrigin 
                      ? 
                        <Typography variant='caption'>
                          <AiOutlineEnvironment /> {t(`countries:${user?.countryOfOrigin}`)}
                        </Typography>
                      : <></>
                  }
              </Stack>
            </Stack>
        </Link>
  // return <Grid container>
  //   <Grid item xs={3}>
  //       {user ? <UserAvatar width={42} height={42} user={user} showName={false} /> : <>2</>}
  //   </Grid>
  //   <Grid item xs={9}>
  //     <Stack direction={'column'}>
  //       <strong>{user?.name || 'unknown'}</strong>
  //       {
  //         user?.countryOfOrigin 
  //           ? 
  //             <em>
  //               <AiOutlineEnvironment /> {t(`countries:${user?.countryOfOrigin}`)}
  //             </em>
  //           : <></>
  //       }
  //     </Stack>
  //   </Grid>
  // </Grid>
};

export default MosaicItem;
