import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent /*  useEffect, useState */ } from 'react';
import { Card /* Button */ } from 'react-bootstrap';
// import { MySocialInfo } from '@/src/types';
// import { CycleDetail } from '../../types/cycle';
// import { PostDetail } from '../../types/post';
// import { useQuery } from 'react-query';
import { useSession } from 'next-auth/client';
import { /* WorkWithImages, */ WorkMosaicItem } from '../../types/work';
import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';
import SocialInteraction from '../common/SocialInteraction';
import { Session } from '../../types';

interface Props {
  // workWithImages: WorkWithImages;
  work: WorkMosaicItem;
  showButtonLabels?: boolean;
  showShare?: boolean;
  showSocialInteraction?: boolean;
  style?: { [k: string]: string };
  cacheKey?: string[];
  showTrash?: boolean;
}
const MosaicItem: FunctionComponent<Props> = ({
  work,
  showButtonLabels = true,
  showShare = false,
  showSocialInteraction = true,
  style = undefined,
  cacheKey = undefined,
  showTrash = false,
}) => {
  const { t } = useTranslation('common');
  const { id, /* author, */ title, localImages, type } = work;
  const [session] = useSession() as [Session | null | undefined, boolean];
  // const [work, setWork] = useState<WorkDetail>();
  // const s
  // const { data: workData } = useQuery(['WORKS', id]);
  // useEffect(() => {
  //   if (workData) {
  //     setWork(workData as WorkDetail);
  //   }
  // }, [workData]);

  return (
    <Card className={styles.container}>
      <div className={styles.imageContainer} style={style}>
        <Link href={`/work/${id}`}>
          <a>
            <LocalImageComponent filePath={localImages[0].storedFile} alt={title} />
          </a>
        </Link>
        <span className={styles.type}>{t(type)}</span>
      </div>
      {showSocialInteraction && work && (
        <Card.Footer className={styles.footer}>
          <SocialInteraction
            cacheKey={cacheKey || undefined}
            showButtonLabels={showButtonLabels}
            showCounts
            showShare={showShare}
            entity={work}
            showTrash={showTrash}
          />
        </Card.Footer>
      )}
    </Card>
    // <article className={styles.post}>
    //   <div className={styles.imageContainer}>
    //     <Link href={`/work/${id}`}>
    //       <a className="d-inline-block">
    //         <LocalImageComponent filePath={localImages[0].storedFile} alt={title} />
    //       </a>
    //     </Link>
    //     <span className={styles.type}>{t(type)}</span>
    //     {work && <SocialInteraction entity={work} />}
    //   </div>
    //   <Link href={`/work/${id}`}>
    //     <a className={styles.title}>{title}</a>
    //   </Link>
    //   <span className={styles.author}>{author}</span>
    // </article>
  );
};

export default MosaicItem;
