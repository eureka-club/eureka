"use client"

import { t } from "@/src/get-dictionary";
import { useDictContext } from "@/src/hooks/useDictContext";
import { Button, Grid } from "@mui/material";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function(){
    const pathname = usePathname();
    console.log("pathname ",pathname)
    const {lang,id}=useParams();
    // const btnPropsDefaults={
    //     about:{active:false},
    //     discussion:{active:false},
    //     posts:{active:false},
    //     guidelines:{active:false},
    //     participants:{active:false},
    // };
    // const [btnProps,setBtnProps] = useState<Record<string,any>>(btnPropsDefaults);

    const href_prefix = `/${lang}/cycle/${id}`;

    // useEffect(()=>{debugger;
    //     setBtnProps(btnPropsDefaults);
    //     pathname.match(/cycle\/(\d*)\/(\w*)$/);
    //     setBtnProps(p=>({...p,[`${RegExp.$2}`]:{active:true}}))
    // },[pathname])
    // const isActive = (segment:string)=>btnProps[segment].active
    const {dict} = useDictContext();
    return <>
        <Grid 
                container direction="row"
                justifyContent="space-between"
                alignItems="center"
                >
                <Grid item>
                    <Link href={`${href_prefix}/about`}>
                        <Button id="btn-about" size='large' className={`btn`}>{t(dict,'About')}</Button>
                    </Link>
                </Grid>
                <Grid item>
                    <Link href={`${href_prefix}/discussion`}>
                        <Button id="btn-discussion" size='large' className={`btn`}>discussion</Button>
                    </Link>
                </Grid>
                <Grid item>
                    <Link href={`${href_prefix}/posts`}>
                        <Button id="btn-posts" size='large' className={`btn`}>posts</Button>
                    </Link>
                </Grid>
                <Grid item>
                    <Link href={`${href_prefix}/guidelines`}>
                        <Button id="btn-guidelines" size='large' className={`btn`}>guidelines</Button>
                    </Link>
                </Grid>
                <Grid item>
                    <Link href={`${href_prefix}/participants`}>
                        <Button id="btn-participants" size='large' className={`btn`}>participants</Button>
                    </Link>
                </Grid>
            </Grid>
                {/* language=CSS */}
                <style jsx global>
                {`
                    .MuiGrid-container{
                        border-bottom: solid 1px var(--eureka-green);
                    }
                `}
                </style>
    </>
}