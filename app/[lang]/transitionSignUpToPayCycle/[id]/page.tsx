import { NextPage } from 'next';
import Layout from '@/src/components/layout/Layout';
import { getServerSession } from 'next-auth';
import auth_config from '@/auth_config';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from '@/i18n-config';
import { LANGUAGES } from '@/src/constants';
import { redirect } from 'next/navigation';
import TransitionToPayCycle from './component/TransitionToPayCycle';
import { getCycle } from '@/src/hooks/useCycle';
import { getCyclePaticipants } from '../../cycle/[id]/hooks/useCycleParticipants';

interface Props {
    params: { lang: Locale, id: string }
}

const TransitionSignUpToPayCyclePage: NextPage<Props> = async ({ params: { lang,id } }) => {
   
   
    const session = await getServerSession(auth_config(lang));
    if (!session?.user) redirect('/');
    const origin = process.env.NEXT_PUBLIC_WEBAPP_URL

    const dictionary = await getDictionary(lang);
    const dict: Record<string, string> = {
        ...dictionary['common'], ...dictionary['navbar'],
    }

    const langs = session?.user.language ?? LANGUAGES[lang];

    const whereCycleParticipants = (id: number) => ({
        where: {
            OR: [
                { cycles: { some: { id } } }, //creator
                { joinedCycles: { some: { id } } }, //participants
            ],
        },
    });

    

    const wcu = whereCycleParticipants(+id!);

    let cycle = await getCycle(+id!);

    const participants = await getCyclePaticipants(+id!);


    return (
        <Layout dict={dict} showNavBar={false} showFooter={false}>
            <TransitionToPayCycle session={session} cycle={cycle!} participants={participants!} ></TransitionToPayCycle>
        </Layout>
    );
};



export default TransitionSignUpToPayCyclePage;
