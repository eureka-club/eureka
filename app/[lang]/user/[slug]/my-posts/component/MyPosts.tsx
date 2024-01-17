'use client'
import { FC } from 'react';
import { Button, ButtonGroup, Col, Row, Spinner } from 'react-bootstrap';

import useMyPosts from '@/src/hooks/useMyPosts';
import PMI from '@/src/components/post/MosaicItem';
import { useRouter } from 'next/navigation'
import { BiArrowBack } from 'react-icons/bi';
import { UserMosaicItem } from '@/src/types/user';
import { Session } from '@/src/types';

import { useDictContext } from "@/src/hooks/useDictContext";


interface Props {
    session: Session | null;
    user: UserMosaicItem | null;
}

const MyPosts: FC<Props> = ({ session, user }) => {
    const { t, dict } = useDictContext();
    const router = useRouter();

    const { data: postsCreated } = useMyPosts(user!.id); //session?.user.language || langs
    return (
        <article className='mt-4' data-cy="my-posts">
            <ButtonGroup className="mt-1 mt-md-3 mb-1">
                <Button variant="primary text-white" onClick={() => router.back()} size="sm">
                    <BiArrowBack />
                </Button>
            </ButtonGroup>

            <h1 className="text-secondary fw-bold mt-sm-0 mb-4">{t(dict,'myPosts')}</h1>
            <Row>
                {postsCreated?.map(c =>
                    <Col key={c.id} xs={12} sm={6} lg={3} xxl={2} className='mb-5 d-flex justify-content-center  align-items-center'>
                        <PMI postId={c.id} size='md' />
                    </Col>
                )}
            </Row>

        </article>)
};

export default MyPosts;
