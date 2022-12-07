
import { FunctionComponent, useEffect, useState, lazy } from 'react';
import useTranslation from 'next-translate/useTranslation';
import {Spinner, Container,Button, Col} from 'react-bootstrap';
import TagsInput from '@/components/forms/controls/TagsInput';
import { GetAllByResonse } from '@/src/types';
import { useInView } from 'react-intersection-observer';
import { CycleMosaicItem } from '../../src/types/cycle';
import { UserMosaicItem } from '../../src/types/user';
import CarouselStatic from '@/src/components/CarouselStatic';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import slugify from 'slugify'
import useFeaturedUsers from '@/src/useFeaturedUsers';
import useMyCycles,{myCyclesWhere} from '@/src/useMyCycles';
import styles from './HomeSingIn.module.css';
import { TextField,FormControl,InputLabel, Select, MenuItem } from '@mui/material';


const Carousel = lazy(()=>import('@/components/Carousel'));

const topics = ['gender-feminisms', 'technology', 'environment',
 'racism-discrimination',
    'wellness-sports','social issues',
    'politics-economics','philosophy',
    'migrants-refugees','introspection',
    'sciences','arts-culture','history',
];

const fetchItems = async (pageParam: number,topic:string):Promise<GetAllByResonse> => {
        const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/getAllBy?topic=${topic}&cursor=${pageParam}`;
        const q = await fetch(url);
        return q.json();
};

interface Props{
        groupedByTopics: Record<string,GetAllByResonse>;
        // myCycles?:CycleMosaicItem[]
      }
      
const HomeSingIn: FunctionComponent<Props> = ({ groupedByTopics}) => {
  const {data:session, status} = useSession();
  const router = useRouter();
  const { t } = useTranslation('common');
  const [ref, inView] = useInView({
    triggerOnce: true,
    // rootMargin: '200px 0px',
    // skip: supportsLazyLoading !== false,
  });
  const [users,setUsers] = useState<UserMosaicItem[]>()
  const {data:dataUsers} = useFeaturedUsers()
  const [cycles,setCycles] = useState<CycleMosaicItem[]>()
  const {data:dataCycles} = useMyCycles(session?.user.id!)
  

  useEffect(()=>{
    if(dataUsers)setUsers(dataUsers)
    if(dataCycles)setCycles(dataCycles.cycles)
  },[dataCycles,dataUsers])

  const [gbt, setGBT] = useState([...Object.entries(groupedByTopics||[])]);
  const [topicIdx,setTopicIdx] = useState(gbt.length-1)

  
  useEffect(()=>{
    const idx = topicIdx+1;
    if(inView && idx < topics.length){
      let isCanceled = false;
      if(!isCanceled){
        const exist = topics[idx] in gbt;
        const fi = async ()=>{
          const r = await fetchItems(0,topics[idx]);
          gbt.push([topics[idx],r])
          if(r){
            setGBT([...gbt]);
            setTopicIdx(idx);
          }
        }
        if(!exist)
          fi()
      }
      return ()=>{
        isCanceled = true
      }
    }
  },[inView, gbt, topicIdx]); 
   
const getTopicsBadgedLinks = () => {
        return <TagsInput formatValue={(v: string) => t(`topics:${v}`)} tags={[...topics].join()} readOnly />;
      };

const renderSpinnerForLoadNextCarousel = ()=>{
if(topicIdx < topics.length-1) return <Spinner ref={ref} animation="grow" />
        return '';
}

const getMediathequeSlug = (id:number,name:string)=>{
    const s =`${name}`
    const slug = `${slugify(s,{lower:true})}-${id}` 
    return slug
}

  const seeAll = async (data: CycleMosaicItem[], q: string, showFilterEngine = true): Promise<void> => {
    if(session){
      const u = session.user
      router.push(`/user/${getMediathequeSlug(u.id,u.name||u.id.toString())}/my-cycles`);
    }
  };
//       <h1 className="text-secondary fw-bold">{t('myCycles')}</h1>

const featuredUsers = () => {
    return (users && users.length && dataUsers) 
    ? <div>      
       <CarouselStatic
        cacheKey={['USERS','FEATURED']}
        //onSeeAll={()=>router.push('/featured-users')}
        seeAll={false}
        data={users}
        title={t('Featured users')}
        userMosaicDetailed = {true}
      />
      </div>
    : <></>;
  };

  const cyclesJoined = () => {
  if(!session)return <></>
  const k = JSON.stringify(myCyclesWhere(session?.user.id))

    return (cycles && cycles.length) 
    ? <div data-cy="myCycles">
       <CarouselStatic
        cacheKey={['CYCLES',k]}
        onSeeAll={async () => seeAll(cycles, t('myCycles'))}
        title={t('myCycles')}
        data={cycles}
        iconBefore={<></>}
        // iconAfter={<BsCircleFill className={styles.infoCircle} />}
      />
      </div>
    : <></>;
  };

const renderCarousels =  ()=>{
        return <>
                {gbt.map(([topic,apiResponse])=>{
                return <div className='mb-4' data-cy={`carousel-${topic}`} style={{minHeight:"300px"}} key={topic}>
                <Carousel topic={topic} apiResponse={apiResponse} />
                </div>
                })}
        </>
}    

  return <>
   <Container className= {`w-100 my-5  ${styles.container}`}>
      <h4 className='text-secondary text-center'>¡Crea un Momento Eureka para resumir una obra que te impactó con una imagen!</h4>
       <section className='mt-3 mx-3 d-flex flex-row justify-content-center' >
          <TextField  label="Describe la imagen que quieres generar" variant="outlined" helperText="Agrega el máximo de detalles posible." style={{width:'60%'}}>
          </TextField>
           <FormControl className='ms-2 me-2 my-0' sx={{ m: 1, minWidth: 120 }} style={{width:'15%'}}>
               <InputLabel id="select-style">Style</InputLabel>
              <Select
                labelId="select-style"
                id="select-style"
                label="Style"
                autoWidth
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
           <Button  className={`btn-eureka`} style={{width:'15%',height:"3.5em"}}>
              Crear Imagen con IA
           </Button>
       </section>
   
   </Container>  
  
   <section className='d-flex flex-column flex-lg-row'>
  <Col xs={12} lg={2}>
    <h1 className="text-secondary fw-bold">{t('Trending topics')}</h1>
  <aside className="mb-5">{getTopicsBadgedLinks()}</aside>
  </Col>  
  <Col xs={12} lg={10}>
  <section className='ms-0 ms-lg-5'>  
    <>
    <div>
      {renderCarousels()}
    </div>
    <div className="mb-5">
      {renderSpinnerForLoadNextCarousel()}
    </div>
  </>
   {featuredUsers()}
  {cyclesJoined()}
  </section>
  </Col>
</section>  
</>

}

export default HomeSingIn;
