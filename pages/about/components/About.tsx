import * as React from 'react';
import { Box, Stack } from '@mui/material';
import { Typography, Grid } from "@mui/material";
import Acordion from "./Acordion"
import CardsAll from "./CardsAll"
import ButtonSubscription from './ButtonSubscription';
import AnimatedIMGCarousel from './AnimatedIMGCarousel';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import { useSession } from 'next-auth/react';
// import PiePagina from './components/PiePagina';

const About = () => {
    const{t}=useTranslation('about');
    const{data:session}=useSession()
    return (

        <>

        
            <Stack direction={'column'} gap={3} sx={{ backgroundColor: "white" }}>
                {/* <Box sx={{display:'flex',justifyContent:'center'}} alignItems={"center"}>
                    <Box sx={{ maxWidth: { lg: '80dvw', sm: '80dvw', xs: '100dvw' }, backgroundColor: "#ecf0f1" }}>
                        <Typography
                            fontSize={"40px"} textAlign="center">
                            Tecnología desde miradas feministas
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{display:'flex',justifyContent:'center'}} alignItems={"center"}>
                    <Box sx={{ maxWidth: { lg: '40dvw', sm: '50dvw', xs: '70dvw' } }}>
                        <Typography fontSize={19} justifyContent={"center"} alignItems={"center"} textAlign="center">
                            El club de lectura y cine para personas que desean descubrir,
                            aprender e imaginar un mundo diferente.
                        </Typography>
                    </Box>

                </Box>

                <Box sx={{display:'flex',justifyContent:'center'}} alignItems={"center"}>
                    <Box sx={{ maxWidth: { lg: '45dvw', sm: '45dvw', xs: '70dvw' } }}>
                        <Typography fontSize={17} justifyContent={"center"} alignItems={"center"} textAlign="center">
                            <b>Cada mes, durante 5 meses,</b> recibirás recomendaciones de libros y
                            películas increíbles sobre <b>género, tecnología y feminismo,</b>
                            perfectos para aprender,
                            reflexionar y debatir en <b>nuestra comunidad exclusiva.</b>
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{display:'flex',justifyContent:'center'}} alignItems={"center"}>
                    <Box sx={{ maxWidth: { lg: '40dvw', sm: '40dvw', xs: '100dvw' } }}>
                        <ButtonSubscription/>
                        <Typography fontSize={15} textAlign="center" justifyContent={"center"} alignItems={"center"} >
                            Y la mejor parte: <b>!<u>Es gratuito</u>! <Typography variant='caption' fontSize={25}>😉</Typography></b>
                        </Typography>
                    </Box>
                </Box> */}

                <Box sx={{display:'flex',justifyContent:'center'}} alignItems={"center"} paddingBlockStart={5} paddingLeft={2}paddingRight={2}>
                    <Box sx={{ maxWidth: { lg: '80dvw', sm: '95dvw', xs: '100dvw' } }}>
                        <Typography variant='h1' fontSize={'2rem'} textAlign="center" sx={{color:'var(--color-secondary)',fontFamily:`"Open Sans", sans-serif`}}>
                        {t('lbl1H')}
                        </Typography>
                        <Typography fontSize={16} textAlign="center" fontStyle={'bold'}>
                        {t('lbl1B')}
                        </Typography>
                    </Box>
                </Box>

                {/* <Box sx={{display:'flex',justifyContent:'center'}} padding={4}>
                    <Box sx={{width:{xs:'90dvw',md:'85dvw'}}}>
                        <AnimatedIMGCarousel imgsSrc={[
                            "/img/register/carousel1/c1.webp",
                            "/img/register/carousel1/c2.webp",
                            "/img/register/carousel1/c3.webp",
                            "/img/register/carousel1/c4.webp",
                            "/img/register/carousel1/c5.webp",
                            "/img/register/carousel1/c6.webp",
                            "/img/register/carousel1/c1.webp",
                            "/img/register/carousel1/c2.webp",
                            "/img/register/carousel1/c3.webp",
                            "/img/register/carousel1/c4.webp",
                            "/img/register/carousel1/c5.webp",
                            "/img/register/carousel1/c6.webp",
                            
                        ]}/>
                    </Box>
                </Box> */}

            </Stack>

            <Box sx={{display:'flex',justifyContent:'center'}} alignItems={"center"}>
                <Box sx={{ maxWidth: { lg: '30dvw', sm: '95dvw', xs: '100dvw' } }}>
                </Box>
            </Box>

            <Stack gap={5} paddingTop={5} paddingBottom={5}>
                

                <Box sx={{display:'flex',justifyContent:'center'}} alignItems={"center"} paddingLeft={2} paddingRight={2}>
                    <Box sx={{ maxWidth: { lg: '100dvw', sm: '400dvw', xs: '100dvw' } }} >
                        <CardsAll />
                    </Box>
                </Box>

            </Stack>

            <Stack gap={5} paddingTop={5} paddingBottom={5} sx={{backgroundColor:'white'}} paddingLeft={2} paddingRight={2}>
                <Box  sx={{display:'flex',justifyContent:'center'}} alignItems={"center"}>
                    <Box sx={{ maxWidth: { lg: '40dvw', sm: '90dvw', xs: '100dvw' } }}>
                        <Typography fontSize={30} textAlign="center">
                            {t('lbl5')}
                        </Typography>
                    </Box>
                </Box>
                
                    
                <Box sx={{position:'relative'}}>
                    <Box sx={{
                        position:'absolute',
                        zIndex:1,
                        top:'0',
                        right:'0',
                        display:{xs:'none',lg:'block'}
                    }}>
                        <Image src='/img/imgctrx.webp'
                            width={150}
                            height={150}
                        />
                    </Box>
                    <Box  sx={{display:'flex',justifyContent:'center'}} padding={4}>
                        <Box  sx={{width:{xs:'90dvw',md:'85dvw'}}}>
                            <AnimatedIMGCarousel imgsSrc={[
                                "/img/register/carousel2/1-min.webp",
                                "/img/register/carousel2/2-min.webp",
                                "/img/register/carousel2/3-min.webp",
                                "/img/register/carousel2/4-min.webp",
                                "/img/register/carousel2/5-min.webp",
                                "/img/register/carousel2/6-min.webp",
                                "/img/register/carousel2/7-min.webp",
                                "/img/register/carousel2/8-min.webp",
                                "/img/register/carousel2/9-min.webp",
                                "/img/register/carousel2/10-min.webp",
                                "/img/register/carousel2/11-min.webp",
                            ]}/>
                        </Box>
                    </Box>
                </Box>
            </Stack>
            
            <Stack gap={5} paddingTop={5} paddingBottom={5} sx={{ backgroundColor: "#ecf0f1" }}>
                <Box sx={{display:'flex',justifyContent:'center'}} alignItems={"center"}  paddingLeft={2} paddingRight={2}>
                    <Box sx={{ maxWidth: { lg: '30dvw', sm: '90dvw', xs: '100dvw' } }}>
                        <Typography fontSize={30} textAlign="center">
                        {t('lbl6')}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{display:'flex',justifyContent:'center'}} alignItems={"center"} paddingLeft={2} paddingRight={2}>
                    <Box sx={{ maxWidth: { lg: '99dvw', sm: '90dvw', xs: '100dvw' } }}>
                        <Grid container gap={4}  sx={{justifyContent:'center'}}>
                            
                            <Grid item xs={12}
                                sm={6}
                                md={4}
                            >
                                <Stack gap={4}>
                                    <Typography>✓ {t('lbl7')}</Typography>
                                    <Typography>✓ {t('lbl8')}</Typography>
                                    <Typography>✓ {t('lbl9')}</Typography>
                                </Stack>
                            </Grid>

                            <Grid item xs={12}
                                sm={6}
                                md={4}
                            >
                                <Stack gap={4}>
                                    <Typography>✓ {t('lbl10')}</Typography>
                                    <Typography>✓ {t('lbl11')}</Typography>
                                    <Typography>✓ {t('lbl12')}</Typography>
                                    <Typography>✓ {t('lbl13')}</Typography>
                                </Stack>
                            </Grid>

                        </Grid>
                    </Box>
                </Box>
                {/* <Box sx={{display:'flex',justifyContent:'center'}} alignItems={"center"} sx={{ backgroundColor: "#ecf0f1",padingTop:'2rem' }}>
                    <Box sx={{ maxWidth: { lg: '40dvw', sm: '95dvw', xs: '100dvw' } }}>
                        <ButtonSubscription/>
                        <Typography fontSize={15} textAlign="center" justifyContent={"center"} alignItems={"center"} >
                            Y la mejor parte: <b>!<u>Es gratuito</u>! <Typography variant='caption' fontSize={25}>😉</Typography></b>
                        </Typography>
                    </Box>
                </Box> */}
                
            </Stack>
            
            <Stack gap={5} paddingTop={5} paddingBottom={5} sx={{ backgroundColor: "white" }}>
            
                <Box sx={{display:'flex',justifyContent:'center'}} alignItems={"center"} >
                    <Box sx={{ maxWidth: { lg: '30dvw', sm: '95dvw', xs: '100dvw' } }}>
                        <Typography fontSize={30} textAlign="center">
                            {t('lbl14')}
                        </Typography>
                    </Box>
                </Box>

                <Box  sx={{position:'relative', display:'flex',justifyContent:'center'}} alignItems={"center"} paddingLeft={1} paddingRight={1}>
                        <Box sx={{
                                position:'absolute',
                                zIndex:1,
                                bottom:'0',
                                right:'0',
                                display:{xs:'none',lg:'block'}
                            }}>
                            <Image src='/img/imgctry.webp'
                                width={150}
                                height={150}
                            />
                        </Box>
                    <Box sx={{maxWidth: { lg: '70dvw', sm: '95dvw', xs: '100dvw' } }}>
                        <Acordion />
                    </Box>
                </Box>
            </Stack>

            <Stack gap={5} paddingTop={5} paddingBottom={5} sx={{ backgroundColor: "#00cec9" }}>
                <Box sx={{display:'flex',justifyContent:'center'}} alignItems={"center"}>
                    <Box sx={{ maxWidth: { lg: '30dvw', sm: '95dvw', xs: '100dvw' } }}>
                        <Typography
                            variant="h4" textAlign="center"  >
                            {t('lbl28')}
                        </Typography>
                    </Box>
                </Box>
                
                <Box sx={{display:'flex',justifyContent:'center'}} alignItems={"center"}>
                    <Box sx={{ maxWidth: { lg: '40dvw', sm: '50dvw', xs: '70dvw' } }}>
                        <Typography fontSize={19} textAlign="center">
                            {t('lbl29')}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{display:'flex',justifyContent:'center'}} alignItems={"center"}>
                    <Box sx={{ maxWidth: { lg: '36dvw', sm: '46dvw', xs: '70dvw' } }}>
                        <Typography fontSize={16} textAlign="center" >
                        {t('lbl30')}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{display:'flex',justifyContent:'center'}} alignItems={"center"}>
                    <Box sx={{ maxWidth: { lg: '40dvw', sm: '95dvw', xs: '100dvw' } }}>
                        {
                            !session?.user 
                                ? <ButtonSubscription/>
                                : <></>
                        }
                        {/* <Typography fontSize={15} textAlign="center" justifyContent={"center"} alignItems={"center"} >
                            Y la mejor parte: <b>!<u>Es gratuito</u>! <Typography variant='caption' fontSize={25}>😉</Typography></b>
                        </Typography> */}
                    </Box>
                </Box>

            </Stack>



            {/* <Box sx={{display:'flex',justifyContent:'center'}} alignItems={"center"} sx={{ backgroundColor: "#535c68" }}>
                <Box sx={{ maxWidth: { lg: '60dvw', sm: '95dvw', xs: '100dvw' } }}>
                    <PiePagina />
                </Box>
            </Box> */}

        </>
    );
}
export default About;










