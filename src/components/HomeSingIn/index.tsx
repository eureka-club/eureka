
import { FunctionComponent, useEffect, useState, lazy, FC, memo } from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import {Spinner, Col} from 'react-bootstrap';
import TagsInput from '@/components/forms/controls/TagsInput';
import { GetAllByResonse } from '@/src/types';
import { useInView } from 'react-intersection-observer';
import { CycleMosaicItem } from '@/src/types/cycle';
import { UserMosaicItem } from '@/src/types/user';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import slugify from 'slugify'
import useFeaturedUsers from '@/src/useFeaturedUsers';
import useInterestedCycles from '@/src/useInterestedCycles';
import useMyCycles,{myCyclesWhere} from '@/src/useMyCycles';
import useFeaturedEurekas from '@/src/useFeaturedEurekas';
import Prompt from '@/src/components/post/PostPrompt';
import FeaturedCycles from '../FeaturedCycles';
import FeaturedEurekas from '../FeaturedEurekas';
import CarouselsByTopics from './CarouselsByTopics';
import CarouselStatic from '../CarouselStatic';

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
  const {data:dataCycles} = useMyCycles(session?.user.id!)
  const [cycles,setCycles] = useState<CycleMosaicItem[]>()
  const {data:dataFeaturedCycles} = useInterestedCycles()
  const [featuredCycles,setfeaturedCycles] = useState(dataFeaturedCycles?.cycles);
  const {data:dataPosts} = useFeaturedEurekas()
  const [posts,setPosts] = useState(dataPosts?.posts);

  useEffect(()=>{
    if(dataUsers)setUsers(dataUsers)
    if(dataFeaturedCycles)setfeaturedCycles(dataFeaturedCycles.cycles)
    if(dataPosts)setPosts(dataPosts.posts)
    if(dataCycles)setCycles(dataCycles.cycles)   

  },[dataCycles,dataUsers,dataFeaturedCycles,dataPosts])

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
        return <TagsInput className='d-flex flex-wrap' formatValue={(v: string) => t(`topics:${v}`)} tags={[...topics].join()} readOnly />;
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
   

  return <>
  <section className='my-5'><Prompt redirect={true}/></section>
   <section className='d-flex flex-column flex-lg-row'>
  <Col xs={12} lg={2} className="me-5" >
    <h2 className="text-secondary fw-bold">{t('Trending topics')}</h2>
    <aside className="mb-4">{getTopicsBadgedLinks()}</aside>
    <section className='mt-5'>
        <h1 className="text-secondary  fw-bold" style={{fontSize:'1.5rem'}}>{t('About Eureka')} </h1>
        <Link href="/about"><a className='text-primary text-decoration-underline text-blue' onClick={()=> window.scrollTo(0, 0)}>{t('browserTitleAbout')} </a></Link>
    </section>
     <section  className="mt-4 p-3 rounded overflow-auto bg-secondary text-white" role="presentation" >
        <h4 className="p-2 m-0 text-wrap text-center fs-6">{t('aboutBox1')}</h4>
     </section>
      <section  className="mt-5 p-3 rounded overflow-auto bg-yellow text-secondary" role="presentation" >
        <h4 className="p-2 m-0 text-wrap text-center fs-6">{t('aboutBox2')}</h4>
     </section>
      <section  className="mt-5 p-3 rounded overflow-auto bg-secondary text-white" role="presentation" >
        <h4 className="p-2 m-0 text-wrap text-center fs-6">{t('aboutBox3')}</h4>
     </section>
      <section  className="mt-5 p-3 rounded overflow-auto bg-yellow text-secondary" role="presentation" >
        <h4 className="p-2 m-0 text-wrap text-center fs-6">{t('aboutBox4')}</h4>
     </section>
  </Col>  
  <Col xs={12} lg={10} className="mt-5 mt-lg-0">
  <section className='ms-0 ms-lg-5'>  
    <FeaturedEurekas posts={posts} dataPosts={dataPosts}/>
    {/* {renderFeaturedEurekas()} */}
    <FeaturedCycles featuredCycles={featuredCycles} dataFeaturedCycles={dataFeaturedCycles} />
    {/* {renderFeaturedCycles()} */}
    {/*cyclesJoined()*/}
    {featuredUsers()}
    <>
    <div className="mt-5">
      <CarouselsByTopics groupedByTopics={gbt}/>
    </div>
    <div className="mb-5">
      {renderSpinnerForLoadNextCarousel()}
    </div>
  </>
  </section>
  </Col>
</section>  
</>

}

export default HomeSingIn;
