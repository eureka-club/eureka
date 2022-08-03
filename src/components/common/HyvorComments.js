import crypto from 'crypto-js';
import { Embed, CommentCount } from 'hyvor-talk-react';
import { useSession } from 'next-auth/react';

import { HYVOR_SSO_KEY, HYVOR_WEBSITE_ID, WEBAPP_URL } from '../../constants';
import { Session } from '../../types';

// interface Props {
//   entity: string;
//   id: string;
// }
const HyvorComments = ({ entity,id }) => {
  const {data:session, status} = useSession() ;
  const isSessionLoading = status == 'loading'
  let hyvorSso = {};
const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT } = process.env;
const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;

  if (isSessionLoading) {
    return null;
  }

  if (session == null) {
    const userData = Buffer.from(JSON.stringify({})).toString('base64');
    const hash = crypto.HmacSHA1(userData, HYVOR_SSO_KEY).toString();
    hyvorSso = { hash, userData, loginURL: `${WEBAPP_URL}/` };
  } else {
    const { user } = session;
    const userDataObj = {
      id: user.id,
      email: user.email,
      name: user.name || user.email?.split('@')[0] || 'User',
      picture: (user.photos && user.photos.length) 
      ? `https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/users-photos/${user.photos[0].storedFile}` 
      : user.image,
    };
    const userData = Buffer.from(JSON.stringify(userDataObj)).toString('base64');
    const hash = crypto.HmacSHA1(userData, HYVOR_SSO_KEY).toString();

    hyvorSso = { hash, userData, loginURL: `${WEBAPP_URL}/` };
  }

  return <Embed websiteId={Number(3377)} id={`${entity}-${id}`} sso={hyvorSso} />;
};

export default HyvorComments;

