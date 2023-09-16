
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
import FormGroup from 'react-bootstrap/FormGroup';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import LocalImageComponent from '@/src/components/LocalImage'
import CropImageFileSelect from '@/components/forms/controls/CropImageFileSelect';
import { useMutation, useQueryClient } from 'react-query';
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
import { TextField, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup, InputLabel, MenuItem } from '@mui/material';
import Textarea from '@mui/joy/Textarea';
import TagsInputTypeAheadMaterial from '@/components/forms/controls/TagsInputTypeAheadMaterial';
import useCountries from 'src/useCountries';
import LanguageSelectMultiple from './controls/LanguageSelectMultiple';

import Image from 'next/image';
// import useTopics from '../../useTopics';

interface FormValues {
  name: string;
  email: string;
  languages: string[],
  aboutMe:string,
}

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
  //const [userName, setUserName] = useState<string>();
  //const [items, setItems] = useState<string[]>([]);  //topics

  // const [language, setLanguage] = useState<string>();
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    email: '',
    languages: [],
    aboutMe: ''
  });
  const [countrySearchResults, setCountrySearchResults] = useState<{ code: string; label: string }[]>([]);
  const [countryOrigin, setCountryOrigin] = useState<string[]>([]);
  const { data: countries } = useCountries();
  useEffect(() => {
    if (countries) setCountrySearchResults(countries.map((d: Country) => ({ code: d.code, label: d.code })))
  }, [countries])


  const [privacySettings, setPrivacySettings] = useState<number>(1);
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
  }, [session])

  const {data:user } = useUser(+id,{
    enabled: !!+id,
    staleTime:1
  });

  useEffect(() => {
    if (user) {
      console.log(user)
      let formValues = {
        name: user.name!,
        email: user.email!,
        languages: user.language!.split(","),
        aboutMe: user.aboutMe!
      }
      setFormValues(formValues);
      // setUser(data);
      setCountryOrigin(user.countryOfOrigin!.split(","))
      //setUserName(user.name!);
      setTags(user.tags!);
      setPrivacySettings(user.dashboardType!);

     /* setDashboardTypeChecked((res) => {
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
      });*/


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
  
 

  const { locale } = useRouter();
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
      if(res.ok){
          toast.success( t('ProfileSaved'))
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

  const validateEmail = (text: string) => {
    const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

    if (!text.match(emailRegex)) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!validateEmail(formValues.email)) {
      toast.error(t('InvalidMail'));
      return false;
    }

    const payload: EditUserClientPayload = {
      name: formValues.name.slice(0, 30),
      email: formValues.email,
      countryOfOrigin: countryOrigin.join(",") || null,
      aboutMe: formValues.aboutMe,
      language: formValues.languages.join(","),
      dashboardType: privacySettings,
      //... privacySettings && {dashboardType: privacySettings},
      tags,
      ... (photo && {photo}),
    };
    //console.log(payload)
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

  /*const handleSearchCountry = async (query: string) => {
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
  };*/

  const handlerDashboardTypeRadioChange = (ev: ChangeEvent<HTMLInputElement>) => {
    ev.preventDefault();
    /*setDashboardTypeChecked(() => ({
      private: false,
      protected: false,
      public: false,
    }));*/
    setPrivacySettings(parseInt(ev.target.value));

   /* 
    setPrivacySettings(() => {
      return { public: 1, protected: 2, private: 3 }[`${ev.target.value}` as number;
    });
   setDashboardTypeChecked((res) => ({ ...res, [`${val}`]: true }));*/
  };

  /*const onChangeUserName = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.currentTarget.value.slice(0, 30));
  };*/

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

  function handleChangeTextField(ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    ev.preventDefault();
    const { name, value } = ev.target;
    //console.log(name, value, 'name, value')
    setFormValues({
      ...formValues,
      [name]: value
    });
  }

  const onSelectLanguage = (language: string[]) => {
    setFormValues({
      ...formValues,
      ['languages']: language
    });
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
                 {!showCrop && <Button className="btn-eureka mt-3 ms-0 mt-md-0 ms-md-3 text-white" onClick={() => setShowCrop(true)}>
                   {t('Change Photo')}
                 </Button>}
               </Col>
               {showCrop && (
                 <Col className='d-flex justify-content-center mt-3'>
                   <div className='profile-crop border p-3'>
                     <CropImageFileSelect onGenerateCrop={onGenerateCrop} onClose={closeCrop} cropShape='round' />
                   </div>
                 </Col>
               )}
             </Row>
             
             <Row className="mt-4 d-flex flex-column flex-md-row">
               <Col>
                 <TextField id="name" className="w-100 mt-5" label={`*${t('Name')}`}
                   variant="outlined" size="small" name="name"
                   value={formValues.name!}
                   type="text"
                   onChange={handleChangeTextField}
                 >
                 </TextField>
                 
               </Col>
               <Col>
                 <TextField id="email" className="w-100 mt-5" label={`*${t('Email')}`}
                   variant="outlined" size="small" name="email"
                   value={formValues.email!}
                   type="text"
                   onChange={handleChangeTextField}
                 >
                 </TextField>
               </Col>
             </Row>
             <Row className="d-flex flex-column flex-md-row">
               <Col className='mt-5'>
                 <FormGroup controlId="countryOrigin" >
                   <TagsInputTypeAheadMaterial
                     data={countrySearchResults}
                     items={countryOrigin}
                     setItems={setCountryOrigin}
                     formatValue={(v: string) => t(`countries:${v}`)}
                     max={1}
                     label={`${t('countryFieldLabel')}`}
                   //placeholder={`${t('Type to add tag')}...`}
                   />
                 </FormGroup>
               </Col>
               <Col className='mt-5'>
                 <LanguageSelectMultiple onSelectLanguage={onSelectLanguage} defaultValue={formValues.languages} label={t('userLanguage')}/>
               </Col>
             </Row>
             <Row className="mt-5">
               <Col>
                 <TagsInputMaterial tags={tags} max={5} setTags={setTags} label={t('Topics')} className="mb-5" />
               </Col>
             </Row>
             <Row className="mt-4">
                 <Col className="">
                   <FormGroup controlId="aboutMe">
                     <FormLabel>{t('About me')}</FormLabel>
                     <Textarea minRows={3} name="aboutMe" value={formValues.aboutMe!} onChange={handleChangeTextField} />
                   </FormGroup>
                 </Col>
               </Row>
               <Row className='mt-5'>
             <FormControl>
                 <FormLabel id="privacy-settings-label-placement">{t('Privacy settings')}</FormLabel>
                 <Form.Text>{t('mediathequeInfo')}.</Form.Text>
                 <RadioGroup
                   aria-labelledby="privacy-settings-radio-buttons-group"
                   defaultValue={1}
                   name="privacySettings"
                   value={privacySettings}
                   onChange={handlerDashboardTypeRadioChange}
                 >
                   <FormControlLabel value={1} control={<Radio />} label={t('My Mediatheque is public')}  />
                   <Form.Text className="ms-4">{t('Anyone can see my Mediatheque')}.</Form.Text>
                   <FormControlLabel value={2} control={<Radio />} label={t('Fallowers can see my Dashboard')} />
                   <Form.Text className="ms-4"> {t('Fallowers can see my Dashboard')}.</Form.Text>
                   <FormControlLabel value={3} control={<Radio />} label={t('My Dashboard is secret')} />
                   <Form.Text className="ms-4">{t('Only I can see my Dashboard')}.</Form.Text>
                 </RadioGroup>
             </FormControl>
             </Row>

             <Container className="mt-4 p-0 py-4 d-flex justify-content-end">
               <Button disabled={isLoadingUser} type="submit" className="btn-eureka">
                 <>
                   {t('Edit')}
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
