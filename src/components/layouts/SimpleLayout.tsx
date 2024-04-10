import { FunctionComponent, HtmlHTMLAttributes} from 'react';
import { Container} from 'react-bootstrap';
import withTitle from '../../HOCs/withTitle';
import NavbarMobile from '@/components/layouts/NavbarMobile';
import Header from '@/components/layouts/Header';
import Navbar from '@/components/layouts/Navbar';
import HeaderMobile from '@/components/layouts/HeaderMobile';
import BannerCustomizable from '@/src/components/BannerCustomizable';
import BannerCustomizableMobile from '@/src/components/BannerCustomizableMobile';
import Footer from '@/components/layouts/Footer';
import { Box } from '@mui/material';

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

const SimpleLayout: FunctionComponent<Props> = ({ children,fullWidth=false, showHeader = false, banner,showCustomBaner=false,showNavBar = true,showFooter=true , allPageSize=false}) => {

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
          <div className="d-none d-lg-block">
            <Navbar />
          </div>
          <div className="d-lg-none">
            <NavbarMobile />
          </div>
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
              ?  <Ctr className='mt-4'>{children}</Ctr>
              : <Ctr className='mainContainer'>{children}</Ctr> 
        }
      </Box>
      {showFooter && (<Footer/>)}
    </>    
  );
};

export default withTitle(SimpleLayout);
