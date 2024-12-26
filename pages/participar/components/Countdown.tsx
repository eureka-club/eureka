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

    return <Stack direction="row" spacing={1}>
        <Stack direction={'column'} padding={1} alignItems={'center'} justifyContent={'center'} style={{backgroundColor:'var(--color-danger)',width:'6rem', height:'6rem'}}>
            <Typography color="white" fontWeight={'bolder'} fontSize={'1.5rem'}>{days}</Typography>
            <Typography color="white" textTransform={'uppercase'}>Dias</Typography>
        </Stack>
        <Stack direction={'column'} padding={1} alignItems={'center'} justifyContent={'center'} style={{backgroundColor:'var(--color-danger)',width:'6rem', height:'6rem'}}>
            <Typography color="white" fontWeight={'bolder'} fontSize={'1.5rem'}>{hours}</Typography>
            <Typography color="white" textTransform={'uppercase'}>Horas</Typography>
        </Stack>
        <Stack direction={'column'} padding={1} alignItems={'center'} justifyContent={'center'} style={{backgroundColor:'var(--color-danger)',width:'6rem', height:'6rem'}}>
            <Typography color="white" fontWeight={'bolder'} fontSize={'1.5rem'}>{minutes}</Typography>
            <Typography color="white" textTransform={'uppercase'}>Minutos</Typography>
        </Stack>
        <Stack direction={'column'} padding={1} alignItems={'center'} justifyContent={'center'} style={{backgroundColor:'var(--color-danger)',width:'6rem', height:'6rem'}}>
            <Typography color="white" fontWeight={'bolder'} fontSize={'1.5rem'}>{seconds}</Typography>
            <Typography color="white" textTransform={'uppercase'}>Segundos</Typography></Stack>
    </Stack>
}
export default Countdown;