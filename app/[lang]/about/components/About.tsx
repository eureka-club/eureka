"use client"
import { t as t_} from '@/src/get-dictionary';
import { useDictContext } from '@/src/hooks/useDictContext';
import { Container } from '@mui/material';
import { FC } from "react";

interface Props{
}
const About:FC<Props> = ({}) => {
  const{t,dict}=useDictContext()
  return (<>
  
    <Container>
      {/* Language=css */}
      <style jsx>{`
        h1 {
          color: var(--eureka-green);
        }

        .middle-container {
          width: 60%;
          margin: auto;
        }

        .what-is1 {
          margin: 60px auto 40px auto;
          text-align: left;
          line-height: 1.5;
        }

        .what-is2 {
          margin: 60px auto 40px auto;
          text-align: right;
          line-height: 1.5;
        }

        .logo-img {
          max-width: 180px;
          max-height: 140px;
          padding: 10px 30px 40px 30px;
          vertical-align: middle;
        }

        .logo-img2 {
          max-width: 180px;
          padding: 10px 30px 40px 30px;
          vertical-align: middle;
        }

        .logo-img3 {
          max-width: 180px;
          max-height: 160px;
          padding: 10px 30px 40px 30px;
          vertical-align: middle;
        }

        .bottom-container {
          padding-top: 20px;
          padding-bottom: 40px;
          background-color: var(--eureka-green);
        }

        .copyright {
          color: var(--text-color-light);
          font-size: 16px;
        }

        .summary {
          line-height: 2;
        }
      `}</style>

      <div style={{ textAlign: 'center' }}>
        <h1 className="text-secondary fw-bold">{t(dict,'aboutPageHeading')}</h1>
      </div>
      <br />
      <hr />

      <div className="middle-container">
        <h2 className="h1 text-secondary">{t(dict,'aboutHeading')}</h2>
        <p className="summary">{t(dict,'aboutText')}</p>

        <div className="what-is2">
          <h2 className="h1 text-secondary">{t(dict,'whatisCycleHeading')}</h2>
          <p className="summary">{t(dict,'whatisCycleText')}</p>
        </div>

        <div className="what-is1">
          <h2 className="h1 text-secondary">{t(dict,'whatisPostHeading')}</h2>
          <p className="summary">{t(dict,'whatisPostText')}</p>
        </div>
        <hr />
        <br />

        <h3 className="h1 text-secondary">{t(dict,'ethicsHeading')}</h3>
        <p className="summary">
          {} <a href="https://www.eureka.club/manifest"> {t(dict,'ethicsText1')}</a>
        </p>
        <p className="summary">{t(dict,'ethicsText2')}</p>
        <p>
          {t(dict,'ethicsText3')}
          <a href="mailto:hola@eureka.club">hola@eureka.club</a>
        </p>
        
        <hr className="my-5" />

        <div className="contact-me" />
      </div>
    </Container>
    </>
  );
};

export default About;
