import { createContext, useContext, useState } from 'react';
import { Modal } from './Modal';
import { DialogContent, DialogTitle } from '@mui/material';

export type ModalBaseProps={
  title:string;
  content:JSX.Element;
}


export type StateType = {
  show:boolean;
} & ModalBaseProps
export type ContextType = {
    state:StateType;
    setState:(s:StateType)=>void;
    close:()=>void;
    show: (content:JSX.Element,title?:string)=>void,
};

const initialState:StateType = {
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
      <Modal open={state.show} onClose={()=>setState(s=>({...s,show:false}))} title={state.title}>
        <DialogTitle>{state.title}</DialogTitle>
        <DialogContent>{state.content}</DialogContent>
      </Modal>
    </ModalContext.Provider>
};

export {ModalProvider, useModalContext};
