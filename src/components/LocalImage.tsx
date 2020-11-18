import { FunctionComponent } from 'react';

import { ASSETS_BASE_URL } from '../constants';

interface Props {
  className?: string;
  style?: Record<string, string>;
  filePath: string;
  alt: string;
}

const LocalImage: FunctionComponent<Props> = ({ className, style, filePath, alt }) => {
  return <img src={`${ASSETS_BASE_URL}/${filePath}`} alt={alt} className={className} style={style} />;
};

export default LocalImage;
