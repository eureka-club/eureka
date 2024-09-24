import useFeaturedUsers from '@/src/useFeaturedUsers';
import MosaicItemUser from '@/components/user/MosaicItem';
import useTranslation from 'next-translate/useTranslation';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';

const FeaturedUsers = () => {
  const { data: users } = useFeaturedUsers();
  const { t } = useTranslation('common');

  const Title = ()=> <Typography variant='h6' color={'secondary'}>{t('Featured users')}{' '}</Typography>;
  const Items = ()=> <Stack>
    {(users??[]).map((user) => (
        <MosaicItemUser padding={1}  key={user.id} user={user}/>
    ))}
  </Stack>
  if (users && users.length) {
    return <>

        {/* Descktops */}
        <Box sx={{display:{xs:'none',md:'block'}}}>
          {Title()}
          {Items()}
        </Box>
        {/* Mobiles */}
        <Box sx={{display:{md:'none'}}}>
          <Accordion elevation={1}>
            <AccordionSummary expandIcon={<ExpandMore color='secondary' />} color='secondary'>
              {Title()}
            </AccordionSummary>
            <AccordionDetails>
              {Items()}
            </AccordionDetails>
          </Accordion>
        </Box>
        {/* <Stack gap={{xs:2,md:1}} direction={{xs:'row',md:'column'}} flexWrap={'wrap'}>
            {users.map((user) => (
              <Stack key={user.id}>
                <MosaicItemUser  user={user} />
              </Stack>
            ))}
        </Stack> */}
      </>
  } else return <></>;
};
export default FeaturedUsers;
