import { FunctionComponent, useState,useEffect } from 'react';
import { Button, Container,Carousel } from 'react-bootstrap';
import { AiOutlineClose, AiOutlineDown } from 'react-icons/ai';

import styles from './BannerCustomizable.module.css';
import useBackOffice from '@/src/useBackOffice';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useDictContext } from '../hooks/useDictContext';

// const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT } = process.env;
// const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;

/*type Props = {
  content: string | JSX.Element | JSX.Element[];
  expandBannerLabel?: string | JSX.Element | JSX.Element[];
  show?: boolean;
  className?: string;
  style?: Record<string, string>;
  cacheKey: [string, string];
};*/

const BannerCustomizableMobile: FunctionComponent = ({
}) => {
  const { t, dict } = useDictContext();
  const{lang}=useParams<{lang:string}>()!;
  const router = useRouter();
  const {data:session, status} = useSession();
  const isLoadingSession = status === "loading"

  const [show, setShow] = useState<boolean>(true);
  const {data:bo } = useBackOffice(undefined,lang);

  // const [image1, setImage1] = useState<string | undefined>();
  // const [image2, setImage2] = useState<string | undefined>();
  // const [image3, setImage3] = useState<string | undefined>();
  
  
  
  // useEffect(() => {
  //   if (bo && bo.sliderImages.length) {
  //     if(bo.SlideImage1 !='null'){
  //       let storeFile1 = bo.sliderImages.filter(x=> x.originalFilename == bo.SlideImage1)[0].storedFile;
  //       setImage1(`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/backoffice/${storeFile1}`);
  //     }
  //     if(bo.SlideImage2 !='null'){
  //       let storeFile2 = bo.sliderImages.filter(x=> x.originalFilename == bo.SlideImage2)[0].storedFile;
  //       setImage2(`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/backoffice/${storeFile2}`);
  //     }
  //      if(bo.SlideImage3 !='null'){
  //       let storeFile3 = bo.sliderImages.filter(x=> x.originalFilename == bo.SlideImage3)[0].storedFile;
  //       setImage3(`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/backoffice/${storeFile3}`);
  //     }
  //   }
  // }, [bo]);


  return (
    <>
      <section className="d-block bg-primary p-3" style={{ backgroundImage: "url('/img/bg-header.svg')",marginBottom:(show) ? '9em' : '2em',maxHeight: (show) ? '18em' : '4em' }}>
        <aside className="d-flex justify-content-end">
          {show && (
            <Button
              variant="info"
              onClick={() => setShow(false)}
              className="py-1 px-3 border-white text-white fs-6 bg-transparent rounded-pill"
            >
              {t(dict,'Close')} <AiOutlineClose />
            </Button>
          )}
          {!show && (
            <Button
              variant="info"
              onClick={() => setShow(true)}
              className="py-1 px-3 border-white text-white fs-6 bg-transparent rounded-pill"
            >
              {t(dict,'Expand')} <AiOutlineDown />
            </Button>
          )}
        </aside>
        {show && (
          <>
            <Container className={`${styles.grid} text-white text-center`} style={{minHeight:'1em'}}>             
            </Container>
            <div className='d-flex justify-content-center'>
            <Carousel indicators={true} controls={false}  style={{width: '98%'}} >
              {bo?.sliders.map(s=>{
                return <Carousel.Item key={`slide-${s.id}`} className="text-secondary bg-gray-very-light" style={{ height: '21rem' }}>
                <div className="d-flex flex-row" >
                  <div className="d-flex flex-column mt-2 px-3 py-3" style={{minWidth:'65%%'}}>
                    <h1 className="fs-3">{s?.title}</h1>
                    <p className="p-0 mx-1 text-wrap fs-6" dangerouslySetInnerHTML={{ __html: s?.text??'' }}/>
                     <div className="d-flex  mt-2"> 
                     {(!isLoadingSession && !session) 
                          ? <Button variant="primary" className='text-white' onClick={() => router.push("/")} >{t(dict,'JoinEureka')}</Button> 
                          : ''
                        }
                    </div>
                  </div>
                </div>
            </Carousel.Item>
              })}
              {/* <Carousel.Item className="text-secondary bg-gray-very-light" style={{ height: '21rem' }}>
                <div className="d-flex flex-row" >
                    <div className="d-flex flex-column mt-2  px-3 py-3" style={{minWidth:'65%'}}>
                      <h1 className="fs-3">{bo?.SlideTitle2}</h1>
                      <p className="p-0 mx-1 text-wrap fs-6">{bo?.SlideText2}</p>
                       <div className="d-flex mt-2"> 
                       {(!isLoadingSession && !session) 
                            ? <Button variant="primary" className='text-white' onClick={() => router.push("/")} >{t(dict,'JoinEureka')}</Button> 
                            : ''
                          }
                      </div>
                    </div>
                  </div>
              </Carousel.Item>
              <Carousel.Item className="text-secondary bg-gray-very-light" style={{ height: '21rem' }}>
                <div className="d-flex flex-row" >
                    <div className="d-flex flex-column mt-2  px-3 py-3" style={{minWidth:'65%'}}>
                      <h1 className="fs-3">{bo?.SlideTitle3}</h1>
                      <p className="p-0 mx-1 text-wrap fs-6">{bo?.SlideText3}</p>
                       <div className="d-flex  mt-2"> 
                       {(!isLoadingSession && !session) 
                            ? <Button variant="primary" className='text-white' onClick={() => router.push("/")} >{t(dict,'JoinEureka')}</Button> 
                            : ''
                          }
                      </div>
                    </div>
                  </div>
              </Carousel.Item> */}
            </Carousel>
            </div>
          </>
        )}
      </section>
    </>
  );
};
export default BannerCustomizableMobile;
