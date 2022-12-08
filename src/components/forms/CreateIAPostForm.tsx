import useTranslation from 'next-translate/useTranslation';
import { FormEvent, FunctionComponent, MouseEvent, RefObject, useEffect, useRef, useState } from 'react';
import {ModalBody,ModalFooter,ModalHeader,ModalTitle} from 'react-bootstrap';
import Prompt from '@/src/components/post/PostPrompt';

interface Props {
  noModal?: boolean;
  params?: any;

}

const CreateIAPostForm: FunctionComponent<Props> = ({noModal = false,params}) => {
  const { t } = useTranslation('createPostForm');

  return <>
    <ModalHeader closeButton={!noModal}>
         <ModalTitle> <h1 className="text-secondary fw-bold mt-sm-0 mb-2">Crea Momento Eureka con inteligencia artificial.</h1></ModalTitle>
      </ModalHeader>
    <section className='my-3'><Prompt searchtext={params?.searchtext} searchstyle={params?.searchstyle}/></section>
  </>
    
};

export default CreateIAPostForm;
