import { Button, Stack, Typography } from '@mui/material';
import { Grid, Box} from '@mui/material';
import Link from 'next/link';

const SubscriptionForm = () => {
  // const bolderComponents = ()=>[<p key={1}/>,<b className='text-shadow' key={2}/>,<>✓ </>]
  return (
    <div>
      <Stack gap={5} paddingTop={5} paddingBottom={5} >
        <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingLeft={2} paddingRight={2}>
          <Box sx={{ maxWidth: { lg: '40dvw', sm: '90dvw', xs: '100dvw' } }}>
            <Typography fontSize={30} textAlign="center">
            Para Quem é o Clube de Leitura, Cinema e Música 'Com amor, Spinardi’?
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingLeft={2} paddingRight={2}>
          <Box sx={{ maxWidth: { lg: '99dvw', sm: '100dvw', xs: '100dvw' } }}>
            <Grid container gap={4} sx={{ justifyContent: 'center' }}>
              <Grid item xs={12} sm={6} md={4}>
                <Stack gap={4}>
                  {/* <Trans i18nKey='spinardi:lbl1BQ' components={bolderComponents()}/> */}
                  <Typography>✓ Para quem é <b>fã do Spinardi e quer se conectar com sua visão única sobre o amor.</b></Typography>
                  {/* <Trans i18nKey='spinardi:lbl2BQ' components={bolderComponents()}/> */}
                  <Typography>✓ Para quem busca uma <b>curadoria cultural exclusiva que combina literatura, cinema e música.</b></Typography>
                  {/* <Trans i18nKey='spinardi:lbl3BQ' components={bolderComponents()}/> */}
                  <Typography>✓ Para quem quer explorar as <b>múltiplas formas de amar</b>, seja no passado, presente ou futuro.</Typography>
                  {/* <Trans i18nKey='spinardi:lbl4BQ' components={bolderComponents()}/> */}
                  <Typography>✓ Para quem deseja refletir sobre <b>como o amor evolui e como podemos construir relações mais inclusivas e afetuosas.</b></Typography>
                  {/* <Trans i18nKey='spinardi:lbl5BQ' components={bolderComponents()}/> */}
                  <Typography>✓ Para quem procura um <b>espaço seguro e acolhedor</b>, onde o amor em todas as suas formas é celebrado sem julgamentos.</Typography>
                  {/* <Trans i18nKey='spinardi:lbl6BQ' components={bolderComponents()}/> */}
                  <Typography>✓ Para quem <b>quer aprender e refletir</b> sobre os desafios, as dores e as belezas do amor através da arte.</Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Stack gap={4}>
                  <Typography>✓ Para quem se interessa em conhecer <b>obras que rompem estereótipos</b> e destacam autores e autoras de diferentes países do mundo.</Typography>
                  <Typography>✓  Para quem <b>não aguenta mais</b> participar de debates nas mídias sociais que frequentemente acabam em brigas, desrespeito e agressividade.</Typography>
                  <Typography>✓ Para quem deseja fazer parte de uma comunidade que valoriza trocas construtivas e momentos de conexão genuína.</Typography>
                  <Typography>✓ Para quem busca um <b>ambiente seguro e livre de julgamentos</b>. Um espaço onde suas ideias são valorizadas e as conversas são construtivas.</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Stack gap={4}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingRight={4} paddingTop={2}>
                    <Box sx={{ maxWidth: { lg: '90dvw', sm: '90dvw', xs: '90dvw' } }}>
                      <Typography paddingBlockStart={2} paddingLeft={1} textAlign="center" variant="subtitle2">
                          <Link href="#price-info">
                            <Button variant='contained'>INSCREVA-SE NO CLUBE</Button>
                          </Link>
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
  );
};
export default SubscriptionForm;
