
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent,FormEvent,ChangeEvent,useState,useEffect,MouseEvent} from 'react';
import {Container,Button,Spinner} from 'react-bootstrap';
import { SelectChangeEvent,TextField,FormControl,InputLabel, Select, MenuItem,LinearProgress} from '@mui/material';
import { useRouter } from 'next/router';
import styles from './PostPrompt.module.css';
import {getImg} from '@/src/lib/utils';
import { BiArrowBack } from 'react-icons/bi';


interface Props {
  onImageSelect?: (file:File) => void;
  redirect?: boolean;
  searchtext?:string | "";
  searchstyle?:string | ""
}

const PostPrompt: FunctionComponent<Props> = ({onImageSelect,redirect = false,searchtext,searchstyle}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [text,setText] = useState<any>(searchtext || "");
  const [style,setStyle] = useState<any>(searchstyle || "")
  const [loading,setLoading] = useState(false)
  const [images,setImages] = useState<HTMLImageElement[]>([])
  const [file, setFile] = useState<File>();
  const [currentImg, setCurrentImg] = useState<string | undefined>();
  const [progress, setProgress] = useState(0);
  const [showOptions, setShowOptions] = useState<boolean>(true);


    useEffect(() => {
      const fetchImages = async () => {
                await searchImages();              
            }
      if(text && text.length)
      fetchImages()                    
  },[])

  useEffect(() => {
       const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);



  function onStyleChange(e:SelectChangeEvent<HTMLTextAreaElement>){
    setStyle(e.target.value as string)
  }

  function onTextChange(e:ChangeEvent<HTMLTextAreaElement>){
    setText(e.target.value)
  }

  async function handleSearch(e:MouseEvent<HTMLButtonElement>){
    e.stopPropagation()
    if(redirect)
      router.push(`/post/create?searchtext=${text}&searchstyle=${style}`)
    else
      await searchImages();    
   }

  async function searchImages(){
    setLoading(true)
    setShowOptions(true)
    setProgress(0)
    setImages([])
    //console.log(text + ", " + style,'TEXTO BUSQUEDA')  
    const {data:en_text} = await fetch(`/api/google-translate/?text=${text + ", " + style}&target=en`)
    .then(r=>r.json())

    const {data:{data}} =  await fetch('/api/openai/createImage',{
      method:'POST',
      headers:{
          'Content-type':'application/json'
      },
      body:JSON.stringify({text:en_text})
    }).then(r=>r.json()) 

    const promises = (data as {b64_json:string}[]).map(d=>{
      return new Promise((resolve,reject)=>{
        const img = new Image()
        img.onload = function(){
          setImages(res=>[...res,img])
          resolve(true)
        }
        img.src = `data:image/webp;base64,${d.b64_json}`
      })
    })
    await Promise.all(promises)
    setLoading(false)
  }

  const renderImages = ()=>{
    if(showOptions)
        return <Container className="my-4"  >
          <h6 className='my-4'>
            <em>Selecciona la imagen que más te gusta. Si ninguna te convence, ajusta tu prompt y genera otras!</em>.
          </h6>
        <section  className='d-flex flex-row justify-content-around'>
                {images.map((img,idx)=><img key={idx} className='cursor-pointer' onClick={()=> processSelect(img.src)}  src={img.src}/>)}
        </section> 
        </Container>
     else
        return ""   
  }

   const processSelect = async (src:string) => {
     const  file = await getImg(src)
     setFile(file!) ;
     setCurrentImg(URL.createObjectURL(file!));
     setShowOptions(false)
     onImageSelect!(file!)
    }

   const renderSelectedPhoto = ()=>{
   if(currentImg)
    return <section className='mt-4'>
            <Button  variant="primary text-white" onClick={() => setShowOptions(true)} size="sm">
              <BiArrowBack />
            </Button>
            <Container className="d-flex justify-content-center">
                <img className={styles.selectedPhoto} src={currentImg} />
           </Container>
           </section>
  };

  return <> <Container className= {`w-100 ${styles.container}`}>
      {redirect && <h4 className='text-secondary text-center'>¡Crea un Momento Eureka para resumir una obra que te impactó con una imagen!</h4>}
      {!redirect && <h6 className='my-3 text-center'><em>Escribe una descripción de la imagen q quieres generar + selecciona en que estilo</em>.</h6>}
       <section className='mt-3 mx-3' >
       <form className='d-flex flex-row justify-content-center'>
         <TextField  label="Describe la imagen que quieres generar" required name="text"
          variant="outlined" helperText="Agrega el máximo de detalles posible." style={{width:'60%'}}
          onChange={onTextChange}
          value={text}>
          </TextField>
           <FormControl className='ms-2 me-2 my-0' sx={{ m: 1, minWidth: 120 }} style={{width:'15%'}}>
               <InputLabel id="select-style">Style</InputLabel>
              <Select variant="outlined"
                labelId="select-style"
                name="style"
                id="select-style"
                label="Style"
                onChange={onStyleChange}
                value={style}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value={'Digital Art'}>Digital Art</MenuItem>
                <MenuItem value={'Oil painting'}>Oil painting</MenuItem>
                <MenuItem value={'Van Gogh'}>Van Gogh</MenuItem>
              </Select>
            </FormControl>
           <Button className={`btn-eureka`} onClick={handleSearch} disabled={loading} style={{width:'20%',height:"3.5em"}}>
              Crear Imagen con IA
           </Button>
       </form>          
       </section>
   </Container>  
     { !loading  ? <>{(images.length > 0) && renderImages()}</>:<LinearProgress variant="determinate" value={progress} />}
     {!showOptions && renderSelectedPhoto()}
   </>
  
};

export default PostPrompt;
