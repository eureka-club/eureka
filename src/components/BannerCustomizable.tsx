import { FunctionComponent, useEffect, useState } from 'react';
import { AiOutlineClose, AiOutlineDown } from 'react-icons/ai';
import useTranslation from 'next-translate/useTranslation';
import useBackOffice from '@/src/useBackOffice';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { AZURE_CDN_ENDPOINT, AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } from '../constants';
import { Box, Button, Typography,  Stack } from '@mui/material';
import { BsCircle, BsCircleFill } from 'react-icons/bs';

const BannerCustomizable: FunctionComponent = ({
}) => {
  const { t, lang } = useTranslation('common');
  const router = useRouter();
  const {data:session, status} = useSession();
  const isLoadingSession = status === "loading"
  const[idxActive,setidxActive]=useState(0);
  const [show, setShow] = useState<boolean>(true);
  const {data:bo } = useBackOffice(undefined,lang);
  const [requireScroll,setrequireScroll]=useState(false);
  
  useEffect(()=>{
    const el:any = document.querySelector(`#outerRef-${idxActive}`);
    const offsetHeight = el?.offsetHeight!;
    const scrollHeight = el?.scrollHeight!
    if(offsetHeight < scrollHeight){
      setrequireScroll(true);
    }
  },[idxActive]);
  
  const imgBaseUrl=`${AZURE_CDN_ENDPOINT}/${AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/backoffice/`;
  
  if(!bo?.sliders.length)return <></>;
  return <Box sx={{backgroundColor:'var(--eureka-green)'}}>
      <Stack>
        <Box alignSelf={'end'} padding={'.5rem'}>
          {show && (
                  <Button
                    variant='text'
                    onClick={() => setShow(false)}
                    className="py-1 px-3 border-white text-white fs-6 bg-transparent rounded-pill"
                  >
                    {t('Close')} <AiOutlineClose />
                  </Button>
                )}
                {!show && (
                  <Button
                    variant='text'
                    onClick={() => setShow(true)}
                    className="py-1 px-3 border-white text-white fs-6 bg-transparent rounded-pill"
                  >
                    {t('Expand')} <AiOutlineDown />
                  </Button>
                )}
        </Box>
      </Stack>
      {
        show
          ? <Stack alignItems={'center'}
          sx={{
            backgroundImage: "url('/img/bg-header.svg')",
            marginBottom: show ? '8em' : '2em',
            height: show ? '15em' : '4em',
            
          }}>
           
          {bo?.sliders.map((s,currentIdx) => (
            <Box  key={`${s.title}-${currentIdx}`} sx={{ 
              display:currentIdx==idxActive ? 'flex': 'none',
              width:'90%',
              
              }} 
              position={'relative'}
            >
              <Stack  direction={'row'} sx={{backgroundColor:'#F8F9FB',height:'20rem',width:'100%'}}>
                <Box flex={1}>
                  <img src={`${imgBaseUrl}${s.images[0].storedFile}`} style={{ width: '24rem', height: '20rem' }}/>
                </Box>
                <Stack flex={3} id={`outerRef-${currentIdx}`}  sx={{ height:'20rem',width:'100%',whiteSpace: 'nowrap', padding:'.5rem 1rem', overflowY:'hidden' }}>
                  <Box id={`innerRef-${currentIdx}`} sx={{overflowY:'auto',height:'100%'}}>
                    <Stack gap={1} sx={{padding:'2rem 2rem 0 2rem'}}>
                      <Typography color={'secondary'} variant='h2' sx={{whiteSpace:'break-spaces',fontSize:'1.8rem'}}>{s.title}</Typography>
                      <Stack gap={1} className='Zxc'>
                        <style jsx global>{`
                          .Zxc p{
                            margin:0!important;
                          }
                        `}</style>
                        <Typography color={'secondary'} variant='h6' sx={{whiteSpace:'normal',lineHeight:1.3}} textAlign={'justify'} dangerouslySetInnerHTML={{ __html: s?.text??'' }}/>
                        <Stack  padding={requireScroll ? '.25rem 0 3rem 0': '0rem'}>
                        {
                          !isLoadingSession && !session
                          ? <Box sx={{paddingTop:".5rem"}} >
                              <Button  style={{textTransform: 'none'}} className="btn-eureka" onClick={() => router.push(s.url)}>
                                {t('JoinEureka')} 
                              </Button>
                            </Box>
                          : <></>
                        }
                        </Stack>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              </Stack>
              
              
            </Box>
          ))}
          <Box>
          {
                bo?.sliders.length>1 
                 ? <Box
                  sx={{
                    display:'flex',
                    padding:'1rem .5rem',
                    gap:'.25rem',
                    width:'100%',
                    
                    alignItems:'center',
                    justifyContent:'center',
                    backgroundColor:'rgba(245, 246, 248, 0.93)'
                  }}
                >
                  {
                      
                      [...Array(bo?.sliders.length)].map((a,idx)=>{
                        return <Button
                        variant='text'
                          key={`slider-${idx}`} 
                          onClick={(e)=>{
                            setidxActive(idx);
                          }}
                          sx={{
                            padding:'.25rem .1rem',
                            minWidth:'1.5rem',
                            height:'.5rem'
                          }}
                        >
                          {/* <Paper> */}
                          {
                            idx==idxActive
                              ? <BsCircleFill/>
                              : <BsCircle/>
                          }
                            {/* <Box sx={{borderRadius:'.125rem',backgroundColor:idx==idxActive ? 'var(--color-secondary)' : 'var(--color-primary)',minWidth:'1.5rem',height:'.5rem',padding:'.4rem'}}/> */}
                          {/* </Paper> */}
                        </Button>
                      })
                      
                  }
                </Box>
                 : <></>
              }
          </Box>
            </Stack>
          :<></>
      }
    </Box>
  // return (
  //   <>
  //   {
  //     bo?.sliders.length  
  //       ? <section
  //         className="d-block bg-primary p-3"
  //         style={{
  //           backgroundImage: "url('/img/bg-header.svg')",
  //           marginBottom: show ? '8em' : '2em',
  //           // marginTop: '4.8em',
  //           maxHeight: show ? '18em' : '4em',
  //         }}
  //       >
  //         <aside className="d-flex justify-content-end">
  //           {show && (
  //             <Button
  //               variant='text'
  //               onClick={() => setShow(false)}
  //               className="py-1 px-3 border-white text-white fs-6 bg-transparent rounded-pill"
  //             >
  //               {t('Close')} <AiOutlineClose />
  //             </Button>
  //           )}
  //           {!show && (
  //             <Button
  //               variant='text'
  //               onClick={() => setShow(true)}
  //               className="py-1 px-3 border-white text-white fs-6 bg-transparent rounded-pill"
  //             >
  //               {t('Expand')} <AiOutlineDown />
  //             </Button>
  //           )}
  //         </aside>
  //         {show && (
  //           <>
  //             <div className="d-flex justify-content-center pt-3">
  //               <Carousel indicators={true} controls={false} style={{ width: '90%' }}>
  //                 {bo?.sliders.map(s=>{
  //                   const storedFile = s.images?.length ? s.images[0].storedFile : '';
  //                   return <Carousel.Item key={`slide-carousel-item-${s.id}`} className="text-secondary bg-gray-very-light" style={{ height: '20rem' }}>
  //                   <div className="d-flex flex-row">
  //                     <div className="">
  //                       {
  //                         storedFile
  //                         ? <img key={`img-${s.id}`} style={{ width: '22em', height: '20em' }} src={`${imgBaseUrl}${storedFile}`} alt="" />
  //                         : <></>
  //                       }
  //                     </div>
  //                     <div className="d-flex flex-column mt-4 px-5 py-3" style={{ minWidth: '65%' }}>
  //                       <h2 className="h1 font-weight-bold fs-2">{s?.title}</h2>
  //                       <div className="p-0 mx-1 text-wrap fs-5" dangerouslySetInnerHTML={{ __html: s?.text??'' }}/>
                        
  //                       <div className="d-flex  pt-2">
  //                         {!isLoadingSession && !session ? (
  //                           <Button className="btn-eureka" onClick={() => router.push('/register')}>
  //                             {t('JoinEureka')}
  //                           </Button>
  //                         ) : (
  //                           ''
  //                         )}
  //                       </div>
  //                     </div>
  //                   </div>
  //                 </Carousel.Item>
  //                 })}
                  
  //               </Carousel>
  //             </div>
  //           </>
  //         )}
  //         </section>
  //       : <></>
  //     }
  //   </>
  // );
};

export default BannerCustomizable;
