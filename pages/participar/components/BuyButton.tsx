import { Button, CircularProgress } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import React, { FC, useState } from "react";
import {Stack} from '@mui/material'
import { useModalContext } from "@/src/hooks/useModal";
import { useRouter } from "next/router";
interface Props {
    label:string|React.ReactNode;
    cycleId:number;
}   
const BuyButton:FC<Props> = ({label,cycleId}) => { 
  const router=useRouter();
  const[isLoading,setIsLoading] = useState(false);
      
  const onClickHandle = async (e:any) => {
    setIsLoading(true);
    e.preventDefault();
    router.push(`/${router.locale}/payment-options/${cycleId}`)
    setIsLoading(false);
  };   
  
  return (
    <>
    <Stack direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 3 }}
        paddingLeft={4}
        justifyContent={'center'}
        justifyItems={'center'}>
    <Button
          variant="outlined"
          color="primary"
          size="large"
          style={{color:'black',borderColor:'black',backgroundColor:'#8DFAF3',display:'block',width:'250px'}}
          type="submit"
          onClick={onClickHandle}
          disabled={isLoading}

      >
      {label} <CircularProgress size={'2rem'} color="inherit" style={{display: isLoading ? 'block' : 'none'}}/>
      </Button>
      </Stack>
      </>
  );
}
export default BuyButton;