"use client"

import React from 'react'
import WorkMosaic from '@/src/components/work/MosaicItem'
import dayjs from 'dayjs';
import { WorkDetail } from '@/src/types/work'
import { Work } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query';
import { useDictContext } from '@/src/hooks/useDictContext';


interface Props{
  showSocialInteraction?: boolean,
  showHeader?: boolean,
  size?: string | undefined,  cycleWorksDates:{
    id: number;
    startDate: Date | null;
    endDate: Date | null;
    workId: number | null;
    work:WorkDetail | null;
  }[];
}

const CycleDetailWorks: React.FC<Props> = ({ showSocialInteraction = true, showHeader = true, size = 'md',cycleWorksDates}) => {
  const works = cycleWorksDates.map(c=>c.work!)
  const{t,dict}=useDictContext();
  const queryClient = useQueryClient()
  const getWorksSorted = (() => {
    const res: Work[] = [];
    cycleWorksDates
      .sort((f, s) => {
        const fCD = dayjs(f.startDate!);
        const sCD = dayjs(s.startDate!);
       
        const isActive = (w: {startDate:Date|null,endDate:Date|null}) => {
          if (w.startDate && w.endDate) return dayjs().isBetween(w.startDate!, w.endDate);
          if (w.startDate && !w.endDate) return dayjs().isAfter(w.startDate);
          return false;
        };
        const isPast = (w: {startDate:Date|null;endDate:Date|null})  => {
          if (w.endDate) return dayjs().isAfter(w.endDate);
          return false;
        };
        // orden en Curso, Siguientes y por ultimo visto/leido
        if (!isPast(f) && isPast(s)) return -1;
        if (isPast(f) && !isPast(s)) return 1;
 
        if (isActive(f) && !isActive(s)) return -1;
        if (!isActive(f) && isActive(s)) return 1;
        if (fCD.isAfter(sCD)) return 1;
        if (fCD.isSame(sCD)) return 0;
        return -1;
      })
      .forEach((cw) => {
        if (works) {
          const idx = works.findIndex((w) => w.id === cw.workId);
          res.push(works[idx]);          
        }
      });
    if (cycleWorksDates.length) return res;
    return works||[];
  })();
  
  return <>
    {showHeader && <h4 className="h5 mt-5 mb-3 fw-bold text-gray-dark">
      {t(dict,'worksCountHeader', { count: works.length })}
    </h4>}
    <section className="d-flex justify-content-center justify-content-lg-start">
      <div className='d-flex flex-wrap flex-column flex-lg-row justify-content-center '>
        {getWorksSorted.map(w => {
          if (!w) return ''
          queryClient.setQueryData(['WORK', `${w.id}`], w)
          return <div className='p-4' key={w.id}>
            <WorkMosaic work={w as WorkDetail} workId={w.id} size={size} showSocialInteraction={showSocialInteraction} showSaveForLater={false} />
          </div>
        })}
      </div>
    </section>
  </>
}

export default React.memo(CycleDetailWorks)