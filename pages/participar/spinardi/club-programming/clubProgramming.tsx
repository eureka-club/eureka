import { Stack, Typography } from '@mui/material';
import { Grid, Card, CardContent, CardHeader, Avatar, IconButton, Divider } from '@mui/material';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import Stars from 'pages/about/components/Stars';

const ClubProgramming = () => {
  return (
    <>
      <div>
      <Stack
        gap={5}
        paddingTop={4}
        paddingBottom={1}
        sx={{ backgroundColor: 'white' }}
        paddingLeft={2}
        paddingRight={2}
      >
        <Stack id="asUl" direction={{ xs: 'column' }} gap={2}>
          <Grid container>
          <Grid item xs={12} sm={4} padding={2}>
              <Card
                elevation={5}
                sx={{
                  maxWidth: 500,
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
                  avatar={<Avatar src={`${process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT}/public-assets/spinardi/catherine d'ignazio.webp`} aria-label="recipe"></Avatar>}
                  action={
                    <IconButton aria-label="settings">
                      <Stars />
                    </IconButton>
                  }
                  title='Catherine D’Ignazio'
                  subheader="Professora do MIT, Estados Unidos"
                />
                <Divider />
                <CardContent>
                  <Typography textAlign={'justify'} variant="body2" color="text.secondary">
                    <FaQuoteLeft />
                    A Eureka promove um ambiente que incentiva tanto a reflexão quanto a ação coletiva para a mudança social.
                    <FaQuoteRight />
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} padding={2}>
              <Card
                elevation={5}
                sx={{
                  maxWidth: 500,
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
                  avatar={<Avatar src={`${process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT}/public-assets/spinardi/Anna.webp`} aria-label="recipe"></Avatar>}
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
                  <Typography textAlign={'justify'} variant="body2" color="text.secondary">
                    <FaQuoteLeft />
                    Eureka me proporcionou uma jornada incrível de aprendizado e reflexão sobre justiça social. Participar do Clube me fez repensar minha visão de mundo. Recomendo a todos que desejam expandir seus horizontes e agir em prol da justiça.
                    <FaQuoteRight />
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} padding={2}>
              <Card
                elevation={5}
                sx={{
                  maxWidth: 500,
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
                  avatar={<Avatar src={`${process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT}/public-assets/spinardi/alejandro_noriega.webp`} aria-label="recipe"></Avatar>}
                  action={
                    <IconButton aria-label="settings">
                      <Stars />
                    </IconButton>
                  }
                  title="Alejandro Noriega"
                  subheader="Empreendedor Social, México"
                />
                <Divider />
                <CardContent>
                  <Typography textAlign={'justify'} variant="body2" color="text.secondary">
                    <FaQuoteLeft />
                    Empreendedor Social, México O Clube me ajudou a entender os círculos viciosos que moldam nossa era: da maximização de lucros pelas big techs à polarização e degradação do processo político. Foi uma experiência transformadora para compreender as raízes da crise social e política.
                    <FaQuoteRight />
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
export default ClubProgramming;
