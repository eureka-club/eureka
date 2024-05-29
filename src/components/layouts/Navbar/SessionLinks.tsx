import useTranslation from 'next-translate/useTranslation';
import styles from './Navbar.module.css';

import { Session } from "@/src/types";
import { signOut, useSession } from 'next-auth/react';
import { BiUser } from 'react-icons/bi';
import LocalImage from '../../LocalImage';
import { AccountCircle, Login, Logout, Person, Settings } from '@mui/icons-material';
import MenuAction from './MenuAction';
import { Avatar, Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { AZURE_STORAGE_URL } from '@/src/constants';
import { useModalContext } from '@/src/hooks/useModal';
import SignInForm from '../../forms/SignInForm';


const avatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = '/img/default-avatar.png';
};
const getAvatar = (session: Session | null) => {
  const user = session?.user;
  if (user && user?.photos) {
    if (!user?.photos.length)
      return (
        <img
          width={24}
          height={24}
          onError={avatarError}
          className={styles.navbarIconNav}
          src={user.image || '/img/default-avatar.png'}
          alt={user.name || ''}
          style={{ border: 'solid 2px var(--color-primary)' }}
        />
      );
    return (
      <LocalImage
        className={`rounded rounded-circle`}
        width={24}
        height={24}
        filePath={`users-photos/${user.photos[0].storedFile}`}
        alt={user.name || ''}
        style={{ border: 'solid 2px var(--color-primary)' }}
      />
    );
  }
  return <BiUser className={styles.navbarIconNav} />;
};


export const SessionLinks = () => {
  const { t } = useTranslation('navbar');
  const { data: session } = useSession();
  // const { setOpen, SignInModal } = useSignInModal();
  const{show}=useModalContext()

  const handlerLogout = () => {
    signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_WEBAPP_URL}` });
  };
  const handlerLogin = () => {
    show(<SignInForm />);
  };

  const sessionLinksInfo = session?.user
    ? [
      {
        label: t('Profile'),
        link: '/profile',
        // icon:<Person />
      },
      ...session.user.roles == 'admin' ? [{ label: t('Admin Panel'), link: '/back-office' }] : [],
      {
        label: t('logout'),
        onClick: handlerLogout,
        // icon: <Logout fontSize="small" />
      }
    ]
    : [
      {
        label: t('login'),
        onClick: handlerLogin,
        // icon: <Login fontSize="small" />
      }
    ]

  return <>
    <MenuAction key='SessionLinks' items={sessionLinksInfo || []} label={
      <Stack justifyContent={'center'} alignItems={'center'} >
        <Avatar 
          sx={{width:32,height:32,bgcolor:'var(--color-primary)'}} 
          alt={session?.user.name!}
          src={
            session?.user.photos.length 
              ? `${AZURE_STORAGE_URL}/users-photos/${session?.user.photos[0].storedFile}`
              : session?.user.image!
          }>
             {/* || '/img/default-avatar.png' */}
            <AccountCircle/>
          </Avatar>
        {/* {<Typography variant="caption"  paddingTop={0.8}>
          {t('Account')}
        </Typography>} */}
      </Stack>
    }
      // title={t('Account')}
      renderMenuItem={
        (i) => {
          if (i.hasOwnProperty('link'))
            return <Link href={i['link']}>
              <Stack gap={3} direction={'row'}>
                {i.icon ? i.icon : <></>} <Typography color={'var(--color-primary)'}>{i.label}</Typography>
              </Stack>
            </Link>
          else if (i.hasOwnProperty('onClick'))
            return <Button sx={{ padding: 0, textTransform: 'capitalize', justifyContent: 'left' }} variant='text' size='small' onClick={() => i['onClick'](i.label)}>
              <Stack gap={3} direction={'row'}>
                {i.icon ? i.icon : <></>} <Typography>{i.label}</Typography>
              </Stack>
            </Button>;
          return <></>
        }
      }
    />
  </>
};