import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { useState, useEffect, SyntheticEvent } from 'react';

import { Spinner, Card, Row, Col, ButtonGroup, Button, Alert } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';
import SimpleLayout from '../src/components/layouts/SimpleLayout';
import EditUserForm from '@/components/forms/EditUserForm';

const Profile: NextPage = () => {
  const [session, isLoadingSession] = useSession();
  const [id, setId] = useState<string>('');
  const [idSession, setIdSession] = useState<string>('');
  const router = useRouter();
  
  const { t } = useTranslation('common');


  return (
    <SimpleLayout title={t('Profile')}>
      <>
        <ButtonGroup className="mt-1 mt-md-3 mb-1">
          <Button variant="primary text-white" onClick={() => router.back()} size="sm">
            <BiArrowBack />
          </Button>
        </ButtonGroup>
      </>
      <EditUserForm />
    </SimpleLayout>
  );
};

export default Profile;
