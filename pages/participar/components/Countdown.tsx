import { Stack, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";

interface Props {
    startDate:Date;
}   
const Countdown:FC<Props> = ({startDate}) => { 
    const days = Math.floor((startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60) % 24);
    const minutes = Math.floor((startDate.getTime() - new Date().getTime()) / (1000 * 60) % 60);
    const [seconds,setseconds] = useState(Math.floor((startDate.getTime() - new Date().getTime()) / 1000 % 60));
    
    useEffect(() => {
        const interval = setInterval(() => {
            setseconds((prev) => {
                if(prev === 0){
                    return 59;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return <Stack direction="row" spacing={0.5} paddingLeft={6} paddingRight={2} paddingTop={2}>
         <Stack direction={'column'} padding={1} alignItems={'center'} justifyContent={'center'} style={{backgroundColor:'var(--color-danger)',width:'5.6rem', height:'5.6rem'}}>
            <Typography color="white" fontWeight={'bolder'} fontSize={'1.5rem'} suppressHydrationWarning>{days}</Typography>
            <Typography color="white" fontSize={'0.8rem'}  textTransform={'uppercase'}>Dias</Typography>
        </Stack>
        <Stack direction={'column'} padding={1} alignItems={'center'} justifyContent={'center'} style={{backgroundColor:'var(--color-danger)',width:'5.6rem', height:'5.6rem'}}>
            <Typography color="white" fontWeight={'bolder'} fontSize={'1.5rem'} suppressHydrationWarning>{hours}</Typography>
            <Typography color="white" fontSize={'0.8rem'}  textTransform={'uppercase'}>Horas</Typography>
        </Stack>
        <Stack direction={'column'} padding={1} alignItems={'center'} justifyContent={'center'} style={{backgroundColor:'var(--color-danger)',width:'5.6rem', height:'5.6rem'}}>
            <Typography color="white" fontWeight={'bolder'} fontSize={'1.5rem'} suppressHydrationWarning>{minutes}</Typography>
            <Typography color="white" fontSize={'0.8rem'} textTransform={'uppercase'}>Minutos</Typography>
        </Stack>
        <Stack direction={'column'} padding={1} alignItems={'center'} justifyContent={'center'} style={{backgroundColor:'var(--color-danger)',width:'5.6rem', height:'5.6rem'}}>
            <Typography color="white" fontWeight={'bolder'} fontSize={'1.5rem'} suppressHydrationWarning>{seconds}</Typography>
            <Typography color="white" fontSize={'0.8rem'}  textTransform={'uppercase'}>Segundos</Typography>
        </Stack>
    </Stack>
}
export default Countdown;