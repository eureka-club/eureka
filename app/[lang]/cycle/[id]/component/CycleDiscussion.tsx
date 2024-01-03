"use client"

import styles from './CycleDiscussion.module.css';
import HyvorComments from '@/src/components/common/HyvorComments';
import { t } from "@/src/get-dictionary";
import useCycle from "@/src/hooks/useCycle";
import { useDictContext } from "@/src/hooks/useDictContext";
import { useParams } from "next/navigation";
import { FC } from "react";
import { useSession } from 'next-auth/react';

const CycleDiscussion:FC =  ()=>{
  const {data:session} = useSession();
    const {id}=useParams();
    const {dict}=useDictContext();
    const {data:cycle}=useCycle(+id);
    return <section>
        {session ? <HyvorComments entity='cycle' id={`${cycle?.id}`} session={session}  /> : <></>}
        {/* language=CSS */}
        <style jsx global>
                {`
                    #btn-discussion{
                        color:white!important;
                        background-color:var(--eureka-green)!important;
                        padding-left:1rem;
                        padding-right:1rem;
                        border-bottom:none;
                        border-radius: 4px 4px 0 0;
                    }
                `}
                </style>
    </section>
}
export default CycleDiscussion;