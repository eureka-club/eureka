import { UserMosaicItem } from '@/src/types/user'
import React,{} from 'react'
import ListWindow from '@/components/ListWindow'


interface Props{
    participants: UserMosaicItem[];
    cacheKey: string[];
}
const CycleDetailParticipants: React.FC<Props> = ({participants, cacheKey}) => {
    return <>
    <div className='d-none d-md-block'><ListWindow items={participants} itemSize={80} cacheKey={cacheKey} itemsByRow={5}/></div> 
    <div className='d-block d-md-none'><ListWindow items={participants} itemSize={80} cacheKey={cacheKey} itemsByRow={1}/></div> 
  </>
}

export default React.memo(CycleDetailParticipants)