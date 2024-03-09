"use client"
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Grid, Stack } from '@mui/material';

import { Container } from 'postcss';
import Avatar from '@mui/material/Avatar';


import Divider from '@mui/material/Divider';
import { red } from '@mui/material/colors';
import CardHeader from '@mui/material/CardHeader';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ImageListItem from '@mui/material';
import Stars from '../componentsHenry/Stars'

/*interface Props {
  variant:string
}
*/
export default function CardsAllll() {
  return (
    <>

      <Stack direction={{ xs: 'column', sm: 'row' }}
      >
        <Box >

          <Grid item xs={12} sm={6} paddingInlineEnd={4}>
            <Box border={0} >
              <Card elevation={0} sx={{
                maxWidth: 600, transition: "0.2s",
                "&:hover": {
                  transform: "scale(1.05)"
                },
              }} >

                <CardContent>
                  <Stack direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 1, sm: 2, md: 3 }} fontSize="20"  >
                    <Box borderRight={3} borderColor={"#504788"} padding={2} sx={{borderColor:"#504788",
                                               
                                                borderRight: { xs: 'none', sm: 'solid .2rem ', md: 'solid .2rem ', color:"#504788" }
                                            }}>

                      <img src="1.webp" alt="" width={80} height={80} />

                    </Box>

                    <Box >
                      <Typography paddingLeft={0} fontFamily={"Calibri"} variant="h5">Recibe Recomendaciones Exclusivas</Typography>
                      <br></br>
                      <Typography paddingLeft={0} textAlign={"justify"} variant="body2" fontFamily={"Calibri"} fontSize={17}>

                        Cada mes, <b>de enero a mayo de 2024</b>, recibirás dos
                        recomendaciones curadas (un libro y una película)
                        que exploran la intersección de la tecnología con
                        cuestiones feministas y sociales.
                        Seleccionamos obras que desafían, inspiran y
                        amplían horizontes, priorizando autoras latinoamericanas.

                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>

              </Card>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} paddingInlineEnd={4} >
            <Box border={0}>
              <Card elevation={0} sx={{
                maxWidth: 600, transition: "0.2s",
                "&:hover": {
                  transform: "scale(1.05)"
                },
              }} >

                <CardContent>
                  <Stack direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 1, sm: 2, md: 3 }} fontSize="20"  >
                    <Box borderRight={3} borderColor={"#504788"} padding={2} sx={{borderColor:"#504788",
                                               
                                               borderRight: { xs: 'none', sm: 'solid .2rem ', md: 'solid .2rem ', color:"#504788" }
                                           }}>
                      <img src="2.webp" alt="" width={80} height={80} />

                    </Box>

                    <Box >
                      <Typography paddingLeft={0} fontFamily={"Calibri"} variant="h5">Tiempo para Reflexión</Typography>
                      <br></br>
                      <Typography paddingLeft={0} textAlign={"justify"} variant="body2" fontFamily={"Calibri"} fontSize={17}>

                        Después de recibir las recomendaciones,
                        es hora de sumergirse en las obras.
                        Tómate un tiempo para leer el libro
                        del mes (compartiremos un cronograma)
                        y ver la película, reflexionando
                        individualmente sobre nuevas perspectivas e ideas.

                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>

              </Card>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} paddingInlineEnd={4}>
            <Box border={0}>
              <Card elevation={0} sx={{
                maxWidth: 600, transition: "0.2s",
                "&:hover": {
                  transform: "scale(1.05)"
                },
              }} >

                <CardContent>
                  <Stack direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 1, sm: 2, md: 3 }} fontSize="20"  >
                    <Box  borderRight={3} borderColor={"#504788"} padding={2} sx={{borderColor:"#504788",
                                               
                                               borderRight: { xs: 'none', sm: 'solid .2rem ', md: 'solid .2rem ', color:"#504788" }
                                           }}>
                      <img src="3.webp" alt="" width={80} height={80} />

                    </Box>

                    <Box >
                      <Typography paddingLeft={0} fontFamily={"Calibri"} variant="h5">Participa en Interesantes Discusiones</Typography>
                      <br></br>
                      <Typography paddingLeft={0} textAlign={"justify"} variant="body2" fontFamily={"Calibri"} fontSize={17}>

                        Una vez finalizada la lectura, únete a una vibrante
                        comunidad en línea a través de nuestro foro y encuentros
                        exclusivos en línea. Aquí, puedes compartir tus impresiones,
                        ideas y reflexiones mediante publicaciones e imágenes.
                        Éste es el espacio perfecto para tener discusiones profundas
                        y constructivas en un ambiente seguro, libre de juicios y críticas.

                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>

              </Card>
            </Box>
          </Grid>
        </Box>

        <Box >
          <Grid item xs={12} sm={6} paddingBlockEnd={4} paddingRight={1} paddingLeft={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Box maxWidth={500}  >
              <Card elevation={5} sx={{
                maxWidth: 500, transition: "0.2s",
                "&:hover": {
                  transform: "scale(1.05)",

                },

                justifyContent: "left",
                alignItems: "left",
                
              }}>
                <CardHeader justifyContent="left"

                  avatar={
                    <Avatar src='Anna.webp' aria-label="recipe" >

                    </Avatar>
                  }

                  action={
                    <IconButton aria-label="settings">

                      <Stars />
                    </IconButton>
                  }

                  title="Anna Silva"
                  subheader="Marketing, Brasil"
                />

                <Divider />
                <CardContent>

                  <Typography textAlign={"justify"} variant="body2" color="text.secondary">
                    “Eureka Club me proporcionó un viaje increíble de aprendizaje y reflexión
                    sobre la justicia social. Participar en el club me hizo replantear mi visión del mundo.
                    Lo recomiendo a todos los que deseen expandir sus horizontes y actuar en pro de la justicia.”

                  </Typography>
                </CardContent>

              </Card>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} paddingBlockEnd={4} paddingRight={1} paddingLeft={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Box maxWidth={500}>
              <Card elevation={5} sx={{
                maxWidth: 500, transition: "0.2s",
                "&:hover": {
                  transform: "scale(1.05)",

                },

                justifyContent: "left",
                alignItems: "left",
                
              }}>
                <CardHeader justifyContent="left"

                  avatar={
                    <Avatar src='Andreia.webp' aria-label="recipe" >

                    </Avatar>
                  }

                  action={
                    <IconButton aria-label="settings">

                      <Stars/>
                    </IconButton>
                  }

                  title="Andreia Odriozola"
                  subheader="Periodista, Uruguay"
                />

                <Divider />
                <CardContent>

                  <Typography textAlign={"justify"} variant="body2" color="text.secondary">
                    “Participar en el club fue una de las mejores decisiones que he tomado.
                    Los temas me ayudaron a comprender cómo podemos construir un mundo más justo y sostenible.
                    Cada libro recomendado inspiró cambios en mi vida personal y profesional.”

                  </Typography>
                </CardContent>

              </Card>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} paddingBlockEnd={4} paddingRight={1} paddingLeft={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Box maxWidth={500} >
              <Card elevation={5} sx={{
                maxWidth: 500, transition: "0.2s",
                "&:hover": {
                  transform: "scale(1.05)",

                },

                justifyContent: "left",
                alignItems: "left",
                
              }}>
                <CardHeader justifyContent="left"

                  avatar={
                    <Avatar src='David.webp' aria-label="recipe" >

                    </Avatar>
                  }

                  action={
                    <IconButton aria-label="settings">

                      <Stars />
                    </IconButton>
                  }

                  title="David Barbosa"
                  subheader="Empresario, Brasil"
                />

                <Divider />
                <CardContent>

                  <Typography textAlign={"justify"} variant="body2" color="text.secondary">
                    “¡Eureka Club es una comunidad increíble! Tenía algunas dudas sobre cómo
                    un hombre podría encajar en un espacio enfocado en el feminismo, pero pronto
                    me di cuenta de que era un lugar de aprendizaje y crecimiento para todos.”

                  </Typography>
                </CardContent>

              </Card>
            </Box>
          </Grid>

        </Box>

      </Stack >


    </>
  );
}


