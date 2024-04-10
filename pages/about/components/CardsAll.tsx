import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, CardHeader, Grid, Stack } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stars from './Stars';
import useTranslation from 'next-translate/useTranslation';

export default function CardsAll() {
  const{t}=useTranslation('about');
  return (
    <>
      <Stack id="asUl" direction={{ xs: 'column'}} gap={2}>
        
          <style jsx global>{
                `
                    #asUl{
                        padding:0;
                        counter-reset:my-counter;
                    }
                    #asUl .MuiGrid-item{
                        list-style:none;
                    }
                    #asUl .MuiGrid-item em:before{
                        counter-increment: my-counter;
                        padding:.5rem 1.2rem;
                        margin-right:.5rem;
                        content:counter(my-counter) ;
                        border:solid 1px var(--color-secondary);
                        background:var(--color-secondary);
                        color:white;
                        font-size:2rem;
                        border-radius:100%;
                    }
                `
                }
          </style>

          <Grid container>
            <Grid item xs={12} sm={6} padding={2}>
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

                      {/* <img src="1.webp" alt="" width={80} height={80} /> */}
                      <em></em>

                    </Box>

                    <Box >
                      <Typography paddingLeft={0} fontFamily={"Calibri"} variant="h5">{t('lbl2H')}</Typography>
                      <br></br>
                      <Typography paddingLeft={0} textAlign={"justify"} variant="body2" fontFamily={"Calibri"} fontSize={17}>
                      {t('lbl2B')}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>

              </Card>
            </Grid>
            <Grid item xs={12} sm={6} padding={2}>
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
                    <Avatar src='/img/Anna.webp' aria-label="recipe" >

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
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12} sm={6} padding={2}>
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
                      <em></em>

                    </Box>

                    <Box >
                      <Typography paddingLeft={0} fontFamily={"Calibri"} variant="h5">{t('lbl3H')}</Typography>
                      <br></br>
                      <Typography paddingLeft={0} textAlign={"justify"} variant="body2" fontFamily={"Calibri"} fontSize={17}>
                      {t('lbl3B')}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>

              </Card>
            </Grid>
            <Grid item xs={12} sm={6} padding={2}>
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
                    <Avatar src='/img/Andreia.webp' aria-label="recipe" >

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
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12} sm={6} padding={2}>
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
                      <em></em>

                    </Box>

                    <Box >
                      <Typography paddingLeft={0} fontFamily={"Calibri"} variant="h5">{t('lbl4H')}</Typography>
                      <br></br>
                      <Typography paddingLeft={0} textAlign={"justify"} variant="body2" fontFamily={"Calibri"} fontSize={17}>
                      {t('lbl4B')}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>

              </Card>
            </Grid>
            <Grid item xs={12} sm={6} padding={2}>
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
                    <Avatar src='/img/David.webp' aria-label="recipe" >

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
            </Grid>
          </Grid>

        {/* <Stack gap={5} justifyContent={'space-between'}>

          <Grid item xs={12} sm={6} paddingRight={1} paddingLeft={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
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
                    <Avatar src='/img/Anna.webp' aria-label="recipe" >

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

          <Grid item xs={12} sm={6} paddingRight={1} paddingLeft={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
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
                    <Avatar src='/img/Andreia.webp' aria-label="recipe" >

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

          <Grid item xs={12} sm={6} paddingRight={1} paddingLeft={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
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
                    <Avatar src='/img/David.webp' aria-label="recipe" >

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

        </Stack> */}

      </Stack>
    </>
  );
}


