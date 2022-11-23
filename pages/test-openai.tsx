import { GetServerSideProps,NextPage } from 'next';
import {getSession } from 'next-auth/react';
import { useState, ChangeEvent, FormEvent } from 'react';
import { Spinner } from 'react-bootstrap';
import SimpleLayout from '../src/components/layouts/SimpleLayout';

interface Props {
  r:string
}

const TestOpenai: NextPage<Props> = ({r}) => {
  const [loading,setLoading] = useState(false)
  const [text,setText] = useState('')
  const [images,setImages] = useState<HTMLImageElement[]>([])

  function onTextChange(e:ChangeEvent<HTMLTextAreaElement>){
    setText(e.target.value)
  }
  async function onSubmit(form:FormEvent<HTMLFormElement>){
    setLoading(true)
    setImages([])
    form.preventDefault()
    const {data:{data}} =  await fetch('/api/openai/createImage',{
      method:'POST',
      headers:{
          'Content-type':'application/json'
      },
      body:JSON.stringify({text})
    }).then(r=>r.json())

    const promises = (data as {b64_json:string}[]).map(d=>{
      return new Promise((resolve,reject)=>{
        const img = new Image()
        img.onload = function(){
          setImages(res=>[...res,img])
          resolve(true)
        }
        img.src = `data:image/webp;base64,${d.b64_json}`
      })
    })
    await Promise.all(promises)
    setLoading(false)
  }

  const renderImages = ()=>{
    return images.map((img,idx)=><img key={idx} src={img.src}/>)
  }

  return <SimpleLayout title={'test openai'}>
    <code>{r}</code>
      <form onSubmit={onSubmit}>
        <textarea value={text} onChange={onTextChange}></textarea>
        <button type='submit' disabled={loading}>submit</button>
      </form>
      <div>
        {!loading ? renderImages():<Spinner animation="grow" />}
      </div>
    </SimpleLayout>
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = (await getSession(ctx));
  const r = process.env.OPENAI_API_KEY
  return {
    props: {r},
  };
};


export default TestOpenai;
