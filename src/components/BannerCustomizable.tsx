import { FunctionComponent, useState } from 'react';
import { Button, Container,Carousel } from 'react-bootstrap';
import { AiOutlineClose, AiOutlineDown } from 'react-icons/ai';
import useTranslation from 'next-translate/useTranslation';
import { useQueryClient } from 'react-query';
import styles from './Banner.module.css';
import Banner from '@/src/components/Banner';



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
 /* const queryClient = useQueryClient();
  const ss = typeof queryClient.getQueryData(cacheKey) === 'boolean' ? queryClient.getQueryData(cacheKey) : s;*/
  const [show, setShow] = useState<boolean>(true);
 
  const close = () => {
    setShow(false);
    //queryClient.setQueryData(cacheKey, false);
  };
  const open = () => {
    setShow(true);
    //queryClient.setQueryData(cacheKey, true);
  };


  return (
    <>
      <section className="bg-primary p-3" style={{ backgroundImage: "url('/img/bg-header.svg')",marginTop:'4.8em' }}>
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
              {t('openHeaderLabel')} <AiOutlineDown />
            </Button>
          )}
        </aside>
        {show && (
          <>
            <Container className={`${styles.grid} text-white text-center`}>
              <h1 className="h1 ms-auto mt-3">{t('underEurekaLabel')}</h1>
              <p className="">
                {t('eurekaReasonLabel')}
                <br />
                {t('eurekaReasonLabel2')}
              </p>
            </Container>
            <Carousel style={{ marginBottom: '-5em' }} nextIcon={<em />} prevIcon={<em />}>
              <Carousel.Item className="p-3 text-white mb-1 bg-secondary" style={{ height: '16rem' }}>
                <aside className="d-block w-100">
                  <div className="d-flex justify-content-center">
                    <aside className={`${styles.bgHeaderLeft}`} />
                  </div>
                  <h2 className="h6 text-center">{t('headerLeftBoxTitle')}</h2>
                  <p className="p-0 m-0 text-wrap text-center fs-6 fst-italic">{t('headerLeftBoxText')}</p>
                </aside>
              </Carousel.Item>
              <Carousel.Item className="p-3 text-white mb-1 bg-secondary" style={{ height: '16rem' }}>
                <aside className="d-block w-100">
                  <div className="d-flex justify-content-center">
                    <aside className={`${styles.bgHeaderCenter}`} />
                  </div>
                  <h2 className="h6 text-center">{t('headerCenterBoxTitle')}</h2>
                  <p className="p-0 m-0 text-wrap text-center fs-6 fst-italic">{t('headerCenterBoxText')}</p>
                </aside>
              </Carousel.Item>
              <Carousel.Item className="p-3 text-white mb-1 bg-secondary" style={{ height: '16rem' }}>
                <aside className="d-block w-100">
                  <div className="d-flex justify-content-center">
                    <aside className={`${styles.bgHeaderRight}`} />
                  </div>
                  <h2 className="h6 text-center">{t('headerRightBoxTitle')}</h2>
                  <p className="p-0 m-0 text-wrap text-center fs-6 fst-italic">{t('headerRightBoxText')}</p>
                </aside>
              </Carousel.Item>
            </Carousel>
          </>
        )}
      </section>
     
    </>
  );
};

export default BannerCustomizable;
