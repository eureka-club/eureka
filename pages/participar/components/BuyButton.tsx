import { Button, ButtonProps, CircularProgress } from "@mui/material";
import React, { FC, useState } from "react";
import {Stack} from '@mui/material'
import { useRouter } from "next/router";
interface Props extends ButtonProps {
    label:string|React.ReactNode;
    cycleId:number;
}   
const BuyButton:FC<Props> = ({label,cycleId,...others}) => { 
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
          
          onClick={onClickHandle}
          disabled={isLoading}
          {...others}  
      >
      {label} <CircularProgress size={'2rem'} color="inherit" style={{display: isLoading ? 'block' : 'none'}}/>
      </Button>
      </Stack>
      </>
  );
}
export default BuyButton;