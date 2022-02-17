import React,{useEffect,useState} from 'react'
import Script from 'next/script'

declare global {
    interface Window {
        tinymce:any;
    }
}

const Editor: React.FC = ()=>{

    useEffect(()=>{
            
    })
    return <section>
        <Script src="/tinymce/tinymce.min.js" onLoad={()=>{
            window.tinymce.init({
                selector: '#mytextarea'
            });
        }}/>
        <textarea id="mytextarea">Hello, World!</textarea>
    </section>
}
export default Editor;