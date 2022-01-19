import React,{useState, useEffect, useRef} from 'react'
// import Image from 'next/dist/client/image';
import { Container, Form, Button } from 'react-bootstrap';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {image64toCanvasRef} from '@/src/lib/utils'
import {v4} from 'uuid'

interface Props{
  src?:string;
  x?:number;
  y?:number;
  width?: number;
  height?: number;
  onGenerateCrop: (file:File) => void;
}
const CropImageFileSelect: React.FC<Props> = ({onGenerateCrop,src='',x=0,y=0,width=80,height=80}) => {
  const [crop, setCrop] = useState<Crop>({
    unit:'px',
    x,
    y,
    width,
    height,
    /*  aspect: 16 / 9  */});
    
    const [blobSRC,setBlobSRC] = useState<string>();
  const [SRC,setSRC] = useState<string>(src);
  const [srcCroped,setSRCCroped] = useState<string|ArrayBuffer>();
  const [IMGInfo,setIMGInfo] = useState<Record<string,any>>({});
  const canvaRef = useRef<HTMLCanvasElement>(null);
  const cropRef = useRef<any>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(()=>{
    console.log('changed',blobSRC)
  },[blobSRC])

  const onComplete = async (crop:Crop) => {
    setCrop({...crop});
    if(cropRef){
      const componentRef = cropRef.current.componentRef;
      const height = componentRef.current.clientHeight;
      const width = componentRef.current.clientWidth;
      const canvas = canvaRef.current!;
      const file = await image64toCanvasRef(canvas,srcCroped!,crop,{width,height});
      onGenerateCrop(file);
      
      

      // canvas.toBlob((blob) => {
      //   if(blob){
      //     const s = URL.createObjectURL(blob);
      //     imageRef.current?.addEventListener('load',()=>{
      //       URL.revokeObjectURL(s);
      //     })
      //     setBlobSRC(()=>s);
      //     let file = new File([blob], `${v4()}.png`, { type: "image/png" })
      //     onGenerateCrop(file);
      //   }
     
      // }, 'image/jpeg');
    }
  }

  const onImageLoaded = (img:HTMLImageElement) => {
    
  };

  const onChangeImage = (e:React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.currentTarget.files)
    const files = e.currentTarget.files;
    if(files?.length){
      const file = files[0];console.log(file)
      const fileReader = new FileReader()
      setSRC(()=>URL.createObjectURL(file));
      fileReader.addEventListener('load',()=>{
        URL.revokeObjectURL(src);
        if(fileReader.result){
          // console.log(fileReader.result)
          setSRCCroped(fileReader.result)
        }
      });
      fileReader.readAsDataURL(file);
      
    }
  };

  const renderForm = () => {
    return <>
    <Form.Group className="mb-3" controlId="image">
      <Form.Label>Image</Form.Label>
      <Form.Control type="file" placeholder="Load an image" onChange={onChangeImage} />
      <Form.Text className="text-muted">
       From your computer
      </Form.Text>
    </Form.Group>
    <ReactCrop 
    ref={cropRef}
    locked
    src={SRC} 
    crop={crop} 
    onChange={newCrop => setCrop(newCrop)} 
    onComplete={onComplete}
    onImageLoaded={onImageLoaded}
    />    
    </>
  };
  return <>
  {renderForm()}
     {/* <img className="border border-primary" src={blobSRC} ref={imageRef} width={width} height={height}  alt="temp-img"/> */}
    <canvas ref={canvaRef} width={width} height={height}/>
    
  </>

};
export default CropImageFileSelect; 