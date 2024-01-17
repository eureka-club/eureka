import { NextPage} from 'next';
import CreatePost from './component/CreatePost';
import Layout from '@/src/components/layout/Layout';
import { getDictionary } from '@/src/get-dictionary';
import { getServerSession } from 'next-auth';
import { Locale } from 'i18n-config';
import { LANGUAGES } from '@/src/constants';
import { redirect } from 'next/navigation';
import auth_config from 'auth_config';

interface Props{
    params:{lang:Locale}
}
const CreatePostPage = async ({params:{lang}}:Props) => {
    const session = await getServerSession(auth_config(lang));
    if(!session?.user)redirect('/');

    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = { ...dictionary['aboutUs'],
     ...dictionary['meta'], ...dictionary['common'], 
     ...dictionary['topics'],...dictionary['navbar'],
     ...dictionary['signInForm'],...dictionary['createPostForm'],
    }

    const langs = session?.user.language??LANGUAGES[lang];

    return  <Layout dict={dict}>
        <CreatePost/>
    </Layout>
};

export default CreatePostPage;
