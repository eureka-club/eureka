import { FunctionComponent,useState } from 'react';
import { ASSETS_BASE_URL, STORAGE_MECHANISM_AZURE, STORAGE_MECHANISM_LOCAL_FILES } from '../constants';
const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT } = process.env;
const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;
const { NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM } = process.env;

interface Props {
  className?: string;
  style?: Record<string, string>;
  filePath: string;
  alt: string;
  width?:number;
  height?:number;
  notNextImage?:boolean;
  blurDataURL?:boolean;
}

const LocalImage: FunctionComponent<Props> = ({ className, style, filePath, alt,width,height,blurDataURL=false,notNextImage }) => {
  const fallbakImgURL = `https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/Image-not-found.webp`
  const [imgError,setImgError] = useState<boolean>(false)
  const onLoadImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbakImgURL;
    setImgError(true)
  };

  switch (NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM) {
    case STORAGE_MECHANISM_AZURE:
      return (
        // !notNextImage ? <Image
        //   blurDataURL={blurDataURL ? fallbakImgURL: undefined}
        //   placeholder={blurDataURL ? 'blur': undefined}
        //   src={imgError ? fallbakImgURL :`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${filePath}`}
        //   alt={alt}
        //   className={`${className}`}
        //   onError={onLoadImgError}
        //   // style={style}
        //   width={width}
        //   height={height}
        //   // objectFit="cover"
        //   // objectPosition={'50% 50%'}
        //   layout={!(width && height) ? "fill" : undefined}
        //   //layout="fill"
        // />
        // // eslint-disable-next-line @next/next/no-img-element
        // : 
        <img
          src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${filePath}`}
          alt={alt}
          className={className}
          onError={onLoadImgError}
          style={{...style,width:`${width}px`,height:`${height}px`}}
         />
      );

    case STORAGE_MECHANISM_LOCAL_FILES:
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={`${ASSETS_BASE_URL}/${filePath}`} alt={alt} className={className} style={{...style,width:`${width}px`,height:`${height}px`}}/>;

    default:
      return null;
  }
};

export default LocalImage;
