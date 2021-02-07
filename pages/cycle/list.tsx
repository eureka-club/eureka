import { Cycle, LocalImage } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import PopoverContent from 'react-bootstrap/PopoverContent';
import Table from 'react-bootstrap/Table';
import { useMutation } from 'react-query';

import { DATE_FORMAT_HUMANIC_ADVANCED } from '../../src/constants';
import { advancedDayjs } from '../../src/lib/utils';
import SimpleLayout from '../../src/components/layouts/SimpleLayout';
import LocalImageComponent from '../../src/components/LocalImage';
import { findAll } from '../../src/facades/cycle';

interface Props {
  cycles: (Cycle & {
    localImages: LocalImage[];
  })[];
}

const CyclesListPage: NextPage<Props> = ({ cycles }) => {
  const router = useRouter();
  const [execDeleteWork, { isSuccess: isDeleteCycleSucces }] = useMutation(async (cycle: Cycle) => {
    const res = await fetch(`/api/cycle/${cycle.id}`, {
      method: 'delete',
    });
    const data = await res.json();

    return data;
  });

  const handleDeleteClick = (cycle: Cycle) => {
    execDeleteWork(cycle);
  };

  useEffect(() => {
    if (isDeleteCycleSucces === true) {
      router.replace(router.asPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteCycleSucces]);

  return (
    <SimpleLayout title="Works library">
      <h1 style={{ marginBottom: '2rem' }}>Cycles list</h1>

      <Table>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>is public?</th>
            <th>title</th>
            <th>languages</th>
            <th>start date</th>
            <th>end date</th>
            <th>[actions]</th>
          </tr>
        </thead>
        <tbody>
          {cycles.map((cycle) => (
            <tr key={cycle.id}>
              <td>
                <LocalImageComponent
                  alt="work cover"
                  filePath={cycle.localImages[0].storedFile}
                  style={{ height: '96px', marginRight: '1rem' }}
                />
              </td>
              <td>{JSON.stringify(cycle.isPublic)}</td>
              <td>{cycle.title}</td>
              <td>{cycle.languages}</td>
              <td>{advancedDayjs(cycle.startDate).format(DATE_FORMAT_HUMANIC_ADVANCED)}</td>
              <td>{advancedDayjs(cycle.endDate).format(DATE_FORMAT_HUMANIC_ADVANCED)}</td>
              <td>
                <Link href={`/cycle/${cycle.id}`}>
                  <a>detail</a>
                </Link>

                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  transition={false}
                  overlay={
                    <Popover id="confirmDelete">
                      <PopoverContent>
                        <Button variant="danger" onClick={() => handleDeleteClick(cycle)}>
                          confirm delete!!!
                        </Button>
                      </PopoverContent>
                    </Popover>
                  }
                >
                  <Button variant="link" className="ml-2">
                    delete?
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const cycles = await findAll();

  return {
    props: {
      cycles,
    },
  };
};

export default CyclesListPage;
