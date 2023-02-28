import { NextPage, GetServerSideProps } from 'next';
import { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
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
import { useSession } from 'next-auth/react';
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

//import styles from './my-read-or-watched.module.css';

interface Props {
  id: number;
}

const MyReadOrWatched: NextPage<Props> = ({ id }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoadingSession = status === 'loading';
  // if(!isLoadingSession && !session)router.push('/')
  const row = useMyReadOrWatched(id)
  //console.log(row,'rowrow')
  const [yearFilter, setYearFilter] = useState<string>('');
  const [booksTotal, setBooksTotal] = useState<number>(0);
  const [moviesTotal, setMoviesTotal] = useState<number>(0);
  const [books, setBooks] = useState<any>(null);
  const [movies, setMovies] = useState<any>(null);
  const [tabKey, setTabKey] = useState<string>();


  useEffect(() => {
    if (router && router.query?.tabKey) {
      setTabKey(router.query.tabKey.toString());
    }
    if (router && router.query?.year) {
      setYearFilter(router.query.year.toString());
    }
  }, [router]);

  useEffect(() => {
    if (row && row.readOrWatchedWorks.length) {
      let books = row.readOrWatchedWorks.filter((rw) => ['book', 'fiction-book'].includes(rw.work!.type)).reverse();
      let movies = row.readOrWatchedWorks.filter((rw) => ['movie', 'documentary'].includes(rw.work!.type)).reverse();

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
  }, [row,yearFilter]);

  const groupBy = (array: any[], key: string | number) => {
    return array.reduce((acc: { [x: string]: any[] }, item: { [x: string]: string | number }) => {
      if (!acc[item[key]]) acc[item[key]] = [];
      acc[item[key]].push(item);
      return acc;
    }, {});
  };

  //console.log(books, 'books');
  //console.log(movies, 'movies');

  const handlerComboxesChangeYear = (e: ChangeEvent<HTMLInputElement>, q: string) => {
    if (e.target.checked) setYearFilter(q);
    else setYearFilter('');
  };

  const copyURL = (e: MouseEvent<HTMLDivElement>, tab: string, year: string) => {
    e.preventDefault();
    const sts = `${row.userName || id.toString()}-${id}`;
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/user/${slugify(sts, { lower: true })}/my-read-or-watched?tabKey=${tab}&&year=${year}`)
      .then(() => {
        toast.success('Url copied to clipboard')
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

  const getPopoverYears = () => {
    return (
      <Popover data-cy="popover-geography" className="position-absolute top-0">
        <Popover.Body>
          <div>
            <Form.Label>
              <strong>{t('Years')}</strong>
            </Form.Label>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="2023"
                checked={yearFilter.includes('2023')}
                onChange={(e) => handlerComboxesChangeYear(e, '2023')}
              />
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="2022"
                checked={yearFilter.includes('2022')}
                onChange={(e) => handlerComboxesChangeYear(e, '2022')}
              />
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="2021"
                checked={yearFilter.includes('2021')}
                onChange={(e) => handlerComboxesChangeYear(e, '2021')}
              />
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="2020"
                checked={yearFilter.includes('2020')}
                onChange={(e) => handlerComboxesChangeYear(e, '2020')}
              />
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="2019"
                checked={yearFilter.includes('2019')}
                onChange={(e) => handlerComboxesChangeYear(e, '2019')}
              />
            </Form.Group>
          </div>
        </Popover.Body>
      </Popover>
    );
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
          {isLoadingSession ? (
            <Spinner animation="grow" />
          ) : 
            <>
              <h1 className="text-secondary fw-bold mt-sm-0 mb-4">{`${t('MyReadOrWatched')}  ${yearFilter}`}</h1>
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

                <Tabs activeKey={tabKey || getDefaultActiveKey()} onSelect={handleSubsectionChange}
 id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="books" title={`${t('Books')} (${booksTotal})`}>
                  <section className="d-flex justify-content-end">
                    <OverlayTrigger trigger="click" rootClose={true} placement="bottom" overlay={getPopoverYears()}>
                      <Button variant="light">{t('Filter by years')}</Button>
                    </OverlayTrigger>
                  </section>
                  {books ? (
                    Object.keys(books).reverse().map((year) => (
                      <Row className="mt-0" key={year}>
                        <section className="d-flex flex-row">
                          <h2 className="fs-4 mb-3 text-secondary fw-bold">{year}</h2>

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
                  <section className="d-flex justify-content-end">
                    <OverlayTrigger trigger="click" rootClose={true} placement="bottom" overlay={getPopoverYears()}>
                      <Button variant="light">{t('Filter by years')}</Button>
                    </OverlayTrigger>
                  </section>

                  {movies ? (
                    Object.keys(movies)
                      .reverse()
                      .map((year) => (
                        <Row className="mt-0" key={year}>
                          <section className="d-flex flex-row">
                            <h2 className="fs-4 mb-3 text-secondary fw-bold">{year}</h2>
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

              {/*<Row>
                {user?.readOrWatchedWorks
                  .filter((rw) => rw.workId)
                  .reverse()
                  .map((c) => (
                    <Col
                      key={c.workId}
                      xs={12}
                      sm={6}
                      lg={3}
                      xxl={2}
                      className="mb-5 d-flex justify-content-center  align-items-center"
                    >
                      <WMI workId={c.workId!} size="md" />
                    </Col>
                  ))}
              </Row>*/}
            </>
         }
        </article>
      </SimpleLayout>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
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
      id,
      dehydratedState: dehydrate(qc),
    },
  };
};
export default MyReadOrWatched;
