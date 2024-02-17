import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent,useState } from 'react';
import { AiOutlineEnvironment } from 'react-icons/ai';
import UserAvatar from '../common/UserAvatar';
import { UserSumary } from '../../types/user';
import useUserSumary from '@/src/useUserSumary';
import { Grid, Stack } from '@mui/material';

interface Props {
  user?: UserSumary;
  userId?:number;
}

const MosaicItem: FunctionComponent<Props> = ({ user:user_,userId }) => {
  const { t } = useTranslation('common');
  const{data}=useUserSumary(userId!,{enabled:!user_ && !!userId});
  const [user]=useState<UserSumary>(user_??data!);

  return <Grid container>
    <Grid item xs={3}>
        {user ? <UserAvatar width={42} height={42} user={user} showName={false} /> : <>2</>}
    </Grid>
    <Grid item xs={9}>
      <Stack direction={'column'}>
        <strong>{user?.name || 'unknown'}</strong>
        {
          user?.countryOfOrigin 
            ? 
              <em>
                <AiOutlineEnvironment /> {t(`countries:${user?.countryOfOrigin}`)}
              </em>
            : <></>
        }
      </Stack>
    </Grid>
  </Grid>
};

export default MosaicItem;
