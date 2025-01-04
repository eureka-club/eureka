import { Stack, Typography } from '@mui/material';
import BuySubscriptionButton from 'pages/participar/components/BuySubscriptionButton';
import Countdown from 'pages/participar/components/Countdown';
import Image from 'next/image';
import { Grid, Box } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';

const Header = () => {
  const { t, lang } = useTranslation('spinardi');
  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 3 }}
        paddingLeft={4}
        justifyContent={'center'}
        justifyItems={'center'}
      >
        <Grid flexDirection={'row'} paddingTop={2}>
          <Image src="/img/spinardi/provisoria.webp" width={300} height={350}></Image>
        </Grid>

        <Grid justifyContent={'center'} justifyItems={'center'}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }} alignItems={'center'}>
            <Box sx={{ maxWidth: { lg: '30dvw', sm: '100dvw', xs: '100dvw' } }}>
              <Typography textAlign="center" paddingTop={2} variant="h4">
                <b> {t('club title')}</b>
              </Typography>
              <Typography paddingBlockEnd={2} textAlign="center" variant="subtitle1">
                {t('club dates')}
              </Typography>
              <Typography paddingBlockEnd={2} textAlign="center" variant="subtitle1">
                {' '}
                {t('fully written')}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{ display: 'flex', justifyContent: 'center' }}
            alignItems={'center'}
            paddingRight={2.5}
            paddingLeft={1}
            paddingY={2}
          >
            <Box sx={{ maxWidth: { lg: '30dvw', sm: '90dvw', xs: '100dvw' } }}>
              <BuySubscriptionButton
                label={t('btn exclusive club')}
                price="price_1QaOWZLbVcSeBXdQ7Nt4wPOr"
                product_id="prod_RTLCazmGCcyKKH"
                cycleId={30}
                next={`/${lang}/participar/spinardi`}
              />
              <Countdown startDate={new Date('2025-01-12')} />
              <Typography paddingBlockStart={2} paddingLeft={1} textAlign="center" variant="subtitle2">
                <i>{t('written')}</i>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Stack>
    </>
  );
};
export default Header;
