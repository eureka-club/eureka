import { Box, BoxProps } from "@mui/material";
import React from "react";

interface SumaryContentWithScrollProps extends BoxProps{
    description:React.ReactElement;
    toggle:React.ReactElement;height:string
  }
  
export const SumaryContentWithScroll = ({description,toggle,height,...others}:SumaryContentWithScrollProps)=>{
    const circle = React.useRef<HTMLDivElement>(null);
    const sumaryCtr = React.useRef<HTMLDivElement>(null);
    const[showToggle,setShowToggle]=React.useState(false);
  
    React.useEffect(()=>{
      if(sumaryCtr.current?.clientHeight!<sumaryCtr.current?.scrollHeight!)
        setShowToggle(true);
    },[]);
  
    const OnScrollChange = (e:any)=>{
      const{scrollHeight,scrollTop,clientHeight}=e.currentTarget;
      circle.current!.style.transform=`translateY(${scrollTop*(clientHeight/scrollHeight)}px)`;
      if(scrollTop==0)
        setShowToggle(true)
      else if(scrollHeight<=scrollTop+clientHeight)
        setShowToggle(false)
      else 
        setShowToggle(true)
    }
    const sxLine={
      position:'relative',
      borderLeft:'dashed 1px var(--color-primary)',
      paddingLeft:'1rem',
    }
    const sxCircle={
      content: `" "`,
      position: 'absolute',
      width: '1rem',
      height: '1rem',
      border: `solid 4px var(--color-primary)`,
      borderRadius: '100%',
      backgroundColor: `var(--color-primary)`,
      top: '0',
      left: '-.5rem',
      zIndex:999
    }
    const sxScroll={
      maxHeight:height,
      overflow:'auto',
      scrollbarWidth: 'none'
    }
  
    return <Box {...others} sx={sxLine}>
      {description ? <Box component={'span'} sx={sxCircle} ref={circle}/> :<></>}
      <Box ref={sumaryCtr} onScroll={OnScrollChange} sx={sxScroll}>
        {description}
      </Box>
      <Box>
        {showToggle ? toggle : <></>}
      </Box>
    </Box>
  }
  