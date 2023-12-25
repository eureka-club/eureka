"use client"

import SignInForm from "@/src/components/forms/SignInForm";
import { CycleContext } from "@/src/hooks/useCycleContext";
import { Session } from "@/src/types";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { FC } from "react";
import { Alert } from "react-bootstrap";
import toast from 'react-hot-toast';
import { useJoinUserToCycleAction } from '@/src/hooks/mutations/useCycleJoinOrLeaveActions';
import { useModalContext } from '@/src/hooks/useModal';
import { CycleMosaicItem } from "@/src/types/cycle";
import { useIsFetching } from "@tanstack/react-query";
import { UserMosaicItem } from "@/src/types/user";
import { t } from "@/src/get-dictionary";
import { useDictContext } from "@/src/hooks/useDictContext";
import CycleDetail from "./CycleDetail";
import useCycle from "@/src/hooks/useCycle";


interface Props{
    session:Session;
    participants:UserMosaicItem[];
}
const Cycle:FC<Props>=({session,participants})=>{
    const {id} = useParams<{id:string}>();

    const {data:cycle} = useCycle(+id);
    const isFetchingCycle = useIsFetching({queryKey:['CYCLE', `${id}`]});
    const { show } = useModalContext();
    const{dict,langs}=useDictContext();
    // const { data: participants, isLoading: isLoadingParticipants } = useUsers(whereCycleParticipants(props.id), {
    // enabled: !!props.id,
    // from: 'cycle/[id]',
    // });

    // const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
    // const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT, NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = props;

    const renderCycleDetailComponent = () => {
        if (cycle) {
            const res = <CycleDetail session={session} />;
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
    } = useJoinUserToCycleAction(session, cycle!, participants || [], (_data, error) => {
        if (!error) toast.success(t(dict,'OK'));
        else toast.success(t(dict,'Internal Server Error'));
    });

    const requestJoinCycle = async () => {
    if (!session) openSignInModal();
    else if (cycle) {
        execJoinCycle();
    }
    };

    const isPending = () => isFetchingCycle > 0 || isJoinCycleLoading;

    // const getBanner = () => {
    // if (cycle && !cycle?.currentUserIsParticipant) {
    //     if (asPath.search(/\/cycle\/21/g) > -1)
    //     return (
    //         <Banner
    //         cacheKey={['BANNER-CYCLE', `${cycle.id}`]}
    //         className="bg-danger"
    //         style={{}}
    //         show
    //         content={
    //             <aside className="text-center text-white">
    //             <h2 className="h2">
    //                 Participa en nuestra conversación y aporta para construir espacios digitales para toda la diversidad
    //                 de cuerpos e identidades
    //             </h2>
    //             <p>22 de agosto - 14 de octubre</p>
    //             <div className="d-grid gap-2">
    //                 <Button
    //                 disabled={isPending()}
    //                 className="pt-2 pb-1 px-5"
    //                 variant="primary"
    //                 size="lg"
    //                 onClick={requestJoinCycle}
    //                 >
    //                 <h4 className="text-white fw-bold">
    //                     ¡Unirse ya! {isPending() && <Spinner size="sm" animation="grow" variant="info" />}
    //                 </h4>
    //                 </Button>
    //             </div>
    //             </aside>
    //         }
    //         />
    //     );
    // }
    // return <></>;
    // };

    if (cycle)
    return (
        <CycleContext.Provider
        value={{ cycle, currentUserIsParticipant: cycle?.currentUserIsParticipant, linkToCycle: false }}
        >
        {/* <Head>
            <meta
            name="title"
            content={`${t('meta:cycleTitle')} ${props.metas.title} ${t('meta:cycleTitle1')} ${props.metas.creator}`}
            ></meta>
            <meta
            name="description"
            content={`${t('meta:cycleDescription')}: ${props.metas.works}.`}
            ></meta>
            <meta property="og:title" content={props.metas?.title || ''} />
            <meta property="og:url" content={`${WEBAPP_URL}/cycle/${props.metas?.id || ''}`} />
            <meta
            property="og:image"
            content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${
                props.metas?.storedFile || ''
            }`}
            />
            <meta property="og:type" content="article" />

            <meta name="twitter:card" content="summary_large_image"></meta>
            <meta name="twitter:site" content="@eleurekaclub"></meta>
            <meta name="twitter:title" content={props.metas?.title || ''}></meta>
            <meta name="twitter:url" content={`${WEBAPP_URL}/cycle/${props.metas?.id || ''}`}></meta>
            <meta
            name="twitter:image"
            content={`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${
                props.metas?.storedFile || ''
            }`}
            ></meta>
        </Head> */}
        {renderCycleDetailComponent()}
        </CycleContext.Provider>
    );
}
export default Cycle;