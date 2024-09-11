import useFeaturedWorks from '@/src/useFeaturedWorks';
import { Col,Row, Carousel } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import MosaicItem from '@/components/work/MosaicItem';
import WorkPostImages from './WorkPostImages';
import WorkComments from './WorkComments';
import Spinner from '../../Spinner';
import { Avatar, Box, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { deepPurple } from '@mui/material/colors';


const FeaturedWorks = () => {
  const { data: dataFeaturedWorks,isLoading } = useFeaturedWorks();
  const { t,lang } = useTranslation('featuredWorks');
  if(isLoading)return <Spinner/>;
  else if(!isLoading && !dataFeaturedWorks?.works?.length)return <></>;
  
  return <Box>
    <Stack direction={'row'} alignItems={'center'} gap={1}>
      <Avatar sx={{width:24,height:24,bgcolor: 'color-mix(in srgb, var(--color-secondary) 50%, transparent)' }}>✨</Avatar>
      <Typography variant='h6' color={'secondary'}>{t('FeaturedDiscussions')}</Typography>
    </Stack>
    <List>
    {
      dataFeaturedWorks?.works.map(w=><ListItem key={`featured-work-${w.id}`} sx={{
        margin:0,padding:'0 .5rem',cursor:'pointer',
        ':hover':{
          borderRadius:'4px',
          boxShadow:'0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
          background:'var(--color-secondary)',
          color:'white',
          '& p':{
            color:'lightgray',
          }
        }
        }}>
        <Link href={`/${lang}/work/${w.id}`}>
          <ListItemText primary={w.title} secondary={w.author} />
        </Link> 
      </ListItem>)
    }
  </List>
  </Box>
  // if (dataFeaturedWorks?.works && dataFeaturedWorks.works?.length) {
  //   return (
  //     <section className=" mb-4">
  //       <h2 className="text-secondary fw-bold mb-2" style={{ fontSize: '1.5rem' }}>
  //         {t('FeaturedDiscussions')}
  //       </h2>
  //       <div className="d-flex justify-content-center">
  //         <Carousel
  //           slide={true}
  //           indicators={true}
  //           controls={false}
  //           style={{ width: '100%' }}
  //         >
  //           {dataFeaturedWorks.works?.map((work) => (
  //             <Carousel.Item key={work.id} className="">
  //               <Row className="d-flex flex-row w-100  bg-gray-very-light rounded-3 py-4 m-0  pe-0 pe-lg-3">
  //                 <Col xs={12}  xl={4} className="d-flex justify-content-center">
  //                   <MosaicItem workId={work.id} size={'large'}/>
  //                 </Col>
  //                 <Col xs={12} xl={8} className="d-flex flex-column">
  //                   <WorkPostImages work={work} workId={work.id} workTitle={work.title} />
  //                   <WorkComments workId={work.id} />
  //                 </Col>
                
  //               </Row>
  //             </Carousel.Item>
  //           ))}
  //         </Carousel>
  //       </div>
  //     </section>
  //   );
  // } else return <></>;
};
export default FeaturedWorks;
