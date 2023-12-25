import Head from 'next/head';
import { getPosts } from '@/src/hooks/usePosts';
import { getWorks } from '@/src/hooks/useWorks';
import { getCycles } from '@/src/hooks/useCycles';

import { getWorksProps } from '@/src/types/work';
import { Locale } from '@/i18n-config';
import { NextPage } from 'next';
import { getDictionary, t } from '@/src/get-dictionary';
import Layout from '@/src/components/layout/Layout';
import auth_config from '@/auth_config';
import { prisma } from '@/src/lib/prisma'
import { LANGUAGES } from '@/src/constants';
import SearchTab from '@/src/components/SearchTab';
import useFilterEngineWorks from '@/src/hooks/useFilterEngineWorks';
import SearchTabWorks from '@/src/components/SearchTabWorks';
import { getServerSession } from 'next-auth';

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
// interface Props {
//   hasCycles: boolean;
//   hasPosts: boolean;
//   hasWorks: boolean;
//   session: Session;
//   metas: any;
// }
interface Props {
  params: { lang: Locale, type: string },
  searchParams: { q: string }
}
const SearchPage: NextPage<Props> = async ({ params: { lang, type }, searchParams }) => {
  const dictionary = await getDictionary(lang);
  const dict: Record<string, string> = { ...dictionary['common'], ...dictionary['meta'], ...dictionary['topics'], ...dictionary['navbar'], ...dictionary['signInForm'],...dictionary['searchEngine'],...dictionary['countries'] }
  const q = searchParams?.q;
  const session = await getServerSession(auth_config(lang))
  const langs = session?.user.language 
    ? session?.user.language 
    : lang.split(',').map(l => LANGUAGES[l]).join(',');

  const origin = process.env.NEXT_PUBLIC_WEBAPP_URL;
  // const qc = new QueryClient();
  const terms = q?.toString()!.split(' ') || [];
  
  const wp = getWorksProps(terms);
  const worksData = await getWorks(langs, { where: wp, /*take*/ }, origin);
  // qc.prefetchQuery(`works-search-${q?.toString()}`, () => worksData);
  const hasWorks = worksData.total > 0;

  let metas = null;

  if (q && topics.includes(q)) {
    metas = {
      //id: cycle?.id,
      topic: q,
      works: hasWorks
        ? worksData.works
          .map((x) => `${x.title} - ${x.author}`)
          .slice(0, 5)
          .join()
        : ""
    };
  }

  let qLabel = q;
  if (qLabel && qLabel.match(':')) qLabel = q;

  return (
    <>
      {/* {metas && (
        <Head>
          <meta
            name="title"
            content={`${t(dict,'topicsTitle')} ${t(dict,'topics:' + metas.topic)} ${t(dict,'topicsTitle1')}`}
          ></meta>
          <meta
            name="description"
            content={`${t(dict,'topicsDescription')}: ${metas.works}, ${t(dict,'topicsDescription1')}:  ${
              metas.cycles
            }.`}
          ></meta>
        </Head>
      )} */}
      <Layout dict={dict}>
        <SearchTab value={2} />
        <SearchTabWorks works={worksData.works} />
      </Layout>


    </>

  );
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const { query } = ctx;
//   const session = await getSession(ctx);
//   const q = query.q;
//   const origin = process.env.NEXT_PUBLIC_WEBAPP_URL;
//   const qc = new QueryClient();
//   const terms = q?.toString()!.split(' ') || [];
//   const cyclesProps = {
//     where: {
//       OR: [
//         {
//           AND: terms.map((t) => ({
//             title: { contains: t },
//           })),
//         },
//         {
//           AND: terms.map((t) => ({
//             contentText: { contains: t },
//           })),
//         },
//         {
//           AND: terms.map((t) => ({
//             tags: { contains: t },
//           })),
//         },
//         {
//           AND: terms.map((t) => ({
//             topics: { contains: t },
//           })),
//         },
//       ],
//     },
//   };
//   const cyclesData = await getCycles(ctx.locale!,{ ... cyclesProps, take }, origin);
//   qc.prefetchQuery(`cycles-search-${q?.toString()}`, () => cyclesData);
//   const hasCycles = cyclesData.total > 0;
//   const postsProps = {
//     where: {
//       OR: [
//         {
//           AND: terms.map((t) => ({
//             title: { contains: t },
//           })),
//         },
//         {
//           AND: terms.map((t) => ({
//             contentText: { contains: t },
//           })),
//         },
//         {
//           AND: terms.map((t) => ({
//             tags: { contains: t },
//           })),
//         },
//         {
//           AND: terms.map((t) => ({
//             topics: { contains: t },
//           })),
//         },
//       ],
//     },
//   };
//   const postsData = await getPosts(ctx.locale!,{ ... postsProps, take }, origin);
//   qc.prefetchQuery(`posts-search-${q?.toString()}`, () => postsData);
//   const hasPosts = postsData.total > 0;

//   const worksData = await getWorks(ctx.locale!,{ ... getWorksProps(terms), take }, origin);

//   qc.prefetchQuery(`works-search-${q?.toString()}`, () => worksData);
//   const hasWorks = worksData.total > 0;

//   let metaTags = null;

//   if (q && topics.includes(q!.toString())) {
//     metaTags = {
//       //id: cycle?.id,
//       topic: q!.toString(),
//       works: hasWorks
//         ? worksData.works
//             .map((x) => `${x.title} - ${x.author}`)
//             .slice(0, 5)
//             .join()
//         : "",
//       cycles: hasCycles
//         ? cyclesData.cycles
//             .map((x) => `${x.title} - ${x.creator.name}`)
//             .slice(0, 2)
//             .join()
//         : "",
//     };
//   }

//   return {
//     props: {
//       hasCycles,
//       hasPosts,
//       hasWorks,
//       metas: metaTags,
//       session,
//       dehydratedState: dehydrate(qc),
//     },
//   };
// };

export default SearchPage;