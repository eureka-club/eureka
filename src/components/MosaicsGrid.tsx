import { Alert, Box } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { ReactElement } from "react";

interface Props{
    children:ReactElement[];
}
export const MosaicsGrid = ({children}:Props)=>{
    const id='MosaicsGrid';
    const{t}=useTranslation('common');
    const sx={
         display: 'grid',
         gridTemplateColumns: {
            // sm:'repeat(auto-fit, calc(188px + .8rem))',
            xs:'repeat(auto-fit, 188px)',
         },
        //  gridTemplateRows: `repeat(auto-fit, 1fr)`,
         gridColumnGap: '.8rem',
         gridRowGap: '.8rem',
    }
      debugger;
    return <>
        {
            children?.length 
            ?   <Box id={id} sx={sx} justifyContent={'left'}>
                    {
                        children
                    } 
                </Box>
            :   <Alert>{t('ResultsNotFound')}</Alert> 
        }
    </>
    //     .div1 { grid-area: 1 / 1 / 2 / 2; }
    //     .div2 { grid-area: 1 / 1 / 2 / 2; }
}