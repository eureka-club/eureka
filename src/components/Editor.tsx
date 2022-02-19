import React,{useEffect,useState} from 'react'
import {Form} from 'react-bootstrap'
// import Script from 'next/script'
import useTranslation from 'next-translate/useTranslation';
// declare global {
//     interface Window {
//         tinymce:any;
//     }
// }
interface Props {
    onSave:(text:string)=>void;
    value:string;
    onChange:(value:string)=>void;
}
const Editor: React.FC<Props> = ({onSave,value,onChange})=>{
    const {t} = useTranslation('common')
    return <Form.Control 
        defaultValue={value}
        value={value} 
        type="text" 
        className="border fs-6 rounded-pill bg-light"
        as="textarea"
        rows={2}
        placeholder={`${t('Write a replay')}...`}        
        onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
            onChange(e.target.value);
        }} 
        onKeyPress={(e:React.KeyboardEvent<HTMLInputElement>)=>{
            if (e.key === 'Enter' && !e.shiftKey){                            
                e.preventDefault()
                onSave(value);  
                onChange('')              
            }
        }} />

    /* return <section>
        <Script src="/tinymce/tinymce.min.js" onLoad={()=>{
            window.tinymce.init({
                selector: '.t',
                init_instance_callback: function(editor: { on: (arg0: string, arg1: (e: any) => void) => void }) {
                    editor.on('input', function(e) {
                        onSave(e.target.innerHTML)

                    });
                    editor.on('keydown', function(e) {                        
                        if(e.key == 'Enter'){                            
                            onSave(e.currentTarget.innerHTML)
                        }
                    });
                },
                
                max_height: 70,
                menubar: false,
                plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help',
                ],
                relative_urls: false,
                forced_root_block : "p,a",
                // toolbar: 'undo redo | formatselect | bold italic backcolor color | insertfile | link  | help',
                toolbar:false,
                branding:false,
                statusbar:false,

                content_style: `body { 
                font-family:Helvetica,Arial,sans-serif; 
                font-size:14px; 
                background:#f7f7f7;
                }`,
            });
        }}/>
        <textarea 
            className="t"
        >{value}</textarea>
    </section>
 */}
export default Editor;