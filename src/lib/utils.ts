import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isBetween from 'dayjs/plugin/isBetween';
import {v4} from 'uuid'

export const advancedDayjs = (date: string | number | Date): dayjs.Dayjs => {
  dayjs.extend(advancedFormat);
  dayjs.extend(isBetween);

  return dayjs(date);
};

export const asyncForEach = async (
  array: Array<unknown>,
  callback: (item: any, index?: number, arr?: Array<any>) => Promise<void>,
): Promise<void> => {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array); // eslint-disable-line no-await-in-loop
  }
};
interface Props {
canvasRef:HTMLCanvasElement;
image64:string;
pixelCrop:{
  x:number;
  y:number;
  width:number;
  height:number;
}
}
export const image64toCanvasRef = (
  canvasRef:HTMLCanvasElement,
  image64:string|ArrayBuffer,
  pixelCrop:{
    x:number;
    y:number;
    width:number;
    height:number;
  },
  clientWidthAndHeight:{
    width:number;
    height:number;
  }  
): Promise<File>=>{
  const canvas = canvasRef // document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');
  const image = new Image();
  image.src = image64 as string;
  return new Promise((resolve,error)=>{
    image.onload = function() {
      const pixelRatio = window.devicePixelRatio;
      const scaleX = image.naturalWidth / clientWidthAndHeight.width;
      const scaleY = image.naturalHeight / clientWidthAndHeight.height;     
  
      canvas.width = pixelCrop.width * pixelRatio * scaleX;
      canvas.height = pixelCrop.height * pixelRatio * scaleY;
  
      ctx!.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx!.imageSmoothingQuality = 'high';
  
      ctx!.drawImage(
        image,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY
      )
       
       canvas.toBlob((blob) => {
        if(blob){
          let file = new File([blob], `${v4()}.png`, { type: "image/png" })
          resolve(file);
        }
     
      }, 'image/jpeg');
    }

  })
}
