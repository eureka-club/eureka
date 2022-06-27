import { FunctionComponent, useState } from 'react';
import { Button, Container,Carousel } from 'react-bootstrap';
import { AiOutlineClose, AiOutlineDown } from 'react-icons/ai';
import useTranslation from 'next-translate/useTranslation';
import styles from './BannerCustomizable.module.css';
import useBackOffice from '@/src/useBackOffice';
const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT } = process.env;
const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;

/*type Props = {
  content: string | JSX.Element | JSX.Element[];
  expandBannerLabel?: string | JSX.Element | JSX.Element[];
  show?: boolean;
  className?: string;
  style?: Record<string, string>;
  cacheKey: [string, string];
};*/

const BannerCustomizable: FunctionComponent = ({
}) => {
  const { t } = useTranslation('common');
  const [show, setShow] = useState<boolean>(true);
  const {data:bo } = useBackOffice();

  console.log(bo,'bobo')

  return (
    <>
      <section className="d-block bg-primary p-3" style={{ backgroundImage: "url('/img/bg-header.svg')",marginBottom:(show) ? '5em' : '2em',marginTop:'4.8em',maxHeight: (show) ? '16em' : '4em' }}>
        <aside className="d-flex justify-content-end">
          {show && (
            <Button
              variant="info"
              onClick={() => setShow(false)}
              className="py-1 px-3 border-white text-white fs-6 bg-transparent rounded-pill"
            >
              {t('Close')} <AiOutlineClose />
            </Button>
          )}
          {!show && (
            <Button
              variant="info"
              onClick={() => setShow(true)}
              className="py-1 px-3 border-white text-white fs-6 bg-transparent rounded-pill"
            >
              {t('Expand')} <AiOutlineDown />
            </Button>
          )}
        </aside>
        {show && (
          <>
            <Container className={`${styles.grid} text-white text-center`} style={{minHeight:'1em'}}>             
            </Container>
            <div className='d-flex justify-content-center'>
            <Carousel indicators={true} controls={false}  style={{width: '65%'}} >
              <Carousel.Item className="p-3 text-white mb-1 bg-secondary" style={{ height: '14rem' }}>
                  <div className="d-flex flex-row" style={{maxWidth:'92%', maxHeight: '12rem' }}>
                    <div className='' >
                         <img
                          style={{width:'12em',height:'12em'}}
                          src="/img/default-avatar.png"
                          alt=""
                        />
                    </div>
                    <div className="d-flex flex-column justify-content-center" style={{minWidth:'85%'}}>
                      <h2 className="h1 text-center">{bo?.SlideTitle1}</h2>
                      <p className="p-0 mx-1 text-wrap text-center fs-4 fst-italic">{bo?.SlideText1}</p>
                       <div className="d-flex justify-content-end me-1"> 
                          <Button variant="primary" className='text-white' >{t('JoinEureka')}</Button>
                      </div>
                    </div>
                  </div>
              </Carousel.Item>
              <Carousel.Item className="p-3 text-white mb-1 bg-secondary" style={{ height: '14rem' }}>
                <div className="d-flex flex-row" style={{maxWidth:'92%', maxHeight: '12rem' }}>
                    <div className='' >
                         <img
                          style={{width:'12em',height:'12em'}}
                          src="/img/default-avatar.png"
                          alt=""
                        />
                    </div>
                    <div className="d-flex flex-column justify-content-center" style={{minWidth:'85%'}}>
                      <h2 className="h1 text-center">{bo?.SlideTitle2}</h2>
                      <p className="p-0 mx-1 text-wrap text-center fs-4 fst-italic">{bo?.SlideText2}</p>
                       <div className="d-flex justify-content-end me-1"> 
                          <Button variant="primary" className='text-white' >{t('JoinEureka')}</Button>
                      </div>
                    </div>
                  </div>
              </Carousel.Item>
              <Carousel.Item className="p-3 text-white mb-1 bg-secondary" style={{ height: '14rem' }}>
                <div className="d-flex flex-row" style={{maxWidth:'92%', maxHeight: '12rem' }}>
                    <div className='' >
                         <img
                          style={{width:'12em',height:'12em'}}
                          src="/img/default-avatar.png"
                          alt=""
                        />
                    </div>
                    <div className="d-flex flex-column justify-content-center" style={{minWidth:'85%'}}>
                      <h2 className="h1 text-center">{bo?.SlideTitle3}</h2>
                      <p className="p-0 mx-1 text-wrap text-center fs-4 fst-italic">{bo?.SlideText3}</p>
                       <div className="d-flex justify-content-end me-1"> 
                          <Button variant="primary" className='text-white' >{t('JoinEureka')}</Button>
                      </div>
                    </div>
                  </div>
              </Carousel.Item>
            </Carousel>
            </div>
          </>
        )}
      </section>
     
    </>
  );
};

export default BannerCustomizable;
