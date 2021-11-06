// import crypto from 'crypto-js';
// import HyvorTalk from 'hyvor-talk-react';
// import { FunctionComponent } from 'react';
// import { useSession } from 'next-auth/client';

// import { HYVOR_SSO_KEY, HYVOR_WEBSITE_ID, WEBAPP_URL } from '../../constants';
// import { Session } from '../../types';

// interface Props {
//   id: string;
// }
export {};

/* const HyvorComments: FunctionComponent<Props> = ({ id }) => {
  const [session, isSessionLoading] = useSession() as [Session | null | undefined, boolean];
  let hyvorSso = {};

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
    };
    const userData = Buffer.from(JSON.stringify(userDataObj)).toString('base64');
    const hash = crypto.HmacSHA1(userData, HYVOR_SSO_KEY!).toString();

    hyvorSso = { hash, userData, loginURL: `${WEBAPP_URL}/login` };
  }

  return <HyvorTalk.Embed websiteId={Number(HYVOR_WEBSITE_ID!)} id={id} sso={hyvorSso} />;
};

export default HyvorComments;
 */
