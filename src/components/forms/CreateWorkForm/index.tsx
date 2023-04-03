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
import { SelectChangeEvent, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Textarea from '@mui/joy/Textarea';
import SearchWorkInput from './SearchWorkInput';
import BookCard from './BookCard';
import VideoCard from './VideoCard';
import { APIMediaSearchResult, Country, isBookGoogleBookApi, isVideoTMDB } from '@/src/types';
import TagsInputTypeAheadMaterial from '@/components/forms/controls/TagsInputTypeAheadMaterial';
import TagsInputMaterial from '@/components/forms/controls/TagsInputMaterial';
import styles from './index.module.css';
import { set } from 'lodash';
const apiKeyTMDB = process.env.NEXT_PUBLIC_TMDB_API_KEY;
import { getImageFile } from '@/src/lib/utils'

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';



interface Props {
    noModal?: boolean;
}

const CreateWorkForm: FunctionComponent<Props> = ({ noModal = false }) => {
    const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
    const formRef = useRef<HTMLFormElement>(null)
    const [resultWorks, setResultWorks] = useState<APIMediaSearchResult[] | APIMediaSearchResult[]>([]);
    const [selectedWork, setSelectedWork] = useState<APIMediaSearchResult | APIMediaSearchResult | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [tags, setTags] = useState<string>('');
    const [items, setItems] = useState<string[]>([]);

    const queryClient = useQueryClient();
    const router = useRouter();
    const { t } = useTranslation('createWorkForm')
    const [publicationLengthLabel, setPublicationLengthLabel] = useState('...');
    const [publicationYearLabel, setPublicationYearLabel] = useState('...');
    const [publicationLinkLabel, setPublicationLinkLabel] = useState('...');
    const typeaheadRef = useRef<AsyncTypeahead<{ id: number; code: string; label: string }>>(null);
    //const [isCountriesSearchLoading, setIsCountriesSearchLoading] = useState(false);
    // const [isCountriesSearchLoading2, setIsCountriesSearchLoading2] = useState(false);
    const [countrySearchResults, setCountrySearchResults] = useState<{ code: string; label: string }[]>([]);
    const [countryOrigin, setCountryOrigin] = useState<string[]>([]);
    const [workType, setWorkType] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [link, setLink] = useState<string>("");
    const [author, setAuthor] = useState<string>("");
    const [publicationYear, setPublicationYear] = useState<string>("");
    const [workLength, setWorkLength] = useState<string>("");
    const [authorGender, setAuthorGender] = useState<string>("");
    const [authorRace, setAuthorRace] = useState<string>(""); 
    const [description, setDescription] = useState<string>("");


    //const [hasCountryOrigin2, setHasCountryOrigin2] = useState<boolean>();
    //const [countryOrigin2, setCountryOrigin2] = useState<string>();
    const [workId, setWorkId] = useState<number | undefined>();

    const { data: topics } = useTopics();
    const { data: countries } = useCountries();

    useEffect(() => {
        if (countries) setCountrySearchResults(countries.map((d: Country) => ({ code: d.code, label: d.code })))
        console.log(countrySearchResults, 'countrySearchResultscountrySearchResultss')
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
        ev.preventDefault();
        /*setSelectedWorksForCycle([]);
        setCycleCoverImageFile(null);
        editorRef.current.setContent('');*/
        setItems([]);
        setTags('');


        /* if (formRef.current != null) {
           const form = formRef.current;
     
           form.cycleTitle.value = '';
           form.languages.value = '';
           form.startDate.value = '';
           form.endDate.value = '';
         }*/
    };

    const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        if (coverFile == null) {
            return;
        }

        const form = ev.currentTarget;
        const payload: CreateWorkClientPayload = {
            type: form.type.value,
            title: form.workTitle.value,
            author: form.author.value,
            authorGender: form.authorGender.value.length ? form.authorGender.value : null,
            authorRace: form.authorRace.value.length ? form.authorRace.value : null,
            cover: coverFile,
            contentText: form.description.value.length ? form.description.value : null,
            link: form.link.value.length ? form.link.value : null,
            countryOfOrigin: countryOrigin || null,
            //countryOfOrigin2: countryOrigin2 || null,
            publicationYear: form.publicationYear.value.length ? form.publicationYear.value : null,
            length: form.workLength.value.length ? form.workLength.value : null,
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


    function handleChangeWorkType(ev: SelectChangeEvent) {
        ev.preventDefault();
        setResultWorks([])
        switch (ev.target.value) {
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
        setWorkType(ev.target.value as string);
    }

    async function searchTitles(q: string) {
        //setLoading(true);
        //setShowOptions(true);
        //setImages([]);
        if (workType) {
            if (['book', 'fiction-book'].includes(workType)) {

                try {
                    const { items: data, totalItems, error } = await fetch(`https://www.googleapis.com/books/v1/volumes?q="${q}"&maxResults=20`).then((r) =>
                        r.json()
                    );
                    //console.log(data, totalItems, 'google books API')
                    if (error) toast.error(error.message)
                    else if (data)
                        setResultWorks(data);
                }
                catch (error: any) {
                    toast.error(error.message)
                }
            }

            if (['documentary', 'movie'].includes(workType)) {  //src="https://image.tmdb.org/t/p/w600_and_h900_bestv2/wKVCk0U3KAcCthWQQgDxwyJAJJc.jpg"

                try {
                    const { results: data, total_results: totalItems, success, status_code, status_message } = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKeyTMDB}&query=${q}`).then((r) =>
                        r.json()
                    );
                    console.log(data, totalItems, 'tmdb API')
                    if (status_code && !success) toast.error(status_message)
                    else if (data)
                        setResultWorks(data);
                }
                catch (error: any) {
                    toast.error(error.message)
                }
            }

        }
        else toast.error("Work type required");
        //setLoading(false);

        console.log(resultWorks, 'resultWorks')
    }

    const handleSelect = async (work: APIMediaSearchResult) => {
        //console.log(isBookGoogleBookApi(work), 'is a Book')
        // console.log(isVideoTMDB(work), 'is a Video')
        setSelectedWork(work);
        if (isBookGoogleBookApi(work)) {
            setTitle(work.volumeInfo.title)
            if (work.volumeInfo.imageLinks) {
                console.log(isBookGoogleBookApi(work), 'is a work')
                let url = work.volumeInfo.imageLinks.thumbnail;
                url = url.replace('http://', 'https://');
                url = url.replace('zoom=1', 'zoom=5');
                let image = new Image();
                image.crossOrigin = "Anonymous";
                image.src = url;
                let file = await getImageFile(image)
                setCoverFile(file as File | null);
            }
        }
        if (isVideoTMDB(work)) {
            setTitle(work.title)
            if (work.poster_path) {
                console.log(isVideoTMDB(work), 'is a video')
                let image = new Image();
                image.crossOrigin = "Anonymous";
                image.src = `https://image.tmdb.org/t/p/w600_and_h900_bestv2${work.poster_path}`;
                let file = await getImageFile(image)
                setCoverFile(file as File | null);
            }
        }
        setResultWorks([]);
        toast.success("Work selected!!!!!");
    }


    return (
        <Form ref={formRef} onSubmit={handleSubmit}>
            <ModalHeader closeButton={!noModal}>
                <ModalTitle> <h1 className="text-secondary fw-bold mt-sm-0 mb-4">{t('title')}</h1></ModalTitle>
            </ModalHeader>

            <ModalBody>
                <span className='text-primary fw-bold'>Core Information</span>
                <Row className='d-flex flex-column flex-lg-row mt-4'>
                    <Col className="">
                        <FormGroup controlId="worktype">
                            <FormControl size="small" fullWidth>
                                <InputLabel id="worktype-label">*{t('typeFieldLabel')}</InputLabel>
                                <Select
                                    labelId="worktype-label"
                                    id="worktype"
                                    value={workType}
                                    label={`*${t("typeFieldLabel")}`}
                                    onChange={handleChangeWorkType}
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
                        {(!selectedWork || resultWorks.length > 0) && <SearchWorkInput callback={searchTitles} />}
                        {(selectedWork && !resultWorks.length) && <TextField id="title" className="w-100" label={`*${t('titleFieldLabel')}`}
                            variant="outlined" size="small"
                            value={title}
                            type="text"
                            onChange={(e) => setTitle(e.target.value)}
                        >
                        </TextField>}
                    </Col>
                    {(!selectedWork || resultWorks.length > 0) && <Box className='d-flex flex-row justify-content-around flex-wrap mt-5'>
                        {(['book', 'fiction-book'].includes(workType!)) && resultWorks.map((work) => {
                            return <BookCard key={work.id} book={work as GoogleBooksProps} callback={handleSelect} />;
                        })}
                        {(['documentary', 'movie'].includes(workType!)) && resultWorks.map((work) => {
                            return <VideoCard key={work.id} video={work as TMDBVideosProps} callback={handleSelect} />;
                        })}

                    </Box>}
                </Row>
                {(selectedWork && !resultWorks.length) &&
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
                        <Col className="">
                            <TextField id="link" className="w-100" label={publicationLinkLabel}
                                variant="outlined" size="small"
                                value={link}
                                type="text"
                                onChange={(e) => setLink(e.target.value)}
                            >
                            </TextField>
                        </Col>
                    </Row>

                        <span className='text-primary fw-bold'>Auhorship</span>
                        <Row className='d-flex flex-column flex-lg-row mt-4 mb-4'>
                            <Col className="">
                                <TextField id="author" className="w-100" label={`*${t('authorFieldLabel')}`}
                                    variant="outlined" size="small"
                                    value={author}
                                    type="text"
                                    onChange={(e) => setAuthor(e.target.value)}
                                >
                                </TextField>


                            </Col>
                            <Col className="">
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
                                            value={authorGender}
                                            label={`*${t("authorGenderFieldLabel")}`}
                                            onChange={(e) => setAuthorGender(e.target.value)}
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
                            <Col className="">
                                <FormGroup controlId="authorRace">
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="authorRace-label">*{t('authorEthnicityFieldLabel')}</InputLabel>
                                        <Select
                                            labelId="authorRace-label"
                                            id="authorRace"
                                            value={authorRace}
                                            label={`*${t("authorEthnicityFieldLabel")}`}
                                            onChange={(e) => setAuthorRace(e.target.value)}
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
                            <Col className="">
                                <TagsInputMaterial tags={tags} setTags={setTags} label={t('topicsFieldLabel')} />

                            </Col>
                        </Row>
                        <span className='text-primary fw-bold'>Additional Information about work</span>
                        <Row className='d-flex flex-column flex-lg-row mt-4'>
                            <Col className="">
                                <TextField id="publicationYear" className="w-100" label={publicationYearLabel}
                                    variant="outlined" size="small"
                                    value={publicationYear}
                                    type="text"
                                    onChange={(e) => setPublicationYear(e.target.value)}
                                />
                            </Col>
                            <Col className="">
                                <TextField id="workLength" className="w-100" label={publicationLengthLabel}
                                    variant="outlined" size="small"
                                    value={workLength}
                                    type="text"
                                    onChange={(e) => setWorkLength(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className='d-flex flex-column flex-lg-row mt-4 mb-5'>
                            <Col className="">
                                <FormGroup controlId="description">
                                <FormLabel>{t('workSummaryFieldLabel')}</FormLabel>
                                <Textarea minRows={5} value={description} onChange={(e) => setDescription(e.target.value)}
 />
                                </FormGroup>
                            </Col>
                        </Row>

                    </>
                }

            </ModalBody>
            <ModalFooter>
                <Container className="p-0 d-flex justify-content-end">
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
                </Container>
            </ModalFooter>
        </Form>
    );
};

export default CreateWorkForm;
