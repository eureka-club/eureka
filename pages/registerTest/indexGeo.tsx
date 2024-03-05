import { Box, Paper, Stack, Typography } from "@mui/material";
import AccordionCustom   from "./componets/AccordionCustom";
import AnimatedIMGCarousel from "pages/registerTest/componets/AnimatedIMGCarousel";
import HowIsItWorkCard from "./componets/HowIsItWorkCard";
import Header from "./componets/Header";

export default function Index() {
    return <main>
        <Header/>
        <Box 
            display={'flex'} 
            justifyContent={'center'} 
            alignItems={'center'} 
        >
            <Box 
                sx={{maxWidth:{lg:'80dvw',sm:'95dvw',xs:'100dvw'}}}
                >
                <Stack direction={'column'}>
                    <AccordionCustom/>
                    <AnimatedIMGCarousel/>

                    <Paper sx={{padding:'1rem'}}>
                        <ul>
                            <style jsx>{
                            `
                                ul{
                                    padding:0;
                                    counter-reset:my-counter;
                                }
                                ul li{
                                    list-style:none;
                                    margin:1.5rem 0
                                }
                                ul li em:before{
                                    counter-increment: my-counter;
                                    padding:.5rem 1.2rem;
                                    margin-right:.5rem;
                                    content:counter(my-counter) ;
                                    border:solid 1px var(--color-secondary);
                                    background:var(--color-primary);
                                    color:white;
                                    font-size:2rem;
                                    border-radius:100%;
                                }
                            `
                            }
                            </style>
                            <li>
                                <Stack direction={{xs:'column',sm:'row',lg:'row'}} justifyContent={'space-between'}>
                                        <Stack direction={{xs:'column',sm:'row',lg:'row'}}>
                                            <em></em>
                                            <Box>
                                                <Box sx={{
                                                    paddingLeft:{xs:'1rem',sm:'1rem',md:'1rem'},
                                                    borderLeft:{xs:'none',sm:'solid .3rem var(--color-primary)',md:'solid .3rem var(--color-primary)'}
                                                    }}>
                                                    <Typography variant={'h5'}>
                                                        Recibe Recomendaciones Exclusivas
                                                    </Typography>
                                                    <Typography>
                                                        Después de recibir las recomendaciones, es hora de sumergirse en las obras. Tómate un tiempo para leer el libro del mes (compartiremos un cronograma) y ver la película, reflexionando individualmente sobre nuevas perspectivas e ideas.
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Stack>
                                        <Box sx={{display:{xs:'none',lg:'block'}}}>
                                            <HowIsItWorkCard/>
                                        </Box>
                                </Stack>
                            </li>
                            <li>
                                <Stack direction={{xs:'column',sm:'row',lg:'row'}} justifyContent={'space-between'}>
                                        <Stack direction={{xs:'column',sm:'row',lg:'row'}}>
                                            <em></em>
                                            <Box>
                                                <Box sx={{
                                                    paddingLeft:{xs:'1rem',sm:'1rem',md:'1rem'},
                                                    borderLeft:{xs:'none',sm:'solid .3rem var(--color-primary)',md:'solid .3rem var(--color-primary)'}
                                                    }}>
                                                    <Typography variant={'h5'}>
                                                        Recibe Recomendaciones Exclusivas
                                                    </Typography>
                                                    <Typography>
                                                        Después de recibir las recomendaciones, es hora de sumergirse en las obras. Tómate un tiempo para leer el libro del mes (compartiremos un cronograma) y ver la película, reflexionando individualmente sobre nuevas perspectivas e ideas.
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Stack>
                                        <Box sx={{display:{xs:'none',lg:'block'}}}>
                                            <HowIsItWorkCard/>
                                        </Box>
                                </Stack>
                            </li>
                        </ul>
                        <Stack>
                            <Box sx={{display:{lg:'none'}}}>
                                <HowIsItWorkCard/>
                            </Box>
                            <Box sx={{display:{lg:'none'}}}>
                                <HowIsItWorkCard/>
                            </Box>
                        </Stack>                            
                    </Paper>
                </Stack>
            </Box>
        </Box>
    </main>
}