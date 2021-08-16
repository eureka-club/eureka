import classNames from 'classnames';
import dayjs from 'dayjs';
import HyvorTalk from 'hyvor-talk-react';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import TabContainer from 'react-bootstrap/TabContainer';
import TabContent from 'react-bootstrap/TabContent';
import TabPane from 'react-bootstrap/TabPane';
import Link from 'next/link';
import { useMutation } from 'react-query';
import { Work } from '@prisma/client';
import globalModalsAtom from '../../atoms/globalModals';

import { ASSETS_BASE_URL, DATE_FORMAT_SHORT_MONTH_YEAR, HYVOR_WEBSITE_ID, WEBAPP_URL } from '../../constants';
import { MySocialInfo, Session } from '../../types';
import { CycleDetail } from '../../types/cycle';
import { PostDetail, PostMosaicItem } from '../../types/post';
import { WorkDetail, WorkMosaicItem } from '../../types/work';

import LocalImageComponent from '../LocalImage';
import PostDetailComponent from '../post/PostDetail';
import CycleSummary from './CycleSummary';
import HyvorComments from '../common/HyvorComments';
import SocialInteraction from '../common/SocialInteraction';
import PostsMosaic from './PostsMosaic';
import WorksMosaic from './WorksMosaic';
import UnclampText from '../UnclampText';
import detailPagesAtom from '../../atoms/detailPages';
import styles from './CycleDetailHeader.module.css';
import MosaicItem from './MosaicItem';
import TagsInput from '../forms/controls/TagsInput';
import CarouselStatic from '../CarouselStatic';
import globalSearchEngineAtom from '../../atoms/searchEngine';

interface Props {
  cycle: CycleDetail;
  post?: PostDetail;
  work?: WorkDetail;
  isCurrentUserJoinedToCycle?: boolean;
  participantsCount?: number;
  postsCount?: number;
  worksCount?: number;
  mySocialInfo?: MySocialInfo;
}

const CycleDetailHeader: FunctionComponent<Props> = ({
  cycle,
  post,
  work,
  isCurrentUserJoinedToCycle,
  participantsCount,
  postsCount,
  worksCount,
  mySocialInfo,
}) => {
  const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [detailPagesState, setDetailPagesState] = useAtom(detailPagesAtom);
  const router = useRouter();
  const [session] = useSession() as [Session | null | undefined, boolean];
  const { t } = useTranslation('cycleDetail');
  const hyvorId = `${WEBAPP_URL}cycle/${cycle.id}`;

  const openSignInModal = () => {
    setGlobalModalsState({ ...globalModalsState, ...{ signInModalOpened: true } });
  };

  const {
    mutate: execJoinCycle,
    isLoading: isJoinCycleLoading,
    isSuccess: isJoinCycleSuccess,
  } = useMutation(async () => {
    await fetch(`/api/cycle/${cycle.id}/join`, { method: 'POST' });
  });
  const {
    mutate: execLeaveCycle,
    isLoading: isLeaveCycleLoading,
    isSuccess: isLeaveCycleSuccess,
  } = useMutation(async () => {
    await fetch(`/api/cycle/${cycle.id}/join`, { method: 'DELETE' });
  });

  const handleSubsectionChange = (key: string | null) => {
    if (key != null) {
      setDetailPagesState({ ...detailPagesState, selectedSubsectionCycle: key });
    }
  };

  const handleJoinCycleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    if (!session) openSignInModal();
    execJoinCycle();
  };

  const handleLeaveCycleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    execLeaveCycle();
  };

  useEffect(() => {
    if (isJoinCycleSuccess === true) {
      router.replace(router.asPath); // refresh page
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isJoinCycleSuccess]);

  useEffect(() => {
    if (isLeaveCycleSuccess === true) {
      router.replace(router.asPath); // refresh page
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLeaveCycleSuccess]);

  const handleEditClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    router.push(`/cycle/${router.query.id}/edit`);
  };

  const canEditCycle = (): boolean => {
    if (session) {
      if (session.user.roles === 'admin' || session!.user.id === cycle.creatorId) return true;
    }
    return false;
  };

  type Item = WorkMosaicItem | PostMosaicItem;
  const seeAll = async (data: Item[], q: string, showFilterEngine = true): Promise<void> => {
    setGlobalSearchEngineState({
      ...globalSearchEngineState,
      itemsFound: data as WorkMosaicItem[],
      q,
      show: showFilterEngine,
    });

    router.push('/search');
  };
  return (
    <Row className="mb-5">
      <Col md={9}>
        <h2>{cycle.title}</h2>
        {cycle.topics && <TagsInput tags={cycle.topics} readOnly />}
        <h3>Content calendar</h3>
        <CycleSummary cycle={cycle} />
        <div className={styles.customCarouselStaticContainer}>
          <CarouselStatic
            showSocialInteraction={false}
            onSeeAll={async () => seeAll(cycle.works as WorkMosaicItem[], t('Eurekas I created'))}
            title=""
            data={cycle.works as WorkMosaicItem[]}
            iconBefore={<></>}
            customMosaicStyle={{ height: '16em' }}
            // iconAfter={<BsCircleFill className={styles.infoCircle} />}
          />
        </div>
      </Col>
      <Col md={3}>
        <div className={styles.cycleCreator}>
          <Link href={`/mediatheque/${cycle.creator.id}`}>
            <a>
              <img
                src={cycle.creator.image || '/img/default-avatar.png'}
                alt="creator avatar"
                className={classNames(styles.cycleCreatorAvatar, 'mr-2')}
              />
              {cycle.creator.name}
            </a>
          </Link>
        </div>
        <MosaicItem cycle={cycle} detailed showTrash />
      </Col>
    </Row>
  );
};

export default CycleDetailHeader;
