// import { NextPage,GetServerSideProps } from 'next';
// import Head from "next/head";
// import { Col, Row, Spinner } from 'react-bootstrap';
// import SimpleLayout from '@/components/layouts/SimpleLayout';
// import { useSession, getSession } from 'next-auth/react';
// import useTranslation from 'next-translate/useTranslation';
// import { dehydrate,QueryClient } from 'react-query';
// import UMI from '@/src/components/user/MosaicItem';
// import {useRouter} from 'next/router'
// import {getUser} from '@/src/useUser';
// import useUserSumary from '@/src/useUserSumary';
// import { ButtonsTopActions } from '@/src/components/ButtonsTopActions';

// interface Props{
//   id:number
// }

// const MyUsersFollowed: NextPage<Props> = ({id}) => {
//   const { t } = useTranslation('common');
//   const router = useRouter()
//   const {data:session,status} = useSession();
//   const isLoadingSession = status === "loading"
//   if(!isLoadingSession && !session)router.push('/')
//   const {data:user} = useUserSumary(id)
//   return <>
//     <Head>
//         <meta property="og:title" content='Eureka'/>
//         <meta property="og:description" content="Activa tu mente, transforma el mundo"/>
//         <meta property="og:url" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}`} />
//         <meta property="og:image" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}/logo.jpg`} />
//         <meta property="og:type" content='website' />

//         <meta name="twitter:card" content="summary_large_image"></meta>
//         <meta name="twitter:site" content="@eleurekaclub"></meta>
//         <meta name="twitter:title" content="Eureka"></meta>
//         <meta name="twitter:description" content="Activa tu mente, transforma el mundo"></meta>
//         <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}/logo.jpg`} ></meta>
//         <meta name="twitter:url" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}`} ></meta>  
//     </Head>
//     <SimpleLayout>
//       <ButtonsTopActions/>
//       <article className='mt-4' data-cy="my-users-followed">
//       {
//       isLoadingSession 
//         ? <Spinner animation="grow"/>
//         : user ? (
//           <>
//           <h1 className="text-secondary fw-bold mt-sm-0 mb-4">{t('myUsersFollowed')}</h1>
//             <Row>
//               {(user?.following).map(c=>
//                 <Col key={c.id} xs={12} sm={6} lg={3} className='mb-4 d-flex justify-content-center  align-items-center'>
//                   <UMI userId={c.id} />
//                 </Col>
//               )}
//             </Row>
//            </>
//         ) : ''
//       }
//       </article>
//     </SimpleLayout>
//   </>
// };
// export const getServerSideProps:GetServerSideProps= async (ctx)=>{
//   const qc = new QueryClient();
//   const session = await getSession({ctx})
//   let id = 0
//   if(ctx.query && ctx.query.slug){
//     const slug = ctx.query.slug.toString()
//     const li = slug.split('-').slice(-1)
//     id = parseInt(li[0])
//   }
//   let res = {
//     props:{
//       id,
//       session,
//       dehydrateState:dehydrate(qc)
//     }
//   }
//   if(!session)return res;
//   const origin = process.env.NEXT_PUBLIC_WEBAPP_URL;

//   await qc.fetchQuery(['USER',id.toString()],()=>getUser(id));
  
//   res = {
//     props:{
//       id,
//       session,
//       dehydrateState:dehydrate(qc)
//     }
//   }
//   return res;
// }
const MyUsersFollowed = ()=>{
    return <>not set</>
}
export default MyUsersFollowed;