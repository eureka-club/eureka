import { NextPage } from 'next';
import { getServerSession } from 'next-auth';
import { Locale } from '@/i18n-config';
import auth_config from '@/auth_config';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { find } from '@/src/facades/cycle';
import CycleDiscussion from '../component/CycleDiscussion';


interface Props {
  params:{lang:Locale,id:string}
}
const CycleDiscussionPage: NextPage<Props> = async ({params:{lang,id}}) => {

  const session = await getServerSession(auth_config(lang));
  let metaTags = null;debugger;
  const cycle = await find(+id);

  if (cycle) {
        metaTags = {
        id: cycle?.id,
        title: cycle?.title,
        creator: cycle.creator.name,
        storedFile: cycle?.localImages[0].storedFile,
        };
    }

    const qc = new QueryClient();
    qc.prefetchQuery({
      queryKey:['CYCLE',id.toString()],
      queryFn: ()=> cycle
    })

    return  <HydrationBoundary state={dehydrate(qc)}>
        <CycleDiscussion />
        
    </HydrationBoundary>
      
};

export default CycleDiscussionPage;