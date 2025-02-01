import { Button, Stack, Typography } from '@mui/material';
import { Grid, Box } from '@mui/material';
import Trans from 'next-translate/Trans';
import Link from 'next/link';

const AdFromOurCommunity = () => {
  return (
    <>
      <div>
        <Stack gap={5} paddingTop={5} paddingBottom={1}>
          <Box
            sx={{ display: 'flex', justifyContent: 'center' }}
            alignItems={'center'}
            paddingLeft={2}
            paddingRight={2}
          >
            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
              <Typography fontSize={30} textAlign="center">
                <b> Conduzido por Rafael Spinardi</b>
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{ display: 'flex', justifyContent: 'center' }}
            alignItems={'center'}
            paddingLeft={2}
            paddingRight={2}
          >
            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
              <Grid container gap={4} sx={{ justifyContent: 'center' }}>
                <Grid item xs={12} sm={6}>
                  <Stack gap={4}>
                    <Box sx={{display:{xs:'none',sm:'block'}}}>
                      <img src={`${process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT}/public-assets/spinardi/com amorspinardi.webp`} width={482} />
                    </Box>
                    <Box sx={{display:{xs:'block',sm:'none'}}}>
                      <img src={`${process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT}/public-assets/spinardi/com amorspinardi.webp`} width={365} />
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Stack gap={4} paddingX={4}>
                    <Box sx={{ display: 'flex', justifyContent: 'left' }} alignItems={'center'}>
                      <Box sx={{ maxWidth: { lg: '43dvw', sm: '43dvw', xs: '100dvw' } }}>
                        <Typography textAlign="left" paddingBlockEnd={2} variant="body2">
                        Salve, família! 
                        </Typography>
                        <Typography textAlign="left" paddingBlockEnd={2} variant="body2">
                        Sou o Spinardi, um artista que sempre acreditou que <b>o amor é a força que move o mundo</b>. Seja no rap, na literatura, no cinema ou na vida, é o amor que nos conecta, nos transforma e dá sentido às nossas histórias. Quando pensei nesse clube, imaginei um <b>espaço onde a gente pudesse trocar ideias, se inspirar e olhar para o amor de um jeito diferente</b> sem estereótipos, sem medo, só com verdade e olhos no olhos.
                          {/* <Trans i18nKey={'spinardi:lbl2BCS'} components={[<p key={1}></p>, <b key={2} />]} /> */}
                        </Typography>
                        <Typography textAlign="left" paddingBlockEnd={2} variant="body2">
                        Minhas músicas sempre foram um reflexo do que sinto e vejo, e quero que a gente converse sobre rimas e beats, mas também sobre muito mais. Vamos explorar juntos como o amor pode ser revolucionário, como pode mudar com o tempo e como pode nos ajudar a construir futuros mais afetuosos e inclusivos. É uma jornada que quero dividir com vocês de coração aberto e mente livre.
                        </Typography>
                        <Typography textAlign="left" paddingBlockEnd={2} variant="body2">
                        Como diria Mano Brown: “Não existe poeta que não saiba falar sobre amor”. 
                        </Typography>
                        <Typography textAlign="left"  variant="body2">
                        Com amor,
                        </Typography>
                        <Typography textAlign="left" paddingBlockEnd={2} variant="body2">
                        Spinardi
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'}>
              <Box sx={{ maxWidth: { lg: '90dvw', sm: '90dvw', xs: '90dvw' } }}>
                <Typography paddingBlockStart={2} paddingLeft={1} textAlign="center" variant="subtitle2">
                  <Link href="#price-info">
                    <Button variant='contained'>INSCREVA-SE NO CLUBE</Button>
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Stack>
      </div>
    </>
  );
};

export default AdFromOurCommunity;
