import { NextPage, GetServerSideProps } from 'next';
import { useState, useEffect, SyntheticEvent, MouseEvent } from 'react';
import Head from 'next/head';
import {
  Alert,
  Form,
  OverlayTrigger,
  Popover,
  Button,
  ButtonGroup,
  Tabs,
  Tab,
  Col,
  Row,
  Spinner,
} from 'react-bootstrap';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { getSession } from 'next-auth/react';
import { Session } from '@/src/types';
import useTranslation from 'next-translate/useTranslation';
import WMI from '@/src/components/work/MosaicItem';
import { useRouter } from 'next/router';
import { getUser } from '@/src/useUser';
import { BiArrowBack } from 'react-icons/bi';
import { UserMosaicItem } from '@/src/types/user';
import { QueryClient, dehydrate } from 'react-query';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import slugify from 'slugify';
import toast from 'react-hot-toast'
import useMyReadOrWatched from '@/src/useMyReadOrWatched'
import { SelectChangeEvent, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import dayjs from 'dayjs';
import LocalImageComponent from '@/src/components/LocalImage';
//import styles from './my-read-or-watched.module.css';

interface Props {
  id: number;
  session: Session;
}

const MyReadOrWatched: NextPage<Props> = ({ id, session }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const query = router.query;
  //const { data: session, status } = useSession();
  //const isLoadingSession = status === 'loading';
  // if(!isLoadingSession && !session)router.push('/')
  const user = useMyReadOrWatched(id)
  //console.log(row,'rowrow')
  const [yearFilter, setYearFilter] = useState<any>(dayjs().year().toString());
  const [booksTotal, setBooksTotal] = useState<number>(0);
  const [moviesTotal, setMoviesTotal] = useState<number>(0);
  const [books, setBooks] = useState<any>(null);
  const [movies, setMovies] = useState<any>(null);
  const [tabKey, setTabKey] = useState<string>();

  useEffect(() => {
    if (query?.tabKey) {
      setTabKey(query.tabKey.toString());
    }
    if (query?.year) {
      setYearFilter(query.year.toString());
    }
  }, [query]);

  useEffect(() => {
    if (user && user.readOrWatchedWorks.length) {
      let books = user.readOrWatchedWorks.filter((rw) => ['book', 'fiction-book'].includes(rw.work!.type)).reverse();
      let movies = user.readOrWatchedWorks.filter((rw) => ['movie', 'documentary'].includes(rw.work!.type)).reverse();

      if (yearFilter.length) {
        books = books.filter((b) => b.year.toString() === yearFilter);
        movies = movies.filter((b) => b.year.toString() === yearFilter);
      }
      if (books.length) {
        setBooks(groupBy(books, 'year'));
      }
      else setBooks(null);
      if (movies.length) {
        setMovies(groupBy(movies, 'year'));
      }
      else setMovies(null);

      setBooksTotal(books.length);
      setMoviesTotal(movies.length);

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
    setYearFilter(e.target.value as string);
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

  const getDefaultActiveKey = () => {
    if (booksTotal > 0)
      return 'books'
    else if (moviesTotal > 0 && !books)
      return 'movies';
    else
      return 'books';
  };

  const handleSubsectionChange = (key: string | null) => {
    if (key != null) {
      setTabKey(key);
    }
  };

  const getYears = () => {
    let years = [];
    for (let i = 0; i < 5; i++)
      years.push((dayjs().year() - i).toString())
    return years;
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
        <article className="mt-4">
          <ButtonGroup className="mt-1 mt-md-3 mb-1">
            <Button variant="primary text-white" onClick={() => router.back()} size="sm">
              <BiArrowBack />
            </Button>
          </ButtonGroup>
          {/*isLoadingSession ? (
            <Spinner animation="grow" />
          ) : */}
          <>
            <section className='mt-sm-0 mb-4 d-flex flex-row '>
              <h1 className="text-secondary fw-bold me-3 d-flex align-items-center">{`${t('MyReadOrWatched')} ${user.userName}`}</h1>
              {renderAvatar()}
            </section>

            <style jsx global>
              {`
                  .nav-tabs .nav-item.show .nav-link,
                  .nav-tabs .nav-link.active,
                  .nav-tabs .nav-link:hover {
                    background-color: var(--bs-primary);
                    color: white !important;
                    border: none !important;
                    border-bottom: solid 2px var(--bs-primary) !important;
                  }
                  .nav-tabs {
                    border: none !important;
                    border-bottom: solid 1px var(--bs-primary) !important;
                  }
                  .nav-link {
                    color: var(--bs-primary);
                  }

                  .form-check {
                    color: gray !important;
                  }
                  .form-check-label {
                    margin-left: 0.2em;
                    font-size: 1.1em;
                  }
                `}
            </style>

            <FormControl className="mb-4" sx={{ minWidth: 120 }} style={{ width: '20%' }}>
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
                {getYears().map(x => (
                  <MenuItem key={x} value={x}>{x}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Tabs activeKey={tabKey || getDefaultActiveKey()} onSelect={handleSubsectionChange}
              id="uncontrolled-tab-example" className="mb-4">
              <Tab eventKey="books" title={`${t('Books')} (${booksTotal})`}>
                {books ? (
                  Object.keys(books).reverse().map((year) => (
                    <Row className="mt-0" key={year}>
                      <section className="d-flex flex-row">
                        <h2 className="fs-5 mb-3 text-secondary">{t('shareText')}</h2>
                        <div className="cursor-pointer" onClick={(e) => copyURL(e, "books", year)}>
                          <ContentCopyRoundedIcon
                            className="ms-2"
                            style={{
                              color: 'var(--eureka-purple)',
                            }}
                          />
                        </div>
                      </section>
                      {
                        books[year].map((w: any) => (
                          <Col
                            key={w.workId}
                            xs={12}
                            sm={6}
                            lg={3}
                            xxl={2}
                            className="mb-5 d-flex justify-content-center  align-items-center"
                          >
                            <WMI workId={w.workId!} size="md" />
                          </Col>
                        ))
                      }
                    </Row>
                  ))
                ) : (
                  <Alert className="mt-4" variant="primary">
                    <Alert.Heading>{t('ResultsNotFound')}</Alert.Heading>
                  </Alert>
                )}
              </Tab>
              <Tab eventKey="movies" title={`${t('Movies')} (${moviesTotal})`}>
                {movies ? (
                  Object.keys(movies)
                    .reverse()
                    .map((year) => (
                      <Row className="mt-0" key={year}>
                        <section className="d-flex flex-row">
                          <h2 className="fs-5 mb-3 text-secondary">{t('shareText')}</h2>
                          <div className="cursor-pointer" onClick={(e) => copyURL(e, "movies", year)}>

                            <ContentCopyRoundedIcon
                              className="ms-2"
                              style={{
                                color: 'var(--eureka-purple)',
                              }}
                            />
                          </div>
                        </section>
                        {movies[year].map((w: any) => (
                          <Col
                            key={w.workId}
                            xs={12}
                            sm={6}
                            lg={3}
                            xxl={2}
                            className="mb-5 d-flex justify-content-center  align-items-center"
                          >
                            <WMI workId={w.workId!} size="md" />
                          </Col>
                        ))}
                      </Row>
                    ))
                ) : (
                  <Alert className="mt-4" variant="primary">
                    <Alert.Heading>{t('ResultsNotFound')}</Alert.Heading>
                  </Alert>
                )}
              </Tab>
            </Tabs>
          </>
          {/* }*/}
        </article>
      </SimpleLayout>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  let user: UserMosaicItem | null = null;
  const qc = new QueryClient();
  let id = 0;
  if (ctx.query && ctx.query.slug) {
    const slug = ctx.query.slug.toString();
    const li = slug.split('-').slice(-1);
    id = parseInt(li[0]);
    const origin = process.env.NEXT_PUBLIC_WEBAPP_URL;
    user = await getUser(id, origin);
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
