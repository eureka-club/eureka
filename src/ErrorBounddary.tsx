import {Component, ReactNode} from 'react'
import SimpleLayout from '@/src/components/layouts/SimpleLayout'
import Link from 'next/link'
import withTranslation from 'next-translate/withTranslation'


interface State{
    hasError:boolean;
}
interface Props{
    children:ReactNode
    i18n:any
}
class ErrorBoundary extends Component<Props,State>{
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

    componentDidCatch(error: any,errorInfo: any){
        console.error(error,errorInfo)
    }

    render(){
      const { t, lang } = this.props.i18n;

        if(this.state.hasError)
            return <SimpleLayout>
        <div id="notfound">
            <div className="notfound">
                <div className="notfound404">
                    <h1>Oops!</h1>
                    <h2>{t('ErrorPageMessage')}</h2>
                </div>
                <div onClick={() => window.location.replace('/')}>
                <a className='btn'>{t('goToHomepage')}</a>
                </div>
		    </div>
	    </div>
            </SimpleLayout>
        return <>this.props.children</>

    }
}
export default withTranslation(ErrorBoundary,'common')
