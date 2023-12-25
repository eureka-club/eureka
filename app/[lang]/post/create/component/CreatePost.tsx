"use client"
import CreatePostForm from "@/src/components/forms/CreatePostForm";
import { t } from "@/src/get-dictionary";
import { useDictContext } from "@/src/hooks/useDictContext";
import { useRouter, useSearchParams } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";
import { Spinner, Card, Row, Col, ButtonGroup, Button, Alert } from 'react-bootstrap';

export default function CreatePost() {
  const { dict } = useDictContext();
  const searchParams = useSearchParams();
  const searchtext = searchParams.get('searchtext');
  const searchstyle = searchParams.get('searchstyle');
  const router = useRouter();

  return (<section className='d-flex flex-column-reverse flex-lg-row'>
    <Col xs={12} lg={2} className="me-4" >
      <section className='mt-5'>
        <h3 className="text-secondary fw-bold">{t(dict, 'DoubtsAI')}</h3>
        {/*<Link href="/about"><a className='text-primary text-decoration-underline text-blue' onClick={()=> window.scrollTo(0, 0)}>{t('browserTitleAbout')} </a></Link>*/}
      </section>
      <section className="mt-4 p-3 rounded overflow-auto bg-secondary text-white" role="presentation" >
        <p className="p-2 m-0 text-wrap text-center fs-6">{t(dict, 'AIAbout1')}</p>
      </section>
      <section className="mt-4 p-3 rounded overflow-auto bg-yellow text-secondary" role="presentation" >
        <p className="p-2 m-0 text-wrap text-center fs-6">{t(dict, 'AIAbout2')}</p>
      </section>
      <section className="mt-4 p-3 rounded overflow-auto bg-secondary text-white" role="presentation" >
        <p className="p-2 m-0 text-wrap text-center fs-6">{t(dict, 'AIAbout3')}</p>
      </section>
      <section className="mt-4 p-3 rounded overflow-auto bg-yellow text-secondary" role="presentation" >
        <p className="p-2 m-0 text-wrap text-center fs-6">{t(dict, 'AIAbout4')}</p>
      </section>
      <section className="mt-4 p-3 rounded overflow-auto bg-secondary text-white" role="presentation" >
        <p className="p-2 m-0 text-wrap text-center fs-6">{t(dict, 'AIAbout5')}</p>
      </section>
    </Col>
    <Col xs={12} lg={10}>
      <section className='ms-0 ms-lg-4'>
        <ButtonGroup className="mt-1 mt-md-3 mb-1">
          <Button variant="primary text-white" onClick={() => router.back()} size="sm">
            <BiArrowBack />
          </Button>
        </ButtonGroup>
        <CreatePostForm noModal params={{ searchtext, searchstyle }} />
      </section>
    </Col>
  </section>  )
}