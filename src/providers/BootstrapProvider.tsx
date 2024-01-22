"use client"
import SSRProvider from 'react-bootstrap/SSRProvider';


type Props = {
    children?: React.ReactNode;
  };
export default function BootstrapProvider({children}:Props){
    return <SSRProvider>
    {children}
    </SSRProvider>;
}