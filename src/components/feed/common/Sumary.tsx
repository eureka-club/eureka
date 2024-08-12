import React from 'react';
import { styled } from '@mui/material/styles';
import useTranslation from 'next-translate/useTranslation';
import { Box, BoxProps, Button } from '@mui/material';
import { SumaryContentWithScroll } from './SumaryContentWithScroll';

type SumaryProps = {children?:React.ReactNode,description:string} & BoxProps;

export const Sumary = styled((props:SumaryProps)=>{
    const initialHeight="20rem";
    const[height,setHeight]=React.useState(initialHeight)
  
    const{t}=useTranslation('common');
    const{children,description,...others}=props;
    
    const ToggleHeight=()=>{
      if(height==initialHeight){
        setHeight('auto')
      }
      else setHeight(initialHeight);
    }
  
    return <Box {...others} >
      <SumaryContentWithScroll 
        height={height}
        description={
          <Box dangerouslySetInnerHTML={{__html:description}}/>
        }
        toggle={<>
            <Button onClick={ToggleHeight}>{
              height==initialHeight 
                ? t('unclampTextMore')
                : t('unclampTextLess')
            }
          </Button>
        </>}
      />
    </Box>
          
  })(({theme})=>({}))
  