import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';
import { Form,InputGroup } from 'react-bootstrap';

import { AiOutlineSearch } from 'react-icons/ai';

interface Props {
  className?: string;
  style?: Record<string,string>;

}
const SearchInput: FunctionComponent<Props> = ({ className = '',style = {}}) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const onTermKeyUp = (e:React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.code == 'Enter'){
      router.push(`/search?q=${e.currentTarget.value}`)
    }
  }

  return <div className={`${className}`} style={{...style}}>
    <InputGroup className="">
      <InputGroup.Text className="bg-white border border-primary">
        <AiOutlineSearch className="text-primary focus-border-color-green"/>
      </InputGroup.Text>
      <style jsx global>
        {`
          .form-control:focus {
            box-shadow: none;
        }          
       `}
       </style>
      <Form.Control
        aria-label="Username"
        aria-describedby="basic-search"
        className={`${className} border-start-0`} type="text" placeholder={t('common:search')} onKeyUp={onTermKeyUp}
      />
    </InputGroup>
  </div>
};

export default SearchInput;
