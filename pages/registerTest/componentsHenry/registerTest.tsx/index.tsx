import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { Stack, AppBar, Toolbar, IconButton, ImageList, ImageListItem, Typography, Grid, Container, Paper, ListItem } from "@mui/material";

import Acordionc from "pages/registerTest/componentsHenry/Acordionc"
import PiePagina from "pages/registerTest/componentsHenry/PiePagina"
import CardsAllll from "pages/registerTest/componentsHenry/CardsAllll"

export default function index() {
    return (

        <>

            <AppBar elevation={0} sx={{ height: 72, backgroundColor: "transparent" }}>

                <Toolbar sx={{ backgroundColor: "#ecf0f1" }}>
                    <ImageListItem sx={{ boxSizing: "border-box", paddingLeft: 0, width: 350, height: 350 }}>
                        <img src="/logo.webp" />
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

            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ backgroundColor: "#ecf0f1" }}>
                <Box sx={{ maxWidth: { lg: '80dvw', sm: '80dvw', xs: '100dvw' }, backgroundColor: "#ecf0f1" }}>
                    <Typography fontFamily={'Helvetica'}
                        fontSize={"40px"} textAlign="center">
                        Tecnología desde miradas feministas
                    </Typography>

                </Box>

            </Box>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ backgroundColor: "#ecf0f1" }}>
                <Box sx={{ maxWidth: { lg: '40dvw', sm: '50dvw', xs: '70dvw' } }}>
                    <Typography fontFamily={'Open Sans, Helvetica'} fontSize={19} justifyContent={"center"} alignItems={"center"} textAlign="center">
                        <br></br>
                        El club de lectura y cine para personas que desean descubrir,
                        aprender e imaginar un mundo diferente.

                    </Typography>

                </Box>

            </Box>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ backgroundColor: "#ecf0f1" }}>
                <Box sx={{ maxWidth: { lg: '45dvw', sm: '45dvw', xs: '70dvw' } }}>
                    <Typography fontFamily={'Open Sans, Helvetica'} fontSize={17} justifyContent={"center"} alignItems={"center"} textAlign="center">
                        <br></br>
                        <b>Cada mes, durante 5 meses,</b> recibirás recomendaciones de libros y
                        películas increíbles sobre <b>género, tecnología y feminismo,</b>
                        perfectos para aprender,
                        reflexionar y debatir en <b>nuestra comunidad exclusiva.</b>

                    </Typography>

                </Box>

            </Box>

            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ backgroundColor: "#ecf0f1" }}>
                <Box sx={{ maxWidth: { lg: '40dvw', sm: '40dvw', xs: '100dvw' } }}>
                    <Typography fontFamily={'Open Sans, Helvetica'} fontSize={19} justifyContent={"center"} alignItems={"center"} textAlign="center">
                        <br></br>
                        <Button sx={{
                            backgroundColor: "#81ecec ", color: 'black', fontStyle: 'bold', borderColor: 'black', '&:hover': {
                                backgroundColor: 'White',
                                borderColor: 'black',
                                boxShadow: 'none',
                            },

                        }} variant='outlined' href="https://www.eureka.club/es/join/25" ><b>Inscríbete en el club</b></Button>

                    </Typography>

                </Box>

            </Box>

            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ backgroundColor: "#ecf0f1" }}>
                <Box sx={{ maxWidth: { lg: '40dvw', sm: '95dvw', xs: '100dvw' } }}>
                    <Typography fontFamily={'Headland One'} fontSize={15} textAlign="center" justifyContent={"center"} alignItems={"center"} >
                        <br></br>
                        Y la mejor parte: <b>!Es gratuito!<img width={25} height={25} src="/Emot.png" /></b>

                    </Typography>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                </Box>

            </Box>

            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ backgroundColor: "#ecf0f1" }}>
                <Box sx={{ maxWidth: { lg: '30dvw', sm: '95dvw', xs: '100dvw' } }}>






                </Box>

            </Box>

            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} >
                <Box sx={{ maxWidth: { lg: '40dvw', sm: '95dvw', xs: '100dvw' } }}>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>

                    <Typography fontFamily={'Headland One'} fontSize={30} textAlign="center">

                        ¿Cómo Funciona?

                    </Typography>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                </Box>

            </Box>

            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} >
                <Box sx={{ maxWidth: { lg: '100dvw', sm: '400dvw', xs: '100dvw' } }} >

                    <CardsAllll />

                </Box>

            </Box>

            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} >
                <Box sx={{ maxWidth: { lg: '40dvw', sm: '90dvw', xs: '100dvw' } }}>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>

                    <Typography fontFamily={'Bookman Old Style'} fontSize={30} textAlign="center">

                        Únete a más de 500 personas en nuestra comunidad

                    </Typography>


                </Box>

            </Box>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} >
                <Box sx={{ maxWidth: { lg: '40dvw', sm: '95dvw', xs: '100dvw' } }}>

                    <br></br>
                    <br></br>
                    <br></br>




                </Box>

            </Box>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ backgroundColor: "#ecf0f1" }} paddingLeft={1} paddingRight={1}>
                <Box sx={{ maxWidth: { lg: '30dvw', sm: '90dvw', xs: '100dvw' } }}>

                 
                    <br></br>
                    <br></br>
                    <Typography fontFamily={'Bookman Old Style'} fontSize={30} textAlign="center">

                        ¿Para Quién es el Club de Lectura y Cine 'Tecnología desde miradas feministas'?

                    </Typography>



                </Box>

            </Box>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ backgroundColor: "#ecf0f1" }}>
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
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ backgroundColor: "#ecf0f1" }}>
                <Box sx={{ maxWidth: { lg: '40dvw', sm: '95dvw', xs: '100dvw' } }}>
                    <Typography fontFamily={'Open Sans, Helvetica'} fontSize={19} justifyContent={"center"} alignItems={"center"} textAlign="center">
                        <br></br>
                        <Button sx={{
                            backgroundColor: "#81ecec ", color: 'black', fontStyle: 'bold', borderColor: 'black', '&:hover': {
                                backgroundColor: 'White',
                                borderColor: 'black',
                                boxShadow: 'none',
                            },

                        }} variant='outlined' href="https://www.eureka.club/es/join/25" ><b>Inscríbete en el club</b></Button>

                    </Typography>

                </Box>

            </Box>

            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ backgroundColor: "#ecf0f1" }}>
                <Box sx={{ maxWidth: { lg: '40dvw', sm: '95dvw', xs: '100dvw' } }}>
                    <Typography fontFamily={'Headland One'} fontSize={15} textAlign="center" justifyContent={"center"} alignItems={"center"} >
                        <br></br>
                        Y la mejor parte: <b>!Es gratuito!<img width={25} height={25} src="/Emot.png" /></b>

                    </Typography>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                </Box>

            </Box>

            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} >
                <Box sx={{ maxWidth: { lg: '30dvw', sm: '95dvw', xs: '100dvw' } }}>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <Typography fontFamily={'Bookman Old Style'} fontSize={30} textAlign="center">

                        ¿Tienes Dudas?

                    </Typography>

                    <br></br>

                </Box>

            </Box>

            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} paddingLeft={1} paddingRight={1}>
                <Box sx={{ maxWidth: { lg: '70dvw', sm: '95dvw', xs: '100dvw' } }}>


                    <Acordionc />

                    <br></br>
                    <br></br>
                    <br></br>
                </Box>

            </Box>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ backgroundColor: "#00cec9" }}>
                <Box sx={{ maxWidth: { lg: '30dvw', sm: '95dvw', xs: '100dvw' } }}>
                    <br></br>
                    <br></br>

                    <Typography fontFamily={'arial'}
                        variant="h4" textAlign="center"  >

                        ¿Qué Esperas?


                    </Typography>



                </Box>

            </Box>

            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ backgroundColor: "#00cec9" }}>
                <Box sx={{ maxWidth: { lg: '40dvw', sm: '50dvw', xs: '70dvw' } }}>

                    <br></br>

                    <Typography fontFamily={'arial'} fontSize={19} textAlign="center">

                        ¡Ha llegado el momento de encontrar tu
                        comunidad y expandir tus horizontes! El club de lectura
                        <b>‘Tecnología desde miradas feministas’</b> da inicio en enero 2024.

                    </Typography>



                </Box>

            </Box>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ backgroundColor: "#00cec9" }}>
                <Box sx={{ maxWidth: { lg: '36dvw', sm: '46dvw', xs: '70dvw' } }}>

                    <br></br>

                    <Typography fontFamily={'arial'} fontSize={16} textAlign="center" >

                        ¡Eureka es el primer club de lectura y cine enfocado en la justicia social para América Latina!
                        Cada mes, durante 5 meses, recibirás recomendaciones de libros y películas increíbles sobre género, tecnología
                        y feminismo, ideales para aprender, reflexionar y debatir con una comunidad exclusiva.

                    </Typography>



                </Box>

            </Box>

            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ backgroundColor: "#00cec9" }}>
                <Box sx={{ maxWidth: { lg: '40dvw', sm: '95dvw', xs: '100dvw' } }}>
                    <Typography fontFamily={'Open Sans, Helvetica'} fontSize={19} justifyContent={"center"} alignItems={"center"} textAlign="center">
                        <br></br>
                        <Button sx={{
                            backgroundColor: "#81ecec ", color: 'black', fontStyle: 'bold', borderColor: 'black', '&:hover': {
                                backgroundColor: 'White',
                                borderColor: 'black',
                                boxShadow: 'none',
                            },

                        }} variant='outlined' href="https://www.eureka.club/es/join/25" ><b>Inscríbete en el club</b></Button>

                    </Typography>

                </Box>

            </Box>

            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ backgroundColor: "#00cec9" }}>
                <Box sx={{ maxWidth: { lg: '40dvw', sm: '95dvw', xs: '100dvw' } }}>
                    <Typography fontFamily={'Headland One'} fontSize={15} textAlign="center" justifyContent={"center"} alignItems={"center"} >
                        <br></br>
                        Y la mejor parte: <b>!Es gratuito!<img width={25} height={25} src="/Emot.png" /></b>

                    </Typography>
                    <br></br>
                </Box>

            </Box>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ backgroundColor: "#535c68" }}>
                <Box sx={{ maxWidth: { lg: '60dvw', sm: '95dvw', xs: '100dvw' } }}>

                    <br></br>
                    <br></br>

                    <PiePagina />
                    <br></br>
                    <br></br>

                    

                </Box>

            </Box>

        </>
    );
}










