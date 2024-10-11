import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { i18n, Locale } from 'i18n-config';
import { ChangeEvent, useRef, useState } from 'react';
import { Editor as EditorCmp } from '@tinymce/tinymce-react';
//import { Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { QueryClient } from 'react-query';
import CropImageFileSelect from '../../../src/components/forms/controls/CropImageFileSelect';
import {Button} from '@mui/material';

interface StateProp {
  title: string;
  text: string;
  language: Locale;
  publishedFrom?: Date;
  publishedTo?: Date;
}
interface Props {
  searchstyle?: string | '';
}
const AddSliderForm = ({ searchstyle }: Props) => {
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState<boolean>(true);
  const [file, setFile] = useState<File>();
  const [text, setText] = useState('');
  const [textLength, setTextLength] = useState(0);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const editorRef = useRef<any>(null);
  const [style, setStyle] = useState<any>(searchstyle || '');
  const [currentImg, setCurrentImg] = useState<string | undefined>();
  const { data: session, status } = useSession();
  const router = useRouter();
  const qc = new QueryClient()
  const{t}=useTranslation('common')
  const WYSWYGRef = useRef(null);
  const [showCrop, setShowCrop] = useState<boolean>(true);

  // if (status == 'unauthenticated') router.push(`/`);

  const [state, setstate] = useState<StateProp>({
    title: '',
    text: '',
    language: 'pt',
  });
  const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string) => {
    setstate((p) => ({ ...p, [`${fieldName}`]: e.target.value }));
  };

  // const renderImages = () => {
  //   if (showOptions)
  //     return (
  //       <Container className="my-4">
  //         <h6 className="my-4">
  //           <em>{'SelectImage'}</em>.
  //         </h6>
  //         <section className="d-flex flex-column flex-lg-row justify-content-around">
  //           {images.map((img, idx) => (
  //             <img
  //               width={250}
  //               key={idx}
  //               className="cursor-pointer mb-4"
  //               onClick={() => processSelect(img.src)}
  //               src={img.src}
  //             />
  //           ))}
  //         </section>
  //       </Container>
  //     );
  //   else return '';
  // };

  // const processSelect = async (src: string) => {
  //   const file = await getImg(src);
  //   setFile(file!);
  //   setstate(p=>({...p,images:[file!]}))
  //   setCurrentImg(URL.createObjectURL(file!));
  //   setShowOptions(false);
  //   // onImageSelect!(file!, text);
  // };
  // function onTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
  //   setText(e.target.value);
  // }
  // const renderSelectedPhoto = () => {
  //   if (currentImg)
  //     return (
  //       <section className="mt-4">
  //         <Button variant="primary text-white" onClick={() => setShowOptions(true)} size="sm">
  //           <BiArrowBack />
  //         </Button>
  //         <Container className="d-flex justify-content-center">
  //           <img style={{ width: '200px' }} src={currentImg} />
  //         </Container>
  //       </section>
  //     );
  // };

  function formValidation() {
    // if (session && !state.text.length) {
    //   toast.error('NoPromptText');
    //   return false;
    // }
    return true;
  }

  // async function handleSearch(e:{stopPropagation:any}) {
  //   e.stopPropagation();
  //   if (formValidation()) {
  //     await searchImages();
  //   }
  // }

  // async function searchImages() {
  //   setLoading(true);
  //   setShowOptions(true);
  //   setImages([]);
  //   const { data: en_text } = await fetch(`/api/google-translate/?text=${state.text + ', ' + style}&target=en`).then(
  //     (r) => r.json(),
  //   );

  //   const { error, data } = await fetch('/api/openai/createImage', {
  //     method: 'POST',
  //     headers: {
  //       'Content-type': 'application/json',
  //     },
  //     body: JSON.stringify({ text: en_text }),
  //   }).then((r) => r.json());
  //   if (data) {
  //     const promises = (data as { b64_json: string }[]).map((d) => {
  //       return new Promise((resolve, reject) => {
  //         const img = new Image();
  //         img.onload = function () {
  //           setImages((res) => [...res, img]);
  //           resolve(true);
  //         };
  //         img.src = `data:image/webp;base64,${d.b64_json}`;
  //       });
  //     });
  //     await Promise.all(promises);
  //   } else if (error) toast.error(error);
  //   setLoading(false);
  // }
  // function onStyleChange(e: SelectChangeEvent<HTMLTextAreaElement>) {
  //   setStyle(e.target.value as string);
  // }

  const resetForm=()=>{
    setstate({text:'',title:'',language:i18n.defaultLocale});
    setImages([]);
    setText('');
    setStyle('');
    setCurrentImg(undefined);
    setFile(undefined);
    let c = (WYSWYGRef.current! as {editor:{resetContent:()=>void}})
    c.editor.resetContent();
  }

  const handleSubmit = async (e:{preventDefault:any})=>{
    setLoading(true)
    e.preventDefault();
    if(!currentImg)toast.error('Select an image before save')
    else{
      const txt =  editorRef.current ? editorRef.current.getContent() : '';
      setstate(p=>({...p,text:txt}));
      console.log(state);
      const fd = new FormData();
      Object.entries(state).forEach(([k,v])=>{
        if(k=='images')
          fd.append(k,v[0]);
        else fd.append(k,v);
      });
      fd.set('text',txt);
      const fr = await fetch('/api/backoffice/add_edit_slider',{
        method:'POST',
        body:fd
      });
      if(fr.ok){
        const res = await fr.json();
        if(res){toast.success('done!');resetForm();}
        else toast.error('server error!');
      }
    }
    setLoading(false)
  }
  const closeCrop = () => {
    setShowCrop(false);
  };

  const openCrop = (n: number) => {
    setShowCrop(true);
  };
  const onGenerateCrop = (photo: File) => {
    setFile(() => photo);
    setCurrentImg(URL.createObjectURL(photo));
    setstate(p=>({...p,'images':[photo]}));

    setShowCrop(false);

    // const file = e.target.files[0];
            // setCurrentImg(URL.createObjectURL(file));
            // setstate(p=>({...p,'images':[file]}));
            // setFile(file);
  };
  return (
    <form >
      <FormControl fullWidth className='p-3'>
        <TextField label="Title" value={state.title} onChange={(e) => changeHandler(e, 'title')} variant="standard" />
        <FormHelperText className={`${state.title.length>=200 ? 'text-danger':''}`}>({200-state.title.length})</FormHelperText>
      </FormControl>
      <FormControl fullWidth className='p-3'>
        <label id="wyswyg-text">Text</label>
        <EditorCmp
         ref={WYSWYGRef}
          apiKey="f8fbgw9smy3mn0pzr82mcqb1y7bagq2xutg4hxuagqlprl1l"
          onInit={(_: any, editor) => {
            editorRef.current = editor;
          }}
          initialValue={state.text}
          onEditorChange={(t, editor) => {
              setTextLength(t.length);
          }}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              'advlist',
              'autolink',
              'lists',
              'link',
              'image',
              'charmap',
              'print',
              'preview',
              'anchor',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'paste',
              'code',
              'help',
              'wordcount',
              'emoticons',
            ],
            emoticons_database: 'emojiimages',
            relative_urls: false,
            forced_root_block: 'div',
            toolbar: 'undo redo | formatselect | bold italic backcolor color | insertfile | link | emoticons  | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
        />
        <FormHelperText className={`${textLength>=4000 ? 'text-danger':''}`}>({4000-textLength})</FormHelperText>
      </FormControl>

      <FormControl fullWidth className='p-3'>
        <InputLabel id="select-language">Language</InputLabel>
        <Select
          labelId="select-language"
          value={state.language}
          label="Age"
          onChange={(e) => setstate((p) => ({ ...p, language: e.target.value as Locale }))}
        >
          {i18n.locales.map((locale) => (
            <MenuItem key={locale} value={locale}>
              {locale.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {/* <Container className='py-3'>
        <Grid container>
          <Grid item xs={8}>
            <FormControl fullWidth>
              <TextField
                label={t('descriptionLabel')}
                name="text"
                variant="outlined"
                helperText={t('descriptionHelperText')}
                style={{ width: '100%' }}
                onChange={onTextChange}
                value={text}
              ></TextField>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth>
              <InputLabel id="select-style">{t('Style')}</InputLabel>
              <Select
                variant="outlined"
                labelId="select-style"
                name="style"
                id="select-style"
                label={t('Style')}
                onChange={onStyleChange}
                value={style}
              >
                <MenuItem value="None">
                  <em>{t('None')}</em>
                </MenuItem>
                <MenuItem value={'3D illustration'}>{t('3D illustration')}</MenuItem>
                <MenuItem value={'Crayon drawing'}>{t('Crayon drawing')}</MenuItem>
                <MenuItem value={'Cartoon'}>{t('Cartoon')}</MenuItem>
                <MenuItem value={'Cyberpunk'}>{t('Cyberpunk')}</MenuItem>
                <MenuItem value={'Digital art'}>{t('Digital art')}</MenuItem>
                <MenuItem value={'Geometric'}>{t('Geometric')}</MenuItem>
                <MenuItem value={'Oil painting'}>{t('Oil painting')}</MenuItem>
                <MenuItem value={'Monet style'}>{t('Monet style')}</MenuItem>
                <MenuItem value={'Pop art'}>{t('Pop art')}</MenuItem>
                <MenuItem value={'Psychedelic'}>{t('Psychedelic')}</MenuItem>
                <MenuItem value={'Realistic photograph'}>{t('Realistic photograph')}</MenuItem>
                <MenuItem value={'Salvador Dali style'}>{t('Salvador Dali style')}</MenuItem>
                <MenuItem value={'Surrealism'}>{t('Surrealism')}</MenuItem>
                <MenuItem value={'Tim Burton style'}>{t('Tim Burton style')}</MenuItem>
                <MenuItem value={'Ukiyo-e'}>{t('Ukiyo-e')}</MenuItem>
                <MenuItem value={'Van Gogh style'}>{t('Van Gogh style')}</MenuItem>
                <MenuItem value={'Vintage'}>{t('Vintage')}</MenuItem>
                <MenuItem value={'Vintage'}>{t('Vintage')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2} className='p-1'>
              <Button
                className='text-white'
                onClick={handleSearch}
                disabled={loading}
                size='lg'
              >
              <CheckCircleOutline/>
            </Button>
          </Grid>
        </Grid>
      {!loading ? <>{images.length > 0 && renderImages()}</> : <LinearProgressMUI />}
      {!showOptions && renderSelectedPhoto()}
      </Container> */}
      {/* <FormControl>
        <label>Pick an IMG</label>
        <input type="file" 
        onChange={(e)=>{
          if(e.target?.files){
            const file = e.target.files[0];
            setCurrentImg(URL.createObjectURL(file));
            setstate(p=>({...p,'images':[file]}));
            setFile(file);
          }
        }}/>
      </FormControl> */}
      <Grid container>
          <Grid item>
          {showCrop && (
                    <div className="d-flex">
                      <div className="w-100 border p-3">
                        <CropImageFileSelect
                          onGenerateCrop={onGenerateCrop}
                          onClose={() => closeCrop()}
                          cropShape="rect"
                          width={352}
                          height={320}
                        />
                      </div>
                    </div>
                  )}
          </Grid>
          <Grid item>
          {
          currentImg 
            ? <img style={{ width: '200px' }} src={currentImg} onClick={()=>{
                setShowCrop(true);
                setCurrentImg(undefined);
                setFile(undefined)}
              } />
            :<></>
        }
          </Grid>
        </Grid>
      <div className='d-flex justify-content-center'>
        <Button disabled={!currentImg || loading || editorRef.current.getContent().length>=4000} onClick={handleSubmit}  variant='contained' color='primary' size="large">Save</Button>
      </div>
    </form>
  );
};
export default AddSliderForm;
