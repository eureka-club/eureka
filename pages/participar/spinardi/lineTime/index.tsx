import { Stack, Typography } from '@mui/material';
import BuySubscriptionButton from 'pages/participar/components/BuySubscriptionButton';
import { Grid, Box, Card, CardContent, CardHeader, Avatar, IconButton, Divider, Chip } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import AnimatedIMGCarousel from 'pages/about/components/AnimatedIMGCarousel';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

import Stars from 'pages/about/components/Stars';
import BuyButton from 'pages/participar/components/BuyButton';
import useCycleSumary from '@/src/useCycleSumary';
import { FC } from 'react';

const LineTime = () => {
  const { t } = useTranslation('spinardi');

  return (
    <>
      <div>
    
        <Stack
       
          gap={0}
          paddingTop={4}
          paddingBottom={4}
          sx={{ backgroundColor: 'white' }}
          paddingLeft={2}
          
        >
          <Stack id="asUl" direction={{ xs: 'column' }} gap={2} alignContent={'center'} alignItems={'center'}>
            <style jsx global>
              {`
                #asUl {
                  padding: 0;
                  counter-reset: my-counter;
                }
                #asUl .MuiGrid-item {
                  list-style: none;
                }
                #asUl .MuiGrid-item em:before {
                  counter-increment: my-counter;
                  padding: 0.5rem 1.2rem;
                  margin-right: 0.5rem;
                  content: counter(my-counter);
                  border: solid 1px var(--color-secondary);
                  background: var(--color-secondary);
                  color: white;
                  font-size: 2rem;
                  border-radius: 100%;
                }
              `}
            </style>

            <Grid container spacing={5} justifyContent={'left'} alignItems={'left'}>
            <Grid item xs={12} sm={4} md={3} lg={3}>
                <Card
                  elevation={0}
                  sx={{
                    borderLeft: '1.9px solid #3D2984',
                    borderTop: '1.9px solid #3D2984',
                    width:210,
                    transition: '0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },

                    justifyContent: 'left',
                    alignItems: 'left',
                  }}
                >
                  <CardHeader
                    sx={{ justifyContent: 'left' }}
                    avatar={<em></em>}
                    title={
                      <Typography textAlign={'justify'} variant="body2" color="text.secondary" paddingRight={4}>
                        <b>MÊS 1</b>
                      </Typography>
                    }
                  />

                  <Divider />
                  <CardContent>
                    <Typography textAlign={'justify'} variant="body2" color="text.secondary" paddingBlockEnd={1} >
                      <Chip label="10 de Março - 13 de Abril" color="secondary" />
                    </Typography>
                    <Typography
                      textAlign={'justify'}
                      variant="body2"
                      color="text.secondary"
                      paddingBlockEnd={1}
                      paddingLeft={2}
                    >
                      <b>Estereótipos do amor</b>
                    </Typography>
                    <Typography textAlign={'justify'} variant="body2" color="text.secondary" paddingLeft={2}>
                      Um livro e dois filmes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4} md={3} lg={3}>
                <Card
                  elevation={0}
                  sx={{
                    borderLeft: '1.9px solid #3D2984',
                    borderTop: '1.9px solid #3D2984',
                    width:210,
                    transition: '0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },

                    justifyContent: 'left',
                    alignItems: 'left',
                  }}
                >
                  <CardHeader
                    sx={{ justifyContent: 'left' }}
                    avatar={<em></em>}
                    title={
                      <Typography textAlign={'justify'} variant="body2" color="text.secondary" paddingRight={4}>
                        <b>MÊS 2</b>
                      </Typography>
                    }
                  />

                  <Divider />
                  <CardContent>
                    <Typography textAlign={'justify'} variant="body2" color="text.secondary" paddingBlockEnd={1} >
                      <Chip label="14 de Abril - 18 de Maio" color="secondary" />
                    </Typography>
                    <Typography
                      textAlign={'justify'}
                      variant="body2"
                      color="text.secondary"
                      paddingBlockEnd={1}
                      paddingLeft={2}
                    >
                      <b>Desafios no amor</b>
                    </Typography>
                    <Typography textAlign={'justify'} variant="body2" color="text.secondary" paddingLeft={2}>
                      Um livro e dois filmes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4} md={3} lg={3}>
                <Card
                  elevation={0}
                  sx={{
                    borderLeft: '1.9px solid #3D2984',
                    borderTop: '1.9px solid #3D2984',
                    width:210,
                    transition: '0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },

                    justifyContent: 'left',
                    alignItems: 'left',
                  }}
                >
                  <CardHeader
                    sx={{ justifyContent: 'left' }}
                    avatar={<em></em>}
                    title={
                      <Typography textAlign={'justify'} variant="body2" color="text.secondary" paddingRight={4}>
                        <b>MÊS 3</b>
                      </Typography>
                    }
                  />

                  <Divider />
                  <CardContent>
                    <Typography textAlign={'justify'} variant="body2" color="text.secondary" paddingBlockEnd={1} >
                      <Chip label="19 de Maio - 15 de Junho" color="secondary" />
                    </Typography>
                    <Typography
                      textAlign={'justify'}
                      variant="body2"
                      color="text.secondary"
                      paddingBlockEnd={1}
                      paddingLeft={2}
                    >
                      <b>Amores perdidos</b>
                    </Typography>
                    <Typography textAlign={'justify'} variant="body2" color="text.secondary" paddingLeft={2}>
                      Um livro e dois filmes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4} md={3} lg={3}>
                <Card
                  elevation={0}
                  sx={{
                    borderLeft: '1.9px solid #3D2984',
                    borderTop: '1.9px solid #3D2984',
                    width:210,
                    transition: '0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },

                    justifyContent: 'left',
                    alignItems: 'left',
                  }}
                >
                  <CardHeader
                    sx={{ justifyContent: 'left' }}
                    avatar={<em></em>}
                    title={
                      <Typography textAlign={'justify'} variant="body2" color="text.secondary" paddingRight={4}>
                        <b>MÊS 4</b>
                      </Typography>
                    }
                  />

                  <Divider />
                  <CardContent>
                    <Typography textAlign={'justify'} variant="body2" color="text.secondary" paddingBlockEnd={1} >
                      <Chip label="16 de Junho - 13 de Julho" color="secondary" />
                    </Typography>
                    <Typography
                      textAlign={'justify'}
                      variant="body2"
                      color="text.secondary"
                      paddingBlockEnd={1}
                      paddingLeft={2}
                    >
                      <b>Futuro do amor</b>
                    </Typography>
                    <Typography textAlign={'justify'} variant="body2" color="text.secondary" paddingLeft={2}>
                      Um livro e dois filmes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Stack>
      </div>
    </>
  );
};
export default LineTime;
