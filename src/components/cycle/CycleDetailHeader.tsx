// import classNames from 'classnames';
// import dayjs from 'dayjs';
// import HyvorTalk from 'hyvor-talk-react';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent } from 'react';
// import Button from 'react-bootstrap/Button';

// import Nav from 'react-bootstrap/Nav';
// import NavItem from 'react-bootstrap/NavItem';
// import NavLink from 'react-bootstrap/NavLink';
import { Col, Row, Button } from 'react-bootstrap';
// import Spinner from 'react-bootstrap/Spinner';
// import TabContainer from 'react-bootstrap/TabContainer';
// import TabContent from 'react-bootstrap/TabContent';
// import TabPane from 'react-bootstrap/TabPane';
// import Link from 'next/link';
// import { useMutation } from 'react-query';
// import { Work } from '@prisma/client';
import Rating from 'react-rating';
import { GiBrain } from 'react-icons/gi';

// import globalModalsAtom from '../../atoms/globalModals';

// import { ASSETS_BASE_URL, DATE_FORMAT_SHORT_MONTH_YEAR, HYVOR_WEBSITE_ID, WEBAPP_URL } from '../../constants';
import { MySocialInfo, Session } from '../../types';
import { CycleMosaicItem } from '../../types/cycle';
import { PostMosaicItem } from '../../types/post';
import { WorkMosaicItem } from '../../types/work';

// import LocalImageComponent from '../LocalImage';
// import PostDetailComponent from '../post/PostDetail';
import CycleSummary from './CycleSummary';
// import HyvorComments from '../common/HyvorComments';
// import SocialInteraction from '../common/SocialInteraction';
// import PostsMosaic from './PostsMosaic';
// import WorksMosaic from './WorksMosaic';
// import UnclampText from '../UnclampText';
// import detailPagesAtom from '../../atoms/detailPages';
import styles from './CycleDetailHeader.module.css';
import MosaicItem from './MosaicItem';
import TagsInput from '../forms/controls/TagsInput';
import UserAvatar from '../common/UserAvatar';
import CarouselStatic from '../CarouselStatic';
import globalSearchEngineAtom from '../../atoms/searchEngine';
import { MosaicContext } from '../../useMosaicContext';

interface Props {
  cycle: CycleMosaicItem;
  post?: PostMosaicItem;
  work?: WorkMosaicItem;
  isCurrentUserJoinedToCycle?: boolean;
  participantsCount?: number;
  postsCount?: number;
  worksCount?: number;
  mySocialInfo?: MySocialInfo;
  onCarouselSeeAllAction?: () => Promise<void>;
  onParticipantsAction?: () => Promise<void>;
}

