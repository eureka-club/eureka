import { NextPage, GetServerSideProps } from 'next';
import { useState, useEffect, Key } from 'react';
import Head from 'next/head';
import { Button, ButtonGroup, Nav, NavItem, NavLink, Tabs, Tab, Col, Row, Spinner } from 'react-bootstrap';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import WMI from '@/src/components/work/MosaicItem';
import { useRouter } from 'next/router';
import useUser, { getUser } from '@/src/useUser';
import { BiArrowBack } from 'react-icons/bi';
import { UserMosaicItem } from '@/src/types/user';
import { QueryClient, dehydrate } from 'react-query';
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
  const { data: user } = useUser(id, { enabled: !!id });
  const [books, setBooks] = useState<any>(null);
  const [movies, setMovies] = useState<any>(null);

  useEffect(() => {
    if (user && user.readOrWatchedWorks.length) {
      let books = user.readOrWatchedWorks
        .filter((rw) => rw.workId && rw.year && ['book', 'fiction-book'].includes(rw.work!.type))
        .reverse();
      let movies = user.readOrWatchedWorks
        .filter((rw) => rw.workId && rw.year && ['movie', 'documentary'].includes(rw.work!.type))
        .reverse();

      if (books.length) setBooks(groupBy(books, 'year'));
      else setBooks(null);
      if (movies.length) setMovies(groupBy(movies, 'year'));
      else setMovies(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groupBy = (array: any[], key: string | number) => {
    return array.reduce((acc: { [x: string]: any[] }, item: { [x: string]: string | number }) => {
      if (!acc[item[key]]) acc[item[key]] = [];
      acc[item[key]].push(item);
      return acc;
    }, {});
  };

  console.log(books, 'books');
  console.log(movies, 'movies');

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
          ) : session ? (
            <>
              <h1 className="text-secondary fw-bold mt-sm-0 mb-4">{t('MyReadOrWatched')}</h1>
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
                `}
              </style>

              <Tabs defaultActiveKey="books" id="uncontrolled-tab-example" className="mb-3">
                <Tab className="mt-5" eventKey="books" title={t('Books')}>
                  {Object.keys(books).map((year) => (
                    <Row className="mt-0" key={year}>
                      <h2 className="fs-4 mb-3 text-secondary fw-bold">{year}</h2>
                      {books[year].reverse().map((w: any) => (
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
                  ))}
                </Tab>
                <Tab className="mt-5" eventKey="movies" title={t('Movies')}>
                  {Object.keys(movies)
                    .reverse()
                    .map((year) => (
                      <Row className="mt-0" key={year}>
                        <h2 className="fs-4 mb-3 text-secondary fw-bold">{year}</h2>
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
                    ))}
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
          ) : (
            ''
          )}
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
