import { Stack } from "@mui/material"
// import { useEffect, useRef } from "react";

interface Props{

}
const AnimatedIMGCarousel = ({}:Props)=>{
    let imgs = [
        "https://datapopalliance.org/wp-content/uploads/2023/12/3-1.webp",
        "https://datapopalliance.org/wp-content/uploads/2023/12/Design-sem-nome-12.webp",
        "https://datapopalliance.org/wp-content/uploads/2023/12/2-1.webp",
        "https://datapopalliance.org/wp-content/uploads/2023/12/4.webp",
        "https://datapopalliance.org/wp-content/uploads/2023/12/5.webp",
        "https://datapopalliance.org/wp-content/uploads/2023/12/1-1.webp",
    ]
    imgs =  [...imgs,...imgs,...imgs];
    // const stackRef=useRef<{scrollLeft:number}>(null);

    // useEffect(()=>{
    //     const interval = setInterval(()=>{
    //         if(stackRef?.current)
    //             stackRef.current.scrollLeft+=10;
    //     },1000);
    //     return ()=>clearInterval(interval);
    // },[]);

    return <Stack 
    // ref={stackRef} 
    // sx={{overflow:'hidden'}}
        sx={{overflow:'scroll'}}
        direction={'row'} spacing={1} 
        >
        {
            imgs?.length 
            ? imgs.map((src,idx)=><img key={`imgaic-${idx}`} width={171} src={src}/>)
            : <></>
        }
        </Stack>
}
export default AnimatedIMGCarousel;