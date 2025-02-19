import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';
import { MediathequeLinks } from './MediathequeLinks';
import { TopicsLinks } from './TopicsLinks';
import SearchInput from '../../SearchInput';
import { SessionLinks } from './SessionLinks';
import { NotificationsLinks } from './NotificationsLinks';
import { Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { SearchInputLink } from './SearchInputLink';
import { AppsLinks } from './AppsLinks';

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: 'white', boxShadow: 'none', color: 'black', borderBottom: 'solid 1px var(--color-primary)' }}>
        <Toolbar>
          <Link href="/" replace>
            <a>
              <Stack direction={'row'} gap={2} >
                <img className="eurekaLogo" src="/logo.svg" alt="Project logo" />
                <Stack sx={{ display: { xs: 'none', lg: 'inherit' } }} alignItems={'center'} justifyContent={'center'}>
                  <Typography variant='h5' sx={{
                    fontFamily: 'Calibri Light', fontWeight: 500, lineHeight: '1rem'
                  }} color='secondary'>Eureka</Typography>

                </Stack>
              </Stack>
            </a>
          </Link>
              <Stack 
                direction='row'
                justifyContent={'end'}  
                sx={{
                  paddingLeft:'3rem',
                }}
              >
                <Stack 
                  gap={3} 
                  direction={'row'} 
                  alignItems={'center'} 
                  sx={{
                    display: { xs: 'none', md: 'inherit' },
                  }}
                >
                  {
                    session?.user
                      ? <>
                          <MediathequeLinks />
                          <TopicsLinks/>
                      </>
                      :<></>
                  }
                  <Box sx={{'& .searchInputCmp': {
                    border: 'solid 1px var(--color-primary)',
                  }}}>
                    <SearchInput />
                  </Box>
                </Stack>
              </Stack>
              <Stack sx={{ marginLeft:'auto',display: { xs: 'none', md: 'flex' }, alignContent: 'center', alignItems: 'center' }} marginLeft={2} direction={'row'}>
                <AppsLinks/>
                {session?.user ? <NotificationsLinks/>:<></>}
                <SessionLinks/>
              </Stack>
              <Stack sx={{ marginLeft:'auto',display: { xs: 'flex', md: 'none' } }} direction={'row'}  justifyContent={'end'} alignItems={'center'}  >
                <SearchInputLink />
                <AppsLinks/>
                <SessionLinks />
                {session?.user ? <NotificationsLinks /> : <></>}
              </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
