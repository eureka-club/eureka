import {memo,FC} from 'react';
import crypto from 'crypto-js';
import { Embed, CommentCount } from 'hyvor-talk-react';
import { Comments } from '@hyvor/hyvor-talk-react';
//import { useSession } from 'next-auth/react';

import { HYVOR_SSO_KEY, HYVOR_WEBSITE_ID, WEBAPP_URL } from '@/src/constants';
import { Session } from '../../types';
import { useSession } from 'next-auth/react';

interface Props {
  entity: string;
  id: string;
}
const HyvorComments:FC<Props> = ({ entity,id })=>{
  const {data:session, status} = useSession() ;
  const isSessionLoading = status == 'loading'
  let hyvorSso = {};
  let hash;
  let userData;
const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT } = process.env;
const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;

  if (isSessionLoading) {
    return null;
  }

  if (session == null) {
    // userData = Buffer.from(JSON.stringify({
    //   timestamp: Math.floor(Date.now() / 1000),
    // })).toString('base64');
    // hash = crypto.HmacSHA1(userData, HYVOR_SSO_KEY!).toString();
    // hyvorSso = { hash, userData, loginURL: `${WEBAPP_URL}/` };
  } 
  if(session) {
    const { user } = session;
    const userDataObj = {
      id: user.id,
      name: user.name || user.email?.split('@')[0] || 'User',
      email: user.email,
      picture_url: (user.photos && user.photos.length) 
      ? `https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/users-photos/${user.photos[0].storedFile}` 
      : user.image,
      timestamp: Math.floor(Date.now() / 1000),
    };
    userData = Buffer.from(JSON.stringify(userDataObj)).toString('base64');
    hash = crypto.HmacSHA256(userData, HYVOR_SSO_KEY!).toString();

    hyvorSso = { hash, userData, loginURL: `${WEBAPP_URL}/` };
    return <Comments
              website-id={3377}
              page-id={`${entity}-${id}`}
              sso-user={userData}
              sso-hash={hash}
          />
  }
  return <></>
  // return <Embed websiteId={Number(3377)} id={`${entity}-${id}`} sso={hyvorSso}/>;
};

export default memo(HyvorComments);

