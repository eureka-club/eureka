import { FunctionComponent, Suspense, lazy} from 'react';
import { Container, Spinner } from 'react-bootstrap';
import withTitle from '../../HOCs/withTitle';

const NavbarMobile = lazy(()=>import ('../NavbarMobile'));
const Header = lazy(()=>import('./Header'));
const Navbar = lazy(()=>import('../Navbar'));
const HeaderMobile = lazy(()=>import('./HeaderMobile'));
const Footer = lazy(()=>import('../Footer'));

type Props = {
  children: JSX.Element | JSX.Element[];
  title?: string;
  showHeader?: boolean;
  banner?: JSX.Element | JSX.Element[];
  showNavBar?:boolean;
  showFooter?:boolean;
  allPageSize?:boolean
};

const SimpleLayout: FunctionComponent<Props> = ({ children, showHeader = false, banner,showNavBar = true,showFooter=true , allPageSize=false}) => {
  const renderBanner = () => {
    if (banner) return <>{banner}</>;
    return ``;
  };

  return (
    <Suspense fallback={<Spinner animation="grow" />}>
      <section>
        <div className="d-none d-lg-block">
          {showNavBar && <Navbar />}
        </div>
        <div className="d-lg-none">
          {showNavBar &&<NavbarMobile />}
        </div>
      </section>
      <section className={(!showNavBar || allPageSize ) ? 'allPageSection': 'mainSection'}>
        <div className="d-none d-lg-block">{showHeader && <Header show={showHeader} />}</div>
        <div className="d-lg-none">{showHeader && <HeaderMobile show={showHeader} />}</div>
        {renderBanner()}
        {(!showNavBar || allPageSize) ? <div className='m-0'>{children}</div>
        : (showHeader) ?  <Container className='mt-4'>{children}</Container>
        : <Container className='mainContainer'>{children}</Container> }
      </section>
      {showFooter && (<Footer/>)}
    </Suspense>    
  );
};

export default withTitle(SimpleLayout);
