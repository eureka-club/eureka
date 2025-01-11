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
