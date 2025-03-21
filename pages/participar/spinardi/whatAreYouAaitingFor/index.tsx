import { Button, Stack, Typography } from '@mui/material';
import Countdown from 'pages/participar/components/Countdown';
import { Grid, Box } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const WhatAreYouAaitingFor = () => {

  return (
    <>
      <div>
        <Stack gap={2} paddingTop={0} paddingBottom={1} sx={{}}>
          <Box sx={{ display: 'flex', justifyContent: 'left' }} alignItems={'left'}>
            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
              <Grid container gap={2} sx={{ justifyContent: 'left', alignItems: 'left' }}>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                  <Stack gap={2}>
                    <Box
                      sx={{
                        maxWidth: { lg: '80dvw', sm: '80dvw', xs: '0dvw' },
                        position: 'relative',
                        zIndex: 0,
                        top: '55px',
                        right: '16px',
                        marginRight: 0,
                        marginTop: 0,
                        display: { xs: 'none', lg: 'block', sm: 'block', md: 'block' },
                      }}
                      paddingLeft={0}
                      paddingTop={0}
                      paddingRight={0}
                      paddingBlockEnd={0}
                    >
                      <Image src={`${process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT}/public-assets/spinardi/footer_background.webp`} width={413} height={413}></Image>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <Stack gap={2} paddingTop={2} paddingX={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'}>
                      <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw', md: '100dvw' } }}>
                        <Typography textAlign="center" paddingTop={2} fontSize={30}>
                          <b> Está esperando o quê?</b>
                        </Typography>
                        <Typography textAlign="center" paddingBlockEnd={2} fontSize={20} paddingTop={2}>
                        É hora de se conectar, refletir e crescer junto com uma comunidade inspiradora! O clube de leitura ‘Com amor, Spinardi’ começa em:
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingRight={4}>
                      <Box sx={{ maxWidth: { lg: '90dvw', sm: '90dvw', xs: '100dvw' } }}>
                        <Countdown startDate={new Date('2025-03-10')} />
                      </Box>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'center' }}
                      alignItems={'center'}
                      paddingRight={4}
                      paddingTop={2}
                    >
                      <Box sx={{ maxWidth: { lg: '90dvw', sm: '90dvw', xs: '90dvw' } }} paddingX={0}>
                        <Typography paddingBlockStart={2} paddingLeft={1} textAlign="center" variant="subtitle2">
                          <Link href="#price-info">
                            <Button variant='contained'>INSCREVA-SE NO CLUBE</Button>
                          </Link>
                        </Typography>
                        <Typography textAlign="center" paddingY={2} variant="body2">
                        Eureka é o primeiro clube de leitura e cinema por justiça social da América Latina! Durante a duração do Clube, você recebe dicas de livros e filmes incríveis sobre o tema do Clube, perfeitos para aprender, refletir e debater na nossa comunidade exclusiva.
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Stack>
      </div>
    </>
  );
};
export default WhatAreYouAaitingFor;
