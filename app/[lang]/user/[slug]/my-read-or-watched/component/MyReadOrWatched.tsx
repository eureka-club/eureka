"use client"
import { FC,useState, useEffect, SyntheticEvent, MouseEvent } from 'react';
import Head from 'next/head';
import {
    Alert,
    Button,
    ButtonGroup,
    Tabs,
    Tab,
    Col,
    Row,
} from 'react-bootstrap';
import { getSession } from 'next-auth/react';
import { Session } from '@/src/types';

import { useDictContext } from "@/src/hooks/useDictContext"; 
import WMI from '@/src/components/work/MosaicItem';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import useUser, { getUser } from '@/src/hooks/useUser';
import { BiArrowBack } from 'react-icons/bi';
import { UserDetail } from '@/src/types/user';
import { QueryClient, dehydrate } from "@tanstack/react-query";
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import slugify from 'slugify';
import toast from 'react-hot-toast'
//import useMyReadOrWatched from '@/src/hooks/useMyReadOrWatched'
import { SelectChangeEvent, Button as ButtonMui, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import dayjs from 'dayjs';
import LocalImageComponent from '@/src/components/LocalImage';
import useReadOrWatchedWorks from '../../../../../../src/hooks/useReadOrWatchedWorks';
import user from 'pages/api/user';
import getUserIdFromSlug from '@/src/getUserIdFromSlug';
import { WorkMosaicItem } from '@/src/types/work';

interface Props {
    // session: Session | null;
    // user: UserDetail | null;

}
const MyReadOrWatched: FC<Props> = ({ }:Props) => {
    const{slug}=useParams<{slug:string}>()!;
    const id = getUserIdFromSlug(slug);
    const {data:user}=useUser(id);
    const { t, dict } = useDictContext();
    const router = useRouter();

    // const ReadOrWatched = useMyReadOrWatched(user!.id)
    // console.log(ReadOrWatched,'ReadOrWatched')
    const [yearFilter, setYearFilter] = useState<any>(dayjs().year().toString());
    const [booksTotal, setBooksTotal] = useState<number>(0);
    const [moviesTotal, setMoviesTotal] = useState<number>(0);
    const [books, setBooks] = useState<any>(null);
    const [movies, setMovies] = useState<any>(null);
    const [tabKey, setTabKey] = useState<string>();

    const searchParams = useSearchParams()!;
    const tabKeyParams = searchParams.get('tabKey');
    const yearParams = searchParams.get('year');
    useEffect(() => {
        if (tabKeyParams) {
            setTabKey(tabKeyParams.toString());
        }
        if (yearParams) {
            setYearFilter(yearParams.toString());
        }
    }, [tabKeyParams, yearParams]);
    const {data:readOrWatchedWorks,isFetched}=useReadOrWatchedWorks(user?.id!)
    useEffect(() => {
        if (readOrWatchedWorks?.length) {
            let books = readOrWatchedWorks.filter((rw) => ['book', 'fiction-book'].includes(rw.work!.type)).reverse();
            let movies = readOrWatchedWorks.filter((rw) => ['movie', 'documentary'].includes(rw.work!.type)).reverse();

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
    }, [yearFilter,isFetched]);

    const groupBy = (array: any[], key: string | number) => {
        return array.reduce((acc: { [x: string]: any[] }, item: { [x: string]: string | number }) => {
            if (!acc[item[key]]) acc[item[key]] = [];
            acc[item[key]].push(item);
            return acc;
        }, {});
    };



    function handlerComboxesChangeYear(e: SelectChangeEvent<HTMLTextAreaElement>) {
        setYearFilter(e.target.value as string);
    }

    const copyURL = (e: MouseEvent<HTMLDivElement>, tab: string, year: string) => {
        e.preventDefault();
        const sts = `${user!.name || user!.id.toString()}-${user!.id}`;
        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/user/${slugify(sts, { lower: true })}/my-read-or-watched?tabKey=${tab}&year=${year}`)
            .then(() => {
                toast.success(t(dict,'UrlCopied'))
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
                        alt={user.name || ''}
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
                            alt={user.name || ''}
                        />
                    </div>
                    <div className="d-none d-md-flex">
                        <LocalImageComponent
                            className="rounded rounded-circle"
              /* className='avatar' */ width={60}
                            height={60}
                            filePath={`users-photos/${user.photos[0].storedFile}`}
                            alt={user.name || ''}
                        />
                    </div>
                </>
            );
        }
        return '';
    };




    return (<article className="mt-4">
        <ButtonGroup className="mt-1 mt-md-3 mb-1">
            <Button variant="primary text-white" onClick={() => router.back()} size="sm">
                <BiArrowBack />
            </Button>
        </ButtonGroup>
        {/*isLoadingSession ? (
            <Spinner animation="grow" />
          ) : */}
        <>
            <Row className='mt-sm-0 mb-4 d-flex flex-column flex-lg-row'>
                <Col className='d-flex flex-row'>
                    <h1 className="text-secondary fw-bold me-3 d-flex align-items-center">{`${t(dict,'MyReadOrWatched')} ${user!.name}`}</h1>
                    {renderAvatar()}
                </Col>
                <Col className='d-flex flex-row justify-content-center justify-content-lg-end'>
                    <Button type='button' className='d-none d-lg-block btn-eureka btn btn-primary mt-2 mt-lg-0 px-5' style={{ width: '50%' }} onClick={() => router.push('/work/create')} size="sm">
                        <span>{t(dict, 'AddWork')}</span>
                    </Button>
                    <Button type='button' className='text-center d-block d-lg-none btn-eureka btn btn-primary mt-3' style={{ width: '100%' }} onClick={() => router.push('/work/create')} size="sm">
                        <span className='text-center'>{t(dict, 'AddWork')}</span>
                    </Button>
                </Col>

            </Row>

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

            <FormControl className="mb-4 d-none d-lg-flex" sx={{ minWidth: 120 }} style={{ width: '20%' }}>
                <InputLabel id="select-years">{t(dict, 'Year')}</InputLabel>
                <Select
                    variant="outlined"
                    labelId="select-style"
                    name="Years"
                    size='small'
                    id="select-years"
                    label={t(dict, 'Year')}
                    onChange={handlerComboxesChangeYear}
                    value={yearFilter}
                >
                    {getYears().map(x => (
                        <MenuItem key={x} value={x}>{x}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <section className='d-flex d-lg-none justify-content-center align-items-center'>
                <FormControl className="mb-4 " style={{ width: '100%' }}>
                    <InputLabel id="select-years">{t(dict, 'Year')}</InputLabel>
                    <Select sx={{ width: 1 }}
                        variant="outlined"
                        labelId="select-style"
                        name="Years"
                        size='small'
                        id="select-years"
                        label={t(dict, 'Year')}
                        onChange={handlerComboxesChangeYear}
                        value={yearFilter}
                    >
                        {getYears().map(x => (
                            <MenuItem key={x} value={x}>{x}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </section>

            <Tabs activeKey={tabKey || getDefaultActiveKey()} onSelect={handleSubsectionChange}
                id="uncontrolled-tab-example" className="mb-4">
                <Tab eventKey="books" title={`${t(dict, 'Books')} (${booksTotal})`}>
                    {books ? (
                        Object.keys(books).reverse().map((year) => (
                            <Row className="mt-0" key={year}>
                                <section className="d-flex flex-row">
                                    <h2 className="fs-5 mb-3 text-secondary">{t(dict, 'shareText')}</h2>
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
                                            <WMI notLangRestrict workId={w.workId!} size="md" />
                                        </Col>
                                    ))
                                }
                            </Row>
                        ))
                    ) : (
                        <Alert className="mt-4" variant="primary">
                                <Alert.Heading>{t(dict, 'ResultsNotFound')}</Alert.Heading>
                        </Alert>
                    )}
                </Tab>
                <Tab eventKey="movies" title={`${t(dict, 'Movies')} (${moviesTotal})`}>
                    {movies ? (
                        Object.keys(movies)
                            .reverse()
                            .map((year) => (
                                <Row className="mt-0" key={year}>
                                    <section className="d-flex flex-row">
                                        <h2 className="fs-5 mb-3 text-secondary">{t(dict, 'shareText')}</h2>
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
                                            <WMI notLangRestrict workId={w.workId!} size="md" />
                                        </Col>
                                    ))}
                                </Row>
                            ))
                    ) : (
                        <Alert className="mt-4" variant="primary">
                                <Alert.Heading>{t(dict, 'ResultsNotFound')}</Alert.Heading>
                        </Alert>
                    )}
                </Tab>
            </Tabs>
        </>
        {/* }*/}
    </article>)



}

export default MyReadOrWatched;