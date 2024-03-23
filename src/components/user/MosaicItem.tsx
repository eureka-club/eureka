import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent,useState } from 'react';
import { AiOutlineEnvironment } from 'react-icons/ai';
import UserAvatar from '../common/UserAvatar';
import { UserSumary } from '@/src/types/UserSumary';
import useUserSumary from '@/src/useUserSumary';
import { Box, Card, Grid, Stack, StackProps, Typography } from '@mui/material';

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
  const{data}=useUserSumary(userId!,{enabled:!user_ && !!userId});
  const [user]=useState<UserSumary>(user_??data!);

  return <Stack direction={'row'} {...otherProps}>
    <Box>{user ? <UserAvatar width={42} height={42} user={user} showName={false} /> : <>2</>}</Box>
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
