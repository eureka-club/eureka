import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, FormEvent, useEffect, useState, FunctionComponent, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import LocalImageComponent from '@/components/LocalImage'
import CropImageFileSelect from '@/components/forms/controls/CropImageFileSelect';
import { useMutation, useQueryClient } from 'react-query';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { useSession } from 'next-auth/client';
// import TagsInputTypeAhead from './controls/TagsInputTypeAhead';
import { User } from '@prisma/client';
import TagsInput from './controls/TagsInput';
import { Session } from '../../types';
import { EditUserClientPayload } from '../../types/user';
import useUser from '@/src/useUser';
// import ImageFileSelect from './controls/ImageFileSelect';
import globalModalsAtom from '../../atoms/globalModals';
import styles from './EditUserForm.module.css';
import i18nConfig from '../../../i18n';
// import useTopics from '../../useTopics';

dayjs.extend(utc);
const EditUserForm: FunctionComponent = () => {
  const [session] = useSession();
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  const router = useRouter();
  const [tags, setTags] = useState<string>('');
  const [photo, setPhoto] = useState<File>();
  // const [user, setUser] = useState<User | undefined>();
  const [id, setId] = useState<string>('');
  const [currentImg, setCurrentImg] = useState<string | undefined>();
  const [userName, setUserName] = useState<string>();
  const [privacySettings, setPrivacySettings] = useState<number>();
  const [dashboardTypeChecked, setDashboardTypeChecked] = useState<{
    public: boolean;
    protected: boolean;
    private: boolean;
  }>({
    private: false,
    protected: false,
    public: false,
  });

  useEffect(() => {
    const s = session as unknown as Session;
    if (!s || !s.user) router?.push('/');
    else setId(s.user.id.toString());
  }, []);

  const { /* isLoading,  isError, error, */ data:user } = useUser(+id,{
    enabled: !!+id,
    staleTime:1
  });
  useEffect(() => {
    if (user) {
      // setUser(data);
      setUserName(user.name!);
      setTags(() => user.tags!);
      setDashboardTypeChecked((res) => {
        let v = 'private';
        switch (user.dashboardType) {
          case 2:
            v = 'protected';
            break;
          case 1:
            v = 'public';
            break;
          default:
            v = 'private';
        }
        return {
          ...res,
          [`${v}`]: true,
        };
      });
      setCurrentImg(() => user.image!);
      // if(user.photos.length)
      //   setUserPhotoFile(()=>user.photos[0])
    }
  }, [user]);

  const handlerCurrentImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentImg(() => e.target.value);
  };

  const typeaheadRef = useRef<AsyncTypeahead<{ id: number; code: string; label: string }>>(null);
  const [isCountriesSearchLoading, setIsCountriesSearchLoading] = useState(false);

  const [countrySearchResults, setCountrySearchResults] = useState<{ id: number; code: string; label: string }[]>([]);
  const [countryOrigin, setCountryOrigin] = useState<string>();

  // const [countryOrigin2, setCountryOrigin2] = useState<string | null>();
  // const [hasCountryOrigin2, sethasCountryOrigin2] = useState<boolean>();
  // const { data: topics } = useTopics();
  // const [items, setItems] = useState<string[]>([]);

  const { locale } = useRouter();
  const [namespace, setNamespace] = useState<Record<string, string>>();
  
  useEffect(() => {
    const fn = async () => {
      const r = await i18nConfig.loadLocaleFrom(locale, 'countries');
      setNamespace(r);
    };
    fn();
  }, [locale]);

  // const labelsChange = (fieldName: string) => {
  //   switch (fieldName) {
  //     case 'fiction-book':
  //     case 'book':
  //       setPublicationLengthLabel(t('Length pages'));
  //       setPublicationYearLabel(t('Publication year'));
  //       break;
  //     case 'movie':
  //     case 'documentary':
  //       setPublicationYearLabel(t('releaseYearFieldLabel'));
  //       setPublicationLengthLabel(`${t('Duration')} (${t('minutes')})`);
  //       break;

  //     default:
  //       setPublicationYearLabel('...');
  //       setPublicationLengthLabel('...');
  //   }
  // };

  // useEffect(() => {
  //   const fetchWork = async () => {
  //     const res: Response = await fetch(`/api/work/${router.query.id}`);
  //     const { status, work: w = null } = await res.json();
  //     if (status === 'OK') {
  //       setWork(w);
  //       setTags(() => {
  //         const ts = w.tags;
  //         return ts;
  //       });
  //       labelsChange(w.type);
  //     }
  //   };
  //   fetchWork();
  // }, [router.query.id]);

  // useEffect(() => {
  //   if (work) {
  //     if (work.countryOfOrigin2) setCountryOrigin2(work.countryOfOrigin2);
  //     // setTopicsTags(work.topics || '');
  //     if (work.topics) items.push(...work.topics.split(','));
  //   }
  // }, [work]);

  // (data: TData, variables: TVariables, context: TContext | undefined)
  
  const {
    mutate: execEditUser,
    error: editUserError,
    isError,
    isLoading: isLoadingUser,
    isSuccess,
  } = useMutation(
    async (payload: EditUserClientPayload) => {
      const fd = new FormData();
      Object.entries(payload).forEach(([key,value])=>{
        if(value)
          fd.append(key,value);
      });
      const res = await fetch(`/api/user/${id}`, {
        method: 'PATCH',
        // headers: { 'Content-Type': 'application/json' },
        body: fd,
      });
      if(!res.ok){
        setGlobalModalsState((r)=>({
          ...r,
          showToast: {
            show: true,
            type: 'warning',
            title: t('Warning'),
            message: res.statusText,
          },
        }));
        return null;
      }
      return res.json();
    },
    {
      onMutate: async () => {
        const cacheKey = ['USER',id];
        const snapshot = queryClient.getQueryData(cacheKey);
        return { cacheKey, snapshot };        
      },
      onSettled: (_user, error, _variables, context) => {
        if (context) {
          const { cacheKey, snapshot } = context;
          if (error && cacheKey) {
            queryClient.setQueryData(cacheKey, snapshot);
          }
          if (context) queryClient.invalidateQueries(cacheKey);
        }
      },
    },
  );

  // const handleWorkTypeChange = (ev: ChangeEvent<HTMLSelectElement>) => {
  //   labelsChange(ev.currentTarget.value);
  //    switch (ev.currentTarget.value) {
  //     case 'book':
  //       setPublicationLengthLabel(`${t('Length')} (${t('pages')})`);
  //       break;
  //     case 'movie':
  //     case 'documentary':
  //       setPublicationYearLabel(t('releaseYearFieldLabel'));
  //       setPublicationLengthLabel(`${t('Duration')} (${t('minutes')})`);
  //       break;

  //     default:
  //       setPublicationYearLabel(t('publicationYearFieldLabel'));
  //       setPublicationLengthLabel(`${t('Length')} | ${t('Duration')}`);
  //   }
  // };

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    // if (coverFile == null) {
    //   return;
    // }

    const form = ev.currentTarget;
    const payload: EditUserClientPayload = {
      name: userName,
      email: form.email.value,
      image: form.image.value,
      countryOfOrigin: countryOrigin,
      aboutMe: form.aboutMe.value,
      dashboardType: privacySettings || 3,
      tags,
      ... (photo && {photo}),
    };

    await execEditUser(payload);
  };

  // const handlerchange = (ev: ChangeEvent<HTMLInputElement>) => {
  //   if (work && ev.currentTarget.id in work) {
  //     let w: WorkDetail & { [key: string]: unknown } = work;
  //     w = work;
  //     w[ev.currentTarget.id] = ev.currentTarget.value;
  //     setWork(w);
  //   }
  // };

  useEffect(() => {
    if (isSuccess === true) {
      setGlobalModalsState({ ...globalModalsState, ...{ editUserModalOpened: false } });
      queryClient.invalidateQueries(['user', id]);
      router.replace(router.asPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const handleSearchCountry = async (query: string) => {
    setIsCountriesSearchLoading(true);
    const response = await fetch(`/api/taxonomy/countries?q=${query}`);
    const itemsSC: { id: number; code: string; label: string }[] = (await response.json()).result;
    itemsSC.forEach((i, idx: number) => {
      itemsSC[idx] = { ...i, label: `${t(`countries:${i.code}`)}` };
    });
    setCountrySearchResults(itemsSC);
    setIsCountriesSearchLoading(false);
  };

  const handleSearchCountrySelect = (selected: { id: number; code: string; label: string }[]): void => {
    if (selected[0] != null) {
      setCountryOrigin(selected[0].code);
    }
  };

  // const toogleCountryOrigin2Handler = (countryOpt?: number) => {
  //   if (countryOpt === 2) {
  //     sethasCountryOrigin2(false);
  //     setCountryOrigin2(null);
  //   } else {
  //     sethasCountryOrigin2(true);
  //     setCountryOrigin2(null);
  //   }
  // };

  // const handleSearchCountry2Select = (selected: { id: number; code: string; label: string }[]): void => {
  //   if (selected[0] != null) {
  //     // if (hasCountryOrigin2)
  //     setCountryOrigin2(selected[0].code);
  //   }
  // };

  // const handleSearchCountry2 = async (query: string) => {
  //   setIsCountriesSearchLoading2(true);
  //   const response = await fetch(`/api/taxonomy/countries?q=${query}`);
  //   const itemsSC2: { id: number; code: string; label: string }[] = (await response.json()).result;
  //   itemsSC2.forEach((i, idx: number) => {
  //     itemsSC2[idx] = { ...i, label: `${t(`countries:${i.code}`)}` };
  //   });
  //   setCountrySearchResults(itemsSC2);
  //   setIsCountriesSearchLoading2(false);
  // };

  const handlerDashboardTypeRadioChange = (val: string) => {
    setDashboardTypeChecked(() => ({
      private: false,
      protected: false,
      public: false,
    }));
    setPrivacySettings(() => {
      return { public: 1, protected: 2, private: 3 }[`${val}`];
    });
    setDashboardTypeChecked((res) => ({ ...res, [`${val}`]: true }));
  };

  const onChangeUserName = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.currentTarget.value.slice(0, 30));
  };

  const onGenerateCrop = (photo: File) => {
    setPhoto(()=>photo);
  };

  return (
    <>
      {user && (
        <Form onSubmit={handleSubmit}>
          <ModalHeader closeButton>
            <Container>
              <ModalTitle>{t('Edit Profile')}</ModalTitle>
            </Container>
          </ModalHeader>

          <ModalBody>
            <Container>
              <Row>
                <Col>
                  <FormGroup controlId="userName" className="mb-3">
                    <FormLabel>*{t('Name')}</FormLabel>
                    <FormControl
                      type="text"
                      onChange={onChangeUserName}
                      required
                      value={userName}
                      // defaultValue={userName || undefined}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup controlId="email" className="mb-3">
                    <FormLabel>*{t('Email')}</FormLabel>
                    <FormControl type="email" required defaultValue={user.email || undefined} />
                  </FormGroup>
                </Col>
              </Row>
              {/* <Row>
                <Col>
                  <FormGroup controlId="image" className="mb-3">
                    <FormLabel>
                      *{t('Image')}
                      {` (URL)`}
                    </FormLabel>
                    <Row>
                      <Col xs={12} md={2}>
                           
                      </Col>
                      <Col xs={12} md={10}>
                        <FormControl
                          type="text"
                          placeholder="http://"
                          required
                          defaultValue={user.image || undefined}
                          onChange={handlerCurrentImgChange}
                        />
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
              </Row> */}
              <Row>
                <Col>
                  <CropImageFileSelect onGenerateCrop={onGenerateCrop} />
                </Col>
              
              </Row>
              <Row>
                <Col>
                  <FormGroup controlId="countryOfOrigin1" className="mb-3">
                    <FormLabel>{t('countryFieldLabel')}</FormLabel>
                    <AsyncTypeahead
                      id="create-work--search-country"
                      // Bypass client-side filtering. Results are already filtered by the search endpoint
                      filterBy={() => true}
                      // inputProps={{ required: true }}
                      // placeholder={t('addWrkTypeaheadPlaceholder')}
                      ref={typeaheadRef}
                      isLoading={isCountriesSearchLoading}
                      labelKey={(res) => `${res.label}`}
                      minLength={2}
                      onSearch={handleSearchCountry}
                      options={countrySearchResults}
                      onChange={handleSearchCountrySelect}
                      placeholder={namespace && user.countryOfOrigin ? namespace[user.countryOfOrigin] : ''}
                      // renderMenuItemChildren={(work) => <WorkTypeaheadSearchItem work={work} />}
                    />
                    {/* {!countryOrigin2 && !hasCountryOrigin2 && (
                    <Button className={styles.toogleSecondOriginCountry} onClick={() => toogleCountryOrigin2Handler()}>
                      {t('Add a second origin country')}
                    </Button>
                  )} */}
                  </FormGroup>
                </Col>
                {/* {(countryOrigin2 || hasCountryOrigin2) && (
                <Col>
                  <FormGroup controlId="countryOfOrigin2">
                    <FormLabel>{t('countryFieldLabel')} 2</FormLabel>
                    <AsyncTypeahead
                      id="create-work--search-country2"
                      // Bypass client-side filtering. Results are already filtered by the search endpoint
                      filterBy={() => true}
                      // inputProps={{ required: true }}
                      // placeholder={t('addWrkTypeaheadPlaceholder')}
                      // ref={typeaheadRef}
                      isLoading={isCountriesSearchLoading2}
                      labelKey={(res) => `${res.label}`}
                      minLength={2}
                      onSearch={handleSearchCountry2}
                      options={countrySearchResults}
                      onChange={handleSearchCountry2Select}
                      placeholder={namespace && countryOrigin2 ? namespace[countryOrigin2] : ''}
                      // renderMenuItemChildren={(work) => <WorkTypeaheadSearchItem work={work} />}
                    />
                    <Button className={styles.toogleSecondOriginCountry} onClick={() => toogleCountryOrigin2Handler(2)}>
                      {t('Remove the second origin country')}
                    </Button>
                  </FormGroup>
                </Col>
              )} */}
              </Row>
              <Row>
                <Col xs={12}>
                  <Form.Group controlId="aboutMe" className="mb-3">
                    <Form.Label>{t('About me')}</Form.Label>
                    <Form.Control as="textarea" rows={3} defaultValue={user.aboutMe || undefined} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TagsInput tags={tags} setTags={setTags} label={t('Topics')} className="mb-3"/>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="privacySettings" className={styles.privacySettings}>
                    <Form.Label className="d-flex flex-column">{t('Privacy settings')}</Form.Label>
                    <Form.Text>{t('mediathequeInfo')}.</Form.Text>
                    <Form.Check type="radio" id="dashboardTypePublic" className={styles.checkPublic}>
                      <Form.Check.Input
                        type="radio"
                        isValid
                        onChange={() => handlerDashboardTypeRadioChange('public')}
                        checked={dashboardTypeChecked.public}
                      />
                      <Form.Check.Label className="ms-2">{t('My Mediatheque is public')}</Form.Check.Label>
                      <Form.Control.Feedback type="valid" className="ms-4">{t('Anyone can see my Mediatheque')}</Form.Control.Feedback>
                    </Form.Check>

                    <Form.Check className={styles.checkProtected} type="radio" id="dashboardTypeProtected">
                      <Form.Check.Input
                        type="radio"
                        isValid
                        onChange={() => handlerDashboardTypeRadioChange('protected')}
                        checked={dashboardTypeChecked.protected}
                      />
                      <Form.Check.Label className="ms-2">{t('Fallowers can see my Dashboard')}</Form.Check.Label>
                      <Form.Control.Feedback type="valid" className="ms-4">
                        {t('Users I fallow or that follow me can see my Dashboard')}
                      </Form.Control.Feedback>
                    </Form.Check>

                    <Form.Check type="radio" id="dashboardTypePrivate" className={styles.checkPrivate}>
                      <Form.Check.Input
                        type="radio"
                        isValid
                        onChange={() => handlerDashboardTypeRadioChange('private')}
                        checked={dashboardTypeChecked.private}
                      />
                      <Form.Check.Label className="ms-2">{t('My Dashboard is secret')}</Form.Check.Label>
                      <Form.Control.Feedback type="valid" className="ms-4">{t('Only I can see my Dashboard')}</Form.Control.Feedback>
                    </Form.Check>
                  </Form.Group>
                </Col>
              </Row>
            </Container>
          </ModalBody>

          <ModalFooter>
            <Container className="py-3">
              <Button variant="primary" disabled={isLoadingUser} type="submit" className="text-white">
                {t('Edit')}
                {isLoadingUser ? (
                  <Spinner animation="grow" variant="info" size="sm" className="ms-1" />
                ) : (
                  <span className={styles.placeholder} />
                )}
                {isError && editUserError}
              </Button>
            </Container>
          </ModalFooter>
        </Form>
      )}
    </>
  );
};

export default EditUserForm;
