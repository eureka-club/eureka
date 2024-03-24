import * as React from 'react';
import { Box, Stack } from '@mui/material';
import { AppBar, Toolbar,ImageListItem, Typography, Grid } from "@mui/material";
import Acordionc from "./components/Acordionc"
import CardsAll from "./components/CardsAll"
import ButtonSubscription from './components/ButtonSubscription';
import AnimatedIMGCarousel from './components/AnimatedIMGCarousel';
import Image from 'next/image';
import PiePagina from './components/PiePagina';

export default function index() {
    return (

        <>

            <AppBar elevation={0} sx={{ height: 72, backgroundColor: "transparent" }}>

                <Toolbar sx={{ backgroundColor: "#ecf0f1" }}>
                    <ImageListItem sx={{ boxSizing: "border-box", paddingLeft: 0, width: 350, height: 350 }}>
                        <img src="/Design_20sem_20nome_20-_202023-12-20T130202.881-min.webp" />
                    </ImageListItem>
                </Toolbar>

            </AppBar>

            <Box sx={{ backgroundColor: "#ecf0f1" }} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Box  >

                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>

                </Box>

            </Box>
        
            <Stack direction={'column'} gap={3} sx={{ backgroundColor: "#ecf0f1" }}>
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Box sx={{ maxWidth: { lg: '80dvw', sm: '80dvw', xs: '100dvw' }, backgroundColor: "#ecf0f1" }}>
                        <Typography fontFamily={'Helvetica'}
                            fontSize={"40px"} textAlign="center">
                            Tecnología desde miradas feministas
                        </Typography>
                    </Box>
                </Box>

                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Box sx={{ maxWidth: { lg: '40dvw', sm: '50dvw', xs: '70dvw' } }}>
                        <Typography fontFamily={'Open Sans, Helvetica'} fontSize={19} justifyContent={"center"} alignItems={"center"} textAlign="center">
                            El club de lectura y cine para personas que desean descubrir,
                            aprender e imaginar un mundo diferente.
                        </Typography>
                    </Box>

                </Box>

                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Box sx={{ maxWidth: { lg: '45dvw', sm: '45dvw', xs: '70dvw' } }}>
                        <Typography fontFamily={'Open Sans, Helvetica'} fontSize={17} justifyContent={"center"} alignItems={"center"} textAlign="center">
                            <b>Cada mes, durante 5 meses,</b> recibirás recomendaciones de libros y
                            películas increíbles sobre <b>género, tecnología y feminismo,</b>
                            perfectos para aprender,
                            reflexionar y debatir en <b>nuestra comunidad exclusiva.</b>
                        </Typography>
                    </Box>
                </Box>

                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Box sx={{ maxWidth: { lg: '40dvw', sm: '40dvw', xs: '100dvw' } }}>
                        <ButtonSubscription/>
                        <Typography fontFamily={'Headland One'} fontSize={15} textAlign="center" justifyContent={"center"} alignItems={"center"} >
                            Y la mejor parte: <b>!<u>Es gratuito</u>! <Typography variant='caption' fontSize={25}>😉</Typography></b>
                        </Typography>
                    </Box>
                </Box>

                <Box display={'flex'} justifyContent={'center'} padding={4}>
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
                </Box>

            </Stack>

            <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Box sx={{ maxWidth: { lg: '30dvw', sm: '95dvw', xs: '100dvw' } }}>






                </Box>

            </Box>

            <Stack gap={5} paddingTop={5} paddingBottom={5}>

                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} >
                    <Box sx={{ maxWidth: { lg: '40dvw', sm: '95dvw', xs: '100dvw' } }}>
                        <Typography fontFamily={'Headland One'} fontSize={30} textAlign="center">
                            ¿Cómo Funciona?
                        </Typography>
                    </Box>
                </Box>

                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} >
                    <Box sx={{ maxWidth: { lg: '100dvw', sm: '400dvw', xs: '100dvw' } }} >
                        <CardsAll />
                    </Box>
                </Box>

            </Stack>

            <Stack gap={5} paddingTop={5} paddingBottom={5}>
                <Box  display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Box sx={{ maxWidth: { lg: '40dvw', sm: '90dvw', xs: '100dvw' } }}>
                        <Typography fontFamily={'Bookman Old Style'} fontSize={30} textAlign="center">
                            Únete a más de 500 personas en nuestra comunidad
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
                    <Box  display={'flex'} justifyContent={'center'} padding={4}>
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
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}  paddingLeft={1} paddingRight={1}>
                    <Box sx={{ maxWidth: { lg: '30dvw', sm: '90dvw', xs: '100dvw' } }}>
                        <Typography fontFamily={'Bookman Old Style'} fontSize={30} textAlign="center">
                            ¿Para Quién es el Club de Lectura y Cine 'Tecnología desde miradas feministas'?
                        </Typography>
                    </Box>
                </Box>
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Box sx={{ maxWidth: { lg: '99dvw', sm: '90dvw', xs: '100dvw' } }}>
                        <Grid paddingLeft={1} paddingRight={1} justifyItems={"center"} display='flex' container spacing={4} item xs={12} alignItems={'center'} justifyContent={'center'}>
                            <Grid justifyItems={"center"} item xs={12}
                                sm={6}
                                md={4}
                                fontFamily="Book antigua"
                            >
                                <br></br>
                                <br></br>
                                ✓ Para quienes quieran leer y ver más obras de autoría latinoamericana.
                                <br></br>
                                <br></br>
                                ✓ Para quienes deseen profundizar en temas contemporáneos.
                                <br></br>
                                <br></br>
                                ✓ Para quienes ya no quieran participar en debates en redes sociales que a menudo terminan en peleas, falta de respeto y agresividad.
                                <br></br>
                                <br></br>
                                ✓ Para quienes tengan curiosidad sobre el papel de la IA y la tecnología en la construcción de futuros innovadores y posibles.
                                <br></br>
                                <br></br>
                                ✓ Para quienes tengan interés en comprender cómo temas como la tecnología y la IA impactan su vida, su comunidad y el mundo.
                            </Grid>

                            <Grid justifyItems={"center"} item xs={12}
                                sm={6}
                                md={4}
                                fontFamily="Book antigua"
                            >
                                ✓ Para quienes quieran conectar con personas que comparten su interés por la tecnología, el feminismo y la justicia social.
                                <br></br>
                                <br></br>
                                ✓ Para quienes deseen expandir horizontes, y sean amantes de la lectura, películas y el aprendizaje.
                                <br></br>
                                <br></br>
                                ✓ Para quienes busquen un ambiente seguro y libre de juicios. Un espacio donde tus ideas son valoradas y las conversaciones son constructivas.
                                <br></br>
                                <br></br>
                                ✓ Para personas apasionadas por la justicia social, que buscan ser agentes de cambio positivo y contribuir a un futuro mejor.
                            </Grid>

                        </Grid>
                    </Box>
                </Box>
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ backgroundColor: "#ecf0f1",padingTop:'2rem' }}>
                    <Box sx={{ maxWidth: { lg: '40dvw', sm: '95dvw', xs: '100dvw' } }}>
                        <ButtonSubscription/>
                        <Typography fontFamily={'Headland One'} fontSize={15} textAlign="center" justifyContent={"center"} alignItems={"center"} >
                            Y la mejor parte: <b>!<u>Es gratuito</u>! <Typography variant='caption' fontSize={25}>😉</Typography></b>
                        </Typography>
                    </Box>
                </Box>
                
            </Stack>
            
            <Stack gap={5} paddingTop={5} paddingBottom={5} sx={{ backgroundColor: "#ecf0f1" }}>
            
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} >
                    <Box sx={{ maxWidth: { lg: '30dvw', sm: '95dvw', xs: '100dvw' } }}>
                        <Typography fontFamily={'Bookman Old Style'} fontSize={30} textAlign="center">
                            ¿Tienes Dudas?
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{position:'relative'}}  display={"flex"} justifyContent={"center"} alignItems={"center"} paddingLeft={1} paddingRight={1}>
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
                        <Acordionc />
                    </Box>
                </Box>
            </Stack>

            <Stack gap={5} paddingTop={5} paddingBottom={5} sx={{ backgroundColor: "#00cec9" }}>
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Box sx={{ maxWidth: { lg: '30dvw', sm: '95dvw', xs: '100dvw' } }}>
                        <Typography fontFamily={'arial'}
                            variant="h4" textAlign="center"  >
                            ¿Qué Esperas?
                        </Typography>
                    </Box>
                </Box>
                
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Box sx={{ maxWidth: { lg: '40dvw', sm: '50dvw', xs: '70dvw' } }}>
                        <Typography fontFamily={'arial'} fontSize={19} textAlign="center">
                            ¡Ha llegado el momento de encontrar tu
                            comunidad y expandir tus horizontes! El club de lectura
                            <b>‘Tecnología desde miradas feministas’</b> da inicio en enero 2024.
                        </Typography>
                    </Box>
                </Box>

                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Box sx={{ maxWidth: { lg: '36dvw', sm: '46dvw', xs: '70dvw' } }}>
                        <Typography fontFamily={'arial'} fontSize={16} textAlign="center" >
                            ¡Eureka es el primer club de lectura y cine enfocado en la justicia social para América Latina!
                            Cada mes, durante 5 meses, recibirás recomendaciones de libros y películas increíbles sobre género, tecnología
                            y feminismo, ideales para aprender, reflexionar y debatir con una comunidad exclusiva.
                        </Typography>
                    </Box>
                </Box>

                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Box sx={{ maxWidth: { lg: '40dvw', sm: '95dvw', xs: '100dvw' } }}>
                        <ButtonSubscription/>
                        <Typography fontFamily={'Headland One'} fontSize={15} textAlign="center" justifyContent={"center"} alignItems={"center"} >
                            Y la mejor parte: <b>!<u>Es gratuito</u>! <Typography variant='caption' fontSize={25}>😉</Typography></b>
                        </Typography>
                    </Box>
                </Box>

            </Stack>



            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ backgroundColor: "#535c68" }}>
                <Box sx={{ maxWidth: { lg: '60dvw', sm: '95dvw', xs: '100dvw' } }}>
                    <PiePagina />
                </Box>
            </Box>

        </>
    );
}










