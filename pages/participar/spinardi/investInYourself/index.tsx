import { Stack, Typography } from '@mui/material';
import { Grid, Box } from '@mui/material';
import BuyButton from 'pages/participar/components/BuyButton';
import useCycleSumary from '@/src/useCycleSumary';
import { FC } from 'react';

const InvestInYourself: FC<{ cycleId: number }> = ({ cycleId }) => {
  const { data: cycle } = useCycleSumary(cycleId);

  return (
    <>
      <div>
        <Stack gap={0.5} paddingTop={2} paddingBottom={1}>
          <Grid>
            <Box
              sx={{ display: 'flex', justifyContent: 'center' }}
              alignItems={'center'}
              paddingLeft={2}
              paddingRight={2}
            >
              <Box id="price-info" sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                <Typography fontSize={30} textAlign="center">
                  <b>Garanta sua vaga!</b>
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'}>
              <Box sx={{ maxWidth: { lg: '45dvw', sm: '75dvw', xs: '100dvw' } }}>
                <Typography textAlign="center" variant="body2">
                É hora de se conectar, refletir e crescer junto! Tenha acesso completo ao Clube de Leitura, Cinema e Música ‘Com amor, Spinardi’ por apenas:
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} alignContent={'center'}>
              <Box
                sx={{ maxWidth: { lg: '43dvw', sm: '60dvw', xs: '100dvw' }, display: 'flex' }}
                alignItems={'center'}
                alignContent={'center'}
              >
                <Typography fontSize={22}>
                  <b>4 X</b>
                </Typography>
                <Typography textAlign="center" paddingBlockEnd={0} fontSize={50} paddingLeft={1}>
                  <b>49,90</b>
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'}>
              <Box sx={{ maxWidth: { lg: '60dvw', sm: '100dvw', xs: '100dvw' } }}>
                <Typography textAlign="center" variant="body2">
                Ou R$ 199,00 à vista
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid paddingY={2}>
            <Box
              sx={{ display: 'flex', justifyContent: 'center' }}
              alignItems={'center'}
              paddingRight={4}
              paddingTop={0}
            >
              <Box sx={{ maxWidth: { lg: '90dvw', sm: '100dvw', xs: '100dvw' } }}>
                <BuyButton label="Comece hoje mesmo!" cycleId={cycle?.id!} sx={{color:'black',borderColor:'black',backgroundColor:'#8DFAF3',display:'block',width:'250px'}} variant="outlined"
          size="large"
          type="submit" />
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'left' }} alignItems={'center'}>
              <Box sx={{ maxWidth: { lg: '60dvw', sm: '70dvw', xs: '100dvw' } }}>
                <Typography textAlign="center" variant="body2">
                  ✅<b> Acesso à curadoria exclusiva de livros, filmes e músicas durante os 4 meses do Clube.</b>
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'left' }} alignItems={'center'}>
              <Box sx={{ maxWidth: { lg: '60dvw', sm: '70dvw', xs: '100dvw' } }}>
                <Typography textAlign="center" variant="body2">
                  ✅<b> Participação em encontros online (e alguns presenciais em São Paulo!) com Spinardi </b>
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'left' }} alignItems={'center'}>
              <Box sx={{ maxWidth: { lg: '60dvw', sm: '70dvw', xs: '100dvw' } }}>
                <Typography textAlign="center" variant="body2">
                  ✅<b> Cronogramas personalizados, resumos em texto e áudio, e materiais de apoio para acompanhar sua jornada.</b>
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'left' }} alignItems={'center'}>
              <Box sx={{ maxWidth: { lg: '60dvw', sm: '70dvw', xs: '100dvw' } }}>
                <Typography textAlign="center" variant="body2">
                  ✅<b> Funcionalidades exclusivas com IA para transformar suas reflexões em momentos únicos.</b>
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid paddingTop={1}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'}>
              <Box sx={{ maxWidth: { lg: '43dvw', sm: '43dvw', xs: '100dvw' } }}>
                <Typography textAlign="center" variant="body2" paddingBlockEnd={1}>
                Nota: Os livros e filmes não estão incluídos no valor da inscrição.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Stack>
      </div>
    </>
  );
};
export default InvestInYourself;
