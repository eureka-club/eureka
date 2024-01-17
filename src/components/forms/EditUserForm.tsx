
import { useAtom } from 'jotai';
import { usePathname, useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

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
import { useMutation, useQueryClient } from '@tanstack/react-query';;
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { useSession } from 'next-auth/react';
// import TagsInputTypeAhead from './controls/TagsInputTypeAhead';
import { User } from '@prisma/client';
import TagsInputMaterial from '@/components/forms/controls/TagsInputMaterial';
import { Country } from '@/src/types';
import { EditUserClientPayload } from '../../types/user';
import useUser from '@/src/useUser';
// import ImageFileSelect from './controls/ImageFileSelect';
import globalModalsAtom from '../../atoms/globalModals';
import styles from './EditUserForm.module.css';
import toast from 'react-hot-toast'
import i18nConfig from '../../../i18n';
import Toast from '../common/Toast';
import { Select, FormControl as FormControlMUI, InputLabel, MenuItem } from '@mui/material';
import Image from 'next/image';
import { getLocale_In_NextPages } from '@/src/lib/utils';
import { useDictContext } from '@/src/hooks/useDictContext';
import { Option } from 'react-bootstrap-typeahead/types/types';
// import useTopics from '../../useTopics';

dayjs.extend(utc);
const EditUserForm: FunctionComponent = () => {
  const {data:session,status} = useSession();
  const isLoadingSession = status == 'loading'
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const queryClient = useQueryClient();
  // const { t } = useTranslation('profile');
  const{t,dict}=useDictContext();
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

  const typeaheadRef = useRef(null);
  const [isCountriesSearchLoading, setIsCountriesSearchLoading] = useState(false);

  const [countrySearchResults, setCountrySearchResults] = useState<{ id: number; code: string; label: string }[]>([]);
  const [countryOrigin, setCountryOrigin] = useState<string>();

  const asPath=usePathname()!
  const locale=getLocale_In_NextPages(asPath);
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
    isPending: isLoadingUser,
    isSuccess,
  } = useMutation(
    {
      mutationFn:async (payload: EditUserClientPayload) => {
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
            toast.success( t(dict,'ProfileSaved'))
            router.push(`/mediatheque/${id}`);
           // return res.json();
        }    
        else
        {
          toast.error(res.statusText)
          return null;
        }
     
      },
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
  //       setPublicationLengthLabel(`${t(dict,'Length')} (${t(dict,'pages')})`);
  //       break;
  //     case 'movie':
  //     case 'documentary':
  //       setPublicationYearLabel(t(dict,'releaseYearFieldLabel'));
  //       setPublicationLengthLabel(`${t(dict,'Duration')} (${t(dict,'minutes')})`);
  //       break;

  //     default:
  //       setPublicationYearLabel(t(dict,'publicationYearFieldLabel'));
  //       setPublicationLengthLabel(`${t(dict,'Length')} | ${t(dict,'Duration')}`);
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
      queryClient.invalidateQueries({queryKey:['user', id]});
      //router.replace(router.asPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const handleSearchCountry = async (query: string) => {
    setIsCountriesSearchLoading(true);
    const response = await fetch(`/api/taxonomy/countries?q=${query}`);
    const itemsSC: { id: number; code: string; label: string }[] = (await response.json()).result;
    itemsSC.forEach((i, idx: number) => {
      itemsSC[idx] = { ...i, label: `${t(dict,`countries:${i.code}`)}` };
    });
    setCountrySearchResults(itemsSC);
    setIsCountriesSearchLoading(false);
  };

  const handleSearchCountrySelect = (selected: Option[]): void => {
    if (selected[0] != null) {
      setCountryOrigin((selected[0] as {code:string}).code);
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
           <h1 className="text-secondary fw-bold mt-sm-0 mb-2">{t(dict,'Edit Profile')}</h1>
              <Row className='d-flex flex-column'>
                <Col className='d-flex flex-column flex-md-row justify-content-center align-items-center' >
                  {renderAvatar()}
                 {!showCrop && <Button  className="btn-eureka mt-3 ms-0 mt-md-0 ms-md-3 text-white" onClick={() => setShowCrop(true)}>
                {t(dict,'Change Photo')}
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
                      *{t(dict,'Image')}
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
                    <FormLabel>*{t(dict,'Name')}</FormLabel>
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
                    <FormLabel>*{t(dict,'Email')}</FormLabel>
                    <FormControl type="email" required defaultValue={user.email || undefined} />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup controlId="countryOfOrigin1" className="mb-4">
                    <FormLabel>{t(dict,'countryFieldLabel')}</FormLabel>
                    <AsyncTypeahead
                      id="create-work--search-country"
                      // Bypass client-side filtering. Results are already filtered by the search endpoint
                      filterBy={() => true}
                      // inputProps={{ required: true }}
                      // placeholder={t(dict,'addWrkTypeaheadPlaceholder')}
                      ref={typeaheadRef}
                      isLoading={isCountriesSearchLoading}
                      labelKey={(res) => `${(res as {label:string}).label}`}
                      minLength={2}
                      onSearch={handleSearchCountry}
                      options={countrySearchResults}
                      onChange={handleSearchCountrySelect}
                      placeholder={namespace && user.countryOfOrigin ? namespace[user.countryOfOrigin] : ''}
                      // renderMenuItemChildren={(work) => <WorkTypeaheadSearchItem work={work} />}
                    />
                    {/* {!countryOrigin2 && !hasCountryOrigin2 && (
                    <Button className={styles.toogleSecondOriginCountry} onClick={() => toogleCountryOrigin2Handler()}>
                      {t(dict,'Add a second origin country')}
                    </Button>
                  )} */}
                  </FormGroup>
                </Col>
                {/* {(countryOrigin2 || hasCountryOrigin2) && (
                <Col>
                  <FormGroup controlId="countryOfOrigin2">
                    <FormLabel>{t(dict,'countryFieldLabel')} 2</FormLabel>
                    <AsyncTypeahead
                      id="create-work--search-country2"
                      // Bypass client-side filtering. Results are already filtered by the search endpoint
                      filterBy={() => true}
                      // inputProps={{ required: true }}
                      // placeholder={t(dict,'addWrkTypeaheadPlaceholder')}
                      // ref={typeaheadRef}
                      isPending={isCountriesSearchLoading2}
                      labelKey={(res) => `${res.label}`}
                      minLength={2}
                      onSearch={handleSearchCountry2}
                      options={countrySearchResults}
                      onChange={handleSearchCountry2Select}
                      placeholder={namespace && countryOrigin2 ? namespace[countryOrigin2] : ''}
                      // renderMenuItemChildren={(work) => <WorkTypeaheadSearchItem work={work} />}
                    />
                    <Button className={styles.toogleSecondOriginCountry} onClick={() => toogleCountryOrigin2Handler(2)}>
                      {t(dict,'Remove the second origin country')}
                    </Button>
                  </FormGroup>
                </Col>
              )} */}
              </Row>
              <Row>
                <Col xs={12}>
                {/* <FormControlMUI fullWidth>
                  <InputLabel id="user-language-select-label">{t(dict,'userLanguage')}</InputLabel>
                  <Select
                    labelId="user-language-select-label"
                    id="user-language-select"
                    value={language || user.language}
                    label={t(dict,'userLanguage')}
                    onChange={(args)=>{setLanguage(args.target.value!);}}
                  >
                    <MenuItem value={'spanish'}><Image width={24} height={24} className="m-0" src="/img/lang-flags/es.png" alt="Language flag 'es'"/></MenuItem>
                    <MenuItem value={'english'}><Image width={24} height={24} className="m-0" src="/img/lang-flags/en.png" alt="Language flag 'en'"/></MenuItem>
                    <MenuItem value={'french'}><Image width={24} height={24} className="m-0" src="/img/lang-flags/fr.png" alt="Language flag 'fr'"/></MenuItem>
                    <MenuItem value={'portuguese'}><Image width={24} height={24} className="m-0" src="/img/lang-flags/pt.png" alt="Language flag 'pt'"/></MenuItem>
                  </Select>
                </FormControlMUI> */}
                  {/* <Form.Group controlId="language" className="mb-5">
                    <Form.Label>{t(dict,'userLanguage')}</Form.Label>
                    <Form.Select aria-label={t(dict,'userLanguage')}>
                      <option>{t(dict,'userLanguage')}</option>
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
                    <Form.Label>{t(dict,'About me')}</Form.Label>
                    <Form.Control as="textarea" rows={3} defaultValue={user.aboutMe || undefined} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                 <TagsInputMaterial tags={tags} max={5} setTags={setTags} label={t(dict,'Topics')} className="mb-5"/>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="privacySettings" className={styles.privacySettings}>
                    <Form.Label className="d-flex flex-column">{t(dict,'Privacy settings')}</Form.Label>
                    <Form.Text>{t(dict,'mediathequeInfo')}.</Form.Text>
                    <Form.Check type="radio" id="dashboardTypePublic" className={styles.checkPublic}>
                      <Form.Check.Input
                        type="radio"
                        isValid
                        onChange={() => handlerDashboardTypeRadioChange('public')}
                        checked={dashboardTypeChecked.public}
                      />
                      <Form.Check.Label className="ms-2">{t(dict,'My Mediatheque is public')}</Form.Check.Label>
                      <Form.Control.Feedback type="valid" className="ms-4">{t(dict,'Anyone can see my Mediatheque')}</Form.Control.Feedback>
                    </Form.Check>

                    <Form.Check className={styles.checkProtected} type="radio" id="dashboardTypeProtected">
                      <Form.Check.Input
                        type="radio"
                        isValid
                        onChange={() => handlerDashboardTypeRadioChange('protected')}
                        checked={dashboardTypeChecked.protected}
                      />
                      <Form.Check.Label className="ms-2">{t(dict,'Fallowers can see my Dashboard')}</Form.Check.Label>
                      <Form.Control.Feedback type="valid" className="ms-4">
                        {t(dict,'Users I fallow or that follow me can see my Dashboard')}
                      </Form.Control.Feedback>
                    </Form.Check>

                    <Form.Check type="radio" id="dashboardTypePrivate" className={styles.checkPrivate}>
                      <Form.Check.Input
                        type="radio"
                        isValid
                        onChange={() => handlerDashboardTypeRadioChange('private')}
                        checked={dashboardTypeChecked.private}
                      />
                      <Form.Check.Label className="ms-2">{t(dict,'My Dashboard is secret')}</Form.Check.Label>
                      <Form.Control.Feedback type="valid" className="ms-4">{t(dict,'Only I can see my Dashboard')}</Form.Control.Feedback>
                    </Form.Check>
                  </Form.Group>
                </Col>
              </Row>

            <Container className="mt-4 p-0 py-4 d-flex justify-content-end">
              <Button  disabled={isLoadingUser} type="submit" className="btn-eureka">
                <>
                  {t(dict,'Edit')}
                  {isLoadingUser ? (
                    <Spinner animation="grow" variant="info" size="sm" className="ms-1" />
                  ) : (
                    <span className={styles.placeholder} />
                  )}
                  {isError && editUserError}
                </>
              </Button>
            </Container>
        </Form>
      )}
    </>
  );
};

export default EditUserForm;
