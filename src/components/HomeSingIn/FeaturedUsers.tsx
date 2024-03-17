import useFeaturedUsers from '@/src/useFeaturedUsers';
import MosaicItemUser from '@/components/user/MosaicItem';
import useTranslation from 'next-translate/useTranslation';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
// import { useMemo, useState } from 'react';
// import { BsChevronUp, BsChevronDown } from 'react-icons/bs';

const FeaturedUsers = () => {
  const { data: users } = useFeaturedUsers();
  const { t } = useTranslation('common');
  // const [showUsersSection, setShowUsersSection] = useState<boolean>(false)

  const Title = ()=> <Typography variant='h6' color={'secondary'}>{t('Featured users')}{' '}</Typography>;
  const Items = ()=> <Stack>
    {(users??[]).map((user) => (
        <MosaicItemUser padding={1}  key={user.id} user={user}
          sx={{'&:hover':{
            border:'solid 1px var(--color-secondary)',
            borderRadius:'.3rem',
            boxShadow:'1px 1px 0px 2px rgba(243, 246, 249, 0.6)',
            background:'var(--color-secondary)',
            color:'white',            
            transition:'background 1s',
          }}}
        />
    ))}
  </Stack>
  if (users && users.length) {
    return <>
        {/* <Box>
          <Box sx={{display:{xs:'block'}}}>
          {!showUsersSection && (
            <span
              className={`cursor-pointer d-flex d-lg-none ms-2`}
              role="presentation"
              onClick={() => setShowUsersSection(true)}
            >
              <BsChevronDown style={{ color: 'var(--color-secondary)' }} />
            </span>
          )}
          {showUsersSection && (
            <span
              className={`cursor-pointer d-flex d-lg-none ms-2`}
              role="presentation"
              onClick={() => setShowUsersSection(false)}
            >
              <BsChevronUp style={{ color: 'var(--color-secondary)' }} />
            </span>
          )}
          </Box>
        </Box> */}

        {/* {showUsersSection && (
          <Box sx={{display:{sm:'none'}}}>
            {users.map((user) => (
              <Box key={user.id}>
                <MosaicItemUser user={user} />
              </Box>
            ))}
          </Box>
        )} */}

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
