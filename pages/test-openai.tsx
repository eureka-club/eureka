import { GetServerSideProps,NextPage } from 'next';
import {getSession } from 'next-auth/react';
import { useState, ChangeEvent, FormEvent } from 'react';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import Spinner from '@/components/common/Spinner'
interface Props {
}

const TestOpenai: NextPage<Props> = () => {
  const [loading,setLoading] = useState(false)
  const [text,setText] = useState('')
  const [images,setImages] = useState<HTMLImageElement[]>([])

  function onTextChange(e:ChangeEvent<HTMLTextAreaElement>){
    setText(e.target.value)
  }

    async function onHyvorTalkCall (){
    const { error, data } = await fetch('/api/hyvor_talk/searchComments?id=work-247', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    }).then((r) => r.json());



    }


  async function onSubmit(form:FormEvent<HTMLFormElement>){
    setLoading(true)
    setImages([])
    form.preventDefault()
    try{
      const {data:en_text} = await fetch(`/api/google-translate/?text=${text}&target=en`)
      .then(r=>r.json())
  
      const {error,data} =  await fetch('/api/openai/createImage',{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({text:en_text})
      }).then(r=>r.json()) 
      
      if(data){
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
  
      }
      else if(error)
        alert(error)
      setLoading(false)

    }
    catch(e){
      console.error(e)
      setLoading(false)
    }
  }

  const renderImages = ()=>{
    return images.map((img,idx)=><img key={idx} src={img.src}/>)
  }

  return <SimpleLayout title={'test openai'}>
      <form onSubmit={onSubmit}>
        <textarea value={text} onChange={onTextChange}></textarea>
        <button type='submit' disabled={loading}>submit</button>
      </form>

      <button onClick={onHyvorTalkCall}>Hyvor Talk Access</button>

      <div>
        {!loading ? renderImages():<Spinner/>}
      </div>
    </SimpleLayout>
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = (await getSession(ctx));
  if (session == null || !session.user.roles.includes('admin')) {
    return { props: { notFound: true } };
  }
  return {
    session,
    props: {},
  };
};


export default TestOpenai;
