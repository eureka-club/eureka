import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, FormEvent, FunctionComponent, useEffect, useState, useRef, MouseEvent } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Backdrop from '@mui/material/Backdrop';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useMutation, useQueryClient } from 'react-query';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import toast from 'react-hot-toast'
import useTopics from 'src/useTopics';
import useCountries from 'src/useCountries';
import { ImCancelCircle } from 'react-icons/im';
import { CreateWorkClientPayload, GoogleBooksProps, TMDBVideosProps, WorkDetail } from '@/types/work';
import ImageFileSelect from '@/components/forms/controls/ImageFileSelectMUI';
import globalModalsAtom from 'src/atoms/globalModals';
import { SelectChangeEvent, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch } from '@mui/material';
import Textarea from '@mui/joy/Textarea';
import SearchWorkInput from './SearchWorkInput';
import BookCard from './BookCard';
import VideoCard from './VideoCard';
import { APIMediaSearchResult, Country, isBookGoogleBookApi, isVideoTMDB } from '@/src/types';
import TagsInputTypeAheadMaterial from '@/components/forms/controls/TagsInputTypeAheadMaterial';
import TagsInputMaterial from '@/components/forms/controls/TagsInputMaterial';
import styles from './index.module.css';
import { getImg } from '@/src/lib/utils'
import { decode } from 'base64-arraybuffer'
import SpinnerComp from '@/src/components/Spinner';
import Box from '@mui/material/Box';
import Image from 'next/image';
import WMI from '@/src/components/work/MosaicItem';
import { EDITION_ALREADY_EXIST, WORK_ALREADY_EXIST } from '@/src/api_code';
import Link from 'next/link'
import { LANGUAGES } from '@/src/constants';

interface Props {
    noModal?: boolean;
}

interface FormValues {
    type?: string | '';
    isbn?: string;
    title?: string;
    link?: string;
    author?: string;
    authorGender?: string;
    authorRace?: string;
    publicationYear?: string;
    workLength?: string;
    description?: string;
    language?: string;
}




