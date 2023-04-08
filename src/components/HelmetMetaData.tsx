import { FunctionComponent} from 'react';
import { Helmet} from 'react-helmet';


interface Props {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?:string
}

const HelmetMetaData: FunctionComponent<Props> = ({...props }) => {

const title= (props.title) ? props.title : "";
const description=(props.description) ? props.description : "";
const url= (props.url) ? props.url : "";
const image=(props.image) ? props.image : "";
const type=(props.type) ? props.type : "";

  return (
      <Helmet>
      <meta property="og:title" content={title} />
      <meta property="og:description" content='Activa tu mente, transforma el mundo' />    
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />

   
     </Helmet>
  );
};

export default HelmetMetaData;
