import { Box } from "@mui/material";
import { ReactElement } from "react";

interface Props{
    children:ReactElement[];
}
export const MosaicsGrid = ({children}:Props)=>{
    const id='MosaicsGrid';
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
      
    return <Box id={id} sx={sx} justifyContent={'left'}>
        {
            children
        }
    </Box>
    //     .div1 { grid-area: 1 / 1 / 2 / 2; }
    //     .div2 { grid-area: 1 / 1 / 2 / 2; }
}