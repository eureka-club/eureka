import React,{useState,useRef} from "react";import { Button } from "react-bootstrap";
import { useSession, signIn, signOut } from "next-auth/react"
import { useMutation } from "react-query";
import {Form} from 'react-bootstrap'

const Index: React.FC = ()=>{
    const {data:session} = useSession()
    const formRef=useRef<HTMLFormElement>(null)

    interface MutationProps{
        identifier:string;
        password:string;
        fullName:string;
    }
    const {mutate,isLoading:isMutating} = useMutation(async (props:MutationProps)=>{
        const {identifier,password,fullName} = props;
        const res = await fetch('/api/userCustomData',{
            method:'POST',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({
                identifier,
                password,
                fullName,
            })
        })
        if(res.ok){
            const data = await res.json()
            signIn('email',{email:identifier})
            // return data;
        }
        else{
            alert(res.statusText)
        }
        return null;
    })

    const handleSubmitSignUp = (e:React.MouseEvent<HTMLButtonElement>)=>{
        //mutate user custom data
        const form = formRef.current

        if(form){
            mutate({
                identifier:form.email.value,
                password:form.password.value,
                fullName:form.fullName.value
            })
            
        }
    }

    const handleSubmitSignIn = (e:React.MouseEvent<HTMLButtonElement>)=>{
        //mutate user custom data
        const form = formRef.current

        if(form){
            // signIn()
            signIn('credentials' ,{
                email:form.email.value,
                password:form.password.value
            })
            
        }
    }
    
    const renderLogInOrOut = ()=>{
        if (session) {
            return (
              <>
                Signed in as {session.user?.email} <br />
                <button onClick={() => signOut({callbackUrl:`${process.env.NEXT_PUBLIC_WEBAPP_URL}/`})}>Sign out</button>
              </>
            )
          }
          return (
            <>
              Not signed in <br />
              <Form ref={formRef} >
                    <Form.Group controlId='fullName'>
                        <Form.Control type="text" placeholder="Name"/>
                    </Form.Group>

                    <Form.Group controlId='email'>
                        <Form.Control type="text" placeholder="Email"/>
                    </Form.Group>

                    <Form.Group controlId='password'>
                        <Form.Control type="text" placeholder="Password"/>
                    </Form.Group>
                    <Button onClick={handleSubmitSignUp}>Sign up</Button>
                    <Button onClick={handleSubmitSignIn}>Sign in</Button>
              </Form>
            </>
          )
    }
    return <article>
        <div className="my-5">
        {renderLogInOrOut()}
        </div>    
    </article>;
};
export default Index