const CycleDetailHeader: FunctionComponent<Props> = ({
  cycle,
  onCarouselSeeAllAction,
  onParticipantsAction,
  // post,
  // work,
  // isCurrentUserJoinedToCycle,
  // participantsCount,
  // postsCount,
  // worksCount,
  // mySocialInfo,
}) => {
  const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  // const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  // const [detailPagesState, setDetailPagesState] = useAtom(detailPagesAtom);
  const router = useRouter();
  const [session] = useSession() as [Session | null | undefined, boolean];
  const { t } = useTranslation('cycleDetail');
  // const hyvorId = `${WEBAPP_URL}cycle/${cycle.id}`;

  // const openSignInModal = () => {
  //   setGlobalModalsState({ ...globalModalsState, ...{ signInModalOpened: true } });
  // };

  // const {
  //   // mutate: execJoinCycle,
  //   // isLoading: isJoinCycleLoading,
  //   isSuccess: isJoinCycleSuccess,
  // } = useMutation(async () => {
  //   await fetch(`/api/cycle/${cycle.id}/join`, { method: 'POST' });
  // });
  // const {
  //   // mutate: execLeaveCycle,
  //   // isLoading: isLeaveCycleLoading,
  //   isSuccess: isLeaveCycleSuccess,
  // } = useMutation(async () => {
  //   await fetch(`/api/cycle/${cycle.id}/join`, { method: 'DELETE' });
  // });

  // const handleSubsectionChange = (key: string | null) => {
  //   if (key != null) {
  //     setDetailPagesState({ ...detailPagesState, selectedSubsectionCycle: key });
  //   }
  // };

  // const handleJoinCycleClick = (ev: MouseEvent<HTMLButtonElement>) => {
  //   ev.preventDefault();
  //   if (!session) openSignInModal();
  //   execJoinCycle();
  // };

  // const handleLeaveCycleClick = (ev: MouseEvent<HTMLButtonElement>) => {
  //   ev.preventDefault();
  //   execLeaveCycle();
  // };

  // useEffect(() => {
  //   if (isJoinCycleSuccess === true) {
  //     router.replace(router.asPath); // refresh page
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isJoinCycleSuccess]);

  // useEffect(() => {
  //   if (isLeaveCycleSuccess === true) {
  //     router.replace(router.asPath); // refresh page
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isLeaveCycleSuccess]);

  // const handleEditClick = (ev: MouseEvent<HTMLButtonElement>) => {
  //   ev.preventDefault();
  //   router.push(`/cycle/${router.query.id}/edit`);
  // };

  // const canEditCycle = (): boolean => {
  //   if (session) {
  //     if (session.user.roles === 'admin' || session!.user.id === cycle.creatorId) return true;
  //   }
  //   return false;
  // };

  type Item = WorkMosaicItem | PostMosaicItem;
  const seeAll = async (data: Item[], q: string, showFilterEngine = true): Promise<void> => {
    setGlobalSearchEngineState({
      ...globalSearchEngineState,
      itemsFound: data as WorkMosaicItem[],
      q: `${t('Works on Cycle')} ${cycle.id}`,
      show: showFilterEngine,
    });

    router.push('/search');
  };

  const getFullSymbol = () => {
    if (cycle && session) {
      const s = session as unknown as Session;
      const ratingByMe = cycle.ratings.findIndex((r) => r.userId === s.user.id);
      if (ratingByMe) return <GiBrain style={{ color: 'var(--eureka-blue)' }} />;
    }

    return <GiBrain style={{ color: 'var(--eureka-green)' }} />;
  };

  const getRatingQty = () => {
    if (cycle) {
      return cycle.ratings.length;
    }
    return 0;
  };

  const getRatingAvg = () => {
    if (cycle) {
      let res = 0;
      cycle.ratings.forEach((r) => {
        res += r.qty;
      });
      res /= cycle.ratings.length;
      return +res.toFixed(1) || 0;
    }
    return 0;
  };

  return (
    <Row className="mb-5">
      <Col md={9}>
        <h2>{cycle.title}</h2>
        {cycle.topics && <TagsInput tags={cycle.topics} readOnly />}
        <Rating
          readonly
          initialRating={getRatingAvg()}
          // onChange={handlerChangeRating}
          className={styles.rating}
          stop={5}
          emptySymbol={<GiBrain style={{ color: 'var(--eureka-grey)' }} />}
          fullSymbol={getFullSymbol()}
        />{' '}
        {getRatingAvg()}
        {' - '}
        {getRatingQty()} {t('ratings')}
        <h3>Content calendar ({cycle.works && cycle.works.length})</h3>
        <CycleSummary cycle={cycle} />
        {/* <Button className={`${styles.seeParticipantsBtn}`} onClick={onParticipantsAction}>
          {cycle.participants.length} participants
        </Button> */}
        <div className={styles.customCarouselStaticContainer}>
          <CarouselStatic
            showSocialInteraction={false}
            // onSeeAll={async () => seeAll(cycle.works as WorkMosaicItem[], t('Eurekas I created'))}
            onSeeAll={onCarouselSeeAllAction}
            title=""
            data={cycle.works as WorkMosaicItem[]}
            iconBefore={<></>}
            customMosaicStyle={{ height: '16em' }}
            // iconAfter={<BsCircleFill className={styles.infoCircle} />}
          />
        </div>
      </Col>
      <Col md={3}>
        <UserAvatar user={cycle.creator} />
        <MosaicContext.Provider value={{ showShare: true }}>
          <MosaicItem cycle={cycle} showTrash className="mt-2" />
        </MosaicContext.Provider>
      </Col>
    </Row>
  );
};

export default CycleDetailHeader;
