"use client"
import { useRouter } from 'next/navigation';
import { Session } from '@/src/types';
import CreateWorkForm from '@/components/forms/CreateWorkForm';
import { ButtonGroup, Button } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';
import { FC } from 'react';

interface Props {
  notFound?: boolean;
  session?: Session
}
const WorkCreate: FC<Props> = ({  }) => {
  const router = useRouter();

  return <>
        <ButtonGroup className="mt-1 mt-md-3 mb-1">
          <Button variant="primary text-white" onClick={() => router.back()} size="sm">
            <BiArrowBack />
          </Button>
        </ButtonGroup>
      <CreateWorkForm noModal/>
    </>
};

export default WorkCreate;
