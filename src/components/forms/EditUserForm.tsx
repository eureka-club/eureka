
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, FormEvent, useEffect, useState, FunctionComponent, useRef,SyntheticEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import LocalImageComponent from '@/src/components/LocalImage'
import CropImageFileSelect from '@/components/forms/controls/CropImageFileSelect';
import { useMutation, useQueryClient } from 'react-query';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { useSession } from 'next-auth/react';
// import TagsInputTypeAhead from './controls/TagsInputTypeAhead';
import TagsInputMaterial from '@/components/forms/controls/TagsInputMaterial';
import { Country } from '@/src/types';
import { EditUserClientPayload } from '../../types/user';
import useUser from '@/src/useUser';
// import ImageFileSelect from './controls/ImageFileSelect';
import globalModalsAtom from '../../atoms/globalModals';
import styles from './EditUserForm.module.css';
import toast from 'react-hot-toast'
// import useTopics from '../../useTopics';

dayjs.extend(utc);
const EditUserForm: FunctionComponent = () => {
  const {data:session,status} = useSession();
  const isLoadingSession = status == 'loading'
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const queryClient = useQueryClient();
  const { t } = useTranslation('profile');
  const router = useRouter();
  const [tags, setTags] = useState<string>('');
  const [photo, setPhoto] = useState<File>();
  const [showCrop, setShowCrop] = useState<boolean>(false);
  // const [user, setUser] = useState<User | undefined>();
  const [id, setId] = useState<string>('');
  const [currentImg, setCurrentImg] = useState<string | undefined>();
  const [changingPhoto, setChangingPhoto] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>();
  // const [language, setLanguage] = useState<string>();
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
    if(session)
      setId(session.user.id.toString());
  }, [session]);

  const {data:user } = useUser(+id,{
    enabled: !!+id,
    staleTime:1
  });

  useEffect(() => {
    if (user) {
      // setUser(data);
      setUserName(user.name!);
      setTags(user.tags!);
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


      // if(user.photos.length)
      //  setCurrentImg(`users-photos/${user.photos[0].storedFile}`);
      //      else
      // setCurrentImg(user.image!);

    }
  }, [user]);

  //const handlerCurrentImgChange = (e: ChangeEvent<HTMLInputElement>) => {
  //  setCurrentImg(() => e.target.value);
  //};

  const typeaheadRef = useRef<AsyncTypeahead<{ id: number; code: string; label: string }>>(null);
  const [isCountriesSearchLoading, setIsCountriesSearchLoading] = useState(false);

  const [countrySearchResults, setCountrySearchResults] = useState<{ id: number; code: string; label: string }[]>([]);
  const [countryOrigin, setCountryOrigin] = useState<string>();

  const { query,locale } = useRouter();
  const [namespace, setNamespace] = useState<Record<string, string>>();
  
  useEffect(() => {
    const fn = async () => {
      // const r = await i18nConfig.loadLocaleFrom(locale, 'countries');
      const res = await fetch('/api/taxonomy/countries')
      const {result:r} = await res.json()
       let o:Record<string, string> ={} 
      const n = (r as Country[]).reduce((p,c:Country)=>{
        p[c.code] = c.label;
        return p;
      },o)
      setNamespace(n);
    };
    fn();
  }, [locale]);

  
  const {
    mutate: execEditUser,
    error: editUserError,
    isError,
    isLoading: isLoadingUser,
    isSuccess,
  } = useMutation(
    async (payload: EditUserClientPayload) => {debugger;
  
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
      if(res.ok){
          toast.success( t('ProfileSaved'));
          if(query.next){
            router.push(decodeURIComponent(query.next.toString()!));
            return;
          }
          router.push(`/mediatheque/${id}`);
         // return res.json();
      }    
      else
      {
        toast.error(res.statusText)
        return null;
      }
   
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
          if (context) queryClient.resetQueries();
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

    const form = ev.currentTarget;debugger;
    if(form.password.value && form.password.value!=form.passwordConfirmation.value){
      toast.error('As senhas não correspondem');
      return;
    }
    const payload: EditUserClientPayload = {
      name: userName,
      email: form.email.value,
      ... form.password.value && {password: form.password.value},
     // image: form.image.value,
      countryOfOrigin: countryOrigin,
      aboutMe: form.aboutMe.value,
      ... privacySettings && {dashboardType: privacySettings},
      tags,
      ... (photo && {photo}),
      //language
    };

    setChangingPhoto(false);
    setShowCrop(false)
    await execEditUser(payload);
  };

  useEffect(() => {
    if (isSuccess === true) {
      setGlobalModalsState({ ...globalModalsState, ...{ editUserModalOpened: false } });
      queryClient.invalidateQueries(['user', id]);
      //router.replace(router.asPath);
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
    //console.log(URL.createObjectURL(photo),'photo src') 
    setPhoto(()=>photo);
    setCurrentImg(URL.createObjectURL(photo));
    setChangingPhoto(true);
    setShowCrop(false);
  };

  const closeCrop = () => {
    setShowCrop(false);
  };

  const avatarError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/img/default-avatar.png';
  };

  const renderAvatar = ()=>{
   
   if(changingPhoto)
    return <img
        onError={avatarError}
        className='avatarProfile'
        src={currentImg}
        alt=''
      />;
      else{
   if(user && user?.photos){
      if(!user?.photos.length)
        return <img
        onError={avatarError}
        className='avatarProfile'
        src={user.image||''}
        alt={user.name||''}
      />;
     return <LocalImageComponent /* className='avatarProfile' */className="rounded rounded-circle" width={160} height={160} filePath={`users-photos/${user.photos[0].storedFile}` } alt={user.name||''} />
    }
      }
  };

     return (
    <>
      {user && (
        <Form onSubmit={handleSubmit}>
           <h1 className="text-secondary fw-bold mt-sm-0 mb-2">{t('Edit Profile')}</h1>
              <Row className='d-flex flex-column'>
                <Col className='d-flex flex-column flex-md-row justify-content-center align-items-center' >
                  {renderAvatar()}
                 {!showCrop && <Button  className="btn-eureka mt-3 ms-0 mt-md-0 ms-md-3 text-white" onClick={() => setShowCrop(true)}>
                {t('Change Photo')}
               </Button>}
                </Col>
                { showCrop && (
                <Col className='d-flex justify-content-center mt-3'>
                  <div className='profile-crop border p-3'>  
                  <CropImageFileSelect onGenerateCrop={onGenerateCrop} onClose={closeCrop} cropShape='round' />
                  </div>
                </Col>
                )}
              </Row>
                { /* <Row>
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
            <Row className="mt-4 d-flex flex-column flex-md-row">
                <Col>
                  <FormGroup controlId="userName" className="mb-4">
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
                  <FormGroup controlId="email" className="mb-4">
                    <FormLabel>*{t('Email')}</FormLabel>
                    <FormControl type="email" required defaultValue={user.email || undefined} />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
              <Col>
                  <FormGroup controlId="password" className="mb-4">
                    <FormLabel>*{t('Password')}</FormLabel>
                    <FormControl type="password" defaultValue={''} />
                  </FormGroup>
                </Col><Col>
                  <FormGroup controlId="passwordConfirmation" className="mb-4">
                    <FormLabel>*{t('Password confirmation')}</FormLabel>
                    <FormControl type="password" defaultValue={''} />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup controlId="countryOfOrigin1" className="mb-4">
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
                {/* <FormControlMUI fullWidth>
                  <InputLabel id="user-language-select-label">{t('userLanguage')}</InputLabel>
                  <Select
                    labelId="user-language-select-label"
                    id="user-language-select"
                    value={language || user.language}
                    label={t('userLanguage')}
                    onChange={(args)=>{setLanguage(args.target.value!);}}
                  >
                    <MenuItem value={'spanish'}><Image width={24} height={24} className="m-0" src="/img/lang-flags/es.png" alt="Language flag 'es'"/></MenuItem>
                    <MenuItem value={'english'}><Image width={24} height={24} className="m-0" src="/img/lang-flags/en.png" alt="Language flag 'en'"/></MenuItem>
                    <MenuItem value={'french'}><Image width={24} height={24} className="m-0" src="/img/lang-flags/fr.png" alt="Language flag 'fr'"/></MenuItem>
                    <MenuItem value={'portuguese'}><Image width={24} height={24} className="m-0" src="/img/lang-flags/pt.png" alt="Language flag 'pt'"/></MenuItem>
                  </Select>
                </FormControlMUI> */}
                  {/* <Form.Group controlId="language" className="mb-5">
                    <Form.Label>{t('userLanguage')}</Form.Label>
                    <Form.Select aria-label={t('userLanguage')}>
                      <option>{t('userLanguage')}</option>
                      <option value="spanish"><img className="m-1" src="/img/lang-flags/es.png" alt="Language flag 'es'"/></option>
                      <option value="english"><img className="m-1" src="/img/lang-flags/en.png" alt="Language flag 'en'"/></option>
                      <option value="french"><img className="m-1" src="/img/lang-flags/fr.png" alt="Language flag 'fr'"/></option>
                      <option value="portuguese"><img className="m-1" src="/img/lang-flags/pt.png" alt="Language flag 'pt'"/></option>
                    </Form.Select>
                  </Form.Group> */}
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <Form.Group controlId="aboutMe" className="mb-5">
                    <Form.Label>{t('About me')}</Form.Label>
                    <Form.Control as="textarea" rows={3} defaultValue={user.aboutMe || undefined} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                 <TagsInputMaterial tags={tags} max={5} setTags={setTags} label={t('Topics')} className="mb-5"/>
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

            <Container className="mt-4 p-0 py-4 d-flex justify-content-end">
              <Button  disabled={isLoadingUser} type="submit" className="btn-eureka">
                <div>
                  {t('Edit')}
                  {isLoadingUser ? (
                    <Spinner animation="grow" variant="info" size="sm" className="ms-1" />
                  ) : (
                    <span className={styles.placeholder} />
                  )}
                  {isError && <>{`${editUserError}`}</> }
                </div>
              </Button>
            </Container>
        </Form>
      )}
    </>
  );
};

export default EditUserForm;
