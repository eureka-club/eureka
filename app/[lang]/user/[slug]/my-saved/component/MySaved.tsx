'use client'
import { FC } from 'react';
import { Button, ButtonGroup, Col, Row,Tab, Tabs } from 'react-bootstrap';
import CMI from '@/src/components/cycle/MosaicItem'
import PMI from '@/src/components/post/MosaicItem'
import WMI from '@/components/work/MosaicItem';
import { useParams, useRouter } from 'next/navigation'
import { BiArrowBack } from 'react-icons/bi';
import { useDictContext } from "@/src/hooks/useDictContext";
import getUserIdFromSlug from '@/src/getUserIdFromSlug';
import { WorkDetail } from '@/src/types/work';
import { CycleDetail } from '@/src/types/cycle';
import { PostDetail } from '@/src/types/post';
import useFavCycles from '@/src/hooks/useFavCycles';
import useFavPosts from '@/src/hooks/useFavPosts';
import useFavWorks from '@/src/hooks/useFavWorks';

interface Props {
}

const MySaved: FC<Props> = () => {
    const {slug,lang}=useParams<{slug:string,lang:string}>()!;
    const id = +getUserIdFromSlug(slug);

    const { t, dict } = useDictContext();
    const router = useRouter();

    const {data:favCycles=[]}=useFavCycles(id!,lang);
    const {data:favPosts=[]}=useFavPosts(id!,lang);
    const {data:favWorks=[]}=useFavWorks(id!,lang);



    const sfl = {favCycles,favPosts,favWorks};

    const renderPosts = () => {
        return <Row className='mt-5'>
            {sfl.favPosts.map((i:PostDetail) =>
                <Col key={i.id} xs={12} sm={6} lg={3} xxl={2} className='mb-5 d-flex justify-content-center  align-items-center'>
                    <PMI postId={i.id} size='md' />
                </Col>
            )}
        </Row>
    }
    const renderCycles = () => {
        return <Row className='mt-5'>
            {sfl.favCycles.map((i:CycleDetail) =>
                <Col key={i.id} xs={12} sm={6} lg={3} xxl={2} className='mb-5 d-flex justify-content-center  align-items-center'>
                    <CMI cycleId={i.id} size='md' />
                </Col>
            )}
        </Row>
    }
    const renderWorks = () => {
        return <Row className='mt-5'>
            {sfl.favWorks.map((c:WorkDetail) =>
                <Col key={c.id} xs={12} sm={6} lg={3} xxl={2} className='mb-5 d-flex justify-content-center  align-items-center'>
                    <WMI notLangRestrict workId={c.id} size='md' />
                </Col>
            )}
        </Row>
    }




    return (
        <article className='mt-4' data-cy="my-posts">
            <ButtonGroup className="mt-1 mt-md-3 mb-1">
                <Button variant="primary text-white" onClick={() => router.back()} size="sm">
                    <BiArrowBack />
                </Button>
            </ButtonGroup>

            <h1 className="text-secondary fw-bold mt-sm-0 mb-4">{t(dict,'mySaved')}</h1>
            {/* language=CSS */}
            <style jsx global>
                {`
                    .nav-tabs .nav-item.show .nav-link,
                    .nav-tabs .nav-link.active,
                    .nav-tabs .nav-link:hover {
                      background-color: var(--bs-primary);
                      color: white !important;
                      border: none !important;
                      border-bottom: solid 2px var(--bs-primary) !important;
                    }
                    .nav-tabs {
                      border: none !important;
                      border-bottom: solid 1px var(--bs-primary) !important;
                    }
                    .nav-link{
                        color:var(--bs-primary)
                    }
                  `}
            </style>

            <Tabs
                defaultActiveKey="works"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                {sfl.favPosts.length ? <Tab eventKey="posts" title={t(dict,'posts')}>
                    {renderPosts()}
                </Tab> : ''}
                {sfl.favCycles.length ? <Tab eventKey="cycles" title={t(dict,'cycles')}>
                    {renderCycles()}
                </Tab> : ''}
                {sfl.favWorks.length ? <Tab eventKey="works" title={t(dict,'works')}>
                    {renderWorks()}
                </Tab> : ''}
            </Tabs>

        </article>)
};

export default MySaved;
