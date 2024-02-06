// import { GetServerSideProps, NextPage } from 'next';
// import { getSession } from 'next-auth/react';

// import { flatten, zip } from 'lodash';

// import { CycleDetail } from '../src/types/cycle';
// import { WorkDetail } from '../src/types/work';
// import SimpleLayout from '../src/components/layouts/SimpleLayout';
// import { search as searchCycles } from '../src/facades/cycle';
// import { search as searchWork } from '../src/facades/work';
// import Mosaic from '../src/components/Mosaic';
// import {Cycle,Work} from '@prisma/client'
// import { getDictionary, t } from '@/src/get-dictionary';
// import { Locale, i18n } from 'i18n-config';

// interface Props {
//   myListMosaicData: (CycleDetail | WorkDetail)[];
//   dict:any
// }

// const MyListPage: NextPage<Props> = ({ myListMosaicData, dict }) => {

//   return (
//     <SimpleLayout title={t(dict,'browserTitleMyList')}>
//       <h4 className="mt-4 mb-5">{t(dict,'mosaicHeaderMyCycles')}</h4>
//       <Mosaic cacheKey={['my-list','']} stack={myListMosaicData} />
//     </SimpleLayout>
//   );
// };

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const session = await getSession(ctx);
//   const dictionary=await getDictionary(ctx.locale as Locale ?? i18n.defaultLocale);
//   const dict = dictionary['common'];

//   let interleavedResults:(Cycle|Work|undefined)[]=[]
//   if (session == null) {
//     ctx.res.writeHead(302, { Location: '/' });
//     ctx.res.end();
//     // return { notFound: true };
//   }
//   else{
//     const cycles = await searchCycles({
//       where: JSON.stringify({
//         OR: [{ participants: { some: { id: session.user.id } } }, { favs: { some: { id: session.user.id } } }],
//       }),
//       include: JSON.stringify({ localImages: true }),
//     });
  
//     const works = await searchWork({
//       where: JSON.stringify({ favs: { some: { id: session.user.id } } }),
//       include: JSON.stringify({ localImages: true }),
//     });
  
//     interleavedResults = flatten(zip(cycles, works)).filter((workOrCycle) => workOrCycle != null);
//   }
//   return {
//     props: {
//       dict,
//       session,
//       myListMosaicData: interleavedResults,
//     },
//   };

// };

// export default MyListPage;
export default {}