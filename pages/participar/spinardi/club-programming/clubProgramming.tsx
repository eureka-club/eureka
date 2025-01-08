import { Stack, Typography } from '@mui/material';
import BuySubscriptionButton from 'pages/participar/components/BuySubscriptionButton';
import { Grid, Box, Card, CardContent, CardHeader, Avatar, IconButton, Divider } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import AnimatedIMGCarousel from 'pages/about/components/AnimatedIMGCarousel';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

import Stars from 'pages/about/components/Stars';
import BuyButton from 'pages/participar/components/BuyButton';
import useCycleSumary from '@/src/useCycleSumary';
import { FC } from 'react';

const ClubProgramming:FC<{cycleId:number}> = ({cycleId}) => {
  const { t } = useTranslation('spinardi');
  const{data:cycle}=useCycleSumary(cycleId);
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
        <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'}>
          <Typography textAlign={'center'} alignItems={'center'} padding={2} variant="h4">
            <b> {t('sub title club Schedule')}</b>
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }} paddingY={1}>
            <Box sx={{ width: { xs: '90dvw', md: '85dvw' } }}>
              <AnimatedIMGCarousel
                imgsSrc={[
                  '/img/register/carousel2/1-min.webp',
                  '/img/register/carousel2/2-min.webp',
                  '/img/register/carousel2/3-min.webp',
                  '/img/register/carousel2/4-min.webp',
                  '/img/register/carousel2/5-min.webp',
                  '/img/register/carousel2/6-min.webp',
                  '/img/register/carousel2/7-min.webp',
                  '/img/register/carousel2/8-min.webp',
                  '/img/register/carousel2/9-min.webp',
                  '/img/register/carousel2/10-min.webp',
                  '/img/register/carousel2/11-min.webp',
                ]}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingTop={4}>
            <Box sx={{ maxWidth: { lg: '40dvw', sm: '90dvw', xs: '100dvw' } }}>
              <BuyButton 
                label={t('btn to sign up')} 
                price={cycle?.price!}
                product_id={cycle?.product_id!}
                cycleId={cycle?.id!} 
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'} paddingTop={4}>
            <Typography textAlign={'center'} alignItems={'center'} padding={2} variant="h4">
              <b> {t('sub title join people')}</b>
            </Typography> 
          </Box>
        </Box>
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
                  avatar={<Avatar src="/img/spinardi/catherine d'ignazio.webp" aria-label="recipe"></Avatar>}
                  action={
                    <IconButton aria-label="settings">
                      <Stars />
                    </IconButton>
                  }
                  title='Catherine D’Ignazio'
                  subheader={t('card header 1')}
                />

                <Divider />
                <CardContent>
                  <Typography textAlign={'justify'} variant="body2" color="text.secondary">
                    <FaQuoteLeft />
                    {t('card content 1')}
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
                  avatar={<Avatar src="/img/Anna.webp" aria-label="recipe"></Avatar>}
                  action={
                    <IconButton aria-label="settings">
                      <Stars />
                    </IconButton>
                  }
                  title="Anna Silva"
                  subheader={t('card header 2')}
                />

                <Divider />
                <CardContent>
                  <Typography textAlign={'justify'} variant="body2" color="text.secondary">
                    <FaQuoteLeft />
                    {t('card content 2')}
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
                  avatar={<Avatar src="/img/spinardi/alejandro_noriega.webp" aria-label="recipe"></Avatar>}
                  action={
                    <IconButton aria-label="settings">
                      <Stars />
                    </IconButton>
                  }
                  title="Alejandro Noriega"
                  subheader={t('card header 3')}
                />

                <Divider />
                <CardContent>
                  <Typography textAlign={'justify'} variant="body2" color="text.secondary">
                    <FaQuoteLeft />
                    {t('card content 3')}
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
