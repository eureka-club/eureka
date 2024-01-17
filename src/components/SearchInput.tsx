"use client"

import { useRouter } from 'next/navigation';
import React, { FunctionComponent,useRef, useState } from 'react';
import { Form,InputGroup,Button,Spinner } from 'react-bootstrap';

import { AiOutlineSearch } from 'react-icons/ai';
import { useDictContext } from '../hooks/useDictContext';

interface Props {
  className?: string;
  style?: Record<string,string>; 

}
const SearchInput: FunctionComponent<Props> = ({ className = '',style = {}}) => {
  const router = useRouter();
  const { t, dict } = useDictContext();
  const formRef=useRef<HTMLFormElement>(null)
  const [searching,setSearching] = useState(false)

  const onTermKeyUp = (e:React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.code == 'Enter' || e.code == 'NumpadEnter' ){
      setSearching(true)
      router.push(`/search?q=${e.currentTarget.value}`)
      setSearching(false);
      // .then((res)=>{setSearching(false);return res})
    }
  }

   const onSearch= (e:React.MouseEvent<HTMLButtonElement>)=>{
    const form = formRef.current;
    if(form && form.search.value) {
      setSearching(true)
      router.push(`/search?q=${form.search.value}`)
      setSearching(false);
      // .then((res)=>{setSearching(false);return res})
    }
  }

  return <><div className={`d-none d-lg-block ${className}`} style={{...style}} data-cy="search-engine">
    <InputGroup className="">
      <InputGroup.Text className="bg-white border border-primary">
        {
          searching 
          ? <Spinner animation="border" size="sm" />
          : <AiOutlineSearch className="text-primary focus-border-color-green"/>
        }
      </InputGroup.Text>
      <style jsx global>
        {`
          .form-control:focus {
            box-shadow: none;
        }          
       `}
       </style>
      <Form.Control
        aria-label="Search Term"
        aria-describedby="basic-search"
        data-cy="search-engine-control"
        className={`${className} border-start-0`} type="text" placeholder={t(dict,'search')} onKeyUp={onTermKeyUp}
      />
    </InputGroup>
  </div>
  <div className={`d-block d-lg-none ${className}`} style={{...style}}>
    <InputGroup className="w-100">
      <style jsx global>
        {`
          .form-control:focus {
            box-shadow: none;
        }          
       `}
       </style>
       <Form ref={formRef} style={{width:'250px'}}>
         <Form.Group controlId='search'>
            <Form.Control
            aria-label="Username"
            aria-describedby="basic-search"
            className={`${className} `} type="text" placeholder={t(dict,'search')} onKeyUp={onTermKeyUp}

          />
         </Form.Group>
      </Form>
       <InputGroup.Text className="d-lg-none text-white border border-primary cursor-pointer bg-primary">
            <Button 
            size="sm" 
            variant="link" 
            className="p-0 text-white text-decoration-none"
            onClick={onSearch}
            >
                {
          searching 
          ? <Spinner animation="border" size="sm"/>
          : <AiOutlineSearch className="text-white focus-border-color-green"/>
        }
              </Button>
            
          </InputGroup.Text>
    </InputGroup>
  </div>
  </>
};

export default SearchInput;
