"use client"

import SignInForm from "@/src/components/forms/SignInForm";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { FC, useEffect } from "react";
import { Alert, Spinner } from "react-bootstrap";
import toast from 'react-hot-toast';
import { useJoinUserToCycleAction } from '@/src/hooks/mutations/useCycleJoinOrLeaveActions';
import { useModalContext } from '@/src/hooks/useModal';
import { useIsFetching } from "@tanstack/react-query";

import { useDictContext } from "@/src/hooks/useDictContext";
import CycleDetail from "./CycleDetail";
import useCycle from "@/src/hooks/useCycle";
import { useSession } from "next-auth/react";
import useCycleParticipants from "@/src/hooks/useCycleParticipants";
import { Button, Container } from "@mui/material";
import Banner from "@/src/components/Banner";
interface Props{
}
const Cycle:FC<Props>=({}:Props)=>{
    const {id} = useParams<{id:string}>()!;
    const{data:session}=useSession();
    const {data:cycle} = useCycle(+id);
    const isFetchingCycle = useIsFetching({queryKey:['CYCLE', `${id}`]});
    const { show } = useModalContext();
    const{t,dict}=useDictContext();
    const{data:participants}=useCycleParticipants(+id);
    const asPath=usePathname();
    const searchParams = useSearchParams();
    const join = searchParams?.get('join');
    // const { data: participants, isLoading: isLoadingParticipants } = useUsers(whereCycleParticipants(props.id), {
    // enabled: !!props.id,
    // from: 'cycle/[id]',
    // });

    // const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
    // const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT, NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = props;

    const renderCycleDetailComponent = () => {
        if (cycle) {
            const res = <CycleDetail/>;
            if (cycle.access === 1) return res;
            else if (cycle.access === 2) return res;
            else if ([3,4].includes(cycle.access) && cycle.currentUserIsParticipant) return res;
            return <Alert>Not authorized</Alert>;
        }
        
        return <Alert variant="warning">
            <>{t(dict,'notFound')}</>
        </Alert>
    };

    const openSignInModal = () => {
        show(<SignInForm />);
    };

    const {
    mutate: execJoinCycle,
    isPending: isJoinCycleLoading,
    data: mutationResponse,
    isSuccess: isJoined,
  } = useJoinUserToCycleAction((session as any)?.user, cycle!, participants || [], (_data:any, error:any) => {
    if (!error) {
      if (cycle && ![2, 4].includes(cycle?.access))
        toast.success(t(dict,'OK'))
    }
    else toast.success(t(dict,'Internal Server Error'));
  });

  useEffect(() => {
    

    if (
      session?.user &&
      join &&
      participants?.findIndex(i => i.id == session.user.id) == -1
    ) {
      execJoinCycle();
    }
  }, [])

  const requestJoinCycle = async () => {
    if (!session) openSignInModal();
    else if (cycle) {
      execJoinCycle();
    }
  };

  const isPending = () => isFetchingCycle > 0 || isJoinCycleLoading;

  if (!isPending() && !cycle)
    return (
        <Alert variant="danger">{t(dict,'notFound')}</Alert>
    );

  const getBanner = () => {
    if (cycle && !cycle?.currentUserIsParticipant) {
      if (asPath!.search(/\/cycle\/21/g) > -1)
        return (
          <Banner
            cacheKey={['BANNER-CYCLE', `${cycle.id}`]}
            className="bg-danger"
            style={{}}
            show
            content={
              <aside className="text-center text-white">
                <h2 className="h2">
                  Participa en nuestra conversación y aporta para construir espacios digitales para toda la diversidad
                  de cuerpos e identidades
                </h2>
                <p>22 de agosto - 14 de octubre</p>
                <div className="d-grid gap-2">
                  <Button
                    disabled={isPending()}
                    className="pt-2 pb-1 px-5"
                    // variant="primary"
                    // size="lg"
                    onClick={requestJoinCycle}
                  >
                    <h4 className="text-white fw-bold">
                      ¡Unirse ya! {isPending() && <Spinner size="sm" animation="grow" variant="info" />}
                    </h4>
                  </Button>
                </div>
              </aside>
            }
          />
        );
    }
    return <></>;
  };

  if (cycle)
    return (
        <Container>
          {renderCycleDetailComponent()}
        </Container>
    );


  return (
    <Container>
      <Spinner animation="grow" variant="info" />
    </Container>
  );
};

export default Cycle;
