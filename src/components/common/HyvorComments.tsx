import {memo,FC} from 'react';
import crypto from 'crypto-js';
import type { Comment} from '@hyvor/hyvor-talk-base';
import { Comments } from '@hyvor/hyvor-talk-react';
import { HYVOR_SSO_KEY, HYVOR_WEBSITE_ID, WEBAPP_URL } from '@/src/constants';
import { Session } from '../../types';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  entity: string;
  id: string;
  session: Session;
  OnCommentCreated?:(comment:Comment) =>Promise<void>;
  settings?:Record<string,any>
}
const HyvorComments:FC<Props> = ({ entity,id,session,settings, OnCommentCreated })=>{
  //const {data:session, status} = useSession() ;
  const{t}=useTranslation('hyvortalk');
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
      ? `${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/users-photos/${user.photos[0].storedFile}` 
      : user.image,
      timestamp: Math.floor(Date.now() / 1000),
    };
     
    userData = Buffer.from(JSON.stringify(userDataObj)).toString('base64');
    hash = crypto.HmacSHA256(userData, HYVOR_SSO_KEY!).toString();

    hyvorSso = { hash, userData, loginURL: `${WEBAPP_URL}/` };
    return <Comments
              website-id={+HYVOR_WEBSITE_ID!}
              page-id={`${entity}-${id}`}
              sso-user={userData}
              sso-hash={hash}
              translations={{
                  'comment_box_text':t('comment_box_text'),
                  'reply_box_text':t('reply_box_text'),
                  'comments_0':t('comments_0'),
                  'no_comments_text':t('no_comments_text'),
                  'ratings_text':t('ratings_text'),
                  'comments_1':t('comments_1'),
                  'comments_multi':t('comments_multi'),
                  'reactions_text':t('reactions_text'),
                  'comment_button_text':t('comment_button_text'),
                  'online':t('online')
              }}
              on={{
                'loaded': () => console.log('Comments loaded'),
                'comment:published': async (comment) => {console.log("comment published ",comment)
                  if(OnCommentCreated)
                    await OnCommentCreated(comment as any);
                },
            }}
          />
  }
  return <></>
  // return <Embed websiteId={Number(3377)} id={`${entity}-${id}`} sso={hyvorSso}/>;
};

export default memo(HyvorComments);

