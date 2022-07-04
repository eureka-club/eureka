import { useState, FunctionComponent, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { Spinner, Alert,Row,Tab, Col} from 'react-bootstrap';

import MosaicItem from '@/components/work/MosaicItem'

import useWorks,{getWorks} from '@/src/useWorks'

import useFilterEngineWorks from './useFilterEngineWorks';
import { useInView } from 'react-intersection-observer';
interface Props{
    
}
const take = 8;
const SearchTabWorks: FunctionComponent<Props> = () => {console.log("mounted tab works")
  const { t } = useTranslation('common');
  const router = useRouter();

  const {FilterEngineWorks,filtersChecked} = useFilterEngineWorks()

  const {data:worksData} = useWorks({q:router.query.q?.toString()!,props:{take}},{enabled:!!router.query?.q});
  const [works,setWorks] = useState(worksData?.works||[])
  
  const [refWorks, inViewWorks] = useInView({
    triggerOnce: false,
  });

  useEffect(()=>{
    if(inViewWorks && router && works.length && worksData?.fetched){
      const fi = async ()=>{
        const {id} = works.slice(-1)[0]
        const r = await getWorks({q:router.query.q?.toString()!,props:{skip:1,cursor:{id},take}});
        setWorks(p=>[...p,...r.works])
      }
      if(worksData?.fetched)
        fi()

    }
  },[inViewWorks])

  const renderWorks=()=>{
    if(works)
      return <div>
        <FilterEngineWorks/>
        <Row>
            {works.map(p=><Col className="mb-3" key={p.id}><MosaicItem workId={p.id} cacheKey={['WORK',p.id.toString()]}  /></Col>)}
      </Row>
      {works?.length!=worksData?.total && <Spinner ref={refWorks} animation="grow" />}
      </div>
      return ''
  }

  return <div>
  {renderWorks()}
  </div>
};
export default SearchTabWorks;
