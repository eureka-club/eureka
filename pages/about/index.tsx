import { GetServerSideProps, NextPage } from 'next';
import Head from "next/head";
import useTranslation from 'next-translate/useTranslation';

import { getSession } from 'next-auth/react';
import { Session } from '@/src/types';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import About from './components/About';
import { ReactNode, createContext, memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { stat } from 'fs';
interface Props{
  session:Session
}

const wait = (ms: number) => {
  const start = Date.now();
  let now = start;

  while (now - start < ms) now = Date.now();
};

export const VerySlowComponent = () => {
  wait(400);
  return null;
};

type State = {x:number,y:number}
const defaulState = {x:1,y:2,incX:()=>{},incY:()=>{}}

const ContextState = createContext(defaulState);
const useContextState = ()=> useContext(ContextState);
const StateProvider = ({children}:{children:ReactNode})=>{
  const[state,setstate]=useState(defaulState);

  const incX=useCallback(()=>setstate(p=>({...p,x:p.x+1})),[])
  const incY=useCallback(()=>setstate(p=>({...p,y:p.y+1})),[])
  const value=useMemo(()=>({x:state.x,y:state.y,incX,incY}),[incX,incY,state.x,state.y])
  return <ContextState.Provider value={value}>{children}</ContextState.Provider>;
}
// const useMyState = ()=>{
//   const[state,setstate]=useState({x:1,y:2});
//   useEffect(()=>{
//     console.log(`useMyState: {x:${state.x}, y:${state.y}}`)
//   })
//   const incX=()=>setstate(p=>({...p,x:p.x+1}))
//   const incY=()=>setstate(p=>({...p,y:p.y+1}))
//   return {state,incX,incY}
// }



const withIncX = (Cmp:any)=>{
  const CmpMemo=memo(Cmp);
  return (props:any)=>{
    const{incX}=useContextState();
    return <CmpMemo {...props} incX={incX} />
  }
}
const withIncY = (Cmp:any)=>{
  const CmpMemo=memo(Cmp);
  return (props:any)=>{
    const{incY}=useContextState();
    return <CmpMemo {...props} incY={incY}/>
  }
}
const X = withIncY(({incY}:{incY:()=>{}})=>{
  // const{state:{x},incY}=useMyState();
  const{x}=useContextState();
  useEffect(()=>{
    console.log('render X');
  })
  return <>x: {x} <button onClick={incY}>inc y</button></>
})
const Y = withIncX(({incX}:{incX:()=>{}})=>{
  // const{state:{y},incX}=useMyState();
  const{y}=useContextState();
  useEffect(()=>{
    console.log('render Y');
  })
  // j
  return <>y: {y} <button onClick={incX}>inc x</button></>

}) 

const AboutPage: NextPage<Props> = ({session}) => {
  // const { t } = useTranslation('about');
  // const[state,setstate]=useState({x:1,y:2});
  useEffect(()=>{
    console.log('render AboutPage')
  })
  // const incX=()=>setstate(p=>({...p,x:p.x+1}))
  // const incY=()=>setstate(p=>({...p,y:p.y+1}))
  
  return (<>
  {/* <Head>
        <meta name="title" content={t('meta:aboutTitle')}></meta>
        <meta name="description" content={t('meta:aboutDescription')}></meta>
    </Head> 
    <style jsx global>{`
      body{
        background-color:white!important;
      }
    `}</style> */}
    {/* <SimpleLayout fullWidth title={t('meta:aboutTitle')}> */}
      {/* <About/> */}
      <StateProvider>
        <X/>
        <Y/>
        <VerySlowComponent/>
      </StateProvider>
    {/* </SimpleLayout> */}
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  return {
    props: {
      session,
    },
  };
  
};
export default AboutPage;
