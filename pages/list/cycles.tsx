import { Cycle, LocalImage } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Table from 'react-bootstrap/Table';
import { QueryClient, dehydrate, useMutation } from '@tanstack/react-query';;

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DATE_FORMAT_HUMANIC_ADVANCED } from '@/src/constants';
import { Session } from '@/src/types';
import { advancedDayjs } from '@/src/lib/utils';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import LocalImageComponent from '@/src/components/LocalImage';
import useCycles, { getCycles } from '@/src/useCycles';

dayjs.extend(utc);
dayjs.extend(timezone);
interface Props {
  session:Session;
  
}

const ListCyclesPage: NextPage<Props> = ({ session }) => {
  const router = useRouter();
  const asPath = usePathname()!;
  const { mutate: execDeleteCycle, isSuccess: isDeleteCycleSucces } = useMutation(
    {
      mutationFn:async (cycle: Cycle) => {
        const res = await fetch(`/api/cycle/${cycle.id}`, {
          method: 'delete',
        });
        const data = await res.json();
    
        return data;
      }
    }
  );

  const {data} = useCycles();
  const cycles = data?.cycles;

  const handleDeleteClick = (cycle: Cycle) => {
    execDeleteCycle(cycle);
  };

  useEffect(() => {
    if (isDeleteCycleSucces === true) {
      router.replace(asPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteCycleSucces]);

  return (
    <SimpleLayout title="Cycles list">
      <h1 style={{ marginBottom: '2rem' }}>Cycles list</h1>

      {cycles ? <Table>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>access</th>
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
                  alt="cycle cover"
                  filePath={cycle.localImages[0].storedFile}
                  height={96}

                  style={{ height: '96px', marginRight: '1rem' }}
                />
              </td>
              <td>{cycle.access}</td>
              <td>{cycle.title}</td>
              <td>{cycle.languages}</td>
              <td>{advancedDayjs(dayjs(cycle.startDate).format()).utc().format(DATE_FORMAT_HUMANIC_ADVANCED)}</td>
              <td>{advancedDayjs(dayjs(cycle.endDate).format()).utc().format(DATE_FORMAT_HUMANIC_ADVANCED)}</td>
              <td>
                <Link legacyBehavior  href={`/cycle/${cycle.id}`}>
                  <a>detail</a>
                </Link>

                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  transition={false}
                  overlay={
                    <Popover id="confirmDelete">
                      <Popover.Body>
                        <Button variant="danger" onClick={() => handleDeleteClick(cycle)}>
                          confirm delete!!!
                        </Button>
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <Button variant="link" className="ms-2">
                    delete?
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>:<>...</>}
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = (await getSession(ctx)) as unknown as Session;
  if (session == null || !session.user.roles.includes('admin')) {
    return { notFound: true };
  }

  const origin = process.env.NEXT_PUBLIC_WEBAPP_URL;
  const qc = new QueryClient();
  const cyclesData = await getCycles(ctx.locale!,undefined, origin);
  qc.prefetchQuery({queryKey:['list/cycles'], queryFn:() => cyclesData});


  return {
    props: {
      session,
      dehydratedState: dehydrate(qc),
    },
  };
};

export default ListCyclesPage;
