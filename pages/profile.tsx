import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { ButtonGroup, Button } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import EditUserForm from '@/components/forms/EditUserForm';

const Profile: NextPage = () => {
  
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
