import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isBetween from 'dayjs/plugin/isBetween';
import { v4 } from 'uuid';
import { Area } from 'react-easy-crop/types';
import { Session } from '../types';
import { UserDetail } from '../types/user';
import fs from 'fs'

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
  canvasRef: HTMLCanvasElement;
  image64: string;
  pixelCrop: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}


export const image64toCanvasRef = (
  canvasRef: HTMLCanvasElement,
  image64: string | ArrayBuffer,
  pixelCrop: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  clientWidthAndHeight: {
    width: number;
    height: number;
  },
): Promise<File> => {
  const canvas = canvasRef; // document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');
  const image = new Image();
  image.src = image64 as string;
  return new Promise((resolve, error) => {
    image.onload = function () {
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
        pixelCrop.height * scaleY,
      );

      canvas.toBlob((blob) => {
        if (blob) {
          let file = new File([blob], `${v4()}.webp`, { type: 'image/webp' });
          resolve(file);
        }
      }, 'image/webp');
    };
  });
};

export const getNotificationMessage = (
  message: string,
  callback: (key: string, payload: Record<string, string>) => string,
) => { 
  const [key, jsonStr] = message.split('!|!');
  return callback(key, JSON.parse(jsonStr));
};

//**canvasUtils.js */

export const createImage = (url: string) => 
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
interface Props {
  imageSrc: string;
  pixelCrop: Area;
}
export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  flip = { horizontal: false, vertical: false },
): Promise<File | null> => {
  const image = <ImageBitmap>await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0);

  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        let file = new File([blob], `${v4()}.webp`, { type: 'image/webp' });
        resolve(file);
      }
    }, 'image/webp');
  });
};

interface Props {
  imageSrc: string;
}
export const getImg = async (
  imageSrc: string,
  rotation = 0,
  flip = { horizontal: false, vertical: false },
): Promise<File | null> => {
  const image = <ImageBitmap>await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  //const data = ctx.getImageData(
  // pixelCrop.x,
  // pixelCrop.y,
  //canvas.width,
  // canvas.height
  //)

  // set canvas width to final desired crop size - this will clear existing context
  //canvas.width = pixelCrop.width
  // canvas.height = pixelCrop.height

  // paste generated rotate image at the top left corner
  //ctx.putImageData(data, 0, 0)

  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        let file = new File([blob], `${v4()}.webp`, { type: 'image/webp' });
        resolve(file);
      }
    }, 'image/webp');
  });
};

interface Props {
  image: HTMLImageElement;
}
export const getImageFile = async (
  image: HTMLImageElement,
  rotation = 0,
  flip = { horizontal: false, vertical: false },
): Promise<File | null> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width ? image.width : 200 ,image.height ? image.height : 500 , rotation);

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        let file = new File([blob], `${v4()}.webp`, { type: 'image/webp' });
        resolve(file);
      }
    }, 'image/webp');
  });
};

export const isAccessAllowed = (
  session: Session,
  user: UserDetail,
  isLoadingUser: boolean,
  isFollowedByMe: boolean,
) => {
  if (!isLoadingUser && user && user.id) {
    if (!user.dashboardType || user.dashboardType === 1) return true;
    // if (!isLoadingSession) {
    // if (!session) return false;
    if (session) {
      const s = session;
      if (user.id === s.user.id) return true;
      if (user.dashboardType === 2 && isFollowedByMe) return true;
      if (user.dashboardType === 3 && user.id === s.user.id) return true;
    }
    // }
  }
  return false;
};
