import React, { useState, useCallback } from "react";
import Cropper, { CropperProps } from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import { Container, Form, Button } from 'react-bootstrap';
import {image64toCanvasRef,getCroppedImg} from '@/src/lib/utils'
import useTranslation from 'next-translate/useTranslation';
import { BsX} from 'react-icons/bs';
import toast from 'react-hot-toast'
interface Props{
  onGenerateCrop: (file:File) => void;
  onClose: () => void;
  cropShape?: 'rect' | 'round' | undefined,
  width?: number,
  height?: number
}
const CropImageFileSelect: React.FC<Props> = ({onGenerateCrop,onClose,cropShape,width=256,height=256}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [imageSrc, setImageSrc] = useState<string>('');
  const [file, setFile] = useState<File>();
  const [selectedPhoto, setSelectedPhoto] = useState<boolean>(false);
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

    const processSelect = async () => {
     const size = formatBytes(file!.size);
       if(size[1] === 'KB' && size[0] > 500 ){
          toast.error( t('selectedCropNotInvalid') +` ${size[0]}` + ` ${size[1]}`)
          setFile(undefined);
      }
      else     
        onGenerateCrop(file!)
    }

    function formatBytes(bytes:number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return [parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),sizes[i]];
}

const onFileChange = async  (e:React.ChangeEvent<HTMLInputElement>)  => {
  const files = e.currentTarget.files;
    if(files?.length){
      const file = files[0];
      const size = formatBytes(files[0].size);
      if(size[1] === 'MB' && size[0] > 2 ){
          toast.error( t('canNotUploadPhoto') +` ${size[0]}` + ` ${size[1]}`)
          e.currentTarget.value = '';
      }
      else{
      const fileReader = new FileReader()
      setImageSrc(()=>URL.createObjectURL(file));
      setSelectedPhoto(true);
      }
    }
  }

  return (
    <>
    <div className='d-flex justify-content-end mb-2'> <Button variant="primary text-white" onClick={onClose}  size="sm">
            <BsX fontSize='1.5em' />
          </Button></div>
    {!selectedPhoto && (<Form.Group className="mb-3" controlId="image">
      <Form.Label>Image</Form.Label>
      <Form.Control type="file" placeholder="Load an image" onChange={onFileChange} />
      <Form.Text className="text-muted">
       From your computer
      </Form.Text>
    </Form.Group>)}

 {imageSrc.length ? <>
    <div className="crop-container mb-2">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          cropSize={{ width: width,height: height }}
          //aspect={2 / 2}
          cropShape	={cropShape}
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
        
        <Button variant="primary" data-cy="set-image" className="ms-3 text-white" onClick={processSelect} >
                {t('select')}
               </Button>
      </div></>
       : <></>}
          </>

  );
};


export default CropImageFileSelect;
