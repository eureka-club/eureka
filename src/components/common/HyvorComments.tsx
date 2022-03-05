import crypto from 'crypto-js';
import HyvorTalk from 'hyvor-talk-react';
import { FunctionComponent,useEffect } from 'react';
import { useSession } from 'next-auth/client';

import { HYVOR_SSO_KEY, HYVOR_WEBSITE_ID, WEBAPP_URL } from '../../constants';
import { Session } from '../../types';

interface Props {
  entity: string;
  id: string;
}
export {};

 const HyvorComments: FunctionComponent<Props> = ({ entity,id }) => {
  const [session, isSessionLoading] = useSession() as [Session | null | undefined, boolean];
  let hyvorSso = {};
const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT } = process.env;
const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;

  if (isSessionLoading) {
    return null;
  }

  if (session == null) {
    const userData = Buffer.from(JSON.stringify({})).toString('base64');
    const hash = crypto.HmacSHA1(userData, HYVOR_SSO_KEY!).toString();
    hyvorSso = { hash, userData, loginURL: `${WEBAPP_URL}/login` };
  } else {
    const { user } = session;
    const userDataObj = {
      id: user.id,
      email: user.email,
      name: user.name || user.email?.split('@')[0] || 'User',
      picture: user.photos.length ? `https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/users-photos/${user.photos[0].storedFile}` : user.image,
    };
    const userData = Buffer.from(JSON.stringify(userDataObj)).toString('base64');
    const hash = crypto.HmacSHA1(userData, HYVOR_SSO_KEY!).toString();

    hyvorSso = { hash, userData, loginURL: `${WEBAPP_URL}/login` };
  }

  return <HyvorTalk.Embed websiteId={Number(3377)} id={`${entity}-${id}`} sso={hyvorSso} />;
};

export default HyvorComments;

