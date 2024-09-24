import useFilterEngineWorks from "@/src/components/useFilterEngineWorks"
import { WorksMosaic } from "@/src/components/WorksMosaic"
import { WorkSumary } from "@/src/types/work"
import { FC, useEffect, useState } from "react"

interface Props{
    favWorks:WorkSumary[]
}
const MyWorksSaved:FC<Props> = ({favWorks})=>{
    const [filtered,setfiltered]=useState<WorkSumary[]>([]);
    const {FilterEngineWork,filtersType,filtersCountries} = useFilterEngineWorks()
    
    useEffect(()=>{
        setfiltered(favWorks);
    },[favWorks])
    
    useEffect(()=>{
        Applyfilters();
    },[filtersType,filtersCountries]);

    const Applyfilters = ()=>{
        let f:WorkSumary[] = [];
        if(!filtersCountries?.length){
            f = favWorks.filter(w=>{
                return filtersType["fiction-book"] && w.type=='fiction-book'
                || filtersType["book"] && w.type=='book'
                || filtersType["movie"] && w.type=='movie'
                || filtersType["documentary"] && w.type=='documentary'
            });
        }
        else{
            f = favWorks.filter(w=>{
                return filtersCountries?.includes(w.countryOfOrigin??'') && w;
            });
        }
        const fr = f.filter(w=>{
            return filtersType["fiction-book"] && w.type=='fiction-book'
            || filtersType["book"] && w.type=='book'
            || filtersType["movie"] && w.type=='movie'
            || filtersType["documentary"] && w.type=='documentary'
        });
        setfiltered(fr);
    }

    return <>
        <FilterEngineWork/>
        <WorksMosaic works={filtered}/>
    </>
}
export default MyWorksSaved;