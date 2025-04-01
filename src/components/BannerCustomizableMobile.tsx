import { FunctionComponent, useState } from 'react';
// import { Button, Container,Carousel } from 'react-bootstrap';
import { AiOutlineClose, AiOutlineDown } from 'react-icons/ai';
import useTranslation from 'next-translate/useTranslation';
import styles from './BannerCustomizable.module.css';
import useBackOffice from '@/src/useBackOffice';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Box, Button, Card, CardActions, CardContent, Typography, } from '@mui/material';



import { AZURE_CDN_ENDPOINT, AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } from '../constants';
import { CardBody } from 'react-bootstrap';

const imgBaseUrl=`${AZURE_CDN_ENDPOINT}/${AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/backoffice/`;

const BannerCustomizableMobile: FunctionComponent = ({
}) => {
  const { t,lang } = useTranslation('common');
  const router = useRouter();
  const {data:session, status} = useSession();
  const isLoadingSession = status === "loading"

  const [show, setShow] = useState<boolean>(true);
  const {data:bo } = useBackOffice(undefined,lang);

  return (
    <>
      <section className="d-block bg-primary p-3" style={{ backgroundImage: "url('/img/bg-header.svg')",marginBottom:(show) ? '9em' : '2em',maxHeight: (show) ? '18em' : '4em' }}>
        <aside className="d-flex justify-content-end">
          {show && (
            <Button
              variant="contained"
              onClick={() => setShow(false)}
              className="py-1 px-3 border-white text-white fs-6 bg-transparent rounded-pill"
            >
              {t('Close')} <AiOutlineClose />
            </Button>
          )}
          {!show && (
            <Button
              variant="contained"
              onClick={() => setShow(true)}
              className="py-1 px-3 border-white text-white fs-6 bg-transparent rounded-pill"
            >
              {t('Expand')} <AiOutlineDown />
            </Button>
          )}
        </aside>
        {show && (
          <>
          <Box
      sx={{
        display: 'flex',
        gap: 1,
        py: 1,
        overflow: 'auto',
        width: '100%',
        scrollSnapType: 'x mandatory',
        '& > *': {
          scrollSnapAlign: 'center',
        },
        '::-webkit-scrollbar': { display: 'none' },
      }}
    >

{bo?.sliders.map(s=>{
                  return <Card sx={{ borderRadius:'0!important',minWidth: 300, backgroundColor:'#F8F9FB' }} key={`slide-${s.id}`}>
                    <CardContent sx={{padding:'.5rem .5rem .25 .5rem!important'}}>
                        <Typography variant='h5' sx={{whiteSpace:'break-spaces'}}>{s.title}</Typography>
                        <Box sx={{whiteSpace:'break-spaces',fontSize:'.85rem',margin:0}} dangerouslySetInnerHTML={{ __html: s?.text??'' }}/>
                          {(!isLoadingSession && !session) 
                              ? <Button variant="contained" className='text-white' onClick={() => router.push(s.url)} >{t('JoinEureka')}</Button> 
                              : ''
                            }
                    </CardContent>
                        
                </Card>
                })}

    </Box>
            {/* <div className='d-flex justify-content-center pt-3'>
              <Carousel indicators={true} controls={false}  style={{width: '98%'}} >
                {bo?.sliders.map(s=>{
                  return <Carousel.Item key={`slide-${s.id}`} className="text-secondary bg-gray-very-light" style={{ height: '21rem' }}>
                  <div className="d-flex flex-row" >
                    <div className="d-flex flex-column mt-2 px-3 py-3" style={{minWidth:'65%%'}}>
                      <h1 className="fs-3">{s?.title}</h1>
                      <div className="p-0 mx-1 text-wrap fs-6" dangerouslySetInnerHTML={{ __html: s?.text??'' }}/>
                      <div className="d-flex  mt-2"> 
                      {(!isLoadingSession && !session) 
                            ? <Button variant="primary" className='text-white' onClick={() => router.push(s.url)} >{t('JoinEureka')}</Button> 
                            : ''
                          }
                      </div>
                    </div>
                  </div>
              </Carousel.Item>
                })}
              </Carousel>
            </div> */}
          </>
        )}
      </section>
    </>
  );
};
export default BannerCustomizableMobile;
