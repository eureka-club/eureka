import { useState,useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import TagsInput from '../src/components/forms/controls/TagsInput';
import { useRouter } from 'next/router';
import useInterestedCycles,{getInterestedCycles} from '@/src/useInterestedCycles';
import useFeaturedEurekas, { getFeaturedEurekas } from '@/src/useFeaturedEurekas';
import { dehydrate, QueryClient } from 'react-query';
import {getbackOfficeData} from '@/src/useBackOffice'
import CarouselStatic from '@/src/components/CarouselStatic';
const ExplorePage: NextPage = () => {
  const { t } = useTranslation('common');
  const [topics /* , setHide */] = useState<string[]>([
    'gender-feminisms', 'technology', 'environment','racism-discrimination','wellness-sports', 'social issues',
    'politics-economics', 'philosophy', 'migrants-refugees', 'introspection', 'sciences', 'arts-culture', 'history',
  ]);
  const router = useRouter();
  
  const {data:dataCycles} = useInterestedCycles()
  const [cycles,setCycles] = useState(dataCycles?.cycles);
  
  const {data:dataPosts} = useFeaturedEurekas()
  const [posts,setPosts] = useState(dataPosts?.posts);
  
  useEffect(()=>{
    if(dataCycles)setCycles(dataCycles.cycles)
    if(dataPosts)setPosts(dataPosts.posts)
  },[dataCycles,dataPosts])

  const getTopicsBadgedLinks = () => {
    return <TagsInput className='d-flex flex-wrap flex-row' formatValue={(v: string) => t(`topics:${v}`)} tags={[...topics].join()} readOnly />;
  };

  
const renderBackOfficeCycles = () => {
    return (cycles && cycles.length && dataCycles) 
    ? <div>      
       <CarouselStatic
        cacheKey={['CYCLES','INTERESTED']}
        onSeeAll={()=>router.push('/featured-cycles')}
        data={cycles}
        title={t('Interest cycles')}
        //seeAll={cycles.length<dataCycles?.total}
      />
      </div>
    : <></>;
  };

  const renderBackOfficePosts = () => {
    return (posts && posts.length && dataPosts) 
    ? <div>      
       <CarouselStatic
        cacheKey={['POSTS','FEATURED']}
        onSeeAll={()=>router.push('/featured-eurekas')}
        data={posts}
        title={t('Featured Eurekas')}
        //seeAll={posts.length<dataPosts.total}
      />
      </div>
    : <></>;
  };


  return (
    <>
    <SimpleLayout showCustomBaner={true} title={t('Explore')}>
      <h1 className="text-secondary fw-bold mt-5">{t('ExploreTopics')}</h1>
      <aside className="mb-5">{getTopicsBadgedLinks()}</aside>
      <div>
        {renderBackOfficeCycles()}
      </div>
      <div style={{marginBottom:'6em'}}>
        {renderBackOfficePosts()}
      </div>
    </SimpleLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const origin = `${process.env.NEXT_PUBLIC_WEBAPP_URL}`
  const qc = new QueryClient()
  const bo = await getbackOfficeData(origin);
 
  let cyclesIds:number[] = [];
  if(bo && bo.CyclesExplorePage)
    bo.CyclesExplorePage.split(',').forEach(x=> cyclesIds.push(parseInt(x)));

  let postsId:number[] = [];
  if(bo && bo.PostExplorePage)
    bo.PostExplorePage.split(',').forEach(x=> postsId.push(parseInt(x)));
      
  await qc.fetchQuery(['BACKOFFICE', `1`], () => bo)
  await qc.fetchQuery(['CYCLES','cycles-of-interest'],()=>getInterestedCycles(cyclesIds,undefined,origin))
  await qc.fetchQuery(['POSTS','eurekas-of-interest'],()=>getFeaturedEurekas(postsId,undefined,origin))

  return { 
    props: {
      dehydratedState: dehydrate(qc),      
    } 
  };
};

export default ExplorePage;
