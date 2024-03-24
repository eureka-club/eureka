import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import styles from './Navbar.module.css';
import {Language, Login, Logout,Person,Settings} from '@mui/icons-material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { setCookie } from 'nookies';
import MoreIcon from '@mui/icons-material/MoreVert';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import MenuAction from './MenuAction';
import { HiOutlineHashtag } from 'react-icons/hi';
import { Stack } from '@mui/system';
import { useSession, signOut } from 'next-auth/react';
import slugify from 'slugify';
import { RiDashboardLine } from 'react-icons/ri';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { Avatar, Button, Divider, Paper, TextField, Tooltip } from '@mui/material';
import SearchInput from '../../SearchInput';
import { useRouter } from 'next/router';
import { QueryClient } from 'react-query';
import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_TTL, WEBAPP_URL } from '@/src/constants';
import LocalImage from '../../LocalImage';
import { BiUser } from 'react-icons/bi';
import SignInForm from '../../forms/SignInForm';
import { useModalContext } from '@/src/useModal';
import useSignInModal from '@/src/useSignInModal';
import NotificationsList from '../../NotificationsList';
import { IoNotificationsCircleOutline } from 'react-icons/io5';


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
  const{data:session}=useSession();
  const router = useRouter();
  const queryClient = new QueryClient();
  const topics =React.useMemo(()=>[
    {label:`${t(`topics:gender-feminisms`)}`,link:`/search?q=${'gender-feminisms'}`},
    {label:`${t(`topics:technology`)}`,link:`/search?q=${'technology'}`},
    {label:`${t(`topics:environment`)}`,link:`/search?q=${'environment'}`},
    {label:`${t(`topics:racism-discrimination`)}`,link:`/search?q=${'racism-discrimination'}`},
    {label:`${t(`topics:wellness-sports`)}`,link:`/search?q=${'wellness-sports'}`},
    {label:`${t(`topics:social issues`)}`,link:`/search?q=${'social issues'}`},
    {label:`${t(`topics:politics-economics`)}`,link:`/search?q=${'politics-economics'}`},
    {label:`${t(`topics:philosophy`)}`,link:`/search?q=${'philosophy'}`},
    {label:`${t(`topics:migrants-refugees`)}`,link:`/search?q=${'migrants-refugees'}`},
    {label:`${t(`topics:introspection`)}`,link:`/search?q=${'introspection'}`},
    {label:`${t(`topics:sciences`)}`,link:`/search?q=${'sciences'}`},
    {label:`${t(`topics:arts-culture`)}`,link:`/search?q=${'arts-culture'}`},
    {label:`${t(`topics:history`)}`,link:`/search?q=${'history'}`},
  ],[]);

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

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  

  // const handlerTopicsLinkClick = (v: string) => {
  //   setSearchEngineState((res) => ({ ...res, itemsFound: [] }));
  //   router.push(`/search?q=${v}`);
  // };
  
  const [openTopics,setopenTopics]=React.useState(false);
  const getTopicsLinks = () => {
    return <MenuAction items={topics} label={
      <Stack justifyContent={'center'} alignItems={'center'}>
        <HiOutlineHashtag
          fontSize={'2rem'}
        />
        {/* <Typography variant="caption" gutterBottom>
          {t('Topics')}
        </Typography> */}
      </Stack>
    }
    title={t('Topics')}
    />;
  };

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
    {label:t('MyReadOrWatched'),link:`/user/${getMediathequeSlug() }/my-read-or-watched`},
  ]
  const getMediathequeLinks = () => {
    return <MenuAction items={mediathequeLinksInfo} label={
      <Stack justifyContent={'center'} alignItems={'center'}>
        <RiDashboardLine fontSize={'2rem'} />
        {/* <Typography variant="caption" gutterBottom>
          {t('My Mediatheque')}
        </Typography> */}
      </Stack>
    }
    title={t('My Mediatheque')}
    />;
  };

  const aboutLinksInfo = [
    {label:t('Manifest'),link:`/manifest`},
    {label:t('About Eureka'),link:`/about`},
    {label:t('About Us'),link:`/aboutUs`},
    {label:t('policyText'),link:`/policy`},
  ]
  const getAboutLinks = () => {
    return <MenuAction items={aboutLinksInfo} label={
      <Stack justifyContent={'center'} alignItems={'center'}>
        <AiOutlineInfoCircle fontSize={'2rem'} />
        {/* <Typography variant="caption" gutterBottom>
          {t('About')}
        </Typography> */}
      </Stack>
    }
    title={t('About')}
    />;
  };

  const langsLinksInfo = router?.locales?.map(l=>({
    label:l,
  }));

  const getLangsLinks = () => {
    return <MenuAction items={langsLinksInfo||[]} label={
      <Stack justifyContent={'center'} alignItems={'center'}>
        <Badge badgeContent={router.locale} color="secondary">
          <Language sx={{fontSize:'2rem'}}/>
        </Badge>
        {/* <Typography variant="caption" gutterBottom>
          {t('About')}
        </Typography> */}
      </Stack>
    }
    title={t('Language')}
    renderMenuItem={
      (i)=>{
        return <Button sx={{padding:0}} variant='text' size='small' onClick={()=>handleLanguageSelect(i.label)}>
          <Typography className={styles.langLinkInfo}>{i.label?.toUpperCase()}</Typography>
        </Button>;
      }
    }
    />;
  };

  const handleLanguageSelect = (locale: string | null) => {
    if (locale != null) {
      queryClient.clear();
      setCookie(null, LOCALE_COOKIE_NAME, locale, {
        maxAge: LOCALE_COOKIE_TTL,
        path: '/',
      });
      window.location.replace(`${WEBAPP_URL}/${locale}${router.asPath}`);
    }
  };

  const handlerLogout = () => {
    signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_WEBAPP_URL}` });
  };

  // const { show } = useModalContext();
  const{SignInModal,setOpen}=useSignInModal();
  const handlerLogin = () => {
    // show(<SignInForm />);
    setOpen(true);
  };

  const sessionLinksInfo = session?.user 
    ? [
      {label:t('Profile'),link:'/profile',icon:<Person />},
      {label:t('Admin Panel'),link:'/back-office',icon:<Settings fontSize="small" />},
      {label:t('logout'),onClick:handlerLogout,icon: <Logout fontSize="small" />}
    ]
    :[
      {label:t('login'),onClick:handlerLogin,icon: <Login fontSize="small" />}
    ]

  const avatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/img/default-avatar.png';
  };
  const getAvatar = () => {
    const user = session?.user;
    if (user && user?.photos) {
      if (!user?.photos.length)
        return (
          <img
            width={23}
            height={23}
            onError={avatarError}
            className={styles.navbarIconNav}
            src={user.image || '/img/default-avatar.png'}
            alt={user.name || ''}
            style={{border:'solid 2px var(--color-primary)'}}
          />
        );
      return (
        <LocalImage
          className={`rounded rounded-circle`}
          width={23}
          height={23}
          filePath={`users-photos/${user.photos[0].storedFile}`}
          alt={user.name || ''}
          style={{border:'solid 2px var(--color-primary)'}}
        />
      );
    }
    return <BiUser className={styles.navbarIconNav} />;
  };
  

  const getSessionLinks = () => {
    return <MenuAction items={sessionLinksInfo||[]} label={
      <Stack sx={{width:'32px',height:'32px'}} justifyContent={'center'} alignItems={'center'}>
            {getAvatar()}
        {/* <Typography variant="caption" gutterBottom>
          {t('About')}
        </Typography> */}
      </Stack>
    }
    title={t('Account')}
    renderMenuItem={
      (i)=>{
          const baseCmp = ()=><Typography>{i.label}</Typography>;
          if(i.hasOwnProperty('link'))
            return <Link href={i['link']}>
              <Stack gap={3} direction={'row'}>
                {i.icon?i.icon:<></>} {baseCmp()}
              </Stack>
            </Link>
          else if(i.hasOwnProperty('onClick'))
            return <Button sx={{padding:0}} variant='text' size='small' onClick={()=>i['onClick'](i.label)}>
              <Stack gap={3} direction={'row'}>
                {i.icon?i.icon:<></>} {baseCmp()}
              </Stack>
            </Button>;
           return <></> 
      }
    }
    />;
  };


  const notificationLinksInfo = [
    {label:t('Profile'),link:'/profile',icon:<Person />},
    {label:t('Admin Panel'),link:'/back-office',icon:<Settings fontSize="small" />},
    {label:t('logout'),onClick:handlerLogout,icon: <Logout fontSize="small" />}
  ];
  const getNotificationsLinks = () => {
    return <MenuAction items={notificationLinksInfo||[]} label={
      <Stack justifyContent={'center'} alignItems={'center'}>
        <IoNotificationsCircleOutline fontSize={'2rem'} />
      </Stack>
    }
    title={t('Account')}
    renderMenuItem={
      (i)=>{
          const baseCmp = ()=><Typography>{i.label}</Typography>;
          if(i.hasOwnProperty('link'))
            return <Link href={i['link']}>
              <Stack gap={3} direction={'row'}>
                {i.icon?i.icon:<></>} {baseCmp()}
              </Stack>
            </Link>
          else if(i.hasOwnProperty('onClick'))
            return <Button sx={{padding:0}} variant='text' size='small' onClick={()=>i['onClick'](i.label)}>
              <Stack gap={3} direction={'row'}>
                {i.icon?i.icon:<></>} {baseCmp()}
              </Stack>
            </Button>;
           return <></> 
      }
    }
    />;
  };
  


  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
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
      {getTopicsLinks()}
      {getMediathequeLinks()}
      {getAboutLinks()}
      {getLangsLinks()}
      {getSessionLinks()}
      {getNotificationsLinks()}
    </Menu>
  );

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
            {getTopicsLinks()}
            {getMediathequeLinks()}
            {getAboutLinks()}
            {getLangsLinks()}
            {getSessionLinks()}
            {getNotificationsLinks()}
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
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      <SignInModal logoImage/>
    </Box>
  );
}
