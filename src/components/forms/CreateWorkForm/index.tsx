import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, FormEvent, FunctionComponent, useEffect, useState, useRef, MouseEvent } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { v4 } from 'uuid'
//import FormControl from 'react-bootstrap/FormControl';
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
import TagsInput from '@/components/forms/controls/TagsInput';
import TagsInputTypeAhead from '@/components/forms/controls/TagsInputTypeAhead';
import toast from 'react-hot-toast'
import useTopics from 'src/useTopics';
import useCountries from 'src/useCountries';
import { ImCancelCircle } from 'react-icons/im';
import { CreateWorkClientPayload, GoogleBooksProps, TMDBVideosProps } from '@/types/work';
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
import { set } from 'lodash';
import { getImageFile, getImg } from '@/src/lib/utils'
import { decode } from 'base64-arraybuffer'


import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';



interface Props {
    noModal?: boolean;
}

interface FormValues {
    type?: string | '';
    title?: string;
    link?: string;
    author?: string;
    authorGender?: string;
    authorRace?: string;
    publicationYear?: string;
    workLength?: string;
    description?: string;
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
        title: '',
        link: '',
        author: '',
        authorGender: '',
        authorRace: '',
        publicationYear: '',
        workLength: '',
        description: ''
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
                setWorkId(json.id);
                toast.success(t('WorkSaved'))
                return json.work;
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
            title: '',
            link: '',
            author: '',
            authorGender: '',
            authorRace: '',
            publicationYear: '',
            workLength: '',
            description: ''
        });
        setItems([]);
        setTags('');
        setCountryOrigin([]);
        setCoverFile(null);
        setSelectedWork(null);
    };

    const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        if (coverFile == null) {
            return;
        }

        const payload: CreateWorkClientPayload = {
            type: formValues?.type!,
            title: formValues?.title!,
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
        };

        await execCreateWork(payload);
    };



    useEffect(() => {
        if (isSuccess === true) {
            setGlobalModalsState({ ...globalModalsState, ...{ createWorkModalOpened: false } });
            queryClient.invalidateQueries('works.mosaic');
            router.push(`/work/${workId}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess]);


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


    async function searchTitles(q: string) {
        //setLoading(true);
        if (formValues && formValues.type) {
            const { error, data } = await fetch('/api/external-works/search', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ type: formValues.type, search: q }),
            }).then((r) => r.json());

            if (data)
                setResultWorks(data);
            else if (error)
                toast.error(error)
        }
        else toast.error("Work type required");
        //setLoading(false);
    }

    const handleSelect = async (work: APIMediaSearchResult) => {
        setSelectedWork(work);
        if (isBookGoogleBookApi(work)) {
            if (work.volumeInfo.imageLinks) {
                console.log(isBookGoogleBookApi(work), work, 'is a work')
                let url = work.volumeInfo.imageLinks.thumbnail;
                url = url.replace('http://', 'https://');
                url = url.replace('zoom=1', 'zoom=5');

                const { buffer } = await fetch('/api/external-works/select', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({ url: work.volumeInfo.imageLinks.thumbnail })
                }).then((r) => r.json());

                const blob = new Blob([decode(buffer)], { type: 'image/webp' });

                let src = URL.createObjectURL(blob)
                let file = await getImg(src) 
                setCoverFile(file);
            }
            formValues['title'] = work.volumeInfo.title;
            formValues['author'] = work.volumeInfo.authors ? work.volumeInfo.authors.join(',') : "";
            formValues['publicationYear'] = (work.volumeInfo.publishedDate) ? work.volumeInfo.publishedDate : "";
            formValues['workLength'] = (work.volumeInfo.pageCount) ? `${work.volumeInfo.pageCount}` : "";
            formValues['description'] = (work.volumeInfo.description) ? work.volumeInfo.description : "";
            setFormValues({
                ...formValues,
            });

        }
        if (isVideoTMDB(work)) {
            if (work.poster_path) {
                console.log(isVideoTMDB(work), 'is a video')
                //let image = new Image();// hice esto aca por errores de CORS
                //image.crossOrigin = "Anonymous";
                let url = `https://image.tmdb.org/t/p/w600_and_h900_bestv2${work.poster_path}`;
                console.log(url)
                let file = await getImg(url + '?not-from-cache-please')  //OKOKOKOK
                setCoverFile(file as File | null);
            }
            formValues['title'] = work.title;
            formValues['publicationYear'] = work.release_date;
            formValues['description'] = work.overview;
            setFormValues({
                ...formValues,
            });
        }
        setResultWorks([]);
        toast.success("Work selected!!!!!");
    }

    const handleChangeUseApiSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUseApiSearch(event.target.checked);
        setResultWorks([]);
        setSelectedWork(null);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <ModalHeader closeButton={!noModal}>
                <ModalTitle> <h1 className="text-secondary fw-bold mt-sm-0 mb-4">{t('title')}</h1></ModalTitle>
            </ModalHeader>
            <ModalBody>
                <FormGroup className='d-flex justify-content-end'>
                    <FormControlLabel control={<Switch checked={useApiSearch} onChange={handleChangeUseApiSearch} />} label={'Use integrated APIs to add work , turn off to add manuallly.'} />
                </FormGroup>
                <span className='text-primary fw-bold'>Core Information</span>
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

                        <span className='text-primary fw-bold'>Auhorship</span>
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

                        <span className='text-primary fw-bold'>Content</span>
                        <Row className='d-flex flex-column flex-lg-row mt-4'>
                            <Col className="">
                                <FormGroup controlId="topics">
                                    <TagsInputTypeAheadMaterial
                                        data={topics}
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
                        <span className='text-primary fw-bold'>Additional Information about work</span>
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
            </ModalFooter>
        </Form>
    );
};

export default CreateWorkForm;
