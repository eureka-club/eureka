"use client"
import { createContext, useContext, useState } from 'react';
import {Modal} from 'react-bootstrap'

export type StateType = {
    show:boolean;
  content:JSX.Element;
  title:string;
}
export type ContextType = {
    state:StateType;
    setState:(s:StateType)=>void;
    close:()=>void;
    show: (content:JSX.Element,title?:string)=>void,
};

const initialState = {
    show: false,
    title:'',
    content: <></>
}
const initialContext = {
    state: initialState,
    setState: (s:StateType)=>({...s,...initialState}),
    close: ()=>{},
    show: (content:JSX.Element,title?:string)=>{},
}
const ModalContext = createContext<ContextType>(initialContext);

const useModalContext = (): ContextType => useContext(ModalContext);

interface Props {
  children: JSX.Element;
}

const ModalProvider: React.FC<Props> = ({children}) => {
    const [state,setState] = useState(initialState)
  
    const close = ()=>{
        setState({title:'',content:<></>,show:false})
    }
    const show = (content:JSX.Element,title?:string)=>{
        setState({title:title||'',content,show:true})
    }
  return <ModalContext.Provider value={{
    state, setState, close, show
  }}>
      {children}
        <Modal show={state.show} onHide={()=>setState(s=>({...s,show:false}))}>
        {state.title ? <Modal.Header closeButton>
          <Modal.Title>{state.title}</Modal.Title>
        </Modal.Header> : ''}
            <Modal.Body>
                {state.content}  
            </Modal.Body>
        </Modal> 
    </ModalContext.Provider>
};

export {ModalProvider, useModalContext};
