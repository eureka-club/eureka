import { BiArrowBack } from 'react-icons/bi';
import { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { QueryClient, dehydrate } from 'react-query';
import { ButtonGroup, Button, Alert } from 'react-bootstrap';
import { getPosts } from '@/src/usePosts';
import { getWorks } from '@/src/useWorks';
import { getCycles } from '@/src/useCycles';

import { Session } from '@/src/types';

import SearchTab from '@/src/components/SearchTab';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import { getSession } from 'next-auth/react';

const topics = [
  'gender-feminisms',
  'technology',
  'environment',
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
];

const take = 8;
interface Props {
  hasCycles: boolean;
  hasPosts: boolean;
  hasWorks: boolean;
  session: Session;
  metas: any;
}
const SearchPage: NextPage<Props> = ({ hasCycles, hasPosts, hasWorks, metas,session }) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  let qLabel = router.query.q?.toString();
  if (qLabel && qLabel.match(':')) qLabel = router.query.q as string;

  const onTermKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code == 'Enter') {
      router.push(`/search?q=${e.currentTarget.value}`);
    }
  };

  const isEurekaTopic = (t: string) => {
    if (topics.includes(t!.toString())) return true;
    return false;
  };

  return (
    <>
      {metas && (
        <Head>
          <meta
            name="title"
            content={`${t('meta:topicsTitle')} ${t('topics:' + metas.topic)} ${t('meta:topicsTitle1')}`}
          ></meta>
          <meta
            name="description"
            content={`${t('meta:topicsDescription')}: ${metas.works}, ${t('meta:topicsDescription1')}:  ${
              metas.cycles
            }.`}
          ></meta>
        </Head>
      )}
      <SimpleLayout title={t('Results')}>
        <ButtonGroup className="mb-1">
          <Button variant="primary text-white" onClick={() => router.back()} size="sm">
            <BiArrowBack />
          </Button>
        </ButtonGroup>
        {/* <SearchInput className="" /> */}

        <>
          {qLabel ? <h1 className="text-secondary fw-bold mb-2">
            {t('Results about')}: {qLabel && `"${isEurekaTopic(qLabel) ? t('topics:' + qLabel) : qLabel}"`}
          </h1> : ''}
        </>
        {hasCycles || hasPosts || hasWorks ? (
          <div className="d-flex flex-column justify-content-center">
            <SearchTab {...{ hasCycles, hasPosts, hasWorks }} />
          </div>
        ) : (
          <>
            <Alert className="mt-4" variant="primary">
              <Alert.Heading>{t('ResultsNotFound')}</Alert.Heading>
            </Alert>
          </>
        )}
      </SimpleLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx;
  const session = await getSession(ctx);
  const q = query.q;
  const origin = process.env.NEXT_PUBLIC_WEBAPP_URL;
  const qc = new QueryClient();
  const terms = q?.toString()!.split(' ') || [];
  const cyclesProps = {
    where: {
      OR: [
        {
          AND: terms.map((t) => ({
            title: { contains: t },
          })),
        },
        {
          AND: terms.map((t) => ({
            contentText: { contains: t },
          })),
        },
        {
          AND: terms.map((t) => ({
            tags: { contains: t },
          })),
        },
        {
          AND: terms.map((t) => ({
            topics: { contains: t },
          })),
        },
      ],
    },
  };
  const cyclesData = await getCycles({ ...cyclesProps, take }, origin);
  qc.prefetchQuery(`cycles-search-${q?.toString()}111`, () => cyclesData);
  const hasCycles = cyclesData.total > 0;

  const postsProps = {
    where: {
      OR: [
        {
          AND: terms.map((t) => ({
            title: { contains: t },
          })),
        },
        {
          AND: terms.map((t) => ({
            contentText: { contains: t },
          })),
        },
        {
          AND: terms.map((t) => ({
            tags: { contains: t },
          })),
        },
        {
          AND: terms.map((t) => ({
            topics: { contains: t },
          })),
        },
      ],
    },
  };
  const postsData = await getPosts({ ...postsProps, take }, origin);
  qc.prefetchQuery(`posts-search-${q?.toString()}`, () => postsData);
  const hasPosts = postsData.total > 0;

  const worksProps = {
    where: {
      OR: [
        {
          AND: terms.map((t) => ({
            title: { contains: t },
          })),
        },
        {
          AND: terms.map((t) => ({
            contentText: { contains: t },
          })),
        },
        {
          AND: terms.map((t) => ({
            tags: { contains: t },
          })),
        },
        {
          AND: terms.map((t) => ({
            topics: { contains: t },
          })),
        },
      ],
    },
  };
  const worksData = await getWorks({ ...worksProps, take }, origin);
  qc.prefetchQuery(`works-search-${q?.toString()}`, () => worksData);
  const hasWorks = worksData.total > 0;

  let metaTags = null;

  if (q && topics.includes(q!.toString())) {
    metaTags = {
      //id: cycle?.id,
      topic: q!.toString(),
      works: hasWorks
        ? worksData.works
            .map((x) => `${x.title} - ${x.author}`)
            .slice(0, 5)
            .join()
        : "",
      cycles: hasCycles
        ? cyclesData.cycles
            .map((x) => `${x.title} - ${x.creator.name}`)
            .slice(0, 2)
            .join()
        : "",
    };
  }

  return {
    props: {
      hasCycles,
      hasPosts,
      hasWorks,
      metas: metaTags,
      session,
      dehydratedState: dehydrate(qc),
    },
  };
};

export default SearchPage;
