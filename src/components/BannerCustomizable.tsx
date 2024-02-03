"use client"
import { FunctionComponent, useState } from 'react';
import { Button, Container,Carousel } from 'react-bootstrap';
import { AiOutlineClose, AiOutlineDown } from 'react-icons/ai';

import styles from './BannerCustomizable.module.css';
import useBackOffice from '@/src/useBackOffice';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useDictContext } from '../hooks/useDictContext';

const BannerCustomizable: FunctionComponent = ({
}) => {
  const { t, dict } = useDictContext();
  const router = useRouter();
  const{lang}=useParams<{lang:string}>()!;
  const {data:session, status} = useSession();
  const isLoadingSession = status === "loading"

  const [show, setShow] = useState<boolean>(true);
  const {data:bo } = useBackOffice(undefined,lang);
  const imgBaseUrl=`https://${process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/backoffice/`;

  return (
    <>
    {
      bo?.sliders.length  ?
        <section
          className="d-block bg-primary p-3"
          style={{
            backgroundImage: "url('/img/bg-header.svg')",
            marginBottom: show ? '8em' : '2em',
            marginTop: '4.8em',
            maxHeight: show ? '18em' : '4em',
          }}
        >
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
              <Container className={`${styles.grid} text-white text-center`} style={{ minHeight: '1em' }}></Container>
              <div className="d-flex justify-content-center">
                <Carousel indicators={true} controls={false} style={{ width: '90%' }}>
                  {bo?.sliders.map(s=>{
                    return <Carousel.Item key={`slide-carousel-item-${s.id}`} className="text-secondary bg-gray-very-light" style={{ height: '20rem' }}>
                    <div className="d-flex flex-row">
                      <div className="">
                        <img key={`img-${s.id}`} style={{ width: '22em', height: '20em' }} src={`${imgBaseUrl}${s.images[0].storedFile}`} alt="" />
                      </div>
                      <div className="d-flex flex-column mt-4 px-5 py-3" style={{ minWidth: '65%%' }}>
                        <h2 className="h1 font-weight-bold fs-2">{s?.title}</h2>
                        <p className="p-0 mx-1 text-wrap fs-5" dangerouslySetInnerHTML={{ __html: s?.text??'' }}/>
                        
                        <div className="d-flex  mt-2">
                          {!isLoadingSession && !session ? (
                            <Button className="btn-eureka" onClick={() => router.push('/register')}>
                              {t(dict,'JoinEureka')}
                            </Button>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    </div>
                  </Carousel.Item>
                  })}
                  
                </Carousel>
              </div>
            </>
          )}
        </section>
        :<></>
      }
    </>
  );
};

export default BannerCustomizable;
