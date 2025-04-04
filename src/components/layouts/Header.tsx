// import { FunctionComponent, useState, useEffect } from 'react';
// import { Button, Col, Container, Row } from 'react-bootstrap';
// import { AiOutlineClose, AiOutlineDown } from 'react-icons/ai';
// import useTranslation from 'next-translate/useTranslation';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/router';
// import withTitle from '../../HOCs/withTitle';
// import styles from './Header.module.css';

// type Props = {
//   // children: string | JSX.Element | JSX.Element[];
//   title?: string;
//   show?: boolean;
// };

// const Header: FunctionComponent<Props> = ({ show: s = false }) => {
//   const { t } = useTranslation('common');
//   const [show, setShow] = useState<boolean>(s);
//   const {data:session, status} = useSession();
//   const isLoadingSession = status === "loading"
//   const router = useRouter();

//   useEffect(() => {
//     if (session) setShow(false);
//   }, [session]);

//   /*const openSignInModal = () => {
//     setGlobalModalsState({ ...globalModalsState, ...{ signInModalOpened: true } });
//   };*/

//   const handlerLogin = ()=>{
//     sessionStorage.setItem('loginRedirect',router.asPath)
//     router.push('/')
//   }
//   return (
//     <>
//       <section className="bg-primary p-3" style={{ backgroundImage: "url('/img/bg-header.svg')" }}>
//         <aside className="d-flex justify-content-end">
//           {show && (
//             <Button
//               variant="info"
//               onClick={() => setShow(false)}
//               className="mt-2 py-1 px-3 border-white text-white fs-6 bg-transparent rounded-pill"
//             >
//               {t('Close')} <AiOutlineClose />
//             </Button>
//           )}
//           {!show && (
//             <Button
//               variant="info"
//               onClick={() => setShow(true)}
//               className="mt-2 py-1 px-3 border-white text-white fs-6 bg-transparent rounded-pill"
//             >
//               {t('openHeaderLabel')} <AiOutlineDown />
//             </Button>
//           )}
//         </aside>
//         {show && (
//           <Container className={`${styles.grid}`}>
//             <Row className="text-white mb-5">
//               <Col xs={12} md={4} className="d-flex flex-column">
//                 <h1 className="h1 ms-auto">{t('underEurekaLabel')}</h1>
//                 {/* <em className="fs-6 ms-auto">{t('underEurekaLabel')}</em> */}
//               </Col>
//               <Col xs={12} md={8} className="text-start">
//                 <p className="ps-4">
//                   {t('eurekaReasonLabel')}
//                   <br />
//                   {t('eurekaReasonLabel2')}
//                 </p>
//               </Col>
//             </Row>

//             <Row className="d-flex justify-content-around" style={{ marginBottom: '-5em' }}>
//               <Col
//                 xs={12}
//                 md={3}
//                 className=""
//               >
//                 <div className="p-3 text-white rounded d-flex flex-column align-items-center mb-1 bg-secondary" style={{width:'280px',height:'213px'}}>
//                   <aside className={`${styles.bgHeaderLeft}`} />
//                   <h2 className="h6 text-center">{t('headerLeftBoxTitle')}</h2>
//                   <p className="p-0 m-0 text-wrap text-center fs-6 fst-italic">{t('headerLeftBoxText')}</p>
//                 </div>
//               </Col>
//               <Col
//                 xs={12}
//                 md={3}
//                 className=""
//               >
//                 <div className="p-3 text-white rounded d-flex flex-column align-items-center mb-1 bg-secondary" style={{width:'280px',height:'213px'}}>
//                   <aside className={`${styles.bgHeaderCenter}`} />
//                   <h2 className="h6 text-center">{t('headerCenterBoxTitle')}</h2>
//                   <p className="p-0 m-0 text-wrap text-center fs-6 fst-italic">{t('headerCenterBoxText')}</p>
//                 </div>
//               </Col>
//               <Col
//                 xs={12}
//                 md={3}
//                 className=""
//               >
//                 <div className="p-3 text-white rounded d-flex flex-column align-items-center mb-1 bg-secondary" style={{width:'280px',height:'213px'}}>
//                   <aside className={`${styles.bgHeaderRight}`} />
//                   <h2 className="h6 text-center">{t('headerRightBoxTitle')}</h2>
//                   <p className="p-0 m-0 text-wrap text-center fs-6 fst-italic">{t('headerRightBoxText')}</p>
//                 </div>
//               </Col>
//             </Row>
//           </Container>
//         )}
//       </section>
//       {show && (
//         <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
//           {!isLoadingSession && !session && (
//             <Button onClick={handlerLogin} className="button text-white rounded-pill" variant="primary">
//               {t('headerSessionBtnLabel')}
//             </Button>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default withTitle(Header);
export default function Header({show}:{show:boolean}){return <>TODO</>}
