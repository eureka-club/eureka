import { FunctionComponent } from 'react';

import { ASSETS_BASE_URL } from '../constants';

interface Props {
  className?: string;
  filePath: string;
  alt: string;
}

const LocalImage: FunctionComponent<Props> = ({ className, filePath, alt }) => {
  return <img src={`${ASSETS_BASE_URL}/${filePath}`} alt={alt} className={className} />;
};

export default LocalImage;
