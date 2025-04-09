import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/material';
import { Grid } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import Link from 'next/link';

export default function ReadingClubs() {
  const { t,lang } = useTranslation('readingClubs');

  const imagePath4 = `/img/readingClubs/Contando Feminicidios com Catherine DIgnazio ${lang=='fr'?'en':lang}.webp`
  const imagePath5 = `/img/readingClubs/Tecnologia Sob Lentes Feministas ${lang=='fr'?'en':lang}.webp`
  
  const imagePath5Href = lang == 'es'
    ? '/es/cycle/25'
    : lang == 'pt'
      ? '/pt/cycle/26'
      : `/${lang}/cycle/24`;

  return (
    <>
      <Stack spacing={1.5} sx={{ background: '#10b4bb', alignItems: 'center', alignContent: 'center' }}>
        <Grid item sx={{ background: 'white', borderRadius: '10px' }}>
          <Box sx={{ alignItems: 'center', alignContent: 'center', paddingTop: '10px' }}>
            <Box sx={{ backgroundColor: 'white', width: '99.99%', borderRadius: '30px' }}>
              <Stack gap={2} paddingTop={1} paddingBottom={1}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'center' }}
                  alignItems={'center'}
                  paddingLeft={1}
                  paddingRight={1}
                >
                  <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                    <Grid container gap={2} sx={{ justifyContent: 'center' }}>
                      <Grid item xs={12} sm={5} md={5}>
                        <Stack gap={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'left', paddingTop: '20px' }} alignItems={'left'}>
                            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                              <Typography textAlign="left" paddingBlockEnd={2} variant="h6">
                                {t('text1')}
                              </Typography>
                              <Typography textAlign="left" paddingBlockEnd={2} variant="h6">
                                {t('text2')}
                              </Typography>
                              <Typography textAlign="left" paddingBlockEnd={2} variant="h6">
                                {t('text3')}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6} md={6}>
                        <Stack gap={0}>
                          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Image src={`/img/readingClubs/foto inicial.webp`} width={3978} height={2652} />
                          </Box>
                          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <Image src={`/img/readingClubs/foto inicial.webp`} width={337} height={260} />
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Grid>
        <Box sx={{ display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
          {' '}
          <Typography variant="h6" color={'whitesmoke'} padding={'30px'}>
            {t('text4')}
            <Link href={'http://bit.ly/eureka-form'}>
              <a className="text-white text-decoration-underline me-xl-1 mb-1 mb-xl-none">bit.ly/eureka-form</a>
            </Link>
            {t('text5')}
            <Link color="secondary" href="mailto:hola@eureka.club">
              <a className="text-white text-decoration-underline me-xl-1 mb-1 mb-xl-none">hola@eureka.club</a>
            </Link>
          </Typography>
        </Box>

        <Grid item sx={{ background: 'white', borderRadius: '10px' }}>
          <Box sx={{ alignItems: 'center', alignContent: 'center', paddingTop: '10px' }}>
            <Box sx={{ backgroundColor: 'white', width: '99.99%', borderRadius: '30px' }}>
              <Stack gap={2} paddingTop={1} paddingBottom={1}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'center' }}
                  alignItems={'center'}
                  paddingLeft={1}
                  paddingRight={1}
                >
                  <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                    <Grid container gap={2} sx={{ justifyContent: 'center' }}>
                      <Grid item xs={12} sm={8} md={8}>
                        <Stack gap={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'left', paddingTop: '20px' }} alignItems={'left'}>
                            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                              <Typography paddingBlockEnd={2} fontSize={30}>
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: `<span style="color: blue;">${t('text6')}</span>`,
                                  }}
                                />
                              </Typography>
                              <Typography paddingBlockEnd={2} variant="h6">
                                {t('text7')}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3} md={3}>
                        <Stack gap={0}>
                          <Box component={Link} href={'https://www.eureka.club/cycle/35'}>
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                              <Image
                                src={`/img/readingClubs/1. reimaginando tecnologias.webp`}
                                width={1080}
                                height={1367}
                                style={{ cursor: 'pointer' }}
                              />
                            </Box>
                          </Box>
                          <Box component={Link} href={'https://www.eureka.club/cycle/35'}>
                            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                              <Image
                                src={`/img/readingClubs/1. reimaginando tecnologias.webp`}
                                width={197}
                                height={260}
                                style={{ cursor: 'pointer' }}
                              />
                            </Box>
                          </Box>
                          <Box>
                            <Typography textAlign="left" variant="body2">
                              {t('text8')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text9')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text10')}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Grid>

        <Grid item sx={{ background: 'white', borderRadius: '10px' }}>
          <Box sx={{ alignItems: 'center', alignContent: 'center', paddingTop: '10px' }}>
            <Box sx={{ backgroundColor: 'white', width: '99.99%', borderRadius: '30px' }}>
              <Stack gap={2} paddingTop={1} paddingBottom={1}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'center' }}
                  alignItems={'center'}
                  paddingLeft={1}
                  paddingRight={1}
                >
                  <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                    <Grid container gap={2} sx={{ justifyContent: 'center' }}>
                      <Grid item xs={12} sm={3} md={3}>
                        <Stack gap={0}>
                        <Box component={Link} href={'https://www.eureka.club/cycle/34'}>
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                              <Image
                                src={`/img/readingClubs/2. em busca de direitos humanos na era da IA.webp`}
                                width={1080}
                                height={1367}
                                style={{ cursor: 'pointer' }}
                              />
                            </Box>
                            </Box>
                            <Box component={Link} href={'https://www.eureka.club/cycle/34'}>
                            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                              <Image
                                src={`/img/readingClubs/2. em busca de direitos humanos na era da IA.webp`}
                                width={197}
                                height={260}
                                style={{ cursor: 'pointer' }}
                              />
                            </Box>
                          </Box>
                          <Box>
                            <Typography textAlign="left" variant="body2">
                              {t('text13')}
                            </Typography>
                            <Typography variant="body2">{t('text14')}</Typography>
                            <Typography variant="body2">{t('text15')}</Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={8} md={8}>
                        <Stack gap={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'left', paddingTop: '20px' }} alignItems={'left'}>
                            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                              <Typography textAlign="left" paddingBlockEnd={2} fontSize={30}>
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: `<span style="color: blue;">${t('text11')}</span>`,
                                  }}
                                />
                              </Typography>
                              <Typography textAlign="left" paddingBlockEnd={2} variant="h6">
                                {t('text12')}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Grid>
        <Grid item sx={{ background: 'white', borderRadius: '10px' }}>
          <Box sx={{ alignItems: 'center', alignContent: 'center', paddingTop: '10px' }}>
            <Box sx={{ backgroundColor: 'white', width: '99.99%', borderRadius: '30px' }}>
              <Stack gap={2} paddingTop={1} paddingBottom={1}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'center' }}
                  alignItems={'center'}
                  paddingLeft={1}
                  paddingRight={1}
                >
                  <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                    <Grid container gap={2} sx={{ justifyContent: 'center' }}>
                      <Grid item xs={12} sm={8} md={8}>
                        <Stack gap={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'left', paddingTop: '20px' }} alignItems={'left'}>
                            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                              <Typography textAlign="left" paddingBlockEnd={2} fontSize={30}>
                              <span
                                  dangerouslySetInnerHTML={{
                                    __html: `<span style="color: blue;">${t('text16')}</span>`,
                                  }}
                                />
                              </Typography>
                              <Typography textAlign="left" paddingBlockEnd={2} variant="h6">
                                {t('text17')}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3} md={3}>
                        <Stack gap={0}>
                        <Box component={Link} href={'https://www.eureka.club/cycle/28'}>
                          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Image
                              src={`/img/readingClubs/3. clube politico do juliano medeiros.webp`}
                              width={1080}
                              height={1367}
                              style={{ cursor: 'pointer' }}
                            />
                          </Box>
                          </Box>
                          <Box component={Link} href={'https://www.eureka.club/cycle/28'}>
                          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <Image
                              src={`/img/readingClubs/3. clube politico do juliano medeiros.webp`}
                              width={197}
                              height={260}
                              style={{ cursor: 'pointer' }}
                            />
                          </Box>
                          </Box>
                          <Box>
                            <Typography textAlign="left" variant="body2">
                              {t('text18')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text19')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text20')}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Grid>
        <Grid item sx={{ background: 'white', borderRadius: '10px' }}>
          <Box sx={{ alignItems: 'center', alignContent: 'center', paddingTop: '10px' }}>
            <Box sx={{ backgroundColor: 'white', width: '99.99%', borderRadius: '30px' }}>
              <Stack gap={2} paddingTop={1} paddingBottom={1}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'center' }}
                  alignItems={'center'}
                  paddingLeft={1}
                  paddingRight={1}
                >
                  <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                    <Grid container gap={2} sx={{ justifyContent: 'center' }}>
                      <Grid item xs={12} sm={3} md={3}>
                        <Stack gap={0}>
                        <Box component={Link} href={'https://www.eureka.club/cycle/31'}>
                          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Image
                              src={imagePath4}
                              width={1080}
                              height={1367}
                              style={{ cursor: 'pointer' }}
                            />
                          </Box>
                          </Box>
                          <Box component={Link} href={'https://www.eureka.club/cycle/31'}>
                          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <Image
                              src={imagePath4}
                              width={197}
                              height={260}
                              style={{ cursor: 'pointer' }}
                            />
                          </Box>
                          </Box>
                          <Box>
                            <Typography textAlign="left" variant="body2">
                              {t('text23')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text24')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text25')}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={8} md={8}>
                        <Stack gap={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'left', paddingTop: '20px' }} alignItems={'left'}>
                            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                              <Typography textAlign="left" paddingBlockEnd={2} fontSize={30}>
                              <span
                                  dangerouslySetInnerHTML={{
                                    __html: `<span >${t('text21')}</span>`,
                                  }}
                                />
                              </Typography>
                              <Typography textAlign="left" paddingBlockEnd={2} variant="h6">
                                {t('text22')}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Grid>
        <Grid item sx={{ background: 'white', borderRadius: '10px' }}>
          <Box sx={{ alignItems: 'center', alignContent: 'center', paddingTop: '10px' }}>
            <Box sx={{ backgroundColor: 'white', width: '99.99%', borderRadius: '30px' }}>
              <Stack gap={2} paddingTop={1} paddingBottom={1}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'center' }}
                  alignItems={'center'}
                  paddingLeft={1}
                  paddingRight={1}
                >
                  <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                    <Grid container gap={2} sx={{ justifyContent: 'center' }}>
                      <Grid item xs={12} sm={8} md={8}>
                        <Stack gap={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'left', paddingTop: '20px' }} alignItems={'left'}>
                            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                              <Typography textAlign="left" paddingBlockEnd={2} fontSize={30}>
                              <span
                                  dangerouslySetInnerHTML={{
                                    __html: `<span >${t('text26')}</span>`,
                                  }}
                                />
                              </Typography>
                              <Typography textAlign="left" paddingBlockEnd={2} variant="h6">
                                {t('text27')}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3} md={3}>
                        <Stack gap={0}>
                        <Box component={Link} href={'https://www.eureka.club/cycle/26'}  >
                          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Link href={imagePath5Href}>
                              <Image
                                src={imagePath5}
                                width={1080}
                                height={1367}
                                style={{ cursor: 'pointer' }}
                              />
                            </Link>
                          </Box>
                          </Box>
                          <Box component={Link} href={'https://www.eureka.club/cycle/26'}  >
                          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <Image
                              src={imagePath5}
                              width={197}
                              height={260}

                            />


                          </Box>
                          </Box>
                          <Box>
                            <Typography textAlign="left" variant="body2">
                              {t('text28')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text29')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text30')}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Grid>
        <Grid item sx={{ background: 'white', borderRadius: '10px' }}>
          <Box sx={{ alignItems: 'center', alignContent: 'center', paddingTop: '10px' }}>
            <Box sx={{ backgroundColor: 'white', width: '99.99%', borderRadius: '30px' }}>
              <Stack gap={2} paddingTop={1} paddingBottom={1}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'center' }}
                  alignItems={'center'}
                  paddingLeft={1}
                  paddingRight={1}
                >
                  <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                    <Grid container gap={2} sx={{ justifyContent: 'center' }}>
                      <Grid item xs={12} sm={3} md={3}>
                        <Stack gap={0}>
                        <Box component={Link} href={'https://www.eureka.club/cycle/21'}>
                          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Image
                              src={`/img/readingClubs/6. perspectivas feministas en moderacion de contenidos.webp`}
                              width={1080}
                              height={1367}
                              style={{ cursor: 'pointer' }}
                            />
                          </Box>
                          </Box>
                          <Box component={Link} href={'https://www.eureka.club/cycle/21'}>
                          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <Image
                              src={`/img/readingClubs/6. perspectivas feministas en moderacion de contenidos.webp`}
                              width={197}
                              height={260}
                              style={{ cursor: 'pointer' }}
                            />
                          </Box>
                          </Box>
                          <Box>
                            <Typography textAlign="left" variant="body2">
                              {t('text33')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text34')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text35')}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={8} md={8}>
                        <Stack gap={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'left', paddingTop: '20px' }} alignItems={'left'}>
                            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                              <Typography textAlign="left" paddingBlockEnd={2} fontSize={30}>
                              <span
                                  dangerouslySetInnerHTML={{
                                    __html: `<span >${t('text31')}</span>`,
                                  }}
                                />
                              </Typography>
                              <Typography textAlign="left" paddingBlockEnd={2} variant="h6">
                                {t('text32')}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Grid>
        <Grid item sx={{ background: 'white', borderRadius: '10px' }}>
          <Box sx={{ alignItems: 'center', alignContent: 'center', paddingTop: '10px' }}>
            <Box sx={{ backgroundColor: 'white', width: '99.99%', borderRadius: '30px' }}>
              <Stack gap={2} paddingTop={1} paddingBottom={1}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'center' }}
                  alignItems={'center'}
                  paddingLeft={1}
                  paddingRight={1}
                >
                  <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                    <Grid container gap={2} sx={{ justifyContent: 'center' }}>
                      <Grid item xs={12} sm={8} md={8}>
                        <Stack gap={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'left', paddingTop: '20px' }} alignItems={'left'}>
                            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                              <Typography textAlign="left" paddingBlockEnd={2} fontSize={30}>
                                {t('text36')}
                              </Typography>
                              <Typography textAlign="left" paddingBlockEnd={2} variant="h6">
                                {t('text37')}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3} md={3}>
                        <Stack gap={0}>
                        <Box component={Link} href={'https://www.eureka.club/cycle/20'}>
                          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Image  style={{ cursor: 'pointer' }} src={`/img/readingClubs/7. Ser Agua.webp`} width={1080} height={1367} />
                          </Box>
                          </Box>
                          <Box component={Link} href={'https://www.eureka.club/cycle/20'}>
                          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <Image  style={{ cursor: 'pointer' }} src={`/img/readingClubs/7. Ser Agua.webp`} width={197} height={260} />
                          </Box>
                          </Box>
                          <Box>
                            <Typography textAlign="left" variant="body2">
                              {t('text38')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text39')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text40')}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Grid>
        <Grid item sx={{ background: 'white', borderRadius: '10px' }}>
          <Box sx={{ alignItems: 'center', alignContent: 'center', paddingTop: '10px' }}>
            <Box sx={{ backgroundColor: 'white', width: '99.99%', borderRadius: '30px' }}>
              <Stack gap={2} paddingTop={1} paddingBottom={1}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'center' }}
                  alignItems={'center'}
                  paddingLeft={1}
                  paddingRight={1}
                >
                  <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                    <Grid container gap={2} sx={{ justifyContent: 'center' }}>
                      <Grid item xs={12} sm={3} md={3}>
                        <Stack gap={0}>
                        <Box component={Link} href={'https://www.eureka.club/cycle/19'}>
                          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Image
                              src={`/img/readingClubs/8.ecossensse & ecosensibility.webp`}
                              width={1080}
                              height={1367}
                              style={{ cursor: 'pointer' }}
                            />
                          </Box>
                          </Box>
                          <Box component={Link} href={'https://www.eureka.club/cycle/19'}>
                          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <Image
                              src={`/img/readingClubs/8.ecossensse & ecosensibility.webp`}
                              width={197}
                              height={260}
                              style={{ cursor: 'pointer' }}
                            />
                            </Box>
                          </Box>
                          <Box>
                            <Typography textAlign="left" variant="body2">
                              {t('text43')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text44')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text45')}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={8} md={8}>
                        <Stack gap={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'left', paddingTop: '20px' }} alignItems={'left'}>
                            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                              <Typography textAlign="left" paddingBlockEnd={2} fontSize={30}>
                                {t('text41')}
                              </Typography>
                              <Typography textAlign="left" paddingBlockEnd={2} variant="h6">
                                {t('text42')}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Grid>
        <Grid item sx={{ background: 'white', borderRadius: '10px' }}>
          <Box sx={{ alignItems: 'center', alignContent: 'center', paddingTop: '10px' }}>
            <Box sx={{ backgroundColor: 'white', width: '99.99%', borderRadius: '30px' }}>
              <Stack gap={2} paddingTop={1} paddingBottom={1}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'center' }}
                  alignItems={'center'}
                  paddingLeft={1}
                  paddingRight={1}
                >
                  <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                    <Grid container gap={2} sx={{ justifyContent: 'center' }}>
                      <Grid item xs={12} sm={8} md={8}>
                        <Stack gap={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'left', paddingTop: '20px' }} alignItems={'left'}>
                            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                              <Typography textAlign="left" paddingBlockEnd={2} fontSize={30}>
                                {t('text46')}
                              </Typography>
                              <Typography textAlign="left" paddingBlockEnd={2} variant="h6">
                                {t('text47')}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3} md={3}>
                        <Stack gap={0}>
                        <Box component={Link} href={'https://www.eureka.club/cycle/18'}>
                          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Image  style={{ cursor: 'pointer' }} src={`/img/readingClubs/9.tautology.webp`} width={1080} height={1367} />
                          </Box>
                          </Box>
                          <Box component={Link} href={'https://www.eureka.club/cycle/18'}>
                          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <Image  style={{ cursor: 'pointer' }} src={`/img/readingClubs/9.tautology.webp`} width={197} height={260} />
                          </Box>
                          </Box>
                          <Box>
                            <Typography textAlign="left" variant="body2">
                              {t('text48')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text49')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text50')}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Grid>
        <Grid item sx={{ background: 'white', borderRadius: '10px' }}>
          <Box sx={{ alignItems: 'center', alignContent: 'center', paddingTop: '10px' }}>
            <Box sx={{ backgroundColor: 'white', width: '99.99%', borderRadius: '30px' }}>
              <Stack gap={2} paddingTop={1} paddingBottom={1}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'center' }}
                  alignItems={'center'}
                  paddingLeft={1}
                  paddingRight={1}
                >
                  <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                    <Grid container gap={2} sx={{ justifyContent: 'center' }}>
                      <Grid item xs={12} sm={3} md={3}>
                        <Stack gap={0}>
                        <Box component={Link} href={'https://www.eureka.club/cycle/16'}>
                          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Image
                              src={`/img/readingClubs/10.capitalismo de las redes.webp`}
                              width={1080}
                              height={1367}
                              style={{ cursor: 'pointer' }}
                            />
                          </Box>
                          </Box>
                          <Box component={Link} href={'https://www.eureka.club/cycle/16'}>

                          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <Image
                              src={`/img/readingClubs/10.capitalismo de las redes.webp`}
                              width={197}
                              height={260}
                              style={{ cursor: 'pointer' }}
                            />
                          </Box>
                          </Box>
                          <Box>
                            <Typography textAlign="left" variant="body2">
                              {t('text53')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text54')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text55')}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={8} md={8}>
                        <Stack gap={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'left', paddingTop: '20px' }} alignItems={'left'}>
                            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                              <Typography textAlign="left" paddingBlockEnd={2} fontSize={30}>
                                {t('text51')}
                              </Typography>
                              <Typography textAlign="left" paddingBlockEnd={2} variant="h6">
                                {t('text52')}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Grid>
        <Grid item sx={{ background: 'white', borderRadius: '10px' }}>
          <Box sx={{ alignItems: 'center', alignContent: 'center', paddingTop: '10px' }}>
            <Box sx={{ backgroundColor: 'white', width: '99.99%', borderRadius: '30px' }}>
              <Stack gap={2} paddingTop={1} paddingBottom={1}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'center' }}
                  alignItems={'center'}
                  paddingLeft={1}
                  paddingRight={1}
                >
                  <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                    <Grid container gap={2} sx={{ justifyContent: 'center' }}>
                      <Grid item xs={12} sm={8} md={8}>
                        <Stack gap={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'left', paddingTop: '20px' }} alignItems={'left'}>
                            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                              <Typography textAlign="left" paddingBlockEnd={2} fontSize={30}>
                                {t('text56')}
                              </Typography>
                              <Typography textAlign="left" paddingBlockEnd={2} variant="h6">
                                {t('text57')}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3} md={3}>
                        <Stack gap={0}>
                        <Box component={Link} href={'https://www.eureka.club/cycle/15'}>

                          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Image  style={{ cursor: 'pointer' }} src={`/img/readingClubs/11.nuevas justicias.webp`} width={1080} height={1367} />
                          </Box>
                          </Box>
                          <Box component={Link} href={'https://www.eureka.club/cycle/15'}>
                          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <Image  style={{ cursor: 'pointer' }} src={`/img/readingClubs/11.nuevas justicias.webp`} width={197} height={260} />
                          </Box>
                          </Box>

                          <Box>
                            <Typography textAlign="left" variant="body2">
                              {t('text58')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text59')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text60')}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Grid>
        <Grid item sx={{ background: 'white', borderRadius: '10px' }}>
          <Box sx={{ alignItems: 'center', alignContent: 'center', paddingTop: '10px' }}>
            <Box sx={{ backgroundColor: 'white', width: '99.99%', borderRadius: '30px' }}>
              <Stack gap={2} paddingTop={1} paddingBottom={1}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'center' }}
                  alignItems={'center'}
                  paddingLeft={1}
                  paddingRight={1}
                >
                  <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                    <Grid container gap={2} sx={{ justifyContent: 'center' }}>
                      <Grid item xs={12} sm={3} md={3}>
                        <Stack gap={0}>
                        <Box component={Link} href={'https://www.eureka.club/cycle/13'}>
                          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Image  style={{ cursor: 'pointer' }} src={`/img/readingClubs/12.genero e violencia.webp`} width={1080} height={1367} />
                          </Box>
                          </Box>
                          <Box component={Link} href={'https://www.eureka.club/cycle/13'}>
                          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <Image  style={{ cursor: 'pointer' }} src={`/img/readingClubs/12.genero e violencia.webp`} width={197} height={260} />
                          </Box>
                          </Box>
                          <Box>
                            <Typography textAlign="left" variant="body2">
                              {t('text63')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text64')}
                            </Typography>
                            <Typography variant="body2" paddingInlineEnd={'85px'}>
                              {t('text65')}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={8} md={8}>
                        <Stack gap={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'left', paddingTop: '20px' }} alignItems={'left'}>
                            <Box sx={{ maxWidth: { lg: '100dvw', sm: '100dvw', xs: '100dvw' } }}>
                              <Typography textAlign="left" paddingBlockEnd={2} fontSize={30}>
                                {t('text61')}
                              </Typography>
                              <Typography textAlign="left" paddingBlockEnd={2} variant="h6">
                                {t('text62')}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Grid>
      </Stack>
    </>
  );
};


