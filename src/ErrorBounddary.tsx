import {Component, ReactNode} from 'react'
import SimpleLayout from '@/src/components/layouts/SimpleLayout'
import Image from 'next/image'


interface State{
    hasError:boolean;
}
interface Props{
    children:ReactNode
}
export class ErrorBoundary extends Component<Props,State>{
    constructor(props:any){
        super(props)
        this.state = {
            hasError:false,
        }
    }

    static getDerivedStateFromError(){
        return {
            hasError:true
        }
    }

    componentDidCatch(error: any,errorInfo: any){debugger;
        console.log(error,errorInfo)
    }

    render(){
        if(this.state.hasError)
            return <SimpleLayout>
                <Image className="d-none d-md-inline-block" src="/img/error.webp" layout='fill' alt='Opps an error occurred!'  />
            </SimpleLayout>
        return this.props.children

    }
}