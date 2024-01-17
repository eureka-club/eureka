"use client"
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import CreateCycleForm from '@/src/components/forms/CreateCycleForm';
import { BiArrowBack } from 'react-icons/bi';
import { Spinner, Card, Row, Col, ButtonGroup, Button, Alert } from 'react-bootstrap';
import { Session } from '@/src/types';

interface Props {
  session:Session
}

const CycleCreate:FC<Props> = ({session}) => {
  const router = useRouter();

  return  <>
    <ButtonGroup className="mt-1 mt-md-3 mb-1">
      <Button variant="primary text-white" onClick={() => router.back()} size="sm">
        <BiArrowBack />
      </Button>
    </ButtonGroup>
      <CreateCycleForm/>
  </>
};

export default CycleCreate;
