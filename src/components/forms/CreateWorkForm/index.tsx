import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, FormEvent, FunctionComponent, useEffect, useState, useRef, MouseEvent } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
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
import { ImCancelCircle } from 'react-icons/im';
import { CreateWorkClientPayload, GoogleBooksProps, TMDBVideosProps } from '@/types/work';
import ImageFileSelect from '@/components/forms/controls/ImageFileSelect';
import globalModalsAtom from 'src/atoms/globalModals';
import { SelectChangeEvent, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SearchWorkInput from './SearchWorkInput';
import BookCard from './BookCard';
import VideoCard from './VideoCard';

import styles from './CreateWorkNewForm.module.css';
import { set } from 'lodash';
const apiKeyTMDB = process.env.NEXT_PUBLIC_TMDB_API_KEY;
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
    const [publicationYearLabel, setPublicationYearLabel] = useState('...');
    const formRef = useRef<HTMLFormElement>(null)
    const [resultWorks, setResultWorks] = useState<GoogleBooksProps[] | TMDBVideosProps[] >([]);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [tags, setTags] = useState<string>('');
    const [items, setItems] = useState<string[]>([]);

    const queryClient = useQueryClient();
    const router = useRouter();
    const { t } = useTranslation('createWorkForm');
    const [publicationLengthLabel, setPublicationLengthLabel] = useState('...');
    const typeaheadRef = useRef<AsyncTypeahead<{ id: number; code: string; label: string }>>(null);
    const [isCountriesSearchLoading, setIsCountriesSearchLoading] = useState(false);
    const [isCountriesSearchLoading2, setIsCountriesSearchLoading2] = useState(false);
    const [countrySearchResults, setCountrySearchResults] = useState<{ id: number; code: string; label: string }[]>([]);
    const [countryOrigin, setCountryOrigin] = useState<string>();
    const [workType, setWorkType] = useState<string>();
    const [hasCountryOrigin2, setHasCountryOrigin2] = useState<boolean>();
    const [countryOrigin2, setCountryOrigin2] = useState<string>();
    const [workId, setWorkId] = useState<number | undefined>();

    const { data: topics } = useTopics();
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

    const handleWorkTypeChange = (ev: ChangeEvent<HTMLSelectElement>) => {
        switch (ev.currentTarget.value) {
            case 'movie':
            case 'documentary':
                setPublicationYearLabel(t('releaseYearFieldLabel'));
                setPublicationLengthLabel(`${t('Duration')} (${t('minutes')})`);
                break;
            case 'fiction-book':
            case 'book':
                setPublicationLengthLabel(t('Length pages'));
                setPublicationYearLabel(t('Publication year'));
                break;
            default:
                setPublicationYearLabel('...');
                setPublicationLengthLabel('...');
        }
    };

    const handleSearchCountry = async (query: string) => {
        setIsCountriesSearchLoading(true);
        const response = await fetch(`/api/taxonomy/countries?q=${query}`);
        const itemsSC: { id: number; code: string; label: string }[] = (await response.json()).result;
        if (itemsSC) {
            itemsSC.forEach((i, idx: number) => {
                itemsSC[idx] = { ...i, label: `${t(`countries:${i.code}`)}` };
            });
            setCountrySearchResults(itemsSC);
        }
        setIsCountriesSearchLoading(false);
    };

    const handleSearchCountry2 = async (query: string) => {
        setIsCountriesSearchLoading2(true);
        const response = await fetch(`/api/taxonomy/countries?q=${query}`);
        const itemsC: { id: number; code: string; label: string }[] = (await response.json()).result;
        itemsC.forEach((i, idx: number) => {
            itemsC[idx] = { ...i, label: `${t(`countries:${i.code}`)}` };
        });
        setCountrySearchResults(itemsC);
        setIsCountriesSearchLoading2(false);
    };

    const handleSearchCountrySelect = (selected: { id: number; code: string; label: string }[]): void => {
        if (selected[0] != null) {
            setCountryOrigin(selected[0].code);
            // setSelectedWorksForCycle([...selectedWorksForCycle, selected[0]]);
            // setAddWorkModalOpened(false);
        }
    };

    const handleSearchCountry2Select = (selected: { id: number; code: string; label: string }[]): void => {
        if (selected[0] != null) {
            if (hasCountryOrigin2) setCountryOrigin2(selected[0].code);

            // setSelectedWorksForCycle([...selectedWorksForCycle, selected[0]]);
            // setAddWorkModalOpened(false);
        }
    };

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
            countryOfOrigin2: countryOrigin2 || null,
            publicationYear: form.publicationYear.value.length ? form.publicationYear.value : null,
            length: form.workLength.value.length ? form.workLength.value : null,
            tags,
            topics: items.join(','),
        };

        await execCreateWork(payload);
    };

    const toogleCountryOrigin2Handler = (countryOpt?: number) => {
        if (countryOpt === 2) setHasCountryOrigin2(false);
        else setHasCountryOrigin2(true);
    };

    useEffect(() => {
        if (isSuccess === true) {
            setGlobalModalsState({ ...globalModalsState, ...{ createWorkModalOpened: false } });
            queryClient.invalidateQueries('works.mosaic');
            router.push(`/work/${workId}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess]);

    // const onNewTagAdded = (e: { code: string; label: string }[]) => {
    //   if (e.length) {
    //     // topicsTags.push(e[0].code);
    //     // setTopicsTags([...new Set(topicsTags)]);

    //     // if (setTags) setTags(items.join());
    //     refTopics.current!.clear();
    //   }
    // };

    function handleChangeWorkType(ev: SelectChangeEvent<HTMLTextAreaElement>) {
        ev.preventDefault();
        setResultWorks([])
        setWorkType(ev.target.value as string);
    }

    async function searchTitles(q: string) {
        //setLoading(true);
        //setShowOptions(true);
        //setImages([]);
        if (workType) {
            if (['book', 'fiction-book'].includes(workType)) {

                const { items: data, totalItems, error } = await fetch(`https://www.googleapis.com/books/v1/volumes?q="${q}"&maxResults=20`).then((r) =>
                    r.json()
                );
                //console.log(data, totalItems, 'google books API')
                if (error) toast.error(error.message)
                else if (data)
                    setResultWorks(data);
            }

            if (['documentary', 'movie'].includes(workType)) {  //src="https://image.tmdb.org/t/p/w600_and_h900_bestv2/wKVCk0U3KAcCthWQQgDxwyJAJJc.jpg"

                const { results: data, total_results: totalItems, success, status_code, status_message } = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKeyTMDB}&query=${q}`).then((r) =>
                    r.json()
                );
                console.log(data, totalItems, 'tmdb API')
                if (status_code && !success) toast.error(status_message)
                else if (data)
                    setResultWorks(data);
            }

        }
        else toast.error("Work type required");
        //setLoading(false);

        //console.log(resultWorks,'resultWorks')
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
                                    //value={age}
                                    label={`*${t("typeFieldLabel")}`}
                                    onChange={handleChangeWorkType}
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
                    <Col className="mb-5">
                        <SearchWorkInput callback={searchTitles} />
                    </Col>
                </Row>
                
                
                <div className='d-flex flex-row justify-content-around flex-wrap '>
                    {(resultWorks.length > 0) && (['book', 'fiction-book'].includes(workType!)) && resultWorks.map((work) => {
                        return <BookCard key={work.id} book={work as GoogleBooksProps} />;
                    })}
                    {(resultWorks.length > 0) && (['documentary', 'movie'].includes(workType!)) && resultWorks.map((work) => {
                        return <VideoCard key={work.id} video={work as TMDBVideosProps} />;
                    })}

                </div>





            </ModalBody>

            <ModalFooter>
                {/* <Container className="p-0 d-flex justify-content-end">
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


        </Container>*/}
            </ModalFooter>
        </Form>



    );
};

export default CreateWorkForm;
