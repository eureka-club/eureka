"use client"
import { FC } from 'react';
import Header from './Header';
import NavBarDestokp from './Navbar';
import NavbarMobile from './NavbarMobile';
import Footer from './Footer';
import { Container } from 'react-bootstrap';
import BannerCustomizable from '@/src/components/BannerCustomizable';
import BannerCustomizableMobile from '@/src/components/BannerCustomizableMobile';
import ReactQueryProvider from '@/src/providers/ReactQueryProvider';
import NextAuthProvider from '@/src/providers/NextAuthProvider';
import { Provider as JOTAIProvider, Atom, createStore } from 'jotai';
import detailPagesAtom from '@/src/atoms/detailPages';
import { DictContext } from '@/src/hooks/useDictContext';
import { ModalProvider } from '@/src/hooks/useModal';
import { EnvContext } from '@/src/hooks/useEnvContext';
import {Toaster} from 'react-hot-toast'

interface Props {
  children: React.ReactNode;
  showNavBar?: boolean;
  showHeader?: boolean;
  showCustomBaner?: boolean;  
  banner?: React.ReactNode | React.ReactNode[];
  allPageSize?: boolean;
  showFooter?: boolean;
  langs:string;
  dict:{};
  //env:Record<string,string>;
}
const Layout: FC<Props> = ({ dict, langs, children, showHeader = false, banner, showCustomBaner = false, showNavBar = true, showFooter = true, allPageSize = false }) => {
  const store = createStore();

  //para probar, ver como pasar el "initialState" q viene de cada page/* o app/*
  store.set(detailPagesAtom, {
    selectedSubsectionCycle: 'cycle-content',
    selectedSubsectionWork: 'all',
  });

  //subscription al 1er cambio
  const unsub = store.sub(detailPagesAtom, () => {
    console.log('detailPagesAtom value is changed to', store.get(detailPagesAtom));
  })
  //unsubscription luego del 1er cambio
  unsub()
  //para probar


  const renderBanner = () => {
    if (banner) return <>{banner}</>;
    return ``;
  };

  return <DictContext.Provider value={{dict,langs}}>
    <EnvContext.Provider value={{
      NEXT_PUBLIC_AZURE_CDN_ENDPOINT: process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT!,
      NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME: process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME!,
      NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM: process.env.NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM!,
      NEXT_PUBLIC_WEBAPP_URL:process.env.NEXT_PUBLIC_WEBAPP_URL!,
      DATE_FORMAT_SHORT:process.env.DATE_FORMAT_SHORT!,
    }}>
      <NextAuthProvider>
        <ReactQueryProvider>
          <JOTAIProvider store={store}>
            <ModalProvider>
              <>
                <Toaster/>
                <section>
                  {showNavBar && <>
                    <div className="d-none d-lg-block">
                      <NavBarDestokp />
                    </div>
                    <div className="d-lg-none">
                      <NavbarMobile />
                    </div>
                  </>
                  }
                </section>
                <section className={(!showNavBar || allPageSize) ? 'allPageSection' : 'mainSection'}>
                  {showHeader && <>
                    <div className="d-none d-lg-block"><Header show={showHeader} /></div>
                    {/* <div className="d-lg-none"><HeaderMobile show={showHeader} /></div> */}
                  </>}
                  {showCustomBaner && <div className="d-none d-lg-block"> <BannerCustomizable /></div>}
                  {showCustomBaner && <div className="d-block d-lg-none"> <BannerCustomizableMobile /></div>}
                  {renderBanner()}
                  {(!showNavBar || allPageSize) ? <div className='m-0'>{children}</div>
                    : (showHeader || showCustomBaner) ? <Container className='mt-4'>{children}</Container>
                      : <Container className='mainContainer'>{children}</Container>}
                </section>
                {showFooter && (<Footer />)}
              </>
            </ModalProvider>
          </JOTAIProvider>
        </ReactQueryProvider>
      </NextAuthProvider>
    </EnvContext.Provider>
  </DictContext.Provider>
    ;
}
export default Layout;