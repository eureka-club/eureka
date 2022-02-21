import { FunctionComponent} from 'react';
import { Helmet} from 'react-helmet';


interface Props {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}

const HelmetMetaData: FunctionComponent<Props> = ({...props }) => {

const title= (props.title) ? props.title : "";
const description=(props.description) ? props.description : "";
const url= (props.url) ? props.url : "";
const image=(props.image) ? props.image : "";
  return (
      <Helmet>
      <meta property="og:title" content={title} />
      <meta property="og:description" content='Esto es una breve descripcion a ver q pasa' />    
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
   
     </Helmet>
  );
};

export default HelmetMetaData;
