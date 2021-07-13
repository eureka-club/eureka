import { FunctionComponent } from 'react';
// import Image from 'next/image';
import { ASSETS_BASE_URL, STORAGE_MECHANISM_AZURE, STORAGE_MECHANISM_LOCAL_FILES } from '../constants';

const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT } = process.env;
const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;
const { NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM } = process.env;

interface Props {
  className?: string;
  style?: Record<string, string>;
  filePath: string;
  alt: string;
}

const LocalImage: FunctionComponent<Props> = ({ className, style, filePath, alt }) => {
  switch (NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM) {
    case STORAGE_MECHANISM_AZURE:
      return (
        // <Image
        //   src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${filePath}`}
        //   // src={`/${filePath}`}
        //   layout="fill"
        // />
        <img
          src={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${filePath}`}
          alt={alt}
          className={className}
          style={style}
        />
      );

    case STORAGE_MECHANISM_LOCAL_FILES:
      return <img src={`${ASSETS_BASE_URL}/${filePath}`} alt={alt} className={className} style={style} />;

    default:
      return null;
  }
};

export default LocalImage;
