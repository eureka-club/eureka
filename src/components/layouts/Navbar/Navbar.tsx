import * as React from 'react';
import styles from './Navbar.module.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MoreIcon from '@mui/icons-material/MoreVert';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import useSignInModal from '@/src/useSignInModal';
import { MediathequeLinks } from './MediathequeLinks';
import { TopicsLinks } from './TopicsLinks';
import { AboutLinks } from './AboutLinks';
import SearchInput from '../../SearchInput';
import { LangsLinks } from './LangsLinks';
import { SessionLinks } from './SessionLinks';
import { NotificationsLinks } from './NotificationsLinks';
import UserAllowedOperationsLinks from './UserAllowedOperationsLinks';
import { Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { SearchInputLink } from './SearchInputLink';
import { AppsLinks } from './AppsLinks';
import { Padding } from '@mui/icons-material';

export default function NavBar() {
  const { t } = useTranslation('navbar');
  const { data: session } = useSession();
  const { SignInModal } = useSignInModal();

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const mobileMenuId = 'primary-search-account-menu-mobile';

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
                  {/* <Typography variant='caption' sx={{lineHeight:'1.2rem'}} color="secondary">{t('tagline')}</Typography> */}
                  {/* <div className={`text-secondary ms-3 h4 mb-0 ${styles.brand}`}>Eureka</div> */}
                  {/* <p className="text-secondary my-0 ms-3 font-weight-light fs-xs">{t('tagline')}</p> */}

                </Stack>
              </Stack>
            </a>
          </Link>
            
          <Stack 
            direction='row'
            justifyContent={'end'}  
            sx={{
              flexGrow: 1,
              // marginLeft:'auto',
              paddingLeft:'4rem', 
              // paddingBlockEnd:'5rem'
              
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
              <MediathequeLinks />
              <TopicsLinks/>
              <Box sx={{'& .searchInputCmp': {
                border: 'solid 1px var(--color-primary)',
              }}}>
                <SearchInput />
              </Box>
            </Stack>
          </Stack>
          <Stack direction={'row'} sx={{ display: { xs: 'none', md: 'flex' }, alignContent: 'center', alignItems: 'center' }}>

            {/* <AboutLinks /> */}
            {/* {session?.user ? <UserAllowedOperationsLinks/>:<></>} */}
            {/* <SearchInputLink /> */}
            <AppsLinks/>
            {session?.user ? <NotificationsLinks/>:<></>}
            <SessionLinks/>
            {/* <LangsLinks/> */}
          </Stack>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }} alignItems={'center'}  >
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMoreAnchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              id={mobileMenuId}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={isMobileMenuOpen}
              onClose={handleMobileMenuClose}
            >
              {/* <SessionLinks/> */}
              {/* <AboutLinks /> */}
              {/* <UserAllowedOperationsLinks/> */}
              <MediathequeLinks />
              <TopicsLinks/>
              <SessionLinks />
              {/* <LangsLinks/> */}
            </Menu>
            <SearchInputLink />
            <AppsLinks/>
            {session?.user ? <NotificationsLinks /> : <></>}
          </Box>
        </Toolbar>
      </AppBar>

      <SignInModal logoImage />
    </Box>
  );
}
