import { GetStaticProps,GetServerSideProps, NextPage } from 'next';
import Head from "next/head";
import useTranslation from 'next-translate/useTranslation';
import { useState,MouseEvent, useEffect, } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';
import {dehydrate,QueryClient,} from 'react-query'
import { Button } from 'react-bootstrap';
import TagsInput from '../src/components/forms/controls/TagsInput';

import styles from './index.module.css';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import Header from '../src/components/layouts/Header';
import Carousel from '../src/components/Carousel';
import ListWindow from '@/src/components/ListWindow';
import { v4 } from 'uuid';
import { WEBAPP_URL } from '../src/constants';
import { getCycles } from '@/src/useCycles';
import { getWorks } from '@/src/useWorks';
import { WorkMosaicItem } from '@/src/types/work';
import { CycleMosaicItem } from '@/src/types/cycle';

interface Props{
  items:(WorkMosaicItem|CycleMosaicItem)[]
}
const IndexPage: NextPage<Props> = ({items}) => {
  const [mounted,setMounted] = useState<boolean>(false)
  useEffect(()=>setMounted(true),[])
  const { t } = useTranslation('common');
  const [show, setShow] = useState<string[]>(['gender-feminisms', 'technology', 'environment']);
  const [hide /* , setHide */] = useState<string[]>([
    'racism-discrimination',
    'wellness-sports',
    'social issues',
    'politics-economics',
    'philosophy',
    'migrants-refugees',
    'introspection',
    'sciences',
    'arts-culture',
    'history',
  ]);
  const getTopicsBadgedLinks = () => {
    return <TagsInput formatValue={(v: string) => t(`topics:${v}`)} tags={[...show, ...hide].join()} readOnly />;
  };
  const showTopic = (e:MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (hide.length) {
      const topic = hide.splice(0, 3);
      setShow([...show, ...topic]);
    }
  };
  if(mounted)
  return (<>
    <Head>
        <meta property="og:title" content='Eureka'/>
        <meta property="og:description" content="Activa tu mente, transforma el mundo"/>
        <meta property="og:url" content={`${WEBAPP_URL}`} />
        <meta property="og:image" content={`${WEBAPP_URL}/logo.jpg`} />
        <meta property="og:type" content='website' />
    </Head>
    <SimpleLayout showHeader title={t('browserTitleWelcome')}>
      <h1 className="text-secondary fw-bold">{t('Trending topics')}</h1>
      <aside className="mb-5">{getTopicsBadgedLinks()}</aside>
      <ListWindow items={items} cacheKey={['ITEMS']}/>
    </SimpleLayout>
    </>
  );
  return <></>
};

export const getStaticProps: GetStaticProps = async () => {
  const cycles = await getCycles();
   const works = await getWorks();
   return {
        props: {
          items: [...cycles,...works],
        },
      };
 
  // const queryClient = new QueryClient();
  // const cycles = queryClient.prefetchQuery(()=>getCycles());
  // const works = queryClient.prefetchQuery(()=>getWorks());
 
  // // await queryClient.prefetchQuery('WORKS', getWorks);

  // return {
  //   props: {
  //     dehydratedState: dehydrate(queryClient),
  //   },
  // };
};
 
// export const getServerSideProps: GetServerSideProps = async () => {
//   const cycles = await getCycles();
//   const works = await getWorks();
 
//   return {
//     props: {
//       items: [...cycles,...works],
//     },
//   };
// };

export default IndexPage;
