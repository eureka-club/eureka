import React, {useEffect, useReducer, useState} from "react";
import { GiBrain } from 'react-icons/gi';
import styles from './Rating.module.css';

interface Props {
 stop?:number;
 qty:number;
 onClick:(value:number)=>void;
 readonly?:boolean;
}

const Rating:React.FC<Props> = ({stop:s1,qty,onClick:ock,readonly})=>{
    const stop = s1 || 5;
    const [value,setValue]=useState(qty);

    useEffect(()=>{
        setValue(qty)
    },[qty])
    
    const renderValues = ()=>{
        let res = [];
        const onClick = (e:React.MouseEvent<SVGElement, MouseEvent>,val:number)=>{
            e.stopPropagation();
            if(!readonly){
                const v = val == qty ? 0 : val;
                ock(v);
            }
        }
        const onMouseEnter = (e:React.MouseEvent<SVGElement, MouseEvent>,val:number)=>{
            if(!readonly)setValue(val)
        }
        const onMouseLeave = (e:React.MouseEvent<SVGElement, MouseEvent>)=>{
            if(!readonly)setValue(qty)
        }
        for(let i =0;i<stop;i++)
            res.push(
                    <GiBrain 
                        role={'button'}
                        className={`fs-6 cursor-pointer ${i<value ? styles.rated : styles.notRated}`} 
                        onClick={(e)=>onClick(e,i+1)}  
                        onMouseEnter={(e)=>onMouseEnter(e,i+1)}
                        onMouseLeave={onMouseLeave}
                        key={i}
                    />
            )
        return res;
    }
    return <>
        {renderValues()}
    </>
}
export default Rating;