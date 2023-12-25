import { Locale } from '@/i18n-config';
import Layout from '@/src/components/layout/Layout';
import { LANGUAGES } from '@/src/constants';
import { getDictionary } from '@/src/get-dictionary';
import { NextPage } from 'next';
import { getServerSession } from 'next-auth';
import Post from './component/Post';
import { getPost } from '@/src/hooks/usePost';
import auth_config from '@/auth_config';
import { Alert } from '@mui/material';

interface Props {
  params:{lang:Locale,id:string}
}
const CyclePage: NextPage<Props> = async ({params:{lang,id}}) => {
    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = { ...dictionary['aboutUs'],
     ...dictionary['meta'], ...dictionary['common'], 
     ...dictionary['topics'],...dictionary['navbar'],
     ...dictionary['signInForm'],...dictionary['createPostForm'],
    }

  const session = await getServerSession(auth_config(lang));
    const langs = session?.user.language??LANGUAGES[lang];

    const origin = process.env.NEXT_PUBLIC_WEBAPP_URL;
    let post = await getPost(+id, origin);

    return  <Layout dict={dict} langs={langs} >
      <>
        {
        post 
          ? <Post post={post!} session={session!}/>
          : <Alert color='error'>Not found</Alert>
        }
      </>
    </Layout>
      
};

export default CyclePage;