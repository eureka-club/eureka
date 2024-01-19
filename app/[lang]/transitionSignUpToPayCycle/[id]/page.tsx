import Layout from '@/src/components/layout/Layout';
import { getServerSession } from 'next-auth';
import auth_config from 'auth_config';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from 'i18n-config';
import { redirect } from 'next/navigation';
import TransitionToPayCycle from './component/TransitionToPayCycle';
import { getCycle } from '@/src/actions/cycle/getCycle';
import { getUsers } from '@/src/actions/user/getUsers';
import { getCycleParticipants } from '@/src/actions/cycle/getParticipants';

interface Props {
    params: { lang: Locale, id: string }
}

const TransitionSignUpToPayCyclePage = async ({ params: { lang,id } }:Props) => {
    const session = await getServerSession(auth_config(lang));
    if (!session?.user) redirect('/');

    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = {
        ...dictionary['common'], ...dictionary['navbar'],
    }

    let cycle = await getCycle(+id!);
    const participants = await getCycleParticipants(+id!);

    return (
        <Layout dict={dict}  showNavBar={false} showFooter={false}>
            <TransitionToPayCycle session={session} cycle={cycle!} participants={participants!} ></TransitionToPayCycle>
        </Layout>
    );
};



export default TransitionSignUpToPayCyclePage;
