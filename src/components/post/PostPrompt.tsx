import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, FormEvent, ChangeEvent, useState, useEffect, MouseEvent } from 'react';
import { Container, Button, Spinner } from 'react-bootstrap';
import LinearProgressMUI from '@/components/common/LinearProgressMUI'
import { SelectChangeEvent, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import styles from './PostPrompt.module.css';
import { getImg } from '@/src/lib/utils';
import { BiArrowBack } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useModalContext } from '@/src/useModal';
import SignInForm from '../forms/SignInForm';
interface Props {
  onImageSelect?: (file: File, text: string) => void;
  showTitle?:boolean;
  redirect?: boolean;
  searchtext?: string | '';
  searchstyle?: string | '';
  margin?: boolean;
}

const PostPrompt: FunctionComponent<Props> = ({
  onImageSelect,
  showTitle = false,
  redirect = false,
  searchtext,
  searchstyle,
  margin = true,
}) => {
  const { t } = useTranslation('createPostForm');
  const router = useRouter();
  const [text, setText] = useState<any>(searchtext || '');
  const [style, setStyle] = useState<any>(searchstyle || '');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [file, setFile] = useState<File>();
  const [currentImg, setCurrentImg] = useState<string | undefined>();
  const [showOptions, setShowOptions] = useState<boolean>(true);
  const { data: session, status } = useSession();
  const { show } = useModalContext();

  useEffect(() => {
    const fetchImages = async () => {
      await searchImages();
    };
    if (text && text.length) fetchImages();
  },[]);

  

  function onStyleChange(e: SelectChangeEvent<HTMLTextAreaElement>) {
    setStyle(e.target.value as string);
  }

  function onTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
  }

  function formValidation() {
    if (session && !text.length) {
      toast.error(t('NoPromptText'));
      return false;
    }
    return true;
  }

  async function handleSearch(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
     if (!session){ 
        show(<SignInForm/>)
        return null;
     }
    if (formValidation()) {
      if (redirect) router.push(`/post/create?searchtext=${text}&searchstyle=${style}`);
      else await searchImages();
    }
  }

  async function searchImages() {
    setLoading(true);
    setShowOptions(true);
    setImages([]);

    const { data: en_text } = await fetch(`/api/google-translate/?text=${text + ', ' + style}&target=en`).then((r) =>
      r.json(),
    );

    const { error, data } = await fetch('/api/openai/createImage', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ text: en_text }),
    }).then((r) => r.json());

    if (data) {
      const promises = (data as { b64_json: string }[]).map((d) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = function () {
            setImages((res) => [...res, img]);
            resolve(true);
          };
          img.src = `data:image/webp;base64,${d.b64_json}`;
        });
      });
      await Promise.all(promises);
    } else if (error) toast.error(error);
    setLoading(false);
  }

  const renderImages = () => {
    if (showOptions)
      return (
        <Container className="my-4">
          <h6 className="my-4">
            <em>{t('SelectImage')}</em>.
          </h6>
          <section className="d-flex flex-column flex-lg-row justify-content-around">
            {images.map((img, idx) => (
              <img key={idx} className="cursor-pointer mb-4" onClick={() => processSelect(img.src)} src={img.src} />
            ))}
          </section>
        </Container>
      );
    else return '';
  };

  const processSelect = async (src: string) => {
    const file = await getImg(src);
    setFile(file!);
    setCurrentImg(URL.createObjectURL(file!));
    setShowOptions(false);
    onImageSelect!(file!, text);
  };

  const renderSelectedPhoto = () => {
    if (currentImg)
      return (
        <section className="mt-4">
          <Button variant="primary text-white" onClick={() => setShowOptions(true)} size="sm">
            <BiArrowBack />
          </Button>
          <Container className="d-flex justify-content-center">
            <img className={styles.selectedPhoto} src={currentImg} />
          </Container>
        </section>
      );
  };

  return (
    <>
      {' '}
      <Container className={`w-100 ${styles.container} ${!margin ? 'p-0 m-0' : ''}`}>
        {showTitle && <h4 className="text-secondary text-center">{t('CreateEureka')}</h4>}
        <section className={`mt-3 mx-0 ${margin ? 'mx-lg-3' : ''} `}>
          <form className="d-none d-lg-flex flex-row justify-content-center">
            <TextField
              label={t('descriptionLabel')}
              name="text"
              variant="outlined"
              helperText={t('descriptionHelperText')}
              style={{ width: '60%' }}
              onChange={onTextChange}
              value={text}
            ></TextField>
            <FormControl className="ms-2 me-2 my-0" sx={{ minWidth: 120 }} style={{ width: '20%' }}>
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
              </Select>
            </FormControl>
            <Button
              className={`btn-eureka`}
              onClick={handleSearch}
              disabled={loading}
              style={{ width: '20%', height: '3.5em' }}
            >
              {t('CreateImage')}
            </Button>
          </form>
          <form className="d-flex d-lg-none flex-column justify-content-center">
            <TextField
              className="mt-3"
              label={t('descriptionLabel')}
              name="text"
              variant="outlined"
              helperText={t('descriptionHelperText')}
              style={{ width: '100%' }}
              onChange={onTextChange}
              value={text}
            ></TextField>
            <FormControl className="mt-4 mb-4" sx={{ minWidth: 120 }} style={{ width: '100%' }}>
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
            <Button
              className={`btn-eureka mt-1`}
              onClick={handleSearch}
              disabled={loading}
              style={{ width: '100%', height: '3.5em' }}
            >
              {t('CreateImage')}
            </Button>
          </form>
        </section>
      </Container>
      {!loading ? (
        <>{images.length > 0 && renderImages()}</>
      ) : ( <LinearProgressMUI/>
      )}
      {!showOptions && renderSelectedPhoto()}
    </>
  );
};

export default PostPrompt;
