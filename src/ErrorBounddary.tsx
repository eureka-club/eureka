import {Component, ReactNode} from 'react'
import SimpleLayout from '@/src/components/layouts/SimpleLayout'
import Link from 'next/link'


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
                {/*<Image className="d-none d-md-inline-block" src="/img/error.webp" layout='fill' alt='Opps an error occurred!'  />*/}
              <div id="notfound">
		<div className="notfound">
			<div className="notfound404">
				<h1>Oops!</h1>
				<h2>404 - The Page can not be found</h2>
			</div>
			<Link href='/'><a className='btn'>Go TO Homepage</a></Link>
		</div>
	</div>
            </SimpleLayout>
        return this.props.children

    }
}