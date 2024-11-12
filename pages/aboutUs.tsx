import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { TiSocialLinkedinCircular } from 'react-icons/ti';
//import { SiUpwork } from 'react-icons/si';
import styles from './aboutUs.module.css';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import { getSession } from 'next-auth/react';
import { Session } from '@/src/types';
import { Container, Grid, Chip, Typography, Stack, Box } from '@mui/material';
//import { ReactElement } from 'react';

interface Props {
  session: Session;
}
const AboutPage: NextPage<Props> = ({ session }) => {
  const { t } = useTranslation('aboutUs');
  const NEXT_PUBLIC_AZURE_CDN_ENDPOINT = process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT;
  const NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME = process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME;
  return (
    <>
      <Head>
        <meta name="title" content={t('meta:aboutUsTitle')}></meta>
        <meta name="description" content={t('meta:aboutUsDescription')}></meta>
      </Head>
      <SimpleLayout title={t('browserTitle')}>
        <div style={{ textAlign: 'center', paddingTop: 40 }}>
          <Typography variant="h5" className="text-secondary fw-bold">
            {t('title')}
          </Typography>
        </div>
        <br />
        <br />
        <div className="middle-container">
          <Container maxWidth="lg">
            <Grid container>
              <Grid item className={styles.peopleCard} lg={3} md={3} xs={12}>
                <Image
                  className="rounded-circle"
                  src="/julie-NUEVA.webp"
                  alt="Founder, Director"
                  width={200}
                  height={200}
                />
                <Typography variant="h2" className={styles.peopleName}>
                  Julie Ricard
                  <a href="https://www.linkedin.com/in/ricardjulie/" target="_blank" rel="noreferrer">
                    <TiSocialLinkedinCircular className={styles.si} />
                  </a>
                </Typography>
                <Typography variant="h3" paddingTop={'9px'} className={styles.professionName}>
                  {t('Founder, Director')}
                </Typography>
                <Typography variant="h4" paddingY={'9px'} className={styles.positionName}>
                  {t('Researcher and technologist')}
                </Typography>
                <Chip label={`${t('social justice')}`} size="small" color="secondary" />
                <br />
                <Chip label={`${t('intersectional feminism')}`} size="small" color="secondary" />
                <br />
                <Chip label={`${t('disinformation')}`} size="small" color="secondary" />
              </Grid>
              <Grid item className={styles.peopleCard} lg={3} md={3} xs={12}>
                <Image
                  className="rounded-circle"
                  src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/aboutUs/geordanis_bano_vega.png`}
                  alt="Picture of Software Engineer"
                  width={200}
                  height={200}
                />
                <Typography variant="h2" className={styles.peopleName}>
                  Geordanis Baño Vega
                  <a href="https://linkedin.com/in/geordanis-baño-vega-488a1863/" target="_blank" rel="noreferrer">
                    <TiSocialLinkedinCircular className={styles.si} />
                  </a>
                </Typography>
                <Typography variant="h3" paddingTop={'9px'} className={styles.professionName}>
                  {t('Software Engineer')}
                </Typography>
                <Typography variant="h4" paddingY={'9px'} className={styles.positionName}>
                  {t('Full-stack expert')}
                </Typography>
                <Chip label={`${t('environment')}`} size="small" color="secondary" />
                <br />
                <Chip label={`${t('good cinema')}`} size="small" color="secondary" />
                <br />
                <Chip label={`${t('music')}`} size="small" color="secondary" />
              </Grid>
              <Grid item className={styles.peopleCard} lg={3} md={3} xs={12}>
                <Image
                  className="rounded-circle"
                  alt="Partnerships and Development"
                  src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/aboutUs/amanda_gois.webp`}
                  width={200}
                  height={200}
                />
                <Typography variant="h2" className={styles.peopleName}>
                  Amanda Quitério de Gois
                  <a
                    href="https://www.linkedin.com/in/amanda-quit%C3%A9rio-de-gois-0b5b111b5/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <TiSocialLinkedinCircular className={styles.si} />
                  </a>
                </Typography>
                <Typography variant="h3" paddingTop={'9px'} className={styles.professionName}>
                  {t('Partnerships and Development')}
                </Typography>
                <Typography variant="h4" paddingY={'9px'} className={styles.positionName}>
                  {t('Master in Literature')}
                </Typography>
                <Chip label={`${t('Gender and feminisms')}`} size="small" color="secondary" />
                <br />
                <Chip label={`${t('Brazilian Popular Music')}`} size="small" color="secondary" />
                <br />
                <Chip label={`${t('Books')}`} size="small" color="secondary" />
              </Grid>

              <Grid item className={styles.peopleCard} lg={3} md={3} xs={12}>
                <Image
                  className="rounded-circle"
                  src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/aboutUs/alejandro_noriega.jpeg`}
                  alt="Co-creator from Prosperia"
                  width={200}
                  height={200}
                />
                <Typography variant="h2" className={styles.peopleName}>
                  Alejandro Noriega
                  <a
                    href="https://www.linkedin.com/in/alejandro-noriega-campero-40305637/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <TiSocialLinkedinCircular className={styles.si} />
                  </a>
                </Typography>
                <Typography variant="h3" paddingTop={'9px'} className={styles.professionName}>
                  {t('Co-creator from Prosperia')}
                </Typography>
                <Typography variant="h4" paddingY={'9px'} className={styles.positionName}>
                  {t('AI and technology expert')}
                </Typography>
                <Chip label={`${t('artificial intelligence')}`} size="small" color="secondary" />
                <br />
                <Chip label={`${t('social policies')}`} size="small" color="secondary" />
                <br />
                <Chip label={`${t('public health')}`} size="small" color="secondary" />
              </Grid>
              <Grid item className={styles.peopleCard} lg={3} md={3} xs={12}>
                <Image
                  className="rounded-circle"
                  src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/aboutUs/henry-rufo.webp`}
                  alt="Picture of Developer"
                  width={200}
                  height={200}
                />
                <Typography variant="h2" className={styles.peopleName}>
                  Henry Ruffo Wood
                  <a href="https://www.linkedin.com/in/henry-ruffo-a076b5334" target="_blank" rel="noreferrer">
                    <TiSocialLinkedinCircular className={styles.si} />
                  </a>
                </Typography>
                <Typography variant="h3" paddingTop={'9px'} className={styles.professionName}>
                  {t('Developer')}
                </Typography>
                <Typography variant="h4" paddingY={'9px'} className={styles.positionName}>
                  {t('Front-end expert')}
                </Typography>
                <Chip label={`${t('Nature')}`} size="small" color="secondary" />
                <br />
                <Chip label={`${t('Photograph')}`} size="small" color="secondary" />
                <br />
                <Chip label={`${t('music')}`} size="small" color="secondary" />
              </Grid>
              <Grid item className={styles.peopleCard} lg={3} md={3} xs={12}>
                <Image
                  className="rounded-circle"
                  src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/aboutUs/daniela-goncalves.jpeg`}
                  alt="Picture of Advisor"
                  width={200}
                  height={200}
                />
                <Typography variant="h2" className={styles.peopleName}>
                  Daniela Gonçalves
                  <a href="https://www.linkedin.com/in/daniela-gonçalves-565aba50/" target="_blank" rel="noreferrer">
                    <TiSocialLinkedinCircular className={styles.si} />
                  </a>
                </Typography>
                <Typography variant="h3" paddingTop={'9px'} className={styles.professionName}>
                  {t('Advisor')}
                </Typography>
                <Typography variant="h4" paddingY={'9px'} className={styles.positionName}>
                  {t('Cinema and documentary expert')}
                </Typography>
                <Chip label={`${t('anthropology')}`} size="small" color="secondary" />
                <br />
                <Chip label={`${t('cultural heritage and memory')}`} size="small" color="secondary" />
                <br />
                <Chip label={`${t('education')}`} size="small" color="secondary" />
              </Grid>
              <Grid item className={styles.peopleCard} lg={3} md={3} xs={12}>
                <Image
                  className="rounded-circle"
                  src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/aboutUs/aranzazu-zaga.jpeg`}
                  alt="Picture of Advisor"
                  width={200}
                  height={200}
                />
                <Typography variant="h2" className={styles.peopleName}>
                  Aranzazu Zaga
                  <a href="https://www.linkedin.com/in/aranzazuzg/" target="_blank" rel="noreferrer">
                    <TiSocialLinkedinCircular className={styles.si} />
                  </a>
                </Typography>
                <Typography variant="h3" paddingTop={'9px'} className={styles.professionName}>
                  {t('Advisor')}
                </Typography>
                <Typography variant="h4" paddingY={'9px'} className={styles.positionName}>
                  {t('Narrative and public affairs expert')}
                </Typography>
                <Chip label={`${t('Communication')}`} size="small" color="secondary" />
                <br />
                <Chip label={`${t('Crisis management')}`} size="small" color="secondary" />
                <br />
                <Chip label={`${t('Public relations')}`} size="small" color="secondary" />
              </Grid>
              {/* <Col className={styles.peopleCard} lg={3} md={3} xs={12}>
<Image
className="rounded-circle"
src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/aboutUs/jose-manuel-gallardo.webp`}
alt="Picture of Software Engineer"
width={200}
height={200}
/>
<h2 className={styles.peopleName}>
José Manuel Gallardo
<a href="https://www.linkedin.com/in/jose-manuel-gallardo-1a13a8100/" target="_blank" rel="noreferrer">
<TiSocialLinkedinCircular className={styles.si} />
</a>
</h2>
<h3 className={styles.professionName}>{t('Software Engineer')}</h3>
<h4 className={styles.positionName}>{t('Front-end expert')}</h4>
<Badge pill className={`badge-secondary ${styles.interest}`}>
{t('History')}
</Badge>
<br />
<Badge pill className={`badge-secondary ${styles.interest}`}>
{t('music')}
</Badge>
<br />
<Badge pill className={`badge-secondary ${styles.interest}`}>
{t('Nature')}
</Badge>
</Col> */}

              <Grid item className={styles.peopleCard} lg={3} md={3} xs={12}>
                <Image
                  className="rounded-circle"
                  src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/aboutUs/Julia_Amadio.webp`}
                  alt="Picture of Software Engineer"
                  width={200}
                  height={200}
                />
                <Typography variant="h2" className={styles.peopleName}>
                  Julia Amadio
                  <a href="https://www.linkedin.com/in/juliaamadiomerces/" target="_blank" rel="noreferrer">
                    <TiSocialLinkedinCircular className={styles.si} />
                  </a>
                </Typography>
                <Typography variant="h3" paddingTop={'9px'} className={styles.professionName}>
                  {t('Visual identity collaborator')}
                </Typography>
                <Typography variant="h4" paddingY={'9px'} className={styles.positionName}>
                  {t('Social media design specialist')}
                </Typography>
                <Chip label={`${t('music')}`} size="small" color="secondary" />
                <br />
                <Chip label={`${t('movies')}`} size="small" color="secondary" />
                <br />
                <Chip label={`${t('gastronomy')}`} size="small" color="secondary" />
              </Grid>
              <Grid container className="w-100 d-flex justify-content-center">
                <Grid item className={styles.peopleCard} lg={3} md={3} xs={12}>
                  <Image
                    className="rounded-circle"
                    src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/aboutUs/Michel.webp`}
                    alt="Picture of Developer"
                    width={200}
                    height={200}
                  />
                  <Typography variant="h2" className={styles.peopleName}>
                    Michel Igielka
                    <a href="https://www.linkedin.com/in/michel-igielka-b4205b134/" target="_blank" rel="noreferrer">
                      <TiSocialLinkedinCircular className={styles.si} />
                    </a>
                  </Typography>
                  <Typography variant="h3" paddingTop={'9px'} className={styles.professionName}>
                    {t('Photographer')}
                  </Typography>
                  <Typography variant="h4" paddingY={'9px'} className={styles.positionName}>
                    {t('Photos specialist')}
                  </Typography>
                  <Chip label={`${t('environment')}`} size="small" color="secondary" />
                  <br />
                  <Chip label={`${t('movies')}`} size="small" color="secondary" />
                  <br />
                  <Chip label={`${t('Adventure sports')}`} size="small" color="secondary" />
                </Grid>
                <Grid item className={styles.peopleCard} lg={3} md={3} xs={12}>
                  <Image
                    className="rounded-circle"
                    src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/aboutUs/don-zamna.jpeg`}
                    alt="Picture of Mastermind"
                    width={200}
                    height={200}
                  />
                  <Typography variant="h2" className={styles.peopleName}>
                    Don Zamna
                    <a href="https://linkedin.com/company/eleurekaclub" target="_blank" rel="noreferrer">
                      <TiSocialLinkedinCircular className={styles.si} />
                    </a>
                  </Typography>
                  <Typography variant="h3" paddingTop={'9px'} className={styles.professionName}>
                    {t('Mastermind')}
                  </Typography>
                  <Typography variant="h4" paddingY={'9px'} className={styles.positionName}>
                    {t('Napping expert')}
                  </Typography>
                  <Chip label={`${t('birds')}`} size="small" color="secondary" />
                  <br />
                  <Chip label={`${t('sleeping')}`} size="small" color="secondary" />
                  <br />
                  <Chip label={`${t('music')}`} size="small" color="secondary" />
                </Grid>
                <Grid item className={styles.peopleCard} lg={3} md={3} xs={12}>
                  <Image
                    className="rounded-circle"
                    src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/aboutUs/Alush.webp`}
                    alt="Picture of Mastermind"
                    width={200}
                    height={200}
                  />
                  <Typography variant="h2" className={styles.peopleName}>
                    Alush
                    <a href="https://linkedin.com/company/eleurekaclub" target="_blank" rel="noreferrer">
                      <TiSocialLinkedinCircular className={styles.si} />
                    </a>
                  </Typography>
                  <Typography variant="h3" paddingTop={'9px'} className={styles.professionName}>
                    {t('Little ball hunter')}
                  </Typography>
                  <Typography variant="h4" paddingY={'9px'} className={styles.positionName}>
                    {t('Companionship expert')}
                  </Typography>
                  <Chip label={`${t('Games')}`} size="small" color="secondary" />
                  <br />
                  <Chip label={`${t('Sachets')}`} size="small" color="secondary" />
                  <br />
                  <Chip label={`${t('Paws')}`} size="small" color="secondary" />
                </Grid>
              </Grid>
            </Grid>
          </Container>
          <div style={{ textAlign: 'center', marginBottom: '4em' }}>
            <div className={styles.thanks}>
              <hr />
              <Typography className="h4" style={{ color: 'var(--eureka-green)' }}>
                {t('We are grateful for Eureka’s many friends that support us in a variety of ways!')}
              </Typography>
              <Typography>
                Ivette Yañez, Roland Trompette, Ricardo Sanginés, Jacques Ricard, Rafael Millán, Daniel C. Zorrilla,
                Giovana Salazar, Amy Shapiro Raikar, Jessie Keating, Igor Hlina, Fernanda Pacheco, Aimé Cruz, Leticia
                Hora
              </Typography>
            </div>

            <div className={styles['contact-me']}>
              <br />
              <hr />
              <Typography className="h4" style={{ color: 'var(--eureka-green)' }}>
                {t('common:eurekaSupport')}
              </Typography>

              <section className="d-flex flex-row justify-content-around align-items-center mt-3">
                <Stack
                  alignItems={'center'}
                  alignContent={'center'}
                  direction={{ xs: 'column', sm: 'row', md: 'row' }}
                  spacing={{ xs: 1, sm: 2, md: 3 }}
                  useFlexGap
                  sx={{ flexWrap: 'wrap' }}
                >
                  <Box>
                    <Image
                      width={110}
                      height={35}
                      src="https://mozilla.design/files/2019/06/Mozilla_Logo_Static.png"
                      alt=""
                    />
                  </Box>
                  <Box>
                    <Image
                      width={90}
                      height={70}
                      src="https://static.wixstatic.com/media/9c73d4_6be410789c004ed2b2281f0b7503645f~mv2.png/v1/fill/w_1046,h_700,al_c,q_90,usm_0.66_1.00_0.01/Logo%20-%20prosperia%20only%20-%20E%20normal%20-%20point.webp"
                      alt=""
                    />
                  </Box>
                  <Box>
                    <Image
                      width={50}
                      height={70}
                      src="https://datapopalliance.org/wp-content/uploads/2019/02/DPA-Logo-Color.png"
                      alt=""
                    />
                  </Box>
                  <Box>
                    <Image width={90} height={80} src="/logos/4.equis-justicias.webp" alt="" />
                  </Box>
                  <Box>
                    <Image width={70} height={70} src="/logos/5.dw-akademie.webp" alt="" />
                  </Box>
                  <Box>
                    <Image width={80} height={30} src="/logos/6.data against feminicide.webp" alt="" />
                  </Box>
                  <Box paddingTop={2}>
                    <Image width={60} height={40} src="/logos/7.data feminism lab.webp" alt="" />
                  </Box>
                  <Box paddingTop={2}>
                    <Image width={70} height={50} src="/logos/8.instituto da hora.webp" alt="" />
                  </Box>
                  <Box paddingTop={2}>
                    <Image width={70} height={50} src="/logos/9.instituto futuro.webp" alt="" />
                  </Box>
                  <Box paddingTop={2}>
                    <Image width={54} height={50} src="/logos/10.mit press.webp" alt="" />
                  </Box>
                  <Box paddingTop={2}>
                    <Image width={90} height={50} src="/logos/11.Penguin Random House.webp" alt="" />
                  </Box>
                  <Box>
                    <Image width={90} height={60} src="/logos/12.fósforo.webp" alt="" />
                  </Box>
                </Stack>
              </section>
            </div>
          </div>
        </div>
      </SimpleLayout>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  return {
    props: {
      session,
    },
  };
};
export default AboutPage;
