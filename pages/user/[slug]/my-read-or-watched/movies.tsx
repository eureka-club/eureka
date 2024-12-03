import { NextPage, GetServerSideProps } from 'next';
import { useState, useEffect, SyntheticEvent, MouseEvent } from 'react';
import Head from 'next/head';
import {
  Alert,
  Button,
  Col,
  Row,
} from 'react-bootstrap';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { getSession } from 'next-auth/react';
import { Session } from '@/src/types';
import useTranslation from 'next-translate/useTranslation';
import WMI from '@/src/components/work/MosaicItem';
import { useRouter } from 'next/router';
import { getUser } from '@/src/useUser';
import { UserDetail } from '@/src/types/user';
import { QueryClient, dehydrate } from 'react-query';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import slugify from 'slugify';
import toast from 'react-hot-toast'
import useMyReadOrWatched from '@/src/useMyReadOrWatched'
import { SelectChangeEvent, Button as ButtonMui, FormControl, InputLabel, Select, MenuItem, Stack, Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import LocalImageComponent from '@/src/components/LocalImage';
import { ButtonsTopActions } from '@/src/components/ButtonsTopActions';
import Masonry from '@mui/lab/Masonry';
import { TabPanelSwipeableViews } from '@/src/components/common/TabPanelSwipeableViews';
import Bar from './components/charts/Bar';

interface Props {
  id: number;
  session: Session;
}

const MyReadOrWatched: NextPage<Props> = ({ id, session }) => {
  const { t } = useTranslation('mediatheque');
  const router = useRouter();
  const query = router.query;
  const user = useMyReadOrWatched(id)
  const [yearFilter, setYearFilter] = useState<any>(dayjs().year().toString());
  const [movies, setMovies] = useState<any>(null);
  const [tabKey, setTabKey] = useState<string>();
  const[genderData,setgenderData]=useState<Record<string,number>>({});
  const[conuntriOfOriginData,setconuntriOfOriginData]=useState<Record<string,number>>({});


  let ms = user.readOrWatchedWorks.filter((rw) => ['movie', 'documentary'].includes(rw.work?.type??'')).reverse();
      
  const res = Array.from(new Set([
    ...(ms??[]).map(m=>m.year)
  ]))
  .sort(
    (a,b)=>+a>+b ? -1 : 1
  );
  
  const [years]=useState<number[]>(res);
  
  useEffect(() => {
    if (query?.tabKey) {
      setTabKey(query.tabKey.toString());
    }
    if (query?.year) {
      setYearFilter(query.year.toString());
    }
  }, [query]);

  useEffect(() => {
    if(years.length)
      setYearFilter(years[0].toString());
  }, [years]);

  useEffect(() => {
    if (user && user.readOrWatchedWorks.length) {
      let movies = user.readOrWatchedWorks.filter((rw) => ['movie', 'documentary'].includes(rw.work?.type??'')).reverse();

      if (yearFilter.length) {
        movies = movies.filter((b) => b.year.toString() === yearFilter);
      }
      if (movies.length) {
        let gd={ 
          [t("female")]:0,
          [t("male")]:0,
          [t("non-binary")]:0,
          [t("trans")]:0,
          [t("other")]:0
        };
        // setMovies(groupBy(movies, 'year'));
        
        let cod:Record<string,any> = {};
        movies.forEach(b=>{
          const keyauthorGender =  t(b.work?.authorGender??'other');
          if(keyauthorGender in gd){
            gd[keyauthorGender] += 1;
          }
          else{
            gd[keyauthorGender] = 1;
          }
          const keycountryOfOrigin = b.work?.countryOfOrigin 
            ? b.work?.countryOfOrigin.split(',').map(i=>t(`countries:${i}`)).join(',') 
            : t(`common:${'unknown'}`);

          if(keycountryOfOrigin in cod){
            cod[keycountryOfOrigin] += 1;
          }
          else{
            cod[keycountryOfOrigin] = 1;
          }
        });
        
        setgenderData(gd);
        setconuntriOfOriginData(cod);
        setMovies(movies);

      }
      else setMovies(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearFilter]);

  const groupBy = (array: any[], key: string | number) => {
    return array.reduce((acc: { [x: string]: any[] }, item: { [x: string]: string | number }) => {
      if (!acc[item[key]]) acc[item[key]] = [];
      acc[item[key]].push(item);
      return acc;
    }, {});
  };

  //console.log(books, 'books');
  //console.log(movies, 'movies');

  function handlerComboxesChangeYear(e: SelectChangeEvent<HTMLTextAreaElement>) {
    setYearFilter(e.target.value.toString());
  }

  const copyURL = (e: MouseEvent<HTMLDivElement>, tab: string, year: string) => {
    e.preventDefault();
    const sts = `${user.userName || id.toString()}-${id}`;
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/user/${slugify(sts, { lower: true })}/my-read-or-watched?tabKey=${tab}&year=${year}`)
      .then(() => {
        toast.success(t('UrlCopied'))
      })
      .catch(err => {
        //console.error('Error al copiar al portapapeles:', err)
      })
  };

  
  const avatarError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/img/default-avatar.png';
  };

  const renderAvatar = () => {
    if (user) {
      if (!user?.photos || !user?.photos.length)
        return (
          <img
            onError={avatarError}
            className="rounded rounded-circle"
            style={{ width: '60px', height: '60px' }}
            src={user.image || '/img/default-avatar.png'}
            alt={user.userName || ''}
          />
        );
      return (
        <>
          <div className="d-flex d-md-none mb-2">
            <LocalImageComponent
              className="rounded rounded-circle"
              /* className='avatar' */ width={60}
              height={60}
              filePath={`users-photos/${user.photos[0].storedFile}`}
              alt={user.userName || ''}
            />
          </div>
          <div className="d-none d-md-flex">
            <LocalImageComponent
              className="rounded rounded-circle"
              /* className='avatar' */ width={60}
              height={60}
              filePath={`users-photos/${user.photos[0].storedFile}`}
              alt={user.userName || ''}
            />
          </div>
        </>
      );
    }
    return '';
  };

  return (
    <>
      <Head>
        <meta property="og:title" content="Eureka" />
        <meta property="og:description" content="Activa tu mente, transforma el mundo" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}`} />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}/logo.jpg`} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:site" content="@eleurekaclub"></meta>
        <meta name="twitter:title" content="Eureka"></meta>
        <meta name="twitter:description" content="Activa tu mente, transforma el mundo"></meta>
        <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}/logo.jpg`}></meta>
        <meta name="twitter:url" content={`${process.env.NEXT_PUBLIC_WEBAPP_URL}`}></meta>
      </Head>
      <SimpleLayout>
        <article className="">
          <ButtonsTopActions/>
          <>
            <Row className='mt-sm-0 mb-4 d-flex flex-column flex-lg-row'>
              <Col className='d-flex flex-row'>
                <h1 className="text-secondary fw-bold me-3 d-flex align-items-center">{`${t('MyReadOrWatched')} ${user.userName}`}</h1>
                {renderAvatar()}
              </Col>
              <Col className='d-flex flex-row justify-content-center justify-content-lg-end'>
                <Button type='button' className='d-none d-lg-block btn-eureka btn btn-primary mt-2 mt-lg-0 px-5' style={{ width: '50%' }} onClick={() => router.push('/work/create')} size="sm">
                  <span>{t('AddWork')}</span>
                                  </Button>
                <Button type='button' className='text-center d-block d-lg-none btn-eureka btn btn-primary mt-3' style={{ width: '100%' }} onClick={() => router.push('/work/create')} size="sm">
                  <span className='text-center'>{t('AddWork')}</span>
                </Button>
              </Col>
            </Row>

            <style jsx global>
              {`
                .form-check {
                  color: gray !important;
                }
                .form-check-label {
                  margin-left: 0.2em;
                  font-size: 1.1em;
                }
              `}
            </style>

            <FormControl className="mb-4 d-none d-lg-flex" sx={{ minWidth: 120 }} style={{ width: '20%' }}>
              <InputLabel id="select-years">{t('Year')}</InputLabel>
              <Select
                variant="outlined"
                labelId="select-style"
                name="Years"
                size='small'
                id="select-years"
                label={t('Year')}
                onChange={handlerComboxesChangeYear}
                value={yearFilter}
              >
                {years.map(x => (
                  <MenuItem key={`1-${x}`} value={x}>{x}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <section className='d-flex d-lg-none justify-content-center align-items-center'>
            <FormControl className="mb-4 " style={{ width: '100%' }}>
              <InputLabel id="select-years">{t('Year')}</InputLabel>
              <Select sx={{ width: 1 }} 
                variant="outlined"
                labelId="select-style"
                name="Years"
                size='small'
                id="select-years"
                label={t('Year')}
                onChange={handlerComboxesChangeYear}
                value={yearFilter}
              >
                {years.map(x => (
                  <MenuItem key={`2-${x}`} value={x}>{x}</MenuItem>
                ))}
              </Select>
            </FormControl>
            </section>
            
            <TabPanelSwipeableViews
              indexActive={1}
              items={[
              {
                label:t('Books'),
                linkTo:`${router.basePath}/user/${router.query.slug}/my-read-or-watched/books`
              },
              {
                label:t('Movies'),
                content:<>
                <Typography variant='h6' textAlign={'center'}>🎥 {
                  movies?.length>1
                    ? `${movies?.length} ${t('movies-read-in')}`
                    : t('movie-read-in')
                } {yearFilter}</Typography>
                  <Stack direction={'row'}>
                    <Bar data={genderData} layoutHorizontal/>
                    <Bar data={conuntriOfOriginData} layoutHorizontal/>
                  </Stack>
                  

                  {movies ? (
                    // Object.keys(movies)
                    //   .reverse()
                    <Stack key={yearFilter}>
                          <section className="d-flex flex-row">
                            <h2 className="fs-5 mb-3 text-secondary">{t('shareText')}</h2>
                            <div className="cursor-pointer" onClick={(e) => copyURL(e, "movies", yearFilter)}>

                              <ContentCopyRoundedIcon
                                className="ms-2"
                                style={{
                                  color: 'var(--eureka-purple)',
                                }}
                              />
                            </div>
                          </section>
                          <Masonry columns={{xs:1,sm:3,md:3,lg:4}} spacing={1}>
                          {movies.map((w: any) => (
                            <Box key={w.workId}>
                              <WMI  
                                 workId={w.workId!} 
                                sx={{
                                  'img':{
                                    width:'100%',
                                    height:'auto',
                                  }
                                }}  
                              />
                            </Box>
                          ))}
                          </Masonry>
                        </Stack>
                  ) : (
                    <Alert className="mt-4" variant="primary">
                      <Alert.Heading>{t('ResultsNotFound')}</Alert.Heading>
                    </Alert>
                  )}
                </>
              }
              ]}
            />
          </>
        </article>
      </SimpleLayout>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  let user: UserDetail | null = null;
  const qc = new QueryClient();
  let id = 0;
  if (ctx.query && ctx.query.slug) {
    const slug = ctx.query.slug.toString();
    const li = slug.split('-').slice(-1);
    id = parseInt(li[0]);
    const origin = process.env.NEXT_PUBLIC_WEBAPP_URL;
    user = await getUser(id);
    await qc.prefetchQuery(['USER', id.toString()], () => user);
  }
  return {
    props: {
      session,
      id,
      dehydratedState: dehydrate(qc),
    },
  };
};
export default MyReadOrWatched;
