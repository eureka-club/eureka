import useTranslation from 'next-translate/useTranslation';
import styles from './Navbar.module.css';

import { Session } from "@/src/types";
import { signOut, useSession } from 'next-auth/react';
import useSignInModal from '@/src/useSignInModal';
import { BiUser } from 'react-icons/bi';
import LocalImage from '../../LocalImage';
import { Login, Logout, Person, Settings } from '@mui/icons-material';
import MenuAction from './MenuAction';
import { Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';


  const avatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/img/default-avatar.png';
  };
  const getAvatar = (session:Session|null) => {
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
  

  export const SessionLinks = () => {
    const { t } = useTranslation('navbar');
    const{data:session}=useSession();
    const{setOpen,SignInModal}=useSignInModal();


    const handlerLogout = () => {
        signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_WEBAPP_URL}` });
    };
    const handlerLogin = () => {
      //show(<SignInForm />);
      setOpen(true);
    };

    const sessionLinksInfo = session?.user 
    ? [
      {
        label:t('Profile'),
        link:'/profile',
        // icon:<Person />
      },
      ... session.user.roles=='admin' ? [{label:t('Admin Panel'),link:'/back-office',icon:<Settings fontSize="small" />}] : [],
      {
        label:t('logout'),
        onClick:handlerLogout,
        // icon: <Logout fontSize="small" />
      }
    ]
    :[
      {
        label:t('login'),
        onClick:handlerLogin,
        // icon: <Login fontSize="small" />
      }
    ]

    return <>
      <MenuAction key='SessionLinks' items={sessionLinksInfo||[]} label={
        <Stack sx={{width:'32px',height:'32px'}} justifyContent={'center'} alignItems={'center'}>
              {getAvatar(session)}
          {/* <Typography variant="caption" gutterBottom>
            {t('About')}
          </Typography> */}
        </Stack>
      }
      title={t('Account')}
      renderMenuItem={
        (i)=>{
            if(i.hasOwnProperty('link'))
              return <Link href={i['link']}>
                <Stack gap={3} direction={'row'}>
                  {i.icon?i.icon:<></>} <Typography color={'var(--color-primary)'}>{i.label}</Typography>
                </Stack>
              </Link>
            else if(i.hasOwnProperty('onClick'))
              return <Button sx={{padding:0,textTransform:'capitalize'}} variant='text' size='small' onClick={()=>i['onClick'](i.label)}>
                <Stack gap={3} direction={'row'}>
                  {i.icon?i.icon:<></>} <Typography>{i.label}</Typography>
                </Stack>
              </Button>;
            return <></> 
        }
      }
      />
      <SignInModal/>
    </>
  };