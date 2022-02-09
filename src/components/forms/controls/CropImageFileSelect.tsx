import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import { Container, Form, Button } from 'react-bootstrap';
import {image64toCanvasRef,getCroppedImg} from '@/src/lib/utils'
import useTranslation from 'next-translate/useTranslation';

interface Props{
  onGenerateCrop: (file:File) => void;
}
const CropImageFileSelect: React.FC<Props> = ({onGenerateCrop}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [imageSrc, setImageSrc] = useState<string>('');
  const [file, setFile] = useState<File>();
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
  const [croppedImage, setCroppedImage] = useState<Area>();
  const { t } = useTranslation('common');
  
  const onCropComplete = async (croppedArea: Area, croppedAreaPixels: Area) => {
         setCroppedAreaPixels(croppedAreaPixels);
         const  file = await getCroppedImg(imageSrc,croppedAreaPixels)
         setFile(file!) ;
         /*if(file)
          onGenerateCrop(file);*/
    }


const onFileChange = async  (e:React.ChangeEvent<HTMLInputElement>)  => {
  const files = e.currentTarget.files;
    if(files?.length){
      const file = files[0];
      const fileReader = new FileReader()
      setImageSrc(()=>URL.createObjectURL(file));
    }
  }

  return (
    <>
     <Form.Group className="mb-3" controlId="image">
      <Form.Label>Image</Form.Label>
      <Form.Control type="file" placeholder="Load an image" onChange={onFileChange} />
      <Form.Text className="text-muted">
       From your computer
      </Form.Text>
    </Form.Group>
 {imageSrc.length ? <>
    <div className="crop-container mb-2">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          //cropSize={{ width: 100, height: 100 }}
          aspect={2 / 2}
          cropShape	='round'
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="crop-controls mt-3 d-flex justify-content-center align-items-start">
        <>
          <Form.Label>Zoom</Form.Label>
          <Form.Range id='zoom-range' className="ms-3" value={zoom} min={1} max={3} step={0.1}  onChange={(e) => setZoom(e.target.valueAsNumber)}/>
        </>
        
        <Button variant="primary" className="ms-3 text-white" onClick={() =>  onGenerateCrop(file!)} >
                {t('select')}
               </Button>
      </div></>
       : <></>}
          </>

  );
};


export default CropImageFileSelect;
