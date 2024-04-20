import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import styles from './Navbar.module.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
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


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));


export default function NavBar() {
  const { t } = useTranslation('navbar');
  const{SignInModal}=useSignInModal();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  // const menuId = 'primary-search-account-menu';
  // const renderMenu = (
  //   <Menu
  //     anchorEl={anchorEl}
  //     anchorOrigin={{
  //       vertical: 'top',
  //       horizontal: 'right',
  //     }}
  //     id={menuId}
  //     keepMounted
  //     transformOrigin={{
  //       vertical: 'top',
  //       horizontal: 'right',
  //     }}
  //     open={isMenuOpen}
  //     onClose={handleMenuClose}
  //   >
  //     <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
  //     <MenuItem onClick={handleMenuClose}>My account</MenuItem>
  //   </Menu>
  // );

  

  // const handlerTopicsLinkClick = (v: string) => {
  //   setSearchEngineState((res) => ({ ...res, itemsFound: [] }));
  //   router.push(`/search?q=${v}`);
  // };
  
  const [openTopics,setopenTopics]=React.useState(false);

  

  

  

  

  // const { show } = useModalContext();
  

  


  
  


  const mobileMenuId = 'primary-search-account-menu-mobile';
  

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{backgroundColor:'white',boxShadow:'none',color:'black',borderBottom:'solid 1px var(--color-primary)'}}>
          <Toolbar>
          <Link href="/" replace>
              <a className="d-flex align-items-center">
                  <aside className="d-flex justify-content-around align-items-center">
                    <img className="eurekaLogo" src="/logo.svg" alt="Project logo" />
                    <Box sx={{display:{xs:'none',sm:'inline-block'}}}>
                      <div className={`text-secondary ms-3 h4 mb-0 ${styles.brand}`}>Eureka</div>
                      <p className="text-secondary my-0 ms-3 font-weight-light fs-xs">{t('tagline')}</p>
                    </Box>
                  </aside>
              </a>
          </Link>
          <Box id="asd" sx={{ flexGrow: 1,paddingLeft:'1rem' }}>
            <SearchInput className="" style={{ width: '100%' }} />
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <TopicsLinks/>
            <MediathequeLinks/>
            <AboutLinks/>
            <LangsLinks/>
            <SessionLinks/>
            <NotificationsLinks/>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
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
              <TopicsLinks/>
              <MediathequeLinks/>
              <AboutLinks/>
              <LangsLinks/>
              <SessionLinks/>
              <NotificationsLinks/>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      <SignInModal logoImage/>
    </Box>
  );
}
