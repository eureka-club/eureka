import { GetServerSideProps,NextPage } from 'next';
import {getSession } from 'next-auth/react';
import { useState, ChangeEvent, FormEvent } from 'react';
import { Spinner } from 'react-bootstrap';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
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
    let res =  await fetch("https://talk.hyvor.com/api/v1/comments?website_id=3377&sort=most_upvoted&page_identifier=cycle-21")
    console.log(await res.json(),'res')

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
        {!loading ? renderImages():<Spinner animation="grow" />}
      </div>
    </SimpleLayout>
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = (await getSession(ctx));
  return {
    props: {},
  };
};


export default TestOpenai;
