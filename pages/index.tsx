import { GetStaticProps, NextPage } from 'next';
import Head from "next/head";
import useTranslation from 'next-translate/useTranslation';
import { useState,MouseEvent, } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';

import { Button } from 'react-bootstrap';
import TagsInput from '../src/components/forms/controls/TagsInput';

import styles from './index.module.css';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import Header from '../src/components/layouts/Header';
import Carousel from '../src/components/Carousel';
import { v4 } from 'uuid';
import { WEBAPP_URL } from '../src/constants';

const IndexPage: NextPage = () => {
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

  return (<>
    <Head>
        <meta property="og:title" content='Eureka'/>
        <meta property="og:description" content="Activa tu mente, transforma el mundo"/>
        <meta property="og:url" content={`${WEBAPP_URL}`} />
        <meta property="og:image" content={`${WEBAPP_URL}/logo.jpg`} />
        <meta property="og:type" content='website' />

        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:site" content="@eleurekaclub"></meta>
        <meta name="twitter:title" content="Eureka"></meta>
        <meta name="twitter:description" content="Activa tu mente, transforma el mundo"></meta>
        <meta name="twitter:image" content={`${WEBAPP_URL}/logo.jpg`} ></meta>
        <meta name="twitter:url" content={`${WEBAPP_URL}`} ></meta>
    </Head>
    <SimpleLayout showHeader title={t('browserTitleWelcome')}>
      <h1 className="text-secondary fw-bold">{t('Trending topics')}</h1>
      <aside className="mb-5">{getTopicsBadgedLinks()}</aside>
      <>{show && show.map((item, idx) => <Carousel className="mt-5" key={`carousel-${idx}`} topic={item} />)}</>
      <Button className="my-3 pe-3 rounded-pill text-white" onClick={e=>showTopic(e)} disabled={hide.length === 0}>
        <span>
          <RiArrowDownSLine /> {t('loadMoreTopics')}
        </span>
      </Button>
    </SimpleLayout>
    </>
  );
};

/* export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  // await queryClient.prefetchQuery('WORKS', getWorks);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
 */
// export const getServerSideProps: GetServerSideProps = async () => {
//   const cycles = await findAllCycles();
//   const works = await findAllWorks();
//   const interleavedResults = flatten(zip(cycles, works)).filter((workOrCycle) => workOrCycle != null);

//   return {
//     props: {
//       homepageMosaicData: interleavedResults,
//     },
//   };
// };

export default IndexPage;
