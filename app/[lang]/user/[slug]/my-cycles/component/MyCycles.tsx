'use client'
import { FC, useState, useEffect, SyntheticEvent, MouseEvent } from 'react';
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { Button, ButtonGroup, Col, Row, Spinner } from 'react-bootstrap';

import useMyCycles from '@/src/hooks/useMyCycles';
import CMI from '@/src/components/cycle/MosaicItem';
import { useRouter } from 'next/navigation'
import { BiArrowBack } from 'react-icons/bi';
import { UserMosaicItem } from '@/src/types/user';
import { Session } from '@/src/types';
import { t } from "@/src/get-dictionary";
import { useDictContext } from "@/src/hooks/useDictContext";


interface Props {
    session: Session | null;
    user: UserMosaicItem | null;
}

const MyCycles: FC<Props> = ({ session, user }) => {
    const { dict, langs } = useDictContext();
    const router = useRouter();
    const { data: dataCycles } = useMyCycles(session?.user.language || langs, user!.id);

    return (
        <article className='mt-4' data-cy="my-posts">
            <ButtonGroup className="mt-1 mt-md-3 mb-1">
                <Button variant="primary text-white" onClick={() => router.back()} size="sm">
                    <BiArrowBack />
                </Button>
            </ButtonGroup>

            <h1 className="text-secondary fw-bold mt-sm-0 mb-4">{t(dict,'myCycles')}</h1>
            <Row>
                {dataCycles?.cycles.map(c =>
                    <Col key={c.id} xs={12} sm={6} lg={3} xxl={2} className='mb-5 d-flex justify-content-center  align-items-center'>
                        <CMI cycleId={c.id} size='md' />
                    </Col>
                )}
            </Row>

        </article>)
};

export default MyCycles;
