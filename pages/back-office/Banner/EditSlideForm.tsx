import { Button, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { ChangeEvent, FC, useRef, useState } from "react";
import { i18n, Locale } from 'i18n-config';
import { FaSave } from 'react-icons/fa';
import { Editor as EditorCmp } from '@tinymce/tinymce-react';
import { WEBAPP_URL } from "@/src/constants";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { useModalContext } from "@/src/hooks/useModal";

const MaxLength = 335;
interface StateProp {
    id:number;
    title: string;
    text: string;
    language: Locale;
    // publishedFrom?: Date;
    // publishedTo?: Date;
  }
  
const EditSlideForm:FC<StateProp> = ({id,title,text,language})=>{
    const [state, setstate] = useState<StateProp>({
        id,
        title,
        text,
        language,
      });
  const [textLength, setTextLength] = useState(text?.length??0);
  const editorRef = useRef<any>(null);
  const WYSWYGRef = useRef(null);
  const {close} = useModalContext();

      const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string) => {
        setstate((p) => ({ ...p, [`${fieldName}`]: e.target.value }));
      };
  const queryClient = useQueryClient();

    const hasError = ()=>{
        const q1 = state.title.length + textLength > MaxLength;
        const q2 = !state.language;
        return q1 || q2;
    }  
    const OnSubmit = async ()=>{
      const url =`${WEBAPP_URL}/api/backoffice/slide/${id}/edit`;
      const text =  editorRef.current ? editorRef.current.getContent() : '';

      const fr = await fetch(url,{
        method:'put',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          title:state.title,
          text,
          language:state.language
        })
      });
      if(fr.ok){
        const res =  await fr.json();
        if(res.ok){
          queryClient.invalidateQueries({queryKey:["BACKOFFICE","1"]});
          close();
          toast.success('Done!');
        }
      }
      else{
        toast.error('Server Error');
      }
    }
    return <form>
        <FormControl fullWidth>
        <TextField label="Title" value={state.title} onChange={(e) => changeHandler(e, 'title')} variant="standard" multiline maxRows={3} />
        <FormHelperText className={`${state.title.length+textLength>=MaxLength ? 'text-danger':''}`}>({MaxLength-(state.title.length+textLength)})</FormHelperText>
      </FormControl>

      <FormControl fullWidth className='p-3'>
        <label id="wyswyg-text">Text</label>
        <EditorCmp
         ref={WYSWYGRef}
          apiKey="f8fbgw9smy3mn0pzr82mcqb1y7bagq2xutg4hxuagqlprl1l"
          onInit={(_: any, editor) => {
            editorRef.current = editor;
          }}
          initialValue={state.text}
          onEditorChange={(t, editor) => {
              setTextLength(t.length);
          }}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              'advlist',
              'autolink',
              'lists',
              'link',
              'image',
              'charmap',
              'print',
              'preview',
              'anchor',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'paste',
              'code',
              'help',
              'wordcount',
              'emoticons',
            ],
            emoticons_database: 'emojiimages',
            relative_urls: false,
            forced_root_block: 'div',
            toolbar: 'undo redo | formatselect | bold italic backcolor color | insertfile | link | emoticons  | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
        />
        <FormHelperText className={`${(state.title.length+textLength)>=MaxLength ? 'text-danger':''}`}>({MaxLength-(state.title.length+textLength)})</FormHelperText>
      </FormControl>

      <FormControl fullWidth className='p-3'>
        <InputLabel id="select-language">Language</InputLabel>
        <Select
          labelId="select-language"
          value={state.language}
          label="Age"
          onChange={(e) => setstate((p) => ({ ...p, language: e.target.value as Locale }))}
        >
          {i18n.locales.map((locale) => (
            <MenuItem key={locale} value={locale}>
              {locale.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button onClick={OnSubmit} disabled={hasError()} variant="contained"><FaSave/></Button>
    </form>
}
export default EditSlideForm;