const CreateWorkForm: FunctionComponent<Props> = ({ noModal = false }) => {
    const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
    const queryClient = useQueryClient();
    const router = useRouter();
    const { t } = useTranslation('createWorkForm')

    const [resultWorks, setResultWorks] = useState<APIMediaSearchResult[] | APIMediaSearchResult[]>([]);
    const [countrySearchResults, setCountrySearchResults] = useState<{ code: string; label: string }[]>([]);
    const [selectedWork, setSelectedWork] = useState<APIMediaSearchResult | APIMediaSearchResult | null>(null);

    const [formValues, setFormValues] = useState<FormValues>({
        type: '',
        isbn: '',
        title: '',
        link: '',
        author: '',
        authorGender: '',
        authorRace: '',
        publicationYear: '',
        workLength: '',
        description: '',
        language: '',
    });
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [countryOrigin, setCountryOrigin] = useState<string[]>([]);
    const [tags, setTags] = useState<string>('');
    const [items, setItems] = useState<string[]>([]);  //topics

    const [publicationLengthLabel, setPublicationLengthLabel] = useState('...');
    const [publicationYearLabel, setPublicationYearLabel] = useState('...');
    const [publicationLinkLabel, setPublicationLinkLabel] = useState('...');
    const typeaheadRef = useRef<AsyncTypeahead<{ id: number; code: string; label: string }>>(null);
    const [workId, setWorkId] = useState<number | undefined>();
    const [useApiSearch, setUseApiSearch] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [showExistingWork, setShowExistingWork] = useState<boolean>(false);
    const { data: topics } = useTopics();
    const { data: countries } = useCountries();

    useEffect(() => {
        if (countries) setCountrySearchResults(countries.map((d: Country) => ({ code: d.code, label: d.code })))
    }, [countries])


    const {
        mutate: execCreateWork,
        error: createWorkError,
        isError,
        isLoading,
        isSuccess,
    } = useMutation(
        async (payload: CreateWorkClientPayload) => {
            const formData = new FormData();

            Object.entries(payload).forEach(([key, value]) => {
                if (value != null) {
                    formData.append(key, value);
                }
            });

            const res = await fetch('/api/work', {
                method: 'POST',
                body: formData,
            });


            if (res.ok) {
                const json = await res.json();
                if (!json.error) {
                    setWorkId(json.work.id);
                    toast.success(t('WorkSaved'))
                    return json.work;
                }
                else if (json.error && [WORK_ALREADY_EXIST, EDITION_ALREADY_EXIST].includes(json.error)) {
                    setShowExistingWork(true)
                    setWorkId(json.work.id)
                }
                else if (json.error)
                    toast.error(t(json.error))

            }
            return null;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('WORKS'); // setQueryData could not be used because relations are not returned when the work is created :|
            },
        },
    );

    const handleFormClear = (ev: MouseEvent<HTMLButtonElement>) => {
        setFormValues({
            type: '',
            isbn: '',
            title: '',
            link: '',
            author: '',
            authorGender: '',
            authorRace: '',
            publicationYear: '',
            workLength: '',
            description: '',
            language: '',
        });
        setItems([]);
        setTags('');
        setCountryOrigin([]);
        setCoverFile(null);
        setSelectedWork(null);
    };

    const handleClear = () => { //lo repito para tenerlo sin tener q pasar evento
        setFormValues({
            type: '',
            isbn: '',
            title: '',
            link: '',
            author: '',
            authorGender: '',
            authorRace: '',
            publicationYear: '',
            workLength: '',
            description: '',
            language: '',
        });
        setItems([]);
        setTags('');
        setCountryOrigin([]);
        setCoverFile(null);
        setSelectedWork(null);
    };

    const handleToDoOtherSearch = (ev: MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault();
        handleClear();
        setSelectedWork(null);
        setWorkId(undefined);
        setShowExistingWork(false);
    };

    const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        if (coverFile == null) {
            return;
        }

        const payload: CreateWorkClientPayload = {
            type: formValues?.type!,
            title: formValues?.title!,
            isbn: formValues?.isbn!,
            author: formValues?.author!,
            authorGender: formValues.authorGender ? formValues.authorGender : null,
            authorRace: formValues.authorRace ? formValues.authorRace : null,
            cover: coverFile,
            contentText: formValues.description ? formValues.description : null,
            link: formValues.link ? formValues.link : null,
            countryOfOrigin: countryOrigin || null,
            //countryOfOrigin2: countryOrigin2 || null,
            publicationYear: formValues.publicationYear ? formValues.publicationYear : null,
            length: formValues.workLength ? formValues.workLength : null,
            tags,
            topics: items.join(','),
            language: formValues?.language!,
        };
        // console.log(payload,'payload')
        await execCreateWork(payload);
    };



    useEffect(() => {
        if (isSuccess === true && !showExistingWork) {
            setGlobalModalsState({ ...globalModalsState, ...{ createWorkModalOpened: false } });
            queryClient.invalidateQueries('works.mosaic');
            router.push(`/work/${workId}`);
        }

        if (isLoading === true) {
            setLoading(true);
        }
        else
            setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isLoading]);


    function handleChangeSelectField(ev: SelectChangeEvent) {
        ev.preventDefault();

        const { name, value } = ev.target;
        setFormValues({
            ...formValues,
            [name]: value
        });

        if (name === 'type') {
            setResultWorks([])
            switch (value) {
                case 'movie':
                    setPublicationLinkLabel('Streaming on')
                    setPublicationYearLabel(t('releaseYearFieldLabel'));
                    setPublicationLengthLabel(`${t('Duration')} (${t('minutes')})`);
                    break;
                case 'documentary':
                    setPublicationLinkLabel('Streaming on')
                    setPublicationYearLabel(t('releaseYearFieldLabel'));
                    setPublicationLengthLabel(`${t('Duration')} (${t('minutes')})`);
                    break;
                case 'book':
                    setPublicationLinkLabel(t('linkFieldLabel'));
                    setPublicationLengthLabel(t('Length pages'));
                    setPublicationYearLabel(t('Publication year'));
                    break;
                case 'fiction-book':
                    setPublicationLinkLabel(t('linkFieldLabel'));
                    setPublicationLengthLabel(t('Length pages'));
                    setPublicationYearLabel(t('Publication year'));
                    break;
                default:
                    setPublicationLinkLabel(t('linkFieldLabel'));
                    setPublicationYearLabel('...');
                    setPublicationLengthLabel('...');
            }
            //setWorkType(ev.target.value as string);
        }
    }

    function handleChangeTextField(ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        ev.preventDefault();
        const { name, value } = ev.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    }


    /*   { type: 'ISBN_10', identifier: '8498383439' },
      { type: 'ISBN_13', identifier: '9788498383430' } */
    function getBookIdentifier(identifiers: any[]) {

        if (identifiers.filter(x => x.type === 'ISBN_10').length > 0)
            return identifiers.filter(x => x.type === 'ISBN_10')[0].identifier;
        else
            if (identifiers.filter(x => x.type === 'ISBN_13').length > 0)
                return identifiers.filter(x => x.type === 'ISBN_13')[0].identifier;
            else
                if (identifiers.filter(x => x.type === 'OTHER').length > 0)
                    return identifiers.filter(x => x.type === 'OTHER')[0].identifier;
                else
                    return '';

    }

    async function searchTitles(q: string) {
        setLoading(true);

        if (formValues && formValues.type) {
            const { error, data } = await fetch('/api/external-works/search', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ type: formValues.type, search: q, language: `${router.locale}` }),
            }).then((r) => r.json());
            if (data && data.length)
                setResultWorks(data);
            else if (!data || !data.length) {
                toast.error(t('NoDataError'))
                setResultWorks([]);
            }
            else if (error)
                toast.error(error)
        }
        else toast.error(t('WorkTypeError'));
        setLoading(false);
    }

    const handleSelect = async (work: APIMediaSearchResult) => {
        setLoading(true);
        setSelectedWork(work);
        if (isBookGoogleBookApi(work)) {
            //Buscar poster y traerlo a eureka//////////////////
            if (work.volumeInfo.imageLinks) {
                let url = work.volumeInfo.imageLinks.thumbnail;
                url = url.replace('http://', 'https://');
                url = url.replace('zoom=1', 'zoom=5');

                const { buffer } = await fetch('/api/external-works/select', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({ url: url })
                }).then((r) => r.json());

                const blob = new Blob([decode(buffer)], { type: 'image/webp' });
                let src = URL.createObjectURL(blob)
                let file = await getImg(src)
                setCoverFile(file);
            }

            let isbn;
            if (work.volumeInfo?.industryIdentifiers && work.volumeInfo?.industryIdentifiers.length)
                isbn = getBookIdentifier(work.volumeInfo?.industryIdentifiers);
            // isbn = work.volumeInfo?.industryIdentifiers.filter(x => x.type == 'ISBN_10')[0].identifier;
            //////////////////////////////////////////////////
            formValues['link'] = (work.volumeInfo?.infoLink) ? work.volumeInfo.infoLink : "";
            formValues['isbn'] = isbn;
            formValues['title'] = work.volumeInfo.title;
            formValues['author'] = work.volumeInfo.authors ? work.volumeInfo.authors.join(',') : "";
            formValues['publicationYear'] = (work.volumeInfo.publishedDate) ? work.volumeInfo.publishedDate : "";
            formValues['workLength'] = (work.volumeInfo.pageCount) ? `${work.volumeInfo.pageCount}` : "";
            formValues['description'] = (work.volumeInfo.description) ? work.volumeInfo.description : "";
            formValues['link'] = (work.volumeInfo?.infoLink) ? work.volumeInfo.infoLink : "";

            let l = work.volumeInfo.language.split("-");
            let language = l.length ? l[0] : undefined;
            formValues['language'] = language ? LANGUAGES[language] : 'spanish';
            setFormValues({
                ...formValues,
            });
        }
        if (isVideoTMDB(work)) {
            //Busco mas detalles del Video TMDB /////////////////////   
            const { video } = await fetch(`/api/external-works/movie/${work.id}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            }).then((r) => r.json());
            ////////////////////////////////////////////////////////

            //Buscar poster y traerlo a eureka//////////////////////
            if (work.poster_path) {
                let url = `https://image.tmdb.org/t/p/w600_and_h900_bestv2${work.poster_path}?not-from-cache-please`;

                const { buffer } = await fetch('/api/external-works/select', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({ url: url })
                }).then((r) => r.json());

                const blob = new Blob([decode(buffer)], { type: 'image/webp' });
                let src = URL.createObjectURL(blob)
                let file = await getImg(src)
                setCoverFile(file as File | null);
            }
            ////////////////////////////////////////////////////////

            formValues['title'] = video.title;
            formValues['author'] = video.director.name ? video.director.name : "";
            formValues['publicationYear'] = video.release_date;
            formValues['workLength'] = (video.runtime) ? `${video.runtime}` : "";
            formValues['description'] = video.overview;
            let language = video.original_language;
            formValues['language'] = language ? LANGUAGES[language] : 'spanish';
            setFormValues({
                ...formValues,
            });
        }
        setResultWorks([]);
        setLoading(false);
        toast.success(t('WorkSelected'));

        return;
    }

    const handleChangeUseApiSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleClear();
        setUseApiSearch(event.target.checked);
        setResultWorks([]);
        setSelectedWork(null);
    };

    return (

        <Form onSubmit={handleSubmit}>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <SpinnerComp />
            </Backdrop>
            {!showExistingWork && <><ModalHeader closeButton={!noModal}>
                <ModalTitle> <h1 className="text-secondary fw-bold mt-sm-0 mb-4">{t('title')}</h1></ModalTitle>
            </ModalHeader>

                <ModalBody>
                    <FormGroup className='d-flex justify-content-end'>
                        <FormControlLabel control={<Switch checked={useApiSearch} onChange={handleChangeUseApiSearch} />} label={t('APIUseText')} />
                    </FormGroup>
                    <span className='text-primary fw-bold'>{t('BasicInformation')}</span>
                    <Row className='d-flex flex-column flex-lg-row mt-4'>
                        <Col className="">
                            <FormGroup controlId="type">
                                <FormControl size="small" fullWidth>
                                    <InputLabel id="type-label">*{t('typeFieldLabel')}</InputLabel>
                                    <Select
                                        labelId="type-label"
                                        id="type"
                                        name="type"
                                        value={formValues.type}
                                        label={`*${t("typeFieldLabel")}`}
                                        onChange={handleChangeSelectField}
                                    //disabled={(selectedWork) ? true : false}
                                    >
                                        <MenuItem value="">{t('typeFieldPlaceholder')}</MenuItem>
                                        <MenuItem value="book">{t('common:book')}</MenuItem>
                                        <MenuItem value="fiction-book">{t('common:fiction-book')}</MenuItem>
                                        <MenuItem value="documentary">{t('common:documentary')}</MenuItem>
                                        <MenuItem value="movie">{t('common:movie')}</MenuItem>
                                    </Select>
                                </FormControl>
                            </FormGroup>
                        </Col>
                        <Col className="">
                            {(!selectedWork || resultWorks.length > 0) && (useApiSearch) && <SearchWorkInput callback={searchTitles} />}
                            {((selectedWork && !resultWorks.length) || !useApiSearch) && <TextField id="title" className="w-100  mt-4 mt-lg-0" label={`*${t('titleFieldLabel')}`}
                                variant="outlined" size="small" name="title"
                                value={formValues.title!}
                                type="text"
                                onChange={handleChangeTextField}
                            >
                            </TextField>}
                        </Col>
                        {useApiSearch ? <> {(!selectedWork || resultWorks.length > 0) && <Box className='d-flex flex-row justify-content-around flex-wrap mt-5'>
                            {(['book', 'fiction-book'].includes(formValues?.type!)) && resultWorks.map((work) => {
                                return <BookCard key={work.id} book={work as GoogleBooksProps} callback={handleSelect} />;
                            })}
                            {(['documentary', 'movie'].includes(formValues?.type!)) && resultWorks.map((work) => {
                                return <VideoCard key={work.id} video={work as TMDBVideosProps} callback={handleSelect} />;
                            })}


                        </Box>} </> : <></>}

                    </Row>
                    {((selectedWork && !resultWorks.length) || !useApiSearch) &&
                        <><Row className='d-flex flex-column flex-lg-row mt-4 mb-4'>
                            <Col className="">
                                <ImageFileSelect aceptedFileTypes="image/*" file={coverFile} setFile={setCoverFile} >
                                    {(imagePreview) => (
                                        <div className={styles.imageControl}>
                                            {coverFile != null && imagePreview != null ? (
                                                <>
                                                    <img src={imagePreview} className="float-left" alt="Work cover" />
                                                </>
                                            ) : ""}
                                        </div>
                                    )}
                                </ImageFileSelect>
                            </Col>
                            <Col className=" mt-4 mt-lg-0">
                                <TextField id="link" className="w-100" label={publicationLinkLabel}
                                    variant="outlined" size="small" name='link'
                                    value={formValues.link}
                                    type="text"
                                    onChange={handleChangeTextField}
                                >
                                </TextField>
                            </Col>
                        </Row>

                            <span className='text-primary fw-bold'>{t('Authorship')}</span>
                            <Row className='d-flex flex-column flex-lg-row mt-4 mb-4'>
                                <Col className="">
                                    <TextField id="author" className="w-100" label={`*${t('authorFieldLabel')}`}
                                        variant="outlined" size="small" name='author'
                                        value={formValues.author}
                                        type="text"
                                        onChange={handleChangeTextField}
                                    >
                                    </TextField>


                                </Col>
                                <Col className=" mt-4 mt-lg-0">
                                    <FormGroup controlId="countryOrigin">
                                        <TagsInputTypeAheadMaterial
                                            data={countrySearchResults}
                                            items={countryOrigin}
                                            setItems={setCountryOrigin}
                                            formatValue={(v: string) => t(`countries:${v}`)}
                                            max={2}
                                            label={`${t('countryFieldLabel')} - 2 max`}
                                        //placeholder={`${t('Type to add tag')}...`}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="">
                                    <FormGroup controlId="language">
                                        <FormControl size="small" fullWidth>
                                            <InputLabel id="language-label">*{t('languageFieldLabel')}</InputLabel>
                                            <Select
                                                defaultValue={formValues.language}
                                                labelId="language-label"
                                                id="language"
                                                name='language'
                                                label={`*${t("languageFieldLabel")}`}
                                            >
                                                <MenuItem value={'spanish'}><Image width={24} height={24} className="m-0" src="/img/lang-flags/es.png" alt="Language flag 'es'" /></MenuItem>
                                                <MenuItem value={'english'}><Image width={24} height={24} className="m-0" src="/img/lang-flags/en.png" alt="Language flag 'en'" /></MenuItem>
                                                <MenuItem value={'french'}><Image width={24} height={24} className="m-0" src="/img/lang-flags/fr.png" alt="Language flag 'fr'" /></MenuItem>
                                                <MenuItem value={'portuguese'}><Image width={24} height={24} className="m-0" src="/img/lang-flags/pt.png" alt="Language flag 'pt'" /></MenuItem>
                                            </Select>
                                        </FormControl>
                                    </FormGroup>

                                </Col>
                            </Row>
                            <Row className='d-flex flex-column flex-lg-row mt-4 mb-4'>
                                <Col className="">
                                    <FormGroup controlId="authorGender">
                                        <FormControl size="small" fullWidth>
                                            <InputLabel id="authorGender-label">*{t('authorGenderFieldLabel')}</InputLabel>
                                            <Select
                                                labelId="authorGender-label"
                                                id="authorGender"
                                                name='authorGender'
                                                value={formValues.authorGender}
                                                label={`*${t("authorGenderFieldLabel")}`}
                                                onChange={handleChangeSelectField}
                                            >
                                                <MenuItem value="">{t('authorGenderFieldPlaceholder')}</MenuItem>
                                                <MenuItem value="female">{t('authorGenderFemale')}</MenuItem>
                                                <MenuItem value="male">{t('authorGenderMale')}</MenuItem>
                                                <MenuItem value="non-binary">{t('authorGenderNonbinary')}</MenuItem>
                                                <MenuItem value="trans">{t('authorGenderTrans')}</MenuItem>
                                                <MenuItem value="other">{t('authorGenderOther')}</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </FormGroup>

                                </Col>
                                <Col className=" mt-4 mt-lg-0">
                                    <FormGroup controlId="authorRace">
                                        <FormControl size="small" fullWidth>
                                            <InputLabel id="authorRace-label">*{t('authorEthnicityFieldLabel')}</InputLabel>
                                            <Select
                                                labelId="authorRace-label"
                                                id="authorRace"
                                                name='authorRace'
                                                value={formValues.authorRace}
                                                label={`*${t("authorEthnicityFieldLabel")}`}
                                                onChange={handleChangeSelectField}
                                            >
                                                <MenuItem value="">{t('authorEthnicityFieldPlaceholder')}</MenuItem>
                                                <MenuItem value="white">{t('authorEthnicityIsWhite')}</MenuItem>
                                                <MenuItem value="non-white">{t('authorEthnicityIsNotWhite')}</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <span className='text-primary fw-bold'>{t('Content')}</span>
                            <Row className='d-flex flex-column flex-lg-row mt-4'>
                                <Col className="">
                                    <FormGroup controlId="topics">
                                        <TagsInputTypeAheadMaterial
                                            data={topics??[]}
                                            items={items}
                                            setItems={setItems}
                                            formatValue={(v: string) => t(`topics:${v}`)}
                                            max={3}
                                            label={t('topicsLabel')}
                                            placeholder={`${t('Type to add tag')}...`}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className=" mt-4 mt-lg-0">
                                    <TagsInputMaterial tags={tags} setTags={setTags} label={t('topicsFieldLabel')} />

                                </Col>
                            </Row>
                            <span className='text-primary fw-bold'>{t('AdditionalInformation')}</span>
                            <Row className='d-flex flex-column flex-lg-row mt-4'>
                                <Col className="">
                                    <TextField id="publicationYear" className="w-100" label={publicationYearLabel}
                                        variant="outlined" size="small" name="publicationYear"
                                        value={formValues.publicationYear}
                                        type="text"
                                        onChange={handleChangeTextField}
                                    />
                                </Col>
                                <Col className=" mt-4 mt-lg-0">
                                    <TextField id="workLength" className="w-100" label={publicationLengthLabel}
                                        variant="outlined" size="small" name="workLength"
                                        value={formValues.workLength}
                                        type="text"
                                        onChange={handleChangeTextField}
                                    />
                                </Col>
                            </Row>
                            <Row className='d-flex flex-column flex-lg-row mt-4 mb-5'>
                                <Col className="">
                                    <FormGroup controlId="description">
                                        <FormLabel>{t('workSummaryFieldLabel')}</FormLabel>
                                        <Textarea minRows={5} name="description" value={formValues.description} onChange={handleChangeTextField} />

                                    </FormGroup>
                                </Col>
                            </Row>

                        </>
                    }

                </ModalBody>
                <ModalFooter>
                    {(selectedWork || !useApiSearch) && <Container className="p-0 d-flex justify-content-end">
                        <ButtonGroup className="py-4">
                            <Button
                                variant="warning"
                                onClick={handleFormClear}
                                className="text-white"
                            >
                                <ImCancelCircle />
                            </Button>
                            <Button disabled={isLoading} type="submit" className="btn-eureka">
                                <>
                                    {t('submitButtonLabel')}
                                    {isLoading && (
                                        <Spinner animation="grow" variant="info" className={`ms-2 ${styles.loadIndicator}`} size="sm" />
                                    )}
                                </>
                            </Button>
                        </ButtonGroup>
                    </Container>}
                </ModalFooter></>}
            {
                showExistingWork && <Row className="mb-5 d-flex flex-column">

                    <Col>
                        <h1 className="text-secondary text-center  fw-bold mt-sm-0 mb-3 mb-lg-5">{t('ExistingWorktitle')}</h1>

                    </Col>
                    <Col className='d-flex  justify-content-center align-items-center'>
                        <WMI workId={workId!}
                            size={'lg'}
                            showCreateEureka={false}
                            showSaveForLater={true}
                            showSocialInteraction
                        />
                    </Col>
                    <Col className='d-flex  justify-content-center align-items-center'>
                        <Box sx={{
                            width: {
                                xs: '80%', // theme.breakpoints.up('xs')
                                md: '30%', // theme.breakpoints.up('md')
                            },
                        }} >
                            <Button
                                className={`mt-3 mt-lg-5 btn-eureka `}
                                onClick={(e) => handleToDoOtherSearch(e)}
                                style={{ width: '100%', height: '2.5em' }}
                            >
                                {t('MakeSearchText')}
                            </Button></Box> </Col>
                </Row>

            }
        </Form >



    );
};

export default CreateWorkForm;
