"use client"
import { FC, FunctionComponent} from 'react';
import { Container} from 'react-bootstrap';
import withTitle from '../../HOCs/withTitle';
import NavbarMobile from '@/components/layouts/NavbarMobile';
import Header from '@/components/layouts/Header';
import Navbar from '@/components/layouts/Navbar';
import HeaderMobile from '@/components/layouts/HeaderMobile';
import BannerCustomizable from '@/src/components/BannerCustomizable';
import BannerCustomizableMobile from '@/src/components/BannerCustomizableMobile';
import Footer from '@/components/layouts/Footer';

import { NextAuthProvider } from '@/src/providers/NextAuthProvider';
import { ReactQueryProvider } from '@/src/providers/ReactQueryProvider';

interface Props{
    children: React.ReactNode;
    showNavBar?:boolean;
    showHeader?: boolean;
    showCustomBaner?: boolean;
    banner?: React.ReactNode | React.ReactNode[];
    allPageSize?:boolean
}
const LayoutCmp:FC<Props> = ({children,showNavBar,showHeader,showCustomBaner,banner,allPageSize})=>{
    const renderBanner = () => {
        if (banner) return <>{banner}</>;
        return ``;
      };

    return <ReactQueryProvider>
              <NextAuthProvider>
                <section>
                {/* {showNavBar &&  */}
                <>
                  <div className="d-none d-lg-block">
                    <Navbar />
                  </div>
                  <div className="d-lg-none">
                    <NavbarMobile />
                  </div>
                </>
                {/* } */}
              </section>
              <section className={(!showNavBar || allPageSize ) ? 'allPageSection': 'mainSection'}> 
                {showHeader && <>
                  <div className="d-none d-lg-block"><Header show={showHeader} /></div>
                  <div className="d-lg-none"><HeaderMobile show={showHeader} /></div>        
                </>}     
                <nav style={{marginBottom:"8rem"}}>
                  {showCustomBaner &&<div className="d-none d-lg-block"> <BannerCustomizable/></div>}
                  {showCustomBaner &&<div className="d-block d-lg-none"> <BannerCustomizableMobile/></div>}
                </nav>
                {renderBanner()}
                {(!showNavBar || allPageSize) ? <div className='m-0'>{children}</div>
                : (showHeader || showCustomBaner) ?  <Container className='mt-4'>{children}</Container>
                : <Container className='mainContainer'>{children}</Container> }
              </section>
              <Footer/>
        </NextAuthProvider>
      </ReactQueryProvider>
    ;
}
export default LayoutCmp;