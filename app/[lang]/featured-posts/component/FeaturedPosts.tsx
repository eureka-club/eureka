'use client'
import { useRouter } from "next/navigation";
import { FC } from "react";
import { t } from '@/src/get-dictionary';
import { useDictContext } from '@/src/hooks/useDictContext';
import { LANGUAGES } from '@/src/constants';
import { Session } from '@/src/types';
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import useFeaturedEurekas, { getFeaturedEurekas } from '@/src/hooks/useFeaturedEurekas';
import PMI from '@/src/components/post/MosaicItem'; import { BiArrowBack } from 'react-icons/bi';

interface Props {
    session: Session | null;
}

const FeaturedPosts: FC<Props> = ({ session }) => {
    const router = useRouter()
    const { dict, langs } = useDictContext();
    const languages = langs.split(',').map(l => LANGUAGES[l]).join(',');

    const { data: dataCycles } = useFeaturedEurekas()


    return (dataCycles?.posts && dataCycles?.posts.length)
        ? <article className='mt-4' data-cy="my-cycles">
            <ButtonGroup className="mt-1 mt-md-3 mb-1">
                <Button variant="primary text-white" onClick={() => router.back()} size="sm">
                    <BiArrowBack />
                </Button>
            </ButtonGroup>
            <>
                <h1 className="text-secondary fw-bold mt-sm-0 mb-4">{t(dict,'Featured Eurekas')}</h1>
                <Row>
                    {dataCycles?.posts.map(c =>
                        <Col key={c.id} xs={12} sm={6} lg={3} xxl={2} className='mb-5 d-flex justify-content-center  align-items-center'>
                            <PMI postId={c.id} />
                        </Col>
                    )}
                </Row>
            </>

        </article>
        : <></>;
    return <></>
};

export default FeaturedPosts