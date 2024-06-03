import { FunctionComponent, HtmlHTMLAttributes} from 'react';
import withTitle from '../../HOCs/withTitle';
import NavbarMobile from '@/components/layouts/NavbarMobile';
import Header from '@/components/layouts/Header';
import Navbar from '@/src/components/layouts/Navbar/Navbar';
import HeaderMobile from '@/components/layouts/HeaderMobile';
import BannerCustomizable from '@/src/components/BannerCustomizable';
import BannerCustomizableMobile from '@/src/components/BannerCustomizableMobile';
import Footer from '@/components/layouts/Footer';
import { Box, Container } from '@mui/material';

type Props = {
  children: JSX.Element | JSX.Element[];
  title?: string;
  showHeader?: boolean;
  banner?: JSX.Element | JSX.Element[];
  showCustomBaner?: boolean;
  showNavBar?:boolean;
  showFooter?:boolean;
  allPageSize?:boolean;
  fullWidth?:boolean
};

const SimpleLayout: FunctionComponent<Props> = ({ children, showHeader = false, banner,showCustomBaner=false,showNavBar = true,showFooter=true , allPageSize=false,fullWidth=false}) => {

  const renderBanner = () => {
    if (banner) return <>{banner}</>;
    return ``;
  };
  const Ctr = ({children,...args}:{children:JSX.Element | JSX.Element[]}&HtmlHTMLAttributes<HTMLDivElement>)=>{
    if(!fullWidth)return <Container {...args}>{children}</Container>;
    return <Box {...args}>{children}</Box>;
  }
  return (
    <>
      <section>
        {showNavBar && <>
          {/* <div className="d-none d-lg-block"> */}
            <Navbar />
          {/* </div> */}
          {/* <div className="d-lg-none">
            <NavbarMobile />
          </div> */}
        </>
        }
      </section>
      <Box sx={!fullWidth ? {paddingBottom:'2rem'}:{}} className={(!showNavBar || allPageSize ) ? 'allPageSection': 'mainSection'}> 
        {showHeader && <>
          <div className="d-none d-lg-block"><Header show={showHeader} /></div>
          <div className="d-lg-none"><HeaderMobile show={showHeader} /></div>        
        </>}     
        {showCustomBaner &&<div className="d-none d-lg-block"> 
          <BannerCustomizable/>
        </div>}
        {showCustomBaner &&<div className="d-block d-lg-none"> <BannerCustomizableMobile/></div>}
        {renderBanner()}
        {
        (!showNavBar || allPageSize) 
          ? <div className='m-0'>{children}</div>
            : (showHeader || showCustomBaner) 
            ? !fullWidth 
              ? <Container className='mt-4'>{children}</Container>
              :<Box className='mt-4'>{children}</Box>
          : !fullWidth 
            ? <Container className='mainContainer'>{children}</Container> 
            : <Box className='mainContainer'>{children}</Box> 
        }
      </Box>
      {showFooter && (<Footer/>)}
    </>    
  );
};

export default withTitle(SimpleLayout